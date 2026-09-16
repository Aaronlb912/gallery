import { useEffect, useRef, useState } from 'react'
import { Workspace, normalizeWorkspace, sampleWorkspace } from './lib/index.js'
import {
  cloudSignIn,
  cloudSignOut,
  cloudSignedIn,
  cloudUserName,
  pullCloudWorkspace,
  pushCloudWorkspace,
} from './lib/cloud-store.js'

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
  const [cloud, setCloud] = useState({ signedIn: false, name: '' })
  const [cloudNote, setCloudNote] = useState('')
  const [cloudMiss, setCloudMiss] = useState('')
  const pending = useRef(null)
  const timer = useRef(null)
  const signedIn = useRef(false)

  useEffect(() => {
    let gone = false
    async function boot() {
      if (!cloudSignedIn()) return
      const name = await cloudUserName()
      if (gone) return
      signedIn.current = true
      setCloud({ signedIn: true, name })
      setCloudNote('Loading your galleries.')
      const pulled = await pullCloudWorkspace()
      if (gone) return
      if (!pulled.ok) {
        setCloudMiss(pulled.error)
        setCloudNote('')
        return
      }
      if (pulled.data) {
        const next = normalizeWorkspace(pulled.data)
        setWorkspace(next)
        writeStored(next)
      }
      setCloudMiss('')
      setCloudNote(name ? `Signed in as ${name}.` : 'Signed in. Saving to your account.')
    }
    boot()
    return () => {
      gone = true
    }
  }, [])

  function change(next) {
    const normalized = normalizeWorkspace(next)
    setWorkspace(normalized)
    writeStored(normalized)
    pending.current = normalized
    if (timer.current) clearTimeout(timer.current)
    if (!signedIn.current) return
    timer.current = setTimeout(() => {
      const body = pending.current
      if (!body) return
      setCloudNote('Saving.')
      pushCloudWorkspace(body).then((result) => {
        if (!result.ok) {
          setCloudMiss(result.error)
          setCloudNote('')
          return
        }
        setCloudMiss('')
        setCloudNote('Saved.')
      })
    }, 800)
  }

  async function signInCloud() {
    setCloudMiss('')
    const result = await cloudSignIn()
    if (!result.ok) {
      setCloudMiss(result.error)
      return
    }
    signedIn.current = true
    setCloud({ signedIn: true, name: result.name })
    const pulled = await pullCloudWorkspace()
    if (!pulled.ok) {
      setCloudMiss(pulled.error)
      return
    }
    if (pulled.data) {
      const next = normalizeWorkspace(pulled.data)
      setWorkspace(next)
      writeStored(next)
      setCloudNote(
        result.name
          ? `Signed in as ${result.name}. Loaded your galleries.`
          : 'Signed in. Loaded your galleries.',
      )
      return
    }
    const pushed = await pushCloudWorkspace(workspace)
    if (!pushed.ok) {
      setCloudMiss(pushed.error)
      return
    }
    setCloudNote(
      result.name
        ? `Signed in as ${result.name}. Galleries will follow this account.`
        : 'Signed in. Galleries will follow this account.',
    )
  }

  async function pullCloud() {
    if (!signedIn.current) {
      setCloudMiss('Sign in first.')
      return
    }
    const pulled = await pullCloudWorkspace()
    if (!pulled.ok) {
      setCloudMiss(pulled.error)
      return
    }
    if (!pulled.data) {
      setCloudNote('No saved galleries on this account yet.')
      return
    }
    const next = normalizeWorkspace(pulled.data)
    setWorkspace(next)
    writeStored(next)
    setCloudMiss('')
    setCloudNote('Loaded your galleries.')
  }

  function forgetCloud() {
    cloudSignOut()
    signedIn.current = false
    setCloud({ signedIn: false, name: '' })
    setCloudNote('This browser is only saving on this computer now.')
    setCloudMiss('')
  }

  function resetSample() {
    if (!window.confirm('Replace stored galleries with the Mill Street sample?')) {
      return
    }
    change(labelSample(normalizeWorkspace(sampleWorkspace)))
  }

  return (
    <Workspace
      value={workspace}
      onChange={change}
      onResetSample={resetSample}
      cloud={cloud}
      cloudNote={cloudNote}
      cloudMiss={cloudMiss}
      onSignInCloud={signInCloud}
      onPullCloud={pullCloud}
      onForgetCloud={forgetCloud}
    />
  )
}
