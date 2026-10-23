export const SKIN_TONES = [
  { label: 'Light', value: '#f6d5bd' },
  { label: 'Fair', value: '#f0c29b' },
  { label: 'Medium', value: '#d9a066' },
  { label: 'Tan', value: '#b9783f' },
  { label: 'Dark', value: '#8a5430' },
  { label: 'Deep', value: '#5c3a21' },
]

export const HAIR_COLORS = [
  { label: 'Black', value: '#1f1a24' },
  { label: 'Brown', value: '#5a3825' },
  { label: 'Auburn', value: '#8e3b24' },
  { label: 'Blonde', value: '#e6b94d' },
  { label: 'Grey', value: '#9a98a6' },
  { label: 'Purple', value: '#7c5cff' },
  { label: 'Pink', value: '#f472d0' },
]

export const HAIR_STYLES = [
  { id: 'short', label: 'Short' },
  { id: 'long', label: 'Long' },
  { id: 'curly', label: 'Curly' },
  { id: 'bun', label: 'Bun' },
  { id: 'none', label: 'None' },
]

export const SHIRT_COLORS = [
  { label: 'Purple', value: '#7c5cff' },
  { label: 'Pink', value: '#f472d0' },
  { label: 'Green', value: '#6fbf73' },
  { label: 'Blue', value: '#4aa3df' },
  { label: 'Orange', value: '#f59e42' },
  { label: 'Red', value: '#e05263' },
  { label: 'Teal', value: '#2fb5a8' },
  { label: 'Cream', value: '#f4efe4' },
]

export const PANTS_COLORS = [
  { label: 'Navy', value: '#34407a' },
  { label: 'Jeans', value: '#4a78b8' },
  { label: 'Khaki', value: '#c2a878' },
  { label: 'Black', value: '#2b2b35' },
  { label: 'Maroon', value: '#8a3b4a' },
]

export const EXPRESSIONS = [
  { id: 'neutral', label: 'Neutral' },
  { id: 'smile', label: 'Smile' },
  { id: 'happy', label: 'Happy' },
  { id: 'focused', label: 'Focused' },
]

export const POSES = [
  { id: 'idle', label: 'Idle' },
  { id: 'wave', label: 'Wave' },
]

export const DEFAULT_CUSTOM = {
  name: 'Sam',
  skin: '#d9a066',
  hair: '#5a3825',
  hairStyle: 'short',
  shirt: '#7c5cff',
  pants: '#34407a',
  expression: 'smile',
  pose: 'idle',
  voiceURI: '',
  pitch: 1,
  rate: 0.95,
}