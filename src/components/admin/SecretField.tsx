'use client'
import React, { useState } from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'

export function SecretField({ path, field }: { path: string; field: any }) {
  const { value, setValue } = useField<string>({ path })
  const [show, setShow] = useState(false)
  return (
    <div className="field-type text loga-secret" style={{ flex: '1 1 auto' }}>
      <FieldLabel label={field?.label} path={path} />
      <div className="loga-secret__row">
        <input type={show ? 'text' : 'password'} value={value || ''} onChange={(e) => setValue(e.target.value)} autoComplete="new-password" />
        <button type="button" onClick={() => setShow(!show)}>{show ? 'Slėpti' : 'Rodyti'}</button>
      </div>
    </div>
  )
}
