import React, { useEffect } from 'react';
import './index.css';

import NavSection from './components/NavSection';
import MainSection from './components/MainSection';
import PetsSection from './components/PetsSection';
import FAQSection from './components/FAQSection';
import PetNewsSection from './components/PetNewsSection';
import SupportUs from './components/SupportUs';
import FooterSection from './components/FooterSection';

const App = () => {
  useEffect(() => {
    const loadChatbaseScript = () => {
      if (!window.chatbase || window.chatbase('getState') !== 'initialized') {
        window.chatbase = (...args) => {
          if (!window.chatbase.q) {
            window.chatbase.q = [];
          }
          window.chatbase.q.push(args);
        };
        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === 'q') {
              return target.q;
            }
            return (...args) => target(prop, ...args);
          },
        });
      }

      const onLoad = () => {
        const script = document.createElement('script');
        script.src = 'https://www.chatbase.co/embed.min.js';
        script.id = 'QZiJAATLhLB_xTPIM5R1T';
        script.domain = 'www.chatbase.co';
        document.body.appendChild(script);
      };

      if (document.readyState === 'complete') {
        onLoad();
      } else {
        window.addEventListener('load', onLoad);
      }
    };
    
    loadChatbaseScript();
  }, []);

  return (
    <div>
      <NavSection />
      <MainSection />
      <PetsSection />
      <PetNewsSection />
      <FAQSection />
      <SupportUs />
      <FooterSection />
    </div>
  );
};

export default App;
