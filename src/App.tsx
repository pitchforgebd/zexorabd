/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import RouteTitleSync from './components/RouteTitleSync';
import Home from './pages/Home';
import About from './pages/About';
import VisionMission from './pages/VisionMission';
import Divisions from './pages/Divisions';
import Chemicals from './pages/divisions/Chemicals';
import Equipment from './pages/divisions/Equipment';
import Power from './pages/divisions/Power';
import Apparel from './pages/divisions/Apparel';
import PrintPack from './pages/divisions/PrintPack';
import Fashion from './pages/divisions/Fashion';
import GlobalSourcing from './pages/GlobalSourcing';
import OurStory from './pages/OurStory';
import Company from './pages/Company';
import Contact from './pages/Contact';

// New Pages
import CeoMessage from './pages/CeoMessage';
import Career from './pages/Career';
import MediaCentre from './pages/media/MediaCentre';
import News from './pages/media/News';
import NewsDetail from './pages/media/NewsDetail';
import PhotoGallery from './pages/media/PhotoGallery';
import VideoGallery from './pages/media/VideoGallery';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import SubsidiaryDetail from './pages/SubsidiaryDetail';

// Admin (Phase 3+)
import { AuthProvider } from './admin/AuthContext';
import ProtectedRoute from './admin/ProtectedRoute';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminDivisionsList from './admin/divisions/AdminDivisionsList';
import AdminDivisionEdit from './admin/divisions/AdminDivisionEdit';
import AdminMediaHub from './admin/media/AdminMediaHub';
import AdminNewsList from './admin/media/AdminNewsList';
import AdminNewsEdit from './admin/media/AdminNewsEdit';
import AdminPhotoGallery from './admin/media/AdminPhotoGallery';
import AdminVideoGallery from './admin/media/AdminVideoGallery';
import AdminHomepage from './admin/homepage/AdminHomepage';
import AdminSuppliers from './admin/homepage/AdminSuppliers';
import AdminPageSections from './admin/sections/AdminPageSections';
import AdminWebsiteSettings from './admin/settings/AdminWebsiteSettings';
import AdminPagesHub from './admin/pages/AdminPagesHub';
import AdminAboutPage from './admin/pages/AdminAboutPage';
import AdminCeoMessagePage from './admin/pages/AdminCeoMessagePage';
import AdminVisionMissionPage from './admin/pages/AdminVisionMissionPage';
import AdminGlobalSourcingPage from './admin/pages/AdminGlobalSourcingPage';
import AdminOurStoryPage from './admin/pages/AdminOurStoryPage';
import AdminContactMessages from './admin/inbox/AdminContactMessages';
import AdminCareerApplications from './admin/inbox/AdminCareerApplications';
import AdminSeoHub from './admin/seo/AdminSeoHub';
import AdminSeoSettings from './admin/seo/AdminSeoSettings';
import AdminSeoTools from './admin/seo/AdminSeoTools';
import AdminAccount from './admin/AdminAccount';

export default function App() {
  return (
    <Router>
      <RouteTitleSync />
      <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="ceo-message" element={<CeoMessage />} />
            <Route path="vision-mission" element={<VisionMission />} />
            <Route path="divisions" element={<Divisions />} />
            <Route path="divisions/chemicals" element={<Chemicals />} />
            <Route path="divisions/equipment" element={<Equipment />} />
            <Route path="divisions/power" element={<Power />} />
            <Route path="divisions/apparel" element={<Apparel />} />
            <Route path="divisions/printpack" element={<PrintPack />} />
            <Route path="divisions/fashion" element={<Fashion />} />
            <Route path="global-sourcing" element={<GlobalSourcing />} />
            <Route path="our-story" element={<OurStory />} />
            <Route path="company" element={<Company />} />
            <Route path="career" element={<Career />} />
            <Route path="media-centre" element={<MediaCentre />} />
            <Route path="media-centre/news" element={<News />} />
            <Route path="media-centre/news/:slug" element={<NewsDetail />} />
            <Route path="media-centre/photo-gallery" element={<PhotoGallery />} />
            <Route path="media-centre/video-gallery" element={<VideoGallery />} />
            <Route path="contact" element={<Contact />} />
            <Route path="subsidiaries/:slug" element={<SubsidiaryDetail />} />
            {/* Draft policies based on this site's actual data practices -
                each page carries a visible notice that it needs legal
                review before being relied on as a compliance document. */}
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* AuthProvider is scoped to just the admin subtree - it checks
              /api/auth/me on mount, which used to fire (and 401) on every
              public pageview from anonymous visitors when it wrapped the
              whole app. */}
          <Route element={<AuthProvider><Outlet /></AuthProvider>}>
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="settings" element={<AdminWebsiteSettings />} />
                <Route path="pages" element={<AdminPagesHub />} />
                <Route path="pages/about" element={<AdminAboutPage />} />
                <Route path="pages/ceo-message" element={<AdminCeoMessagePage />} />
                <Route path="pages/vision-mission" element={<AdminVisionMissionPage />} />
                <Route path="pages/global-sourcing" element={<AdminGlobalSourcingPage />} />
                <Route path="pages/our-story" element={<AdminOurStoryPage />} />
                <Route path="divisions" element={<AdminDivisionsList />} />
                <Route path="divisions/:id" element={<AdminDivisionEdit />} />
                <Route path="media" element={<AdminMediaHub />} />
                <Route path="media/news" element={<AdminNewsList />} />
                <Route path="media/news/:id" element={<AdminNewsEdit />} />
                <Route path="media/photos" element={<AdminPhotoGallery />} />
                <Route path="media/videos" element={<AdminVideoGallery />} />
                <Route path="homepage" element={<AdminHomepage />} />
                <Route path="homepage/suppliers" element={<AdminSuppliers />} />
                <Route path="sections" element={<AdminPageSections />} />
                <Route path="career-applications" element={<AdminCareerApplications />} />
                <Route path="contact-messages" element={<AdminContactMessages />} />
                <Route path="seo" element={<AdminSeoHub />} />
                <Route path="seo/pages" element={<AdminSeoSettings />} />
                <Route path="seo/tools" element={<AdminSeoTools />} />
                <Route path="account" element={<AdminAccount />} />
              </Route>
            </Route>
          </Route>
      </Routes>
    </Router>
  );
}
