function newId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}`
}

export function newItemId() {
  return newId('item')
}

export function newGalleryId() {
  return newId('gallery')
}

export function normalizeItem(raw) {
  const src = typeof raw.src === 'string' ? raw.src : ''
  const caption = typeof raw.caption === 'string' ? raw.caption : ''
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : newItemId(),
    src,
    caption,
  }
}

export function normalizeGallery(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      id: newGalleryId(),
      title: '',
      note: '',
      items: [],
    }
  }
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : newGalleryId(),
    title: typeof raw.title === 'string' ? raw.title : '',
    note: typeof raw.note === 'string' ? raw.note : '',
    items: Array.isArray(raw.items)
      ? raw.items
          .filter((item) => item && typeof item === 'object' && !Array.isArray(item))
          .map((item) => normalizeItem(item))
      : [],
  }
}

export function fileSlug(title) {
  const slug = String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'gallery'
}

export function downloadGallery(gallery, filename) {
  const name = filename || `${fileSlug(gallery.title)}.json`
  const blob = new Blob([JSON.stringify(gallery, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}

export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error || new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}
