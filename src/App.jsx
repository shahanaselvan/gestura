import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ComingSoon from './pages/ComingSoon'
import TextToSpeech from './pages/TextToSpeech'
import { NAV_ITEMS } from './navItems'
import SpeechToText from './pages/SpeechToText'
// Add each finished page here. Anything not listed shows "Coming soon".
const PAGES = {
  '/text-to-speech': TextToSpeech,
  '/speech-to-text': SpeechToText,
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          {NAV_ITEMS.filter((i) => i.path !== '/').map((i) => {
            const Page = PAGES[i.path]
            return (
              <Route
                key={i.path}
                path={i.path}
                element={Page ? <Page /> : <ComingSoon title={i.label} />}
              />
            )
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}