import React, { useState } from 'react';
import { FaInstagram, FaFacebook, FaYoutube, FaGithub } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
// import PrivacyPolicyModal from '../common/PrivacyPolicyModal';
// import TermsOfServiceModal from '../common/TermsOfServicesModal';

const FooterSection = () => {
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsOfServiceOpen, setIsTermsOfServiceOpen] = useState(false);

  return (
    <footer className="bg-[#7D712E] dark:bg-gray-950 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white dark:text-[#7D712E]">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Pet', 'Shelter', 'Guide', 'FAQ'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="dark:hover:text-[#7D712E] text-white transition duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
          <h4 className="text-xl font-bold mb-6 text-white dark:text-[#7D712E]">Legal</h4>
          <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setIsPrivacyPolicyOpen(true)}
                  className="dark:hover:text-[#7D712E] text-white transition duration-300"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTermsOfServiceOpen(true)}
                  className="dark:hover:text-[#7D712E] text-white transition duration-300"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white dark:text-[#7D712E]">Stay Connected</h4>
            <p className="mb-4 text-white">Follow us for the latest updates and community events.</p>
            <div className="flex space-x-4">
                {[{ icon: FaInstagram, link: 'https://www.instagram.com/taleelee20/' },
                { icon: FaFacebook, link: 'https://www.facebook.com/lee.nillar/' },
                { icon: FaYoutube, link: 'https://www.youtube.com/@lee9266' },
                { icon: FaGithub, link: 'https://github.com/LeeePH' }].map(({ icon: Icon, link }, index) => (
                  <a key={index} href={link} className="text-white hover:text-[#000000] dark:hover:text-[#7D712E] transition duration-300" target="_blank" rel="noopener noreferrer">
                    <Icon size={24} />
                  </a>
                ))}
            </div>
          </div>


          {/* Newsletter Signup */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white dark:text-[#7D712E]">Newsletter</h4>
            <p className="mb-4 text-white">Subscribe for early updates and notifications.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                className="dark:bg-[#7D712E] bg-gray-200 px-4 py-2 rounded-r-md transition duration-300"
              >
                <HiMail size={24} />
              </button>
            </form>
          </div>
        </div>

        {/* Developed By */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-center">
          <p className="text-sm text-white dark:text-gray-300 mt-4">
            © {new Date().getFullYear()} PawConnect | All rights reserved.
          </p>
        </div>
      </div>

      {/* <PrivacyPolicyModal
        isOpen={isPrivacyPolicyOpen}
        onClose={() => setIsPrivacyPolicyOpen(false)}
      />
      <TermsOfServiceModal
        isOpen={isTermsOfServiceOpen}
        onClose={() => setIsTermsOfServiceOpen(false)}
      /> */}
    </footer>
  );
};

export default FooterSection;

