'use client'
/**
 * Photo gallery manager for cars and engines.
 * - upload many photos at once (button or drag & drop from the desktop)
 * - reorder by dragging (or with the arrows)
 * - ★ makes a photo the main one (moves it to the first place)
 * - ✕ removes the photo from this item
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useField, FieldLabel, FieldDescription } from '@payloadcms/ui'

type ID = number | string
type MediaDoc = { id: ID; url?: string; filename?: string; sizes?: { thumb?: { url?: string } } }
type Pending = { key: string; name: string; progress: number; error?: string; preview?: string }

const toId = (v: any): ID => (v && typeof v === 'object' ? v.id : v)

function uploadOne(file: File, onProgress: (p: number) => void): Promise<MediaDoc> {
  return new Promise((resolve, reject) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('_payload', JSON.stringify({ alt: file.name.replace(/\.[^.]+$/, '') }))
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/media')
    xhr.withCredentials = true
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100))
    xhr.onload = () => {
      try {
        const j = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300 && j.doc) resolve(j.doc)
        else reject(new Error(j?.errors?.[0]?.message || 'Klaida ' + xhr.status))
      } catch {
        reject(new Error('Klaida ' + xhr.status))
      }
    }
    xhr.onerror = () => reject(new Error('Ryšio klaida'))
    xhr.send(fd)
  })
}

export function GalleryField({ path, field }: { path: string; field: any }) {
  const { value, setValue } = useField<any[]>({ path })
  const ids: ID[] = useMemo(() => (Array.isArray(value) ? value.map(toId).filter((x) => x !== null && x !== undefined) : []), [value])
  const [docs, setDocs] = useState<Record<string, MediaDoc>>({})
  const [pending, setPending] = useState<Pending[]>([])
  const [drag, setDrag] = useState<number | null>(null)
  const [over, setOver] = useState<number | null>(null)
  const [dropActive, setDropActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const idsRef = useRef(ids)
  idsRef.current = ids

  // seed docs from populated values
  useEffect(() => {
    if (!Array.isArray(value)) return
    const add: Record<string, MediaDoc> = {}
    value.forEach((v) => { if (v && typeof v === 'object' && v.id) add[String(v.id)] = v })
    if (Object.keys(add).length) setDocs((d) => ({ ...add, ...d }))
  }, [value])

  // fetch missing docs
  useEffect(() => {
    const missing = ids.filter((id) => !docs[String(id)])
    if (!missing.length) return
    const q = missing.map((id) => `where[id][in][]=${encodeURIComponent(String(id))}`).join('&')
    fetch(`/api/media?${q}&limit=${missing.length}&depth=0`, { credentials: 'include' })
      .then((r) => r.json())
      .then((j) => {
        const add: Record<string, MediaDoc> = {}
        ;(j.docs || []).forEach((d: MediaDoc) => { add[String(d.id)] = d })
        setDocs((d) => ({ ...d, ...add }))
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')])

  const commit = useCallback((next: ID[]) => setValue(next), [setValue])
  const move = (from: number, to: number) => {
    if (from === to || to < 0 || to >= ids.length) return
    const next = ids.slice()
    const [x] = next.splice(from, 1)
    next.splice(to, 0, x)
    commit(next)
  }
  const remove = (i: number) => commit(ids.filter((_, k) => k !== i))
  const makeMain = (i: number) => move(i, 0)

  const handleFiles = async (list: FileList | File[]) => {
    const files = Array.from(list).filter((f) => f.type.startsWith('image/'))
    if (!files.length) return
    const items: Pending[] = files.map((f, i) => ({ key: Date.now() + '-' + i + '-' + f.name, name: f.name, progress: 0, preview: URL.createObjectURL(f) }))
    setPending((p) => [...p, ...items])
    const results: (ID | null)[] = new Array(files.length).fill(null)
    let cursor = 0
    const worker = async () => {
      while (cursor < files.length) {
        const i = cursor++
        try {
          const doc = await uploadOne(files[i], (pr) => setPending((p) => p.map((x) => (x.key === items[i].key ? { ...x, progress: pr } : x))))
          setDocs((d) => ({ ...d, [String(doc.id)]: doc }))
          results[i] = doc.id
          setPending((p) => p.filter((x) => x.key !== items[i].key))
        } catch (e: any) {
          setPending((p) => p.map((x) => (x.key === items[i].key ? { ...x, error: e?.message || 'Klaida' } : x)))
        }
      }
    }
    await Promise.all([worker(), worker(), worker()])
    const added = results.filter((x): x is ID => x !== null)
    if (added.length) commit([...idsRef.current, ...added])
  }

  const thumb = (id: ID) => {
    const d = docs[String(id)]
    return d ? d.sizes?.thumb?.url || d.url : undefined
  }

  return (
    <div className="field-type loga-gallery">
      <div className="loga-gallery__head">
        <FieldLabel label={field?.label || 'Nuotraukos'} path={path} />
        <span className="loga-gallery__count">{ids.length} nuotr.</span>
      </div>
      <div
        className={'loga-gallery__grid' + (dropActive ? ' is-drop' : '')}
        onDragOver={(e) => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); setDropActive(true) } }}
        onDragLeave={() => setDropActive(false)}
        onDrop={(e) => {
          if (e.dataTransfer.files?.length) { e.preventDefault(); setDropActive(false); handleFiles(e.dataTransfer.files) }
        }}
      >
        {ids.map((id, i) => (
          <div
            key={String(id)}
            className={'loga-ph' + (i === 0 ? ' is-main' : '') + (drag === i ? ' is-drag' : '') + (over === i && drag !== null && drag !== i ? ' is-over' : '')}
            draggable
            onDragStart={(e) => { setDrag(i); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)) }}
            onDragEnter={() => drag !== null && setOver(i)}
            onDragOver={(e) => { if (drag !== null) e.preventDefault() }}
            onDrop={(e) => { if (drag !== null) { e.preventDefault(); move(drag, i) } setDrag(null); setOver(null) }}
            onDragEnd={() => { setDrag(null); setOver(null) }}
          >
            {thumb(id) ? <img src={thumb(id)} alt="" draggable={false} /> : <span className="loga-ph__loading" />}
            <span className="loga-ph__n">{i + 1}</span>
            {i === 0 && <span className="loga-ph__main">★ Pagrindinė</span>}
            <div className="loga-ph__tools">
              {i !== 0 && (
                <button type="button" title="Padaryti pagrindine" onClick={() => makeMain(i)}>★</button>
              )}
              <button type="button" title="Į kairę" disabled={i === 0} onClick={() => move(i, i - 1)}>←</button>
              <button type="button" title="Į dešinę" disabled={i === ids.length - 1} onClick={() => move(i, i + 1)}>→</button>
              <button type="button" title="Pašalinti" className="is-del" onClick={() => remove(i)}>✕</button>
            </div>
          </div>
        ))}
        {pending.map((p) => (
          <div key={p.key} className={'loga-ph is-pending' + (p.error ? ' is-error' : '')}>
            {p.preview && <img src={p.preview} alt="" />}
            <span className="loga-ph__bar"><span style={{ width: p.progress + '%' }} /></span>
            <span className="loga-ph__status">{p.error ? p.error : p.progress + '%'}</span>
            {p.error && (
              <div className="loga-ph__tools"><button type="button" className="is-del" onClick={() => setPending((x) => x.filter((y) => y.key !== p.key))}>✕</button></div>
            )}
          </div>
        ))}
        <button type="button" className="loga-gallery__add" onClick={() => inputRef.current?.click()}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          <strong>Įkelti nuotraukas</strong>
          <span>arba nutempkite failus čia</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = '' }} />
      <FieldDescription description={field?.admin?.description} path={path} />
    </div>
  )
}
