import { X } from 'lucide-react';

const SettingsModal = ({
  isOpen,
  onClose,
  darkMode,
  toggleDarkMode,
  notifications,
  toggleNotifications,
  privacySettings,
  togglePrivacySettings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none bg-gray-100 dark:bg-gray-700 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-medium text-gray-800 dark:text-white">Dark Mode</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark mode for better visibility in low light</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#b8be5a] focus:ring-offset-2 ${
                darkMode ? 'bg-[#b8be5a]' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-medium text-gray-800 dark:text-white">Notifications</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about your adoption applications</p>
            </div>
            <button
              onClick={toggleNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#b8be5a] focus:ring-offset-2 ${
                notifications ? 'bg-[#b8be5a]' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Privacy Settings Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-medium text-gray-800 dark:text-white">Privacy Settings</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Control your profile visibility</p>
            </div>
            <button
              onClick={togglePrivacySettings}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#b8be5a] focus:ring-offset-2 ${
                privacySettings ? 'bg-[#b8be5a]' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacySettings ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 flex justify-end border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors shadow-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 