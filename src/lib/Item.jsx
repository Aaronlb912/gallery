export function Item({ item, onRemove }) {
  return (
    <article className="gy-item">
      <div className="gy-mat">
        {item.src ? (
          <img src={item.src} alt="" />
        ) : (
          <div className="gy-empty-photo">No photo</div>
        )}
      </div>
      <p className="gy-caption">{item.caption || 'No caption yet.'}</p>
      <button type="button" className="gy-quiet" onClick={() => onRemove(item.id)}>
        Remove
      </button>
    </article>
  )
}
