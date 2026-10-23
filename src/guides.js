export const CHARACTERS = [
  {
    id: 'aarav',
    name: 'Aarav',
    role: 'Captions guide',
    pitch: 1,
    body: '/guides/aarav.png',
    head: '/guides/aarav-head.png',
    intro:
      'Hi, I’m Aarav! I’ll help you with live captions and conversations. Ask me anything as you explore.',
  },
  {
    id: 'kabir',
    name: 'Kabir',
    role: 'Voice & gesture guide',
    pitch: 0.8,
    body: '/guides/kabir.png',
    head: '/guides/kabir-head.png',
    intro:
      'Hey, I’m Kabir! I’ll show you how to speak your messages aloud and how to use hand gestures.',
  },
  {
    id: 'meera',
    name: 'Meera',
    role: 'Phrases & chat guide',
    pitch: 1.3,
    body: '/guides/meera.png',
    head: '/guides/meera-head.png',
    intro:
      'Hello, I’m Meera! I’ll help you with quick phrases and answer your questions in the chat.',
  },
]

export const PAGE_GUIDES = {
  '/': {
    guide: 'aarav',
    tips: [
      'Welcome to GESTURA! Pick any tool from the menu at the top. Each page has its own guide.',
      'New here? Tap “Show me around” and I’ll walk you through every page.',
      'Not sure where to start? Try Quick Phrases for one-tap speech, or Speech to Text for live captions.',
    ],
  },
  '/speech-to-text': {
    guide: 'aarav',
    tips: [
      'Press Start Listening and allow the microphone. Spoken words appear as live captions.',
      'Choose the language that matches the speaker before you start.',
      'Use Copy text to save the conversation, or Clear transcript to start fresh.',
    ],
  },
  '/text-to-speech': {
    guide: 'kabir',
    tips: [
      'Type your message and press Speak. GESTURA says it out loud for you.',
      'Try different voices, and slow the speed down if your listener needs it.',
      'Stop cuts the voice right away if you change your mind.',
    ],
  },
  '/gesture-recognition': {
    guide: 'kabir',
    tips: [
      'Press Start Camera and allow access. Keep your hand well lit and fully in view.',
      'Hold each gesture steady for about a second. Watch the Debug line count up.',
      'Tick “Speak recognized phrases” to hear each gesture said aloud. Lower your hand between gestures.',
    ],
  },
  '/quick-phrases': {
    guide: 'meera',
    tips: [
      'Pick a category, then tap ▶ next to a phrase to say it aloud.',
      'Add your own phrases at the top. The pencil edits one and the bin deletes it.',
      'Try Common Conversations for ready-made phrases for a restaurant, doctor or shop.',
    ],
  },
  '/chatbot': {
    guide: 'meera',
    tips: [
      'Ask me how to use any page. The suggestion buttons are a quick way to start.',
      'Tap Listen under a reply to hear it read aloud.',
    ],
  },
  '/guides': {
    guide: 'meera',
    tips: [
      'These are your three guides. Each one looks after different pages.',
      'You can minimize or turn off the guides below whenever you like.',
    ],
  },
}

// Order of the "Show me around" tour
export const TOUR = [
  '/speech-to-text',
  '/text-to-speech',
  '/gesture-recognition',
  '/quick-phrases',
  '/chatbot',
  '/guides',
]

const MODE_KEY = 'gestura.guideMode'

export function loadGuideMode() {
  try {
    const m = localStorage.getItem(MODE_KEY)
    return ['open', 'min', 'off'].includes(m) ? m : 'open'
  } catch {
    return 'open'
  }
}

export function saveGuideMode(mode) {
  try {
    localStorage.setItem(MODE_KEY, mode)
  } catch {
    // storage may be unavailable; the guide still works
  }
}