import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ComingSoon from './pages/ComingSoon'
import { NAV_ITEMS } from './navItems'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          {NAV_ITEMS.filter((i) => i.path !== '/').map((i) => (
            <Route key={i.path} path={i.path} element={<ComingSoon title={i.label} />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}