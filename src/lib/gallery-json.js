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
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      id: newItemId(),
      src: '',
      title: '',
      caption: '',
      credit: '',
      date: '',
    }
  }
  const caption = typeof raw.caption === 'string' ? raw.caption : ''
  let title = typeof raw.title === 'string' ? raw.title : ''
  if (!title && typeof raw.name === 'string') title = raw.name
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : newItemId(),
    src: typeof raw.src === 'string' ? raw.src : '',
    title,
    caption,
    credit: typeof raw.credit === 'string' ? raw.credit : '',
    date: typeof raw.date === 'string' ? raw.date : '',
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

export function blankGallery(title) {
  return normalizeGallery({
    title: title || '',
    note: '',
    items: [],
  })
}

export function cloneItem(item) {
  const src = normalizeItem(item)
  const title = src.title ? `${src.title} copy` : 'Copy'
  return {
    ...src,
    id: newItemId(),
    title,
  }
}

export function cloneGallery(gallery) {
  const src = normalizeGallery(gallery)
  return {
    ...src,
    id: newGalleryId(),
    title: src.title ? `${src.title} copy` : 'Copy',
    items: src.items.map((item) => ({ ...item, id: newItemId() })),
  }
}

export function normalizeWorkspace(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    const gallery = blankGallery('Gallery')
    return { galleries: [gallery], activeGalleryId: gallery.id }
  }

  let galleries = []
  if (Array.isArray(raw.galleries)) {
    galleries = raw.galleries
      .filter((item) => item && typeof item === 'object' && !Array.isArray(item))
      .map((item) => normalizeGallery(item))
  } else if (Array.isArray(raw.items)) {
    galleries = [normalizeGallery(raw)]
  }

  if (galleries.length === 0) {
    galleries = [blankGallery('Gallery')]
  }

  const active =
    galleries.find((item) => item.id === raw.activeGalleryId) || galleries[0]
  return { galleries, activeGalleryId: active.id }
}

export function fileSlug(title) {
  const slug = String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'gallery'
}

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadGallery(gallery, filename) {
  downloadJson(gallery, filename || `${fileSlug(gallery.title)}.json`)
}

export function downloadWorkspace(workspace, filename = 'galleries.json') {
  downloadJson(
    {
      activeGalleryId: workspace.activeGalleryId,
      galleries: workspace.galleries,
    },
    filename,
  )
}

export function itemCount(gallery) {
  return (gallery.items || []).length
}

export function itemMatches(item, query) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return true
  const parts = [item.title, item.caption, item.credit, item.date]
  return parts.join(' ').toLowerCase().includes(q)
}

export function moveItem(gallery, itemId, toIndex) {
  const from = gallery.items.findIndex((item) => item.id === itemId)
  if (from < 0) return gallery
  let insert = toIndex
  if (from < insert) insert -= 1
  if (insert < 0) insert = 0
  const items = [...gallery.items]
  const [item] = items.splice(from, 1)
  if (insert > items.length) insert = items.length
  items.splice(insert, 0, item)
  return { ...gallery, items }
}

export function isImageFile(file) {
  if (!file) return false
  if (file.type && file.type.startsWith('image/')) return true
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name || '')
}

export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error || new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

export function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error || new Error('Could not read file'))
    reader.readAsText(file)
  })
}

function parseGalleryObject(data) {
  if (!Array.isArray(data.items)) {
    return { ok: false, error: 'That file is not a gallery.' }
  }
  const items = []
  for (const raw of data.items) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return { ok: false, error: 'A piece in that file is not a piece.' }
    }
    items.push(normalizeItem(raw))
  }
  const title = typeof data.title === 'string' ? data.title.trim() : ''
  return {
    ok: true,
    gallery: {
      id: typeof data.id === 'string' && data.id ? data.id : newGalleryId(),
      title: title || 'Gallery',
      note: typeof data.note === 'string' ? data.note : '',
      items,
    },
  }
}

export function parseFile(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, error: 'That file is not JSON.' }
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, error: 'That file is not a gallery.' }
  }

  if (Array.isArray(data.galleries)) {
    if (data.galleries.length === 0) {
      return { ok: false, error: 'That file has no galleries.' }
    }
    const galleries = []
    for (const item of data.galleries) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return { ok: false, error: 'That file is not a gallery.' }
      }
      const one = parseGalleryObject(item)
      if (!one.ok) return one
      galleries.push(one.gallery)
    }
    const active =
      galleries.find((item) => item.id === data.activeGalleryId) || galleries[0]
    return {
      ok: true,
      kind: 'workspace',
      workspace: { galleries, activeGalleryId: active.id },
    }
  }

  const one = parseGalleryObject(data)
  if (!one.ok) return one
  return { ok: true, kind: 'gallery', gallery: one.gallery }
}
