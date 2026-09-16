import { useRef, useState } from 'react'
import { Gallery } from './Gallery.jsx'
import {
  blankGallery,
  cloneGallery,
  downloadWorkspace,
  itemCount,
  normalizeWorkspace,
  parseFile,
  readTextFile,
} from './gallery-json.js'
import './gallery.css'

export function Workspace({
  value,
  onChange,
  onResetSample,
  cloud,
  cloudNote,
  cloudMiss,
  onSignInCloud,
  onPullCloud,
  onForgetCloud,
}) {
  const workspace = normalizeWorkspace(value)
  const jsonInput = useRef(null)
  const [page, setPage] = useState('list')
  const [title, setTitle] = useState('')
  const [miss, setMiss] = useState('')
  const connected = Boolean(cloud && cloud.signedIn)

  const active =
    workspace.galleries.find((gallery) => gallery.id === workspace.activeGalleryId) ||
    workspace.galleries[0]

  function setWorkspace(next) {
    setMiss('')
    onChange(next)
  }

  function openGallery(id) {
    setWorkspace({ ...workspace, activeGalleryId: id })
    setPage('gallery')
  }

  function updateActive(next) {
    setWorkspace({
      galleries: workspace.galleries.map((gallery) =>
        gallery.id === active.id ? next : gallery,
      ),
      activeGalleryId: next.id,
    })
  }

  function addGallery(event) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setMiss('Need a gallery name.')
      return
    }
    const gallery = blankGallery(trimmed)
    setTitle('')
    setWorkspace({
      galleries: [...workspace.galleries, gallery],
      activeGalleryId: gallery.id,
    })
    setPage('gallery')
  }

  function duplicateGallery(id) {
    const src = workspace.galleries.find((gallery) => gallery.id === id)
    if (!src) return
    const copy = cloneGallery(src)
    setWorkspace({
      galleries: [...workspace.galleries, copy],
      activeGalleryId: workspace.activeGalleryId,
    })
  }

  function removeGallery(id) {
    if (workspace.galleries.length < 2) {
      setMiss('Keep at least one gallery.')
      return
    }
    const galleries = workspace.galleries.filter((gallery) => gallery.id !== id)
    const activeGalleryId =
      workspace.activeGalleryId === id ? galleries[0].id : workspace.activeGalleryId
    setWorkspace({ galleries, activeGalleryId })
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
    if (parsed.kind === 'workspace') {
      setWorkspace(normalizeWorkspace(parsed.workspace))
      return
    }
    setWorkspace({
      galleries: [...workspace.galleries, parsed.gallery],
      activeGalleryId: parsed.gallery.id,
    })
  }

  if (page === 'gallery' && active) {
    return (
      <Gallery
        key={active.id}
        value={active}
        onChange={updateActive}
        onGalleries={() => {
          setMiss('')
          setPage('list')
        }}
        onLoadWorkspace={(next) => {
          setWorkspace(normalizeWorkspace(next))
          setPage('gallery')
        }}
        onDownloadAll={() => downloadWorkspace(workspace)}
      />
    )
  }

  return (
    <div className="gy">
      <header className="gy-top">
        <div>
          <h1>Galleries</h1>
          <p className="gy-hint">
            Pictures stay on this computer. Download JSON if you want a
            copy. Open a gallery, or make a blank one.
          </p>
        </div>
        <div className="gy-actions">
          <button type="button" className="gy-btn-ghost" onClick={() => downloadWorkspace(workspace)}>
            Download all galleries
          </button>
          <a className="gy-btn-ghost" href="https://github.com/Aaronlb912/gallery">
            Get the files
          </a>
          <button type="button" className="gy-btn-ghost" onClick={() => jsonInput.current && jsonInput.current.click()}>
            Load JSON
          </button>
          {onResetSample ? (
            <button type="button" className="gy-btn-ghost" onClick={onResetSample}>
              Reset sample
            </button>
          ) : null}
        </div>
      </header>
      <input
        ref={jsonInput}
        className="gy-file"
        type="file"
        accept="application/json,.json"
        onChange={loadJson}
      />
      {miss ? <p className="gy-miss">{miss}</p> : null}
      {workspace.galleries.length === 0 ? (
        <p className="gy-empty">No galleries. Make one to start.</p>
      ) : (
        <ul className="gy-list">
          {workspace.galleries.map((gallery) => (
            <li key={gallery.id} className="gy-row">
              <div className="gy-row-lead">
                <div className={gallery.items[0] && gallery.items[0].src ? 'gy-row-thumb' : 'gy-row-thumb is-empty'}>
                  {gallery.items[0] && gallery.items[0].src ? (
                    <img src={gallery.items[0].src} alt="" />
                  ) : null}
                </div>
                <div>
                  <p className="gy-row-name">{gallery.title || 'Untitled gallery'}</p>
                  <p className="gy-meta">
                    {itemCount(gallery) === 1
                      ? '1 photo'
                      : `${itemCount(gallery)} photos`}
                  </p>
                </div>
              </div>
              <div className="gy-actions">
                <button type="button" onClick={() => openGallery(gallery.id)}>
                  Open
                </button>
                <button
                  type="button"
                  className="gy-btn-ghost"
                  onClick={() => duplicateGallery(gallery.id)}
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  className="gy-btn-ghost"
                  onClick={() => removeGallery(gallery.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <form className="gy-add" onSubmit={addGallery}>
        <label className="gy-caption-field">
          Gallery name
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Window shelf"
          />
        </label>
        <button type="submit">New gallery</button>
      </form>
      {onSignInCloud ? (
        <div className="gy-cloud">
          {connected ? (
            <>
              <p className="gy-cloud-copy">
                {cloud.name ? `Signed in as ${cloud.name}.` : 'Signed in.'}
                {cloudNote && !/^signed in/i.test(cloudNote) ? ` ${cloudNote}` : ''}
              </p>
              <button type="button" className="gy-quiet" onClick={onPullCloud}>
                Load saved
              </button>
              <button type="button" className="gy-quiet" onClick={onForgetCloud}>
                Sign out
              </button>
            </>
          ) : (
            <p className="gy-cloud-copy">
              <button type="button" className="gy-quiet" onClick={onSignInCloud}>
                Sign in
              </button>{' '}
              to keep these on another device.
            </p>
          )}
          {cloudMiss ? <p className="gy-miss">{cloudMiss}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
