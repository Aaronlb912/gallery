function formatDate(value) {
  if (!value) return ''
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return value
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const month = months[Number(match[2]) - 1]
  if (!month) return value
  return `${month} ${Number(match[3])}, ${match[1]}`
}

export function Item({
  item,
  dragging,
  dropLine,
  lockDrag,
  onOpen,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  const className = [
    'gy-item',
    dragging ? 'gy-dragging' : '',
    dropLine === 'before' ? 'gy-drop-before' : '',
    dropLine === 'after' ? 'gy-drop-after' : '',
    lockDrag ? 'gy-item-still' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article
      className={className}
      draggable={!lockDrag}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="gy-mat">
        {item.src ? (
          <img src={item.src} alt="" />
        ) : (
          <div className="gy-empty-photo">No photo</div>
        )}
      </div>
      <h3 className="gy-item-title">{item.title || 'Untitled piece'}</h3>
      <p className="gy-caption">{item.caption || 'No caption yet.'}</p>
      {item.credit ? <p className="gy-meta">{item.credit}</p> : null}
      {item.date ? <p className="gy-meta">{formatDate(item.date)}</p> : null}
      <div className="gy-item-actions">
        <button type="button" className="gy-quiet" onClick={() => onOpen(item.id)}>
          Edit
        </button>
        <button type="button" className="gy-quiet" onClick={() => onRemove(item.id)}>
          Remove
        </button>
      </div>
    </article>
  )
}
