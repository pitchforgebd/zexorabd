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
import PhotoGallery from './pages/media/PhotoGallery';
import VideoGallery from './pages/media/VideoGallery';

// Admin (Phase 3+)
import { AuthProvider } from './admin/AuthContext';
import ProtectedRoute from './admin/ProtectedRoute';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminPlaceholder from './admin/AdminPlaceholder';

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
              <Route path="media-centre/photo-gallery" element={<PhotoGallery />} />
              <Route path="media-centre/video-gallery" element={<VideoGallery />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="divisions" element={<AdminPlaceholder title="Divisions & Products" phase="Phase 4" />} />
                <Route path="media" element={<AdminPlaceholder title="News & Media" phase="Phase 5" />} />
                <Route path="homepage" element={<AdminPlaceholder title="Homepage & Suppliers" phase="Phase 6" />} />
                <Route path="sections" element={<AdminPlaceholder title="Page Sections" phase="Phase 7" />} />
                <Route path="career-applications" element={<AdminPlaceholder title="Career Applications" phase="Phase 8" />} />
                <Route path="contact-messages" element={<AdminPlaceholder title="Contact Messages" phase="Phase 8" />} />
                <Route path="seo" element={<AdminPlaceholder title="SEO" phase="Phase 9" />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
