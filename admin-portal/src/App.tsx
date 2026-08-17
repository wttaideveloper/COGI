import { Navigate, Route, Routes } from 'react-router-dom'
import RequireAuth from '@/components/RequireAuth'
import AdminLayout from '@/layouts/AdminLayout'
import { AuditPage, DashboardPage, EnquiriesPage, ForgotPasswordPage, GenericContentPage, LoginPage, NavigationPage, NewsletterPage, ProfilePage, ResetPasswordPage, SettingsPage } from '@/pages/AdminPages'
import UsersPage from '@/pages/UsersPage'
import HomepagePage from '@/pages/HomepageManagerPage'
import MediaLibraryPage from '@/pages/MediaLibraryPage'
import PageEditorPage from '@/pages/PageEditorPage'
import { FooterEditorPage, HeaderEditorPage, SeoEditorPage, ThemePage } from '@/pages/SiteSetupPages'
import WebsiteCopyPage from '@/pages/WebsiteCopyPage'
import type { ModuleKey } from '@/types'

const crudModules: ModuleKey[] = ['programs', 'blog', 'events', 'stories', 'testimonials', 'team', 'partners', 'locations']

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="theme" element={<ThemePage />} />
          <Route path="seo" element={<SeoEditorPage />} />
          <Route path="header" element={<HeaderEditorPage />} />
          <Route path="footer" element={<FooterEditorPage />} />
          <Route path="homepage" element={<HomepagePage />} />
          <Route path="website-copy" element={<WebsiteCopyPage />} />
          <Route path="media" element={<MediaLibraryPage />} />
          <Route path="navigation" element={<NavigationPage />} />
          <Route path="pages" element={<GenericContentPage moduleKey="pages" />} />
          <Route path="pages/:id" element={<PageEditorPage />} />
          {crudModules.map((key) => <Route key={key} path={`${key}`} element={<GenericContentPage moduleKey={key} />} />)}
          {crudModules.map((key) => <Route key={`${key}-edit`} path={`${key}/:id`} element={<GenericContentPage moduleKey={key} />} />)}
          <Route path="enquiries" element={<EnquiriesPage />} />
          <Route path="newsletter" element={<NewsletterPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
