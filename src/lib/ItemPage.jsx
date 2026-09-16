import { useEffect, useRef, useState } from 'react'
import { cloneItem, isImageFile, normalizeItem, readImageFile } from './gallery-json.js'
import './gallery.css'

export function ItemPage({ item, mode, onSave, onCancel, onRemove, onDuplicate }) {
  const isNew = mode === 'new'
  const fileInput = useRef(null)
  const [title, setTitle] = useState(item.title || '')
  const [caption, setCaption] = useState(item.caption || '')
  const [credit, setCredit] = useState(item.credit || '')
  const [date, setDate] = useState(item.date || '')
  const [src, setSrc] = useState(item.src || '')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(item.src || '')
  const [miss, setMiss] = useState('')

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  useEffect(() => {
    if (!file) {
      setPreview(src)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file, src])

  async function builtItem() {
    let nextSrc = src
    if (file) {
      if (!isImageFile(file)) {
        setMiss('That file is not a picture.')
        return null
      }
      try {
        nextSrc = await readImageFile(file)
      } catch {
        setMiss('Could not read that file.')
        return null
      }
    }
    if (!nextSrc) {
      setMiss('Need a photo.')
      return null
    }
    setMiss('')
    return normalizeItem({
      ...item,
      src: nextSrc,
      title: title.trim(),
      caption: caption.trim(),
      credit: credit.trim(),
      date: date.trim(),
    })
  }

  async function save(event) {
    event.preventDefault()
    const next = await builtItem()
    if (!next) return
    onSave(next)
  }

  async function duplicate() {
    const next = await builtItem()
    if (!next) return
    onDuplicate(cloneItem(next))
  }

  return (
    <div className="gy gy-page">
      <p className="gy-kicker">{isNew ? 'Add photo' : 'Edit piece'}</p>
      <h1>{isNew ? 'New photo' : item.title || 'Untitled piece'}</h1>
      <p className="gy-hint">
        {isNew
          ? 'Pick a picture, fill the fields, then save. Escape goes back.'
          : 'Change the piece, then save. Escape goes back without saving.'}
      </p>
      {miss ? <p className="gy-miss">{miss}</p> : null}
      <form className="gy-form" onSubmit={save}>
        <label>
          Photo
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={(event) => {
              const next = event.target.files && event.target.files[0] ? event.target.files[0] : null
              setFile(next)
              setMiss('')
            }}
          />
        </label>
        {preview ? (
          <div className="gy-form-preview">
            <img src={preview} alt="" />
          </div>
        ) : null}
        <label>
          Title
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          Caption
          <textarea
            rows={4}
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
          />
        </label>
        <div className="gy-form-row">
          <label>
            Credit
            <input
              value={credit}
              onChange={(event) => setCredit(event.target.value)}
              placeholder="Who made it. name@example.com"
            />
          </label>
          <label>
            Date
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
        </div>
        <div className="gy-actions">
          <button type="submit">Save</button>
          <button type="button" className="gy-btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          {onDuplicate ? (
            <button type="button" className="gy-btn-ghost" onClick={duplicate}>
              Duplicate
            </button>
          ) : null}
          {onRemove ? (
            <button type="button" className="gy-quiet" onClick={onRemove}>
              Remove
            </button>
          ) : null}
        </div>
      </form>
    </div>
  )
}
