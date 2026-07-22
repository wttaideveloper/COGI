import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { SkipToContent } from './SkipToContent'

export function MainLayout() {
  return (
    <>
      <SkipToContent />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
