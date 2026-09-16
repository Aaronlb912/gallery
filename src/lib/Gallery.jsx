import { useRef, useState } from 'react'
import { Item } from './Item.jsx'
import { downloadGallery, newItemId, readImageFile } from './gallery-json.js'
import './gallery.css'

export function Gallery({ value, onChange }) {
  const fileInput = useRef(null)
  const [file, setFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [miss, setMiss] = useState('')

  async function addPhoto(event) {
    event.preventDefault()
    if (!file) {
      setMiss('Need a photo.')
      return
    }
    if (!file.type.startsWith('image/')) {
      setMiss('That file is not a picture.')
      return
    }
    let src
    try {
      src = await readImageFile(file)
    } catch {
      setMiss('Could not read that file.')
      return
    }
    if (!src) {
      setMiss('Could not read that file.')
      return
    }
    onChange({
      ...value,
      items: [
        ...value.items,
        {
          id: newItemId(),
          src,
          caption: caption.trim(),
        },
      ],
    })
    setFile(null)
    setCaption('')
    setMiss('')
    if (fileInput.current) fileInput.current.value = ''
  }

  function removeItem(id) {
    onChange({
      ...value,
      items: value.items.filter((item) => item.id !== id),
    })
  }

  return (
    <div className="gy">
      <header className="gy-top">
        <div>
          <p className="gy-kicker">Gallery</p>
          <h1>{value.title || 'Untitled gallery'}</h1>
          {value.note ? <p className="gy-note">{value.note}</p> : null}
        </div>
        <div className="gy-actions">
          <button type="button" onClick={() => downloadGallery(value)}>
            Download JSON
          </button>
        </div>
      </header>

      <form className="gy-add" onSubmit={addPhoto}>
        <label>
          Photo
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={(event) => {
              setFile(event.target.files && event.target.files[0] ? event.target.files[0] : null)
              setMiss('')
            }}
          />
        </label>
        <label className="gy-caption-field">
          Caption
          <input
            type="text"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Clay, glaze, who made it"
          />
        </label>
        <button type="submit">Add photo</button>
        {miss ? <p className="gy-miss">{miss}</p> : null}
      </form>

      {value.items.length === 0 ? (
        <p className="gy-empty">No photos yet. Add one above.</p>
      ) : (
        <div className="gy-grid">
          {value.items.map((item) => (
            <Item key={item.id} item={item} onRemove={removeItem} />
          ))}
        </div>
      )}
    </div>
  )
}
