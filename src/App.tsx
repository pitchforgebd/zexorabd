/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
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
import Contact from './pages/Contact';

// New Pages
import CeoMessage from './pages/CeoMessage';
import Career from './pages/Career';
import MediaCentre from './pages/media/MediaCentre';
import News from './pages/media/News';
import NewsDetail from './pages/media/NewsDetail';
import PhotoGallery from './pages/media/PhotoGallery';
import VideoGallery from './pages/media/VideoGallery';

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
import AdminContactMessages from './admin/inbox/AdminContactMessages';
import AdminCareerApplications from './admin/inbox/AdminCareerApplications';
import AdminSeoSettings from './admin/seo/AdminSeoSettings';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
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
              <Route path="career" element={<Career />} />
              <Route path="media-centre" element={<MediaCentre />} />
              <Route path="media-centre/news" element={<News />} />
              <Route path="media-centre/news/:slug" element={<NewsDetail />} />
              <Route path="media-centre/photo-gallery" element={<PhotoGallery />} />
              <Route path="media-centre/video-gallery" element={<VideoGallery />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
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
                <Route path="seo" element={<AdminSeoSettings />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
