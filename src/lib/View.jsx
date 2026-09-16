import { useEffect } from 'react'
import { formatDate } from './gallery-json.js'

export function View({ item, onClose, onEdit }) {
  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="gy-view" onClick={onClose}>
      <div
        className="gy-view-card"
        role="dialog"
        aria-modal="true"
        aria-label={item.title || 'Untitled piece'}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="gy-view-mat">
          {item.src ? (
            <img src={item.src} alt="" />
          ) : (
            <div className="gy-empty-photo">No photo</div>
          )}
        </div>
        <div className="gy-view-copy">
          <h2>{item.title || 'Untitled piece'}</h2>
          <p className="gy-caption">{item.caption || 'No caption yet.'}</p>
          {item.credit ? <p className="gy-meta">{item.credit}</p> : null}
          {item.date ? <p className="gy-meta">{formatDate(item.date)}</p> : null}
          <div className="gy-actions">
            <button type="button" onClick={onClose}>
              Close
            </button>
            <button type="button" className="gy-btn-ghost" onClick={() => onEdit(item.id)}>
              Edit
            </button>
          </div>
          <p className="gy-hint">Escape goes back.</p>
        </div>
      </div>
    </div>
  )
}
