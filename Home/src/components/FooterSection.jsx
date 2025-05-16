import React, { useState } from 'react';
import { FaInstagram, FaFacebook, FaYoutube, FaGithub } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import { X, FileText, Shield } from 'lucide-react';

const FooterSection = () => {
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsOfServiceOpen, setIsTermsOfServiceOpen] = useState(false);

  return (
    <footer className="bg-[#7D712E] dark:bg-gray-950 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          <div>
            <h4 className="text-xl font-bold mb-6 text-white dark:text-[#7D712E]">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Pet', 'Shelter', 'Guide', 'FAQ'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="dark:hover:text-[#7D712E] text-white hover:text-black transition duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
          <h4 className="text-xl font-bold mb-6 text-white dark:text-[#7D712E]">Legal</h4>
          <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setIsPrivacyPolicyOpen(true)}
                  className="dark:hover:text-[#7D712E] text-white hover:text-black transition duration-300"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTermsOfServiceOpen(true)}
                  className="dark:hover:text-[#7D712E] text-white hover:text-black transition duration-300"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

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

        <div className="border-t border-gray-800 pt-8 mt-8 text-center">
          <p className="text-sm text-white dark:text-gray-300 mt-4">
            © {new Date().getFullYear()} PawConnect | All rights reserved.
          </p>
        </div>
      </div>

      {isTermsOfServiceOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-[#6D712E]/20 to-[#6D712E]/5 dark:from-[#6D712E]/30 dark:to-[#6D712E]/10 px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setIsTermsOfServiceOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white/80 dark:bg-gray-800/80 rounded-full p-1.5 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#6D712E]/50"
                aria-label="Close terms of service"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#6D712E]/15 dark:bg-[#6D712E]/20 shadow-inner">
                  <FileText className="h-7 w-7 text-[#6D712E]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Terms of Service</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6">
              <div className="prose dark:prose-invert max-w-none prose-headings:text-[#6D712E] dark:prose-headings:text-[#A2A86E] prose-h4:text-lg prose-h4:font-semibold prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-li:text-gray-600 dark:prose-li:text-gray-300">
                <h4 className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#6D712E]/15 text-[#6D712E] text-sm font-bold">
                    1
                  </span>
                  Acceptance of Terms
                </h4>
                <p>By accessing and using PawConnect, you agree to be bound by these Terms of Service.</p>

                <h4 className="flex items-center gap-2 mt-6">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#6D712E]/15 text-[#6D712E] text-sm font-bold">
                    2
                  </span>
                  User Responsibilities
                </h4>
                <p>Users must:</p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Provide accurate information during registration
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Maintain the security of their account
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Not use the service for any illegal purposes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Not share their account credentials
                  </li>
                </ul>

                <h4 className="flex items-center gap-2 mt-6">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#6D712E]/15 text-[#6D712E] text-sm font-bold">
                    3
                  </span>
                  Pet Adoption Process
                </h4>
                <p>PawConnect facilitates pet adoption by:</p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Connecting potential adopters with shelters
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Providing information about available pets
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Supporting the adoption process
                  </li>
                </ul>

                <h4 className="flex items-center gap-2 mt-6">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#6D712E]/15 text-[#6D712E] text-sm font-bold">
                    4
                  </span>
                  Limitation of Liability
                </h4>
                <p>PawConnect is not responsible for:</p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    The health or behavior of adopted pets
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Any disputes between adopters and shelters
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Any damages or losses resulting from pet adoption
                  </li>
                </ul>
              </div>
            </div>

            <div className="px-8 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center flex-shrink-0">
              <button
                onClick={() => setIsTermsOfServiceOpen(false)}
                className="px-6 py-2.5 bg-[#6D712E] hover:bg-[#5A5E26] text-white rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#6D712E]/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {isPrivacyPolicyOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-[#6D712E]/20 to-[#6D712E]/5 dark:from-[#6D712E]/30 dark:to-[#6D712E]/10 px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setIsPrivacyPolicyOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white/80 dark:bg-gray-800/80 rounded-full p-1.5 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#6D712E]/50"
                aria-label="Close privacy policy"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#6D712E]/15 dark:bg-[#6D712E]/20 shadow-inner">
                  <Shield className="h-7 w-7 text-[#6D712E]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6">
              <div className="prose dark:prose-invert max-w-none prose-headings:text-[#6D712E] dark:prose-headings:text-[#A2A86E] prose-h4:text-lg prose-h4:font-semibold prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-li:text-gray-600 dark:prose-li:text-gray-300">
                <h4 className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#6D712E]/15 text-[#6D712E] text-sm font-bold">
                    1
                  </span>
                  Information We Collect
                </h4>
                <p>We collect:</p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Name and contact information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Email address
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Account credentials
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Adoption preferences
                  </li>
                </ul>

                <h4 className="flex items-center gap-2 mt-6">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#6D712E]/15 text-[#6D712E] text-sm font-bold">
                    2
                  </span>
                  How We Use Your Information
                </h4>
                <p>We use your information to:</p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Process your registration
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Facilitate pet adoptions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Send important updates
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Improve our services
                  </li>
                </ul>

                <h4 className="flex items-center gap-2 mt-6">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#6D712E]/15 text-[#6D712E] text-sm font-bold">
                    3
                  </span>
                  Data Protection
                </h4>
                <p>We protect your data by:</p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Using secure servers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Encrypting sensitive information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Regular security updates
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Limited access to personal data
                  </li>
                </ul>

                <h4 className="flex items-center gap-2 mt-6">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#6D712E]/15 text-[#6D712E] text-sm font-bold">
                    4
                  </span>
                  Your Rights
                </h4>
                <p>You have the right to:</p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Access your personal data
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Request data correction
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Delete your account
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#6D712E]"></span>
                    Opt-out of communications
                  </li>
                </ul>
              </div>
            </div>

            <div className="px-8 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center flex-shrink-0">
              <button
                onClick={() => setIsPrivacyPolicyOpen(false)}
                className="px-6 py-2.5 bg-[#6D712E] hover:bg-[#5A5E26] text-white rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#6D712E]/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default FooterSection;

