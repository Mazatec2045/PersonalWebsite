import { useState } from 'react';
import InteractiveHero from './components/InteractiveHero';
import { Navbar, About, Experience, Tech, Works, Contact, Hero } from './components';
import { StarsCanvas } from './components/canvas';

/**
 * Main App Component - Hybrid 3D Portfolio
 * 
 * Structure:
 * 1. Fixed Landing Page (InteractiveHero) - Full screen 3D experience
 * 2. Scrollable Portfolio Sections - Traditional portfolio content
 */
const App = () => {
  const [showLanding, setShowLanding] = useState(true);

  return (
    <div className="relative">
      {/* Fixed 3D Landing Page */}
      {showLanding && (
        <div className="fixed inset-0 z-50">
          <InteractiveHero onExplore={() => setShowLanding(false)} />
        </div>
      )}

      {/* Scrollable Portfolio Content */}
      <div id="portfolio" className="relative z-0 bg-primary">
        {/* Add padding-top to account for landing page */}
        <div className="h-screen" /> {/* Spacer for landing page */}

        <div className="relative z-0">
          <Navbar />

          <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
            <Hero />
          </div>

          <About />
          <Experience />
          <Tech />
          <Works />

          <div className="relative z-0">
            <Contact />
            <StarsCanvas />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
