import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { CHARACTERS, PAGE_GUIDES, loadGuideMode } from './guides'
import { DEFAULT_CUSTOM } from './customGuide'

const KEY = 'gestura.guides.v2'
const GuideContext = createContext(null)

function loadSettings() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    if (raw && typeof raw === 'object') {
      return {
        mode: ['open', 'min', 'off'].includes(raw.mode) ? raw.mode : 'open',
        who: typeof raw.who === 'string' ? raw.who : 'auto',
        overrides: raw.overrides && typeof raw.overrides === 'object' ? raw.overrides : {},
        custom: { ...DEFAULT_CUSTOM, ...(raw.custom || {}) },
      }
    }
  } catch {
    // fall through to the defaults
  }
  return { mode: loadGuideMode(), who: 'auto', overrides: {}, custom: DEFAULT_CUSTOM }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings))
  } catch {
    // storage may be unavailable; the guides still work
  }
}

// Turns a guide id into a full guide: the base character plus the user's changes.
function resolveGuide(settings, id) {
  if (id === 'custom') {
    const c = settings.custom
    const name = (c.name || '').trim() || 'My Guide'
    return {
      id: 'custom',
      custom: true,
      name,
      role: 'Your own guide',
      pitch: c.pitch,
      rate: c.rate,
      voiceURI: c.voiceURI,
      profile: c,
      intro: `Hi, I’m ${name}! I’m your personal guide. Let me help you find your way around GESTURA.`,
    }
  }
  const base = CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0]
  const o = settings.overrides[base.id] ?? {}
  const name = (o.name ?? '').trim() || base.name
  return {
    ...base,
    name,
    pitch: o.pitch ?? base.pitch,
    rate: o.rate ?? 0.95,
    voiceURI: o.voiceURI ?? '',
    intro: base.intro.replaceAll(base.name, name),
  }
}

export function GuideProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const value = useMemo(
    () => ({
      settings,
      setMode: (mode) => setSettings((s) => ({ ...s, mode })),
      setWho: (who) => setSettings((s) => ({ ...s, who })),
      setOverride: (id, patch) =>
        setSettings((s) => ({
          ...s,
          overrides: { ...s.overrides, [id]: { ...s.overrides[id], ...patch } },
        })),
      resetGuide: (id) =>
        setSettings((s) => {
          const overrides = { ...s.overrides }
          delete overrides[id]
          return { ...s, overrides }
        }),
      setCustom: (patch) => setSettings((s) => ({ ...s, custom: { ...s.custom, ...patch } })),
      resetCustom: () => setSettings((s) => ({ ...s, custom: DEFAULT_CUSTOM })),
      getGuide: (id) => resolveGuide(settings, id),
      guideForPath: (pathname) => {
        const page = PAGE_GUIDES[pathname]
        if (!page) return null
        const id = settings.who === 'auto' ? page.guide : settings.who
        return { guide: resolveGuide(settings, id), tips: page.tips }
      },
    }),
    [settings]
  )

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>
}

export function useGuides() {
  const ctx = useContext(GuideContext)
  if (!ctx) throw new Error('useGuides must be used inside GuideProvider')
  return ctx
}