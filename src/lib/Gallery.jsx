import { useEffect, useRef, useState } from 'react'
import { Item } from './Item.jsx'
import { ItemPage } from './ItemPage.jsx'
import {
  downloadGallery,
  isImageFile,
  itemMatches,
  moveItem,
  newItemId,
  normalizeItem,
  parseFile,
  readImageFile,
  readTextFile,
} from './gallery-json.js'

export function Gallery({
  value,
  onChange,
  onGalleries,
  onLoadWorkspace,
  onDownloadAll,
}) {
  const jsonInput = useRef(null)
  const titleInput = useRef(null)
  const drag = useRef(null)
  const skipClick = useRef(false)
  const fileOver = useRef(0)
  const [query, setQuery] = useState('')
  const [miss, setMiss] = useState('')
  const [galleryTitle, setGalleryTitle] = useState(value.title)
  const [renaming, setRenaming] = useState(false)
  const [view, setView] = useState({ name: 'gallery' })
  const [dragId, setDragId] = useState(null)
  const [over, setOver] = useState(null)
  const [fileHover, setFileHover] = useState(false)

  useEffect(() => {
    setGalleryTitle(value.title)
  }, [value.title])

  useEffect(() => {
    if (renaming && titleInput.current) titleInput.current.focus()
  }, [renaming])

  const filtering = Boolean(query.trim())
  const shown = filtering ? value.items.filter((item) => itemMatches(item, query)) : value.items

  function removeItem(id) {
    onChange({
      ...value,
      items: value.items.filter((item) => item.id !== id),
    })
  }

  function saveTitle(event) {
    event.preventDefault()
    const trimmed = galleryTitle.trim()
    if (!trimmed) {
      setMiss('Need a gallery name.')
      return
    }
    onChange({ ...value, title: trimmed })
    setRenaming(false)
    setMiss('')
  }

  async function addFiles(fileList) {
    const files = Array.from(fileList || []).filter(isImageFile)
    if (!files.length) {
      setMiss('Need a photo.')
      return
    }
    const added = []
    for (const file of files) {
      try {
        const src = await readImageFile(file)
        if (!src) continue
        const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
        added.push(
          normalizeItem({
            id: newItemId(),
            src,
            title: name,
            caption: '',
            credit: '',
            date: '',
          }),
        )
      } catch {
        setMiss('Could not read that file.')
        return
      }
    }
    if (!added.length) {
      setMiss('Need a photo.')
      return
    }
    onChange({ ...value, items: [...value.items, ...added] })
    setMiss('')
  }

  async function loadJson(event) {
    const file = event.target.files && event.target.files[0]
    event.target.value = ''
    if (!file) return
    let text
    try {
      text = await readTextFile(file)
    } catch {
      setMiss('Could not read that file.')
      return
    }
    const parsed = parseFile(text)
    if (!parsed.ok) {
      setMiss(parsed.error)
      return
    }
    setMiss('')
    if (parsed.kind === 'workspace') {
      if (onLoadWorkspace) onLoadWorkspace(parsed.workspace)
      else onChange(parsed.workspace.galleries[0])
      return
    }
    onChange(parsed.gallery)
  }

  function startDrag(event, itemId) {
    if (filtering || event.target.closest('button')) {
      event.preventDefault()
      return
    }
    drag.current = itemId
    setDragId(itemId)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', itemId)
  }

  function overItem(event, itemId) {
    event.preventDefault()
    if (!drag.current || drag.current === itemId) return
    const rect = event.currentTarget.getBoundingClientRect()
    const before = event.clientX < rect.left + rect.width / 2
    setOver({ id: itemId, where: before ? 'before' : 'after' })
  }

  function dropOnItem(event, itemId) {
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer.files && event.dataTransfer.files.length) {
      addFiles(event.dataTransfer.files)
      clearDrag()
      return
    }
    const fromId = drag.current
    if (!fromId || fromId === itemId) {
      clearDrag()
      return
    }
    const target = value.items.findIndex((item) => item.id === itemId)
    if (target < 0) {
      clearDrag()
      return
    }
    const where = over && over.id === itemId ? over.where : 'before'
    const toIndex = where === 'after' ? target + 1 : target
    onChange(moveItem(value, fromId, toIndex))
    skipClick.current = true
    clearDrag()
  }

  function clearDrag() {
    drag.current = null
    setDragId(null)
    setOver(null)
  }

  function onGridDragOver(event) {
    event.preventDefault()
  }

  function onGridDrop(event) {
    event.preventDefault()
    if (event.dataTransfer.files && event.dataTransfer.files.length) {
      addFiles(event.dataTransfer.files)
    }
    fileOver.current = 0
    setFileHover(false)
    clearDrag()
  }

  function onFileEnter(event) {
    if (![...event.dataTransfer.types].includes('Files')) return
    fileOver.current += 1
    setFileHover(true)
  }

  function onFileLeave() {
    fileOver.current = Math.max(0, fileOver.current - 1)
    if (fileOver.current === 0) setFileHover(false)
  }

  function openNew() {
    setView({
      name: 'item',
      mode: 'new',
      item: normalizeItem({ id: newItemId() }),
    })
  }

  function openEdit(id) {
    if (skipClick.current) {
      skipClick.current = false
      return
    }
    const item = value.items.find((piece) => piece.id === id)
    if (!item) return
    setView({ name: 'item', mode: 'edit', item })
  }

  function saveItem(next) {
    const exists = value.items.some((item) => item.id === next.id)
    onChange({
      ...value,
      items: exists
        ? value.items.map((item) => (item.id === next.id ? next : item))
        : [...value.items, next],
    })
    setView({ name: 'gallery' })
    setMiss('')
  }

  function duplicateItem(copy) {
    onChange({ ...value, items: [...value.items, copy] })
    setView({ name: 'gallery' })
    setMiss('')
  }

  if (view.name === 'item') {
    return (
      <ItemPage
        item={view.item}
        mode={view.mode}
        onSave={saveItem}
        onCancel={() => setView({ name: 'gallery' })}
        onRemove={
          view.mode === 'edit'
            ? () => {
                removeItem(view.item.id)
                setView({ name: 'gallery' })
              }
            : undefined
        }
        onDuplicate={view.mode === 'edit' ? duplicateItem : undefined}
      />
    )
  }

  return (
    <div
      className={fileHover ? 'gy gy-file-over' : 'gy'}
      onDragEnter={onFileEnter}
      onDragLeave={onFileLeave}
      onDragOver={onGridDragOver}
      onDrop={onGridDrop}
    >
      <header className="gy-top">
        <div>
          <p className="gy-kicker">Gallery</p>
          {renaming ? (
            <form className="gy-title-form" onSubmit={saveTitle}>
              <label>
                Gallery name
                <input
                  ref={titleInput}
                  className="gy-title-input"
                  value={galleryTitle}
                  onChange={(event) => setGalleryTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      event.preventDefault()
                      setGalleryTitle(value.title)
                      setRenaming(false)
                      setMiss('')
                    }
                  }}
                />
              </label>
              <div className="gy-actions">
                <button type="submit">Save</button>
                <button
                  type="button"
                  className="gy-btn-ghost"
                  onClick={() => {
                    setGalleryTitle(value.title)
                    setRenaming(false)
                    setMiss('')
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="gy-title-row">
              <h1>{value.title || 'Untitled gallery'}</h1>
              <button type="button" className="gy-quiet" onClick={() => setRenaming(true)}>
                Edit
              </button>
            </div>
          )}
          {value.note ? <p className="gy-note">{value.note}</p> : null}
        </div>
        <div className="gy-actions">
          {onGalleries ? (
            <button type="button" className="gy-btn-ghost" onClick={onGalleries}>
              Galleries
            </button>
          ) : null}
          <button type="button" onClick={openNew}>
            Add photo
          </button>
        </div>
      </header>

      <div className="gy-tools">
        <label>
          Search
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title, caption, credit"
          />
        </label>
        <div className="gy-actions">
          <button type="button" className="gy-btn-ghost" onClick={() => jsonInput.current && jsonInput.current.click()}>
            Load JSON
          </button>
          <button type="button" className="gy-btn-ghost" onClick={() => downloadGallery(value)}>
            Download this gallery
          </button>
          {onDownloadAll ? (
            <button type="button" className="gy-btn-ghost" onClick={onDownloadAll}>
              Download all
            </button>
          ) : null}
        </div>
        <input
          ref={jsonInput}
          className="gy-file"
          type="file"
          accept="application/json,.json"
          onChange={loadJson}
        />
      </div>
      {miss ? <p className="gy-miss">{miss}</p> : null}
      {fileHover ? <p className="gy-drop-hint">Drop photos to add them.</p> : null}

      {value.items.length === 0 ? (
        <div className="gy-empty-box">
          <p className="gy-empty">No photos yet. Add one, or drop a picture here.</p>
        </div>
      ) : shown.length === 0 ? (
        <p className="gy-empty">Nothing matches. Clear search to see the shelf.</p>
      ) : (
        <div className="gy-grid">
          {shown.map((item) => (
            <Item
              key={item.id}
              item={item}
              dragging={dragId === item.id}
              dropLine={over && over.id === item.id ? over.where : ''}
              lockDrag={filtering}
              onOpen={openEdit}
              onRemove={removeItem}
              onDragStart={(event) => startDrag(event, item.id)}
              onDragOver={(event) => overItem(event, item.id)}
              onDrop={(event) => dropOnItem(event, item.id)}
              onDragEnd={clearDrag}
            />
          ))}
        </div>
      )}
    </div>
  )
}
