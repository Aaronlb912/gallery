import { useState } from 'react'
import { Workspace, normalizeWorkspace, sampleWorkspace } from './lib/index.js'

const STORAGE_KEY = 'gallery-workspace'

function labelSample(workspace) {
  return {
    ...workspace,
    galleries: workspace.galleries.map((gallery) =>
      gallery.id === 'gallery-mill-street' && gallery.title === 'Mill Street Pottery'
        ? { ...gallery, title: 'DEMO GALLERY Mill Street Pottery' }
        : gallery,
    ),
  }
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return labelSample(normalizeWorkspace(sampleWorkspace))
    return normalizeWorkspace(JSON.parse(raw))
  } catch {
    return labelSample(normalizeWorkspace(sampleWorkspace))
  }
}

function writeStored(workspace) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace))
  } catch {
    // Demo still runs if storage is blocked.
  }
}

export default function App() {
  const [workspace, setWorkspace] = useState(readStored)

  function change(next) {
    const normalized = normalizeWorkspace(next)
    setWorkspace(normalized)
    writeStored(normalized)
  }

  function resetSample() {
    if (!window.confirm('Replace stored galleries with the Mill Street sample?')) {
      return
    }
    change(labelSample(normalizeWorkspace(sampleWorkspace)))
  }

  return (
    <Workspace value={workspace} onChange={change} onResetSample={resetSample} />
  )
}
