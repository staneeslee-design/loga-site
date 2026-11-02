import type { Payload } from 'payload'
import nodemailer from 'nodemailer'

const TYPE_LT: Record<string, string> = {
  quick: 'Greita užklausa',
  part: 'Rasti detalę',
  sell: 'Pasiūlytas automobilis',
  callback: 'Perskambinti',
}

function lines(doc: any): [string, string][] {
  const d = doc.details || {}
  const rows: [string, any][] = [
    ['Tipas', TYPE_LT[doc.type] || doc.type],
    ['Automobilis / tema', doc.subject],
    ['Detalė', doc.part],
    ['Vardas', doc.name],
    ['Telefonas', doc.phone],
    ['VIN', doc.vin],
    ['Komentaras', doc.message],
    ['Metai', d.year],
    ['Būklė', d.condition],
    ['Pristatymas', d.delivery],
    ['Susisiekti', d.channel],
    ['Kalba', doc.locale],
    ['Puslapis', doc.page],
  ]
  return rows.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '').map(([k, v]) => [k, String(v)])
}
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function notifyInquiry(payload: Payload, doc: any) {
  const s: any = await payload.findGlobal({ slug: 'settings', depth: 0 })
  const rows = lines(doc)
  const title = `${TYPE_LT[doc.type] || 'Užklausa'}: ${doc.subject || doc.part || doc.phone}`
  const text = `🔔 ${title}\n\n` + rows.map(([k, v]) => `${k}: ${v}`).join('\n')
  const adminUrl = (process.env.NEXT_PUBLIC_SERVER_URL || '') + `/admin/collections/inquiries/${doc.id}`
  const jobs: Promise<unknown>[] = []

  // E-mail
  const mail = s?.mail || {}
  const to = (mail.recipients || []).map((r: any) => r.email).filter(Boolean)
  if (mail.enabled && to.length && mail.host) {
    const transport = nodemailer.createTransport({
      host: mail.host,
      port: mail.port || 465,
      secure: mail.secure ?? true,
      auth: mail.user ? { user: mail.user, pass: mail.pass } : undefined,
    })
    const html =
      `<div style="font-family:Inter,Arial,sans-serif;max-width:560px">` +
      `<h2 style="margin:0 0 12px;color:#E31F25">${esc(title)}</h2>` +
      `<table cellpadding="6" style="border-collapse:collapse;width:100%">` +
      rows.map(([k, v]) => `<tr><td style="color:#4f5054;border-bottom:1px solid #eee;width:40%">${esc(k)}</td><td style="border-bottom:1px solid #eee;font-weight:600">${esc(v)}</td></tr>`).join('') +
      `</table>` +
      (process.env.NEXT_PUBLIC_SERVER_URL ? `<p><a href="${adminUrl}" style="color:#E31F25">Atidaryti administravime →</a></p>` : '') +
      `</div>`
    jobs.push(
      transport.sendMail({
        from: `"${mail.fromName || 'Loga group'}" <${mail.fromEmail || mail.user}>`,
        to: to.join(', '),
        subject: title,
        text,
        html,
        replyTo: undefined,
      }),
    )
  }

  // Telegram
  const tg = s?.telegram || {}
  if (tg.enabled && tg.botToken && tg.chatIds) {
    for (const chat of String(tg.chatIds).split(',').map((x) => x.trim()).filter(Boolean)) {
      jobs.push(
        fetch(`https://api.telegram.org/bot${tg.botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chat, text: text + (process.env.NEXT_PUBLIC_SERVER_URL ? `\n\n${adminUrl}` : ''), disable_web_page_preview: true }),
        }),
      )
    }
  }

  // Viber bot
  const vb = s?.viberBot || {}
  if (vb.enabled && vb.token && vb.receivers) {
    for (const r of String(vb.receivers).split(',').map((x) => x.trim()).filter(Boolean)) {
      jobs.push(
        fetch('https://chatapi.viber.com/pa/send_message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Viber-Auth-Token': vb.token },
          body: JSON.stringify({ receiver: r, type: 'text', sender: { name: 'Loga group' }, text }),
        }),
      )
    }
  }

  // Webhook
  const wh = s?.webhook || {}
  if (wh.enabled && wh.url) {
    jobs.push(
      fetch(wh.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'inquiry.created', title, text, inquiry: doc }),
      }),
    )
  }

  const res = await Promise.allSettled(jobs)
  res.forEach((r) => {
    if (r.status === 'rejected') payload.logger.error({ err: r.reason }, 'Inquiry notification failed')
  })
}
