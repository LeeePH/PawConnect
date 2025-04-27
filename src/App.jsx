import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// client
import NavSection from './components/NavSection';
import MainContent from './components/MainContent';
import PetSection from './components/PetsSection';
import PartneredShelters from './components/PartneredShelters';
import AdoptionSteps from './components/AdoptionSteps';
import CoexistenceSection from './components/CoexistenceSection';
import FaqSection from './components/FaqSection';
import FooterSection from './components/FooterSection';

// admin
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <NavSection />
              <MainContent />
              <PetSection />
              <PartneredShelters/>
              {/* <CoexistenceSection /> */}
              <AdoptionSteps />
              <FaqSection />
              <FooterSection />
            </div>
          }
        />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
