'use client'
import React, { useEffect, useState } from 'react'

const cache = new Map<string, string>()

export function CoverCell({ rowData, collectionSlug }: { rowData?: any; collectionSlug?: string }) {
  const photos = Array.isArray(rowData?.photos) ? rowData.photos : []
  const first = photos[0]
  const direct = first && typeof first === 'object' ? first.sizes?.thumb?.url || first.url : null
  const id = first && typeof first !== 'object' ? String(first) : null
  const [url, setUrl] = useState<string | null>(direct || (id ? cache.get(id) || null : null))
  useEffect(() => {
    if (direct || !id || cache.has(id)) return
    fetch(`/api/media/${id}?depth=0`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        const u = d?.sizes?.thumb?.url || d?.url
        if (u) { cache.set(id, u); setUrl(u) }
      })
      .catch(() => {})
  }, [direct, id])
  const slug = collectionSlug || (typeof window !== 'undefined' ? window.location.pathname.split('/collections/')[1]?.split('/')[0] : '')
  const href = rowData?.id && slug ? `/admin/collections/${slug}/${rowData.id}` : undefined
  return (
    <a className="loga-cover" href={href} title="Redaguoti">
      {url ? <img src={url} alt="" /> : <span className="loga-cover__none" />}
      {photos.length > 0 && <span className="loga-cover__n">{photos.length}</span>}
    </a>
  )
}
