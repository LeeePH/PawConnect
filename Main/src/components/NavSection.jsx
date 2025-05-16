"use client"

import { useEffect, useState } from "react"    
import { jwtDecode } from 'jwt-decode';
import { Sun, Moon, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import ProfileModal from './modals/ProfileModal';
import ApplicationModal from './modals/ApplicationModal';
import SettingsModal from './modals/SettingsModal';
import NotificationModal from './modals/NotificationModal';

const NavSection = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [username, setUsername] = useState("")
  const [userId, setUserId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [adoptionStatus, setAdoptionStatus] = useState([])
  const [showAdoptionStatus, setShowAdoptionStatus] = useState(false)
  const [userData, setUserData] = useState({
    name: "",
    avatar: "/placeholder.svg?height=200&width=200",
    favoritePet: null,
    notifications: {
      email: true,
      push: false,
      newsletter: true,
    },
    privacy: {
      profileVisibility: "public",
      activityTracking: true,
    },
  })
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [applications, setApplications] = useState([])
  const [userRemark, setUserRemark] = useState("");
  const [isSubmittingRemark, setIsSubmittingRemark] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelAppId, setCancelAppId] = useState(null);
  const [notification, setNotification] = useState({ open: false, title: '', message: '', statusType: '' });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  // Handle scroll event to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const userDataFromUrl = urlParams.get("userData");
    if (tokenFromUrl && userDataFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      localStorage.setItem("userData", decodeURIComponent(userDataFromUrl));
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    console.log('=== Initial useEffect running ===');
    
    const token = localStorage.getItem("token");
    const storedUserData = localStorage.getItem("userData");
    console.log('Raw token from localStorage:', token);
    console.log('Stored user data:', storedUserData);

    if (token && storedUserData) {
      try {
        const decoded = jwtDecode(token);
        const userData = JSON.parse(storedUserData);
        console.log('Full decoded token:', decoded);
        console.log('Parsed user data:', userData);
        
        if (decoded && decoded.id) {
          console.log('Found user ID in token:', decoded.id);
          setUserId(decoded.id);
          setUsername(userData.username || decoded.username);
          setUserData(prev => ({
            ...prev,
            name: userData.username || decoded.username,
            email: userData.email || "",
            created_at: userData.created_at || ""
          }));
        } else {
          console.log('Token structure:', {
            hasId: !!decoded.id,
            decodedKeys: Object.keys(decoded)
          });
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
        }
      } catch (error) {
        console.error('Error decoding token or parsing user data:', error);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      }
    } else {
      // Handle username from URL or localStorage if no token
      const urlParams = new URLSearchParams(window.location.search);
      const user = urlParams.get("username");
      console.log('Username from URL:', user);

      if (user) {
        console.log('Setting username from URL:', user);
        setUsername(user);
        setUserData(prev => ({
          ...prev,
          name: user,
        }));
        localStorage.setItem("username", user);
      } else {
        const savedUsername = localStorage.getItem("username");
        console.log('Username from localStorage:', savedUsername);
        if (savedUsername) {
          setUsername(savedUsername);
          setUserData(prev => ({
            ...prev,
            name: savedUsername,
          }));
        }
      }
    }
  }, []);

  // Add a function to check token status
  const checkTokenStatus = () => {
    const token = localStorage.getItem("token");
    console.log('Current token status:', {
      exists: !!token,
      value: token ? 'Present' : 'Not found'
    });
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Current token decoded:', decoded);
      } catch (error) {
        console.error('Error decoding current token:', error);
      }
    }
  };

  // Add token check when modal opens
  useEffect(() => {
    if (showProfileModal) {
      console.log('Profile modal opened, checking token status...');
      checkTokenStatus();
    }
  }, [showProfileModal]);

  useEffect(() => {
    console.log('=== userData updated:', userData);
  }, [userData]);

  const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("token")
    window.location.href = "http://localhost:5173"
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".user-dropdown")) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  // Handle notification settings change
  const handleNotificationChange = (setting, value) => {
    setUserData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: value,
      },
    }))
  }

  // Handle privacy settings change
  const handlePrivacyChange = (setting, value) => {
    setUserData((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [setting]: value,
      },
    }))
  }

  // Function to refresh user's favorite pet
  const refreshFavoritePet = async () => {
    if (userId) {
      try {
        const favoritesResponse = await fetch(`http://localhost:5001/favorites/user/${userId}`);
        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json();
          setUserData(prev => ({
            ...prev,
            favoritePets: favoritesData.map(pet => ({
              pet_id: pet.pet_id,
              name: pet.name,
              type: pet.type
            }))
          }));
        }
      } catch (error) {
        console.error('Error refreshing favorite pet:', error);
      }
    }
  };

  useEffect(() => {
    // Listen for custom event to refresh favorite pet
    const handler = () => refreshFavoritePet();
    window.addEventListener("refreshFavoritePet", handler);
    return () => window.removeEventListener("refreshFavoritePet", handler);
  }, [userId]);

  // fetch adoption status
  const fetchAdoptionStatus = async () => {
    if (userId) {
      try {
        const response = await fetch(`http://localhost:5001/adoption-status/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setAdoptionStatus(data);
        }
      } catch (error) {
        console.error('Error fetching adoption status:', error);
      }
    }
  };

  // Add useEffect to fetch adoption status when userId changes
  useEffect(() => {
    if (userId) {
      fetchAdoptionStatus();
    }
  }, [userId]);

  // Add function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Add function to fetch applications
  const fetchApplications = async () => {
    if (userId) {
      try {
        const response = await fetch(`http://localhost:5001/adoption-status/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    }
  };

  useEffect(() => {
    if (showProfileModal) {
      fetchApplications();
    }
  }, [showProfileModal, userId]);

  const handleUserRemarkSubmit = async (applicationId) => {
    setIsSubmittingRemark(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/adoption-status/${applicationId}/user-remark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ remark: userRemark })
      });
      if (res.ok) {
        setUserRemark("");
        fetchApplications && fetchApplications();
      }
    } catch (e) {
      // handle error
    }
    setIsSubmittingRemark(false);
  };

  // cancelApplication function (now triggers modal)
  const cancelApplication = (applicationId) => {
    setCancelAppId(applicationId);
    setShowCancelModal(true);
  };

  const confirmCancelApplication = async () => {
    if (!cancelAppId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/adoption-status/${cancelAppId}/cancel`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        setShowApplicationModal(false);
        fetchApplications();
      } else {
        alert('Failed to cancel application');
      }
    } catch (error) {
      console.error('Error canceling application:', error);
      alert('Error canceling application');
    } finally {
      setShowCancelModal(false);
      setCancelAppId(null);
    }
  };

  // Handler for editing application (support FormData)
  const handleEditApplication = async (applicationId, form) => {
    setIsSubmittingEdit(true);
    try {
      const token = localStorage.getItem("token");
      let options = {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
      };
      if (!(form instanceof FormData)) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(form);
      }
      await fetch(`http://localhost:5001/adoption-status/${applicationId}/edit`, options);
      // If user_remark is present and not using FormData, submit it as well
      if (!(form instanceof FormData) && form.user_remark && form.user_remark.trim()) {
        await fetch(`http://localhost:5001/adoption-status/${applicationId}/user-remark`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ remark: form.user_remark })
        });
      }
      fetchApplications();
    } catch (error) {
      console.error('Error editing application:', error);
      alert('Failed to update application.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Helper: Get notification message by status
  const getStatusNotification = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return { title: 'Application Approved', message: 'Congratulations! Your adoption application has been approved.', statusType: 'approved' };
      case 'pending':
        return { title: 'Application Pending', message: 'Your adoption application is pending. Please wait for further updates.', statusType: 'pending' };
      case 'rejected':
        return { title: 'Application Rejected', message: 'We regret to inform you that your application was rejected.', statusType: 'rejected' };
      case 'for compliance':
        return { title: 'Action Required', message: 'Your application needs additional compliance. Please review and edit your application.', statusType: 'for compliance' };
      case 'evaluate':
        return { title: 'Application Under Evaluation', message: 'Your application is currently being evaluated.', statusType: 'evaluate' };
      default:
        return { title: 'Application Update', message: 'There is an update to your application status.', statusType: 'default' };
    }
  };

  // Add useEffect to check for status changes and show notification
  useEffect(() => {
    if (adoptionStatus && adoptionStatus.length > 0 && userId) {
      const lastSeenStatuses = JSON.parse(localStorage.getItem('lastSeenStatuses') || '{}');
      let foundChange = false;
      let changedApp = null;
      for (const app of adoptionStatus) {
        const prevStatus = lastSeenStatuses[app.application_id];
        if (prevStatus && prevStatus !== app.status) {
          foundChange = true;
          changedApp = app;
          break;
        }
      }
      if (!foundChange) {
        // If no previous record, initialize
        adoptionStatus.forEach(app => {
          lastSeenStatuses[app.application_id] = app.status;
        });
        localStorage.setItem('lastSeenStatuses', JSON.stringify(lastSeenStatuses));
      } else if (changedApp) {
        // Show notification for the changed application
        const notif = getStatusNotification(changedApp.status);
        setNotification({ open: true, ...notif });
      }
    }
  }, [adoptionStatus, userId]);

  // When notification is closed, update last seen status
  const handleCloseNotification = () => {
    if (adoptionStatus && adoptionStatus.length > 0) {
      const lastSeenStatuses = JSON.parse(localStorage.getItem('lastSeenStatuses') || '{}');
      adoptionStatus.forEach(app => {
        lastSeenStatuses[app.application_id] = app.status;
      });
      localStorage.setItem('lastSeenStatuses', JSON.stringify(lastSeenStatuses));
    }
    setNotification({ open: false, title: '', message: '', statusType: '' });
  };

  // Handle smooth scroll to section
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
          isScrolled ? "bg-white dark:bg-gray-900 shadow-md" : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto flex flex-wrap justify-between items-center py-4 px-6">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold" style={{ color: "#b8be5a" }}>
              PawConnect
            </h1>
          </div>

          <div className="hidden md:flex space-x-6">
            <a
              href="#home"
              onClick={e => handleNavClick(e, 'home')}
              className="text-[#b8be5a] hover:text-gray-900 dark:text-white dark:hover:text-gray-300 duration-300 cursor-pointer"
            >
              Home
            </a>
            <a
              href="#pet"
              onClick={e => handleNavClick(e, 'pet')}
              className="text-[#b8be5a] hover:text-gray-900 dark:text-white dark:hover:text-gray-300 duration-300 cursor-pointer"
            >
              Pets
            </a>
            <a
              href="#guide"
              onClick={e => handleNavClick(e, 'guide')}
              className="text-[#b8be5a] hover:text-gray-900 dark:text-white dark:hover:text-gray-300 duration-300 cursor-pointer"
            >
              Pet Resources
            </a>
            <a
              href="#FAQ"
              onClick={e => handleNavClick(e, 'FAQ')}
              className="text-[#b8be5a] hover:text-gray-900 dark:text-white dark:hover:text-gray-300 duration-300 cursor-pointer"
            >
              FAQs
            </a>
            <a
              href="#support"
              onClick={e => handleNavClick(e, 'support')}
              className="text-[#b8be5a] hover:text-gray-900 dark:text-white dark:hover:text-gray-300 duration-300 cursor-pointer"
            >
              Support Us
            </a>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Add Adoption Status Button */}
            {userId && adoptionStatus.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowAdoptionStatus(!showAdoptionStatus)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#b8be5a]">Adoption Status</span>
                </button>

                {showAdoptionStatus && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-all duration-200 ease-in-out">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#f8faee] to-[#f0f3e0] dark:from-gray-700 dark:to-gray-800">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">Your Applications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {adoptionStatus.map((application) => (
                        <div key={application.id} className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-start space-x-3">            
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800 dark:text-white">{application.pet_name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{application.pet_type}</p>
                              <div className="mt-2 flex items-center justify-between">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                  {application.status || 'Pending'}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(application.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="user-dropdown relative">
              <h2 className="text-gray-700 dark:text-white inline-flex items-center">
                {"  "}
                <button
                  onClick={toggleDropdown}
                  className="focus:outline-none flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  style={{ color: "#b8be5a" }}
                >
                  <span className="font-medium text-[#b8be5a]">{username || " User"}</span>
                  <span className="ml-1">
                    <ChevronDown size={16} />
                  </span>
                </button>
              </h2>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-gray-700 dark:text-white rounded-xl shadow-xl z-50 border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-200 ease-in-out">
                  <ul className="py-1">
                    <li
                      className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors flex items-center space-x-2"
                      onClick={() => {
                        setShowProfileModal(true)
                        setIsDropdownOpen(false)
                      }}
                    >
                      <User size={16} className="text-[#b8be5a]" />
                      <span className="dark:text-white">View Profile</span>
                    </li>
                    <li
                      className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors flex items-center space-x-2"
                      onClick={() => {
                        setShowSettingsModal(true)
                        setIsDropdownOpen(false)
                      }}
                    >
                      <Settings size={16} className="text-[#b8be5a]" />
                      <span className="dark:text-white">Settings</span>
                    </li>
                    <li
                      className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors flex items-center space-x-2 border-t border-gray-200 dark:border-gray-700"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="text-red-500" />
                      <span className="dark:text-white">Log Out</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
              style={{ color: "#6D712E" }}
            >
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userData={userData}
        applications={applications}
        onApplicationClick={(application) => {
          setSelectedApplication(application);
          setShowApplicationModal(true);
        }}
        onSettingsClick={() => setShowSettingsModal(true)}
        getStatusColor={getStatusColor}
        onEditApplication={handleEditApplication}
        isSubmittingEdit={isSubmittingEdit}
      />

      {/* Application Details Modal */}
      <ApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        application={selectedApplication}
        getStatusColor={getStatusColor}
        onCancel={cancelApplication}
        userRemark={userRemark}
        setUserRemark={setUserRemark}
        isSubmittingRemark={isSubmittingRemark}
        onSubmitRemark={handleUserRemarkSubmit}
        onEditApplication={handleEditApplication}
        isSubmittingEdit={isSubmittingEdit}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        darkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        notifications={userData.notifications}
        toggleNotifications={(value) => handleNotificationChange("notifications", value)}
        privacySettings={userData.privacy}
        togglePrivacySettings={(value) => handlePrivacyChange("activityTracking", value)}
      />

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Cancel Application?</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to cancel this application? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
                onClick={() => { setShowCancelModal(false); setCancelAppId(null); }}
              >
                No, Go Back
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                onClick={confirmCancelApplication}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.open}
        onClose={handleCloseNotification}
        title={notification.title}
        message={notification.message}
        statusType={notification.statusType}
      />
    </div>
  )
}

export default NavSection

