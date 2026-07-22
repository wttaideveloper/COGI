import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { SiteConfigProvider } from '@/contexts/SiteConfigContext'
import { MainLayout } from '@/components/layout/MainLayout'
import { HomePage } from '@/pages/HomePage'
import { AboutPage } from '@/pages/AboutPage'
import { OurStoryPage } from '@/pages/OurStoryPage'
import { BoardPage } from '@/pages/BoardPage'
import { GlobalTeamPage } from '@/pages/GlobalTeamPage'
import { BeliefsPage } from '@/pages/BeliefsPage'
import { PartnersPage } from '@/pages/PartnersPage'
import { ProgramsPage } from '@/pages/ProgramsPage'
import { ProgramDetailPage } from '@/pages/ProgramDetailPage'
import { ResourcesPage } from '@/pages/ResourcesPage'
import { StoriesPage } from '@/pages/StoriesPage'
import { TestimonialsPage } from '@/pages/TestimonialsPage'
import { BlogPage } from '@/pages/BlogPage'
import { BlogDetailPage } from '@/pages/BlogDetailPage'
import { EventsPage } from '@/pages/EventsPage'
import { EventDetailPage } from '@/pages/EventDetailPage'
import { GetInvolvedPage } from '@/pages/GetInvolvedPage'
import { DonatePage } from '@/pages/DonatePage'
import { ContactPage } from '@/pages/ContactPage'
import { SearchPage } from '@/pages/SearchPage'
import { LegalPage } from '@/pages/LegalPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SiteConfigProvider>
          <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="about/our-story" element={<OurStoryPage />} />
              <Route path="about/board" element={<BoardPage />} />
              <Route path="about/global-team" element={<GlobalTeamPage />} />
              <Route path="about/beliefs" element={<BeliefsPage />} />
              <Route path="about/partners" element={<PartnersPage />} />
              <Route path="programs" element={<ProgramsPage />} />
              <Route path="programs/:slug" element={<ProgramDetailPage />} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="resources/stories" element={<StoriesPage />} />
              <Route path="resources/testimonials" element={<TestimonialsPage />} />
              <Route path="resources/blog" element={<BlogPage />} />
              <Route path="resources/blog/:slug" element={<BlogDetailPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:slug" element={<EventDetailPage />} />
              <Route path="get-involved" element={<GetInvolvedPage />} />
              <Route path="donate" element={<DonatePage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="privacy-policy" element={<LegalPage />} />
              <Route path="terms-of-use" element={<LegalPage />} />
              <Route path="cookie-notice" element={<LegalPage />} />
              <Route path="accessibility" element={<LegalPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
          </BrowserRouter>
        </SiteConfigProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
