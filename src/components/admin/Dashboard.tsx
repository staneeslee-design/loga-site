import React from 'react'
import type { Payload } from 'payload'

type Props = { payload: Payload }

export async function Dashboard({ payload }: Props) {
  const [cars, engines, newInq, allInq, latest] = await Promise.all([
    payload.count({ collection: 'cars' }),
    payload.count({ collection: 'engines' }),
    payload.count({ collection: 'inquiries', where: { status: { equals: 'new' } } }),
    payload.count({ collection: 'inquiries' }),
    payload.find({ collection: 'inquiries', limit: 5, sort: '-createdAt', depth: 0 }),
  ])
  const TYPES: Record<string, string> = { quick: 'Greita užklausa', part: 'Rasti detalę', sell: 'Pasiūlytas automobilis', callback: 'Perskambinti' }
  const tiles = [
    { label: 'Automobiliai', value: cars.totalDocs, href: '/admin/collections/cars', add: '/admin/collections/cars/create', addLabel: '+ Pridėti automobilį' },
    { label: 'Varikliai', value: engines.totalDocs, href: '/admin/collections/engines', add: '/admin/collections/engines/create', addLabel: '+ Pridėti variklį' },
    { label: 'Naujos užklausos', value: newInq.totalDocs, href: '/admin/collections/inquiries?where[status][equals]=new', hot: newInq.totalDocs > 0, add: '/admin/collections/inquiries', addLabel: `Visos užklausos (${allInq.totalDocs})` },
  ]
  return (
    <div className="loga-dash">
      <div className="loga-dash__hero">
        <div>
          <p className="loga-dash__eyebrow">Loga group</p>
          <h1>Sveiki sugrįžę 👋</h1>
          <p className="loga-dash__sub">Čia valdote svetainės automobilius, variklius, tekstus ir užklausas.</p>
        </div>
        <a className="loga-btn" href="/" target="_blank" rel="noreferrer">Peržiūrėti svetainę →</a>
      </div>
      <div className="loga-dash__tiles">
        {tiles.map((t) => (
          <div key={t.label} className={'loga-tile' + (t.hot ? ' is-hot' : '')}>
            <a href={t.href} className="loga-tile__main">
              <span className="loga-tile__value">{t.value}</span>
              <span className="loga-tile__label">{t.label}</span>
            </a>
            <a href={t.add} className="loga-tile__add">{t.addLabel}</a>
          </div>
        ))}
      </div>
      {latest.docs.length > 0 && (
        <div className="loga-dash__list">
          <h2>Naujausios užklausos</h2>
          {latest.docs.map((d: any) => (
            <a key={d.id} href={`/admin/collections/inquiries/${d.id}`} className="loga-inq">
              <span className={'loga-inq__dot is-' + (d.status || 'new')} />
              <span className="loga-inq__type">{TYPES[d.type] || d.type}</span>
              <span className="loga-inq__subj">{[d.subject, d.part].filter(Boolean).join(' · ') || '—'}</span>
              <span className="loga-inq__phone">{d.phone}</span>
              <span className="loga-inq__date">{new Date(d.createdAt).toLocaleString('lt-LT', { dateStyle: 'short', timeStyle: 'short' })}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
