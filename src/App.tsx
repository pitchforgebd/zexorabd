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

export default function App() {
  return (
    <HelmetProvider>
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
        </Routes>
      </Router>
    </HelmetProvider>
  );
}
