'use client'
import React from 'react'
import { useRowLabel } from '@payloadcms/ui'

export function SectionRowLabel() {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  return <span>{(rowNumber ?? 0) + 1}. {data?.title || 'Skyrius'}</span>
}
