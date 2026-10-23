export const WELCOME =
  'Hi! I’m the GESTURA assistant. Ask me how to use a feature, or tap one of the suggestions below.'

export const SUGGESTIONS = [
  'What is Gestura?',
  'How do I use Speech to Text?',
  'How do I use Text to Speech?',
  'Which gestures are supported?',
  'Is my data private?',
  'Which browser should I use?',
]

const FALLBACK =
  'I’m not sure about that yet. I can help with Speech to Text, Text to Speech, Gesture Recognition, Quick Phrases, privacy and browser support. Try one of the suggestions below.'

const RULES = [
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    reply:
      'Hello! How can I help you today? You can ask about Speech to Text, Text to Speech, Gesture Recognition or Quick Phrases.',
  },
  {
    keywords: ['what is gestura', 'about gestura', 'purpose', 'who are you', 'project'],
    reply:
      'GESTURA is a student-built prototype that helps Deaf and mute users communicate. It brings together speech-to-text captions, text-to-speech, gesture recognition and quick phrases in one place.',
  },
  {
    keywords: ['what can you do', 'feature', 'help', 'option', 'menu', 'page'],
    reply:
      'Here is what GESTURA offers:\n• Speech to Text: live captions of what someone says\n• Text to Speech: type a message and have it spoken\n• Gesture Recognition: show hand gestures to the camera\n• Quick Phrases: tap ready-made phrases and speak them\n• Chatbot: that’s me!',
  },
  {
    keywords: ['speech to text', 'caption', 'transcript', 'microphone', 'mic', 'listening', 'live caption'],
    reply:
      'Open Speech to Text, choose a language, and press Start Listening. Allow the microphone when your browser asks. Your words appear as live captions, and you can copy or clear the transcript. It works best in Chrome or Edge, in a quiet room.',
  },
  {
    keywords: ['text to speech', 'speak', 'read aloud', 'voice', 'speed', 'volume'],
    reply:
      'Open Text to Speech, type your message, pick a voice, then press Speak. You can adjust the speed and volume with the sliders, and filter the voices by language.',
  },
  {
    keywords: ['gesture', 'camera', 'hand', 'sign', 'sign language', 'recognition', 'asl'],
    reply:
      'On the Gesture Recognition page, press Start Camera and show a hand gesture clearly in good lighting. GESTURA recognises a small set of gestures and turns them into text. It is a prototype, so the vocabulary is limited. Hold each gesture steady for a second or two.',
  },
  {
    keywords: ['quick phrase', 'phrase', 'emergency', 'customize', 'add phrase', 'edit phrase'],
    reply:
      'Quick Phrases has ready-made phrases in four groups: Greetings, Emergency, Daily Life and Questions. Tap ▶ to speak one, or use the pencil and bin icons to edit or delete it. You can add your own too, and they are saved in your browser.',
  },
  {
    keywords: ['privacy', 'private', 'data', 'secure', 'safe', 'store', 'save', 'record'],
    reply:
      'Your quick phrases are saved only in your own browser, and chat messages are not stored. Speech to Text uses your browser’s speech recognition service, which may send audio to the browser’s provider to transcribe it, so avoid saying sensitive information aloud.',
  },
  {
    keywords: ['browser', 'chrome', 'edge', 'safari', 'firefox', 'support', 'compatible'],
    reply:
      'For the best results use the latest Chrome or Edge on a laptop or Android phone. Speech to Text depends on your browser’s speech recognition, which can be limited in Firefox and Safari.',
  },
  {
    keywords: ['not working', 'no sound', 'cannot hear', 'no voice', 'blocked', 'permission', 'error', 'problem', 'issue'],
    reply:
      'If something is not working:\n• Check that you allowed microphone or camera access (click the lock icon in the address bar)\n• Use Chrome or Edge\n• Check your volume and internet connection\n• Reload the page and try again',
  },
  {
    keywords: ['language', 'tamil', 'hindi', 'english', 'telugu', 'malayalam'],
    reply:
      'Speech to Text offers English (India, US, UK), Tamil, Hindi, Telugu and Malayalam. Text to Speech uses the voices installed on your device, so the languages you see depend on your browser and system.',
  },
  {
    keywords: ['offline', 'internet', 'wifi', 'online'],
    reply:
      'Speech to Text needs an internet connection. Text to Speech and Quick Phrases mostly depend on the voices installed on your device.',
  },
  {
    keywords: ['accuracy', 'accurate', 'limit', 'limitation', 'how well', 'reliable'],
    reply:
      'GESTURA is a prototype. Gesture recognition covers a limited set of gestures and works best with good lighting and a clear view of your hand. Speech recognition accuracy depends on accents, noise and your browser. It is a communication aid, not a replacement for a human interpreter.',
  },
  {
    keywords: ['who made', 'who built', 'creator', 'developer', 'team'],
    reply:
      'GESTURA was built as a student project to make everyday communication more accessible for Deaf and mute people.',
  },
  {
    keywords: ['thanks', 'thank you', 'great', 'awesome'],
    reply: 'You’re welcome! Ask me anything else about GESTURA.',
  },
  {
    keywords: ['bye', 'goodbye', 'see you'],
    reply: 'Goodbye! Take care.',
  },
]

// lowercase, strip punctuation, and drop a trailing "s" so "gestures" matches "gesture"
const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w))
    .join(' ')

export function getReply(input) {
  const padded = ` ${normalize(input)} `
  let best = null
  let bestScore = 0

  for (const rule of RULES) {
    let score = 0
    for (const kw of rule.keywords) {
      const k = normalize(kw)
      // whole-word match; longer phrases score higher
      if (padded.includes(` ${k} `)) score += k.split(' ').length
    }
    if (score > bestScore) {
      best = rule
      bestScore = score
    }
  }

  return best ? best.reply : FALLBACK
}