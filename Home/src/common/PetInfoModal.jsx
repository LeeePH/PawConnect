"use client"

import { useEffect, useState, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faTimes, faMapMarkerAlt, faMars, faClock } from "@fortawesome/free-solid-svg-icons"
import {User, Lock, X, Eye, EyeOff, Mail, Check, AlertCircle } from "lucide-react"

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const PetInfoModal = ({ pet, onClose }) => {
  const [pets, setPets] = useState([])

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState(null)
  const [verificationToken, setVerificationToken] = useState(null)
  const [notification, setNotification] = useState(null)
  const [emailAvailable, setEmailAvailable] = useState(null)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [isValidEmail, setIsValidEmail] = useState(null)
  const [isTypingUsername, setIsTypingUsername] = useState(false)
  const [isTypingEmail, setIsTypingEmail] = useState(false)
  const usernameTimeoutRef = useRef(null)
  const emailTimeoutRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verificationStatus = params.get('verification');
    const message = params.get('message');

    if (verificationStatus === 'success') {
      console.log('Showing success modal');
      setVerificationStatus('success');
      showNotification('success', 'Email verified successfully! Please proceed to login.');
      setTimeout(() => {
        setShowLoginModal(true);
        setVerificationStatus(null);
        
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 2000);
    } else if (verificationStatus === 'error') {
      console.log('Showing error modal:', message);
      setVerificationStatus('error');
      showNotification('error', message || 'Error verifying email');
      
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const showNotification = (type, message) => {
    setNotification(null);
    setTimeout(() => {
      setNotification({ type, message });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }, 100);
  };

  const checkAvailability = async (username, email) => {
    if (!username && !email) return;
    
    setIsCheckingAvailability(true);
    try {
      const response = await fetch('http://localhost:5000/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }),
      });

      const data = await response.json();
      
      if (username) {
        setUsernameAvailable(data.usernameAvailable);
      }
      if (email) {
        setEmailAvailable(data.emailAvailable);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const validateEmail = (email) => {
    setIsTypingEmail(true);

    if (emailTimeoutRef.current) {
      clearTimeout(emailTimeoutRef.current);
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email);
    
    emailTimeoutRef.current = setTimeout(() => {
      setIsValidEmail(email ? isValid : null);
      if (isValid) {
        checkAvailability(null, email);
      } else {
        setEmailAvailable(null);
      }
      setIsTypingEmail(false);
    }, 600);
  };

  const checkUsernameAvailability = (username) => {
    setIsTypingUsername(true);
    
    if (usernameTimeoutRef.current) {
      clearTimeout(usernameTimeoutRef.current);
    }
    
    if (!username) {
      setUsernameAvailable(null);
      setIsTypingUsername(false);
      return;
    }
    
    usernameTimeoutRef.current = setTimeout(() => {
      if (username.length >= 3) {
        checkAvailability(username, null);
      } else {
        setUsernameAvailable(false);
      }
      setIsTypingUsername(false);
    }, 600);
  };

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal)
    if (showRegisterModal) setShowRegisterModal(false)
  }

  const toggleRegisterModal = () => {
    setShowRegisterModal(!showRegisterModal)
    if (showLoginModal) setShowLoginModal(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleRegisterPasswordVisibility = () => {
    setShowRegisterPassword(!showRegisterPassword)
  }

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0)
      setPasswordFeedback("")
      return
    }
    
    // password strength calculation
    let strength = 0
    
    // length
    if (password.length >= 8) strength += 1
    
    // lowercase
    if (/[a-z]/.test(password)) strength += 1
    
    // uppercase
    if (/[A-Z]/.test(password)) strength += 1
    
    // number
    if (/[0-9]/.test(password)) strength += 1
    
    // special characters
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    
    setPasswordStrength(strength)
    
    if (strength === 0) setPasswordFeedback("Password is required")
    else if (strength === 1) setPasswordFeedback("Password is very weak")
    else if (strength === 2) setPasswordFeedback("Password is weak")
    else if (strength === 3) setPasswordFeedback("Password is medium")
    else if (strength === 4) setPasswordFeedback("Password is strong")
    else setPasswordFeedback("Password is very strong")
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const username = document.querySelector("#login-username").value
    const password = document.querySelector("#login-password").value

    if (!username || !password) {
      showNotification('error', 'Please fill in both fields.')
      return
    }

    if (username === "Admin" && password === "123") {
      showNotification('success', 'Admin login successful!')
      setTimeout(() => {
        window.location.href = "/admin/dashboard"
      }, 2000)
      return
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        showNotification('error', `Login failed: ${errorText}`)
      } else {
        const data = await response.json()
        showNotification('success', 'Login successful!')
        setTimeout(() => {
          window.location.href = `http://localhost:5174/?username=${encodeURIComponent(username)}`
          localStorage.setItem("token", data.token)
        }, 2000)
      }
    } catch (error) {
      showNotification('error', 'Error connecting to the server.')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const username = document.querySelector("#register-username").value
    const email = document.querySelector("#register-email").value
    const password = document.querySelector("#register-password").value
    const confirmPassword = document.querySelector("#register-confirm-password").value

    if (!username || !email || !password || !confirmPassword) {
      showNotification('error', 'Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      showNotification('error', 'Passwords do not match.')
      return
    }

    if (passwordStrength < 3) {
      showNotification('error', 'Please choose a stronger password.')
      return
    }

    if (!isValidEmail) {
      showNotification('error', 'Please enter a valid email address.')
      return
    }

    if (!usernameAvailable) {
      showNotification('error', 'Username is already taken.')
      return
    }

    if (!emailAvailable) {
      showNotification('error', 'Email is already registered.')
      return
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        showNotification('error', data.message || 'Registration failed')
      } else {
        setVerificationToken(data.token)
        setVerificationStatus('pending')
        setShowRegisterModal(false)
        showNotification('success', data.message)
      }
    } catch (error) {
      showNotification('error', 'Error connecting to the server.')
    }
  }

  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <>
      {notification && (
        <div className="fixed top-4 left-[40%] transform -translate-x-1/2 z-[9999] animate-fadeIn">
          <div 
            className={`flex items-center p-4 rounded-lg shadow-lg min-w-[300px] ${
              notification.type === 'success' ? 'bg-green-500' :
              notification.type === 'error' ? 'bg-red-500' :
              'bg-blue-500'
            } text-white`}
          >
            <div className="flex items-center w-full">
              {notification.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" /> :
               notification.type === 'error' ? <XCircle className="h-5 w-5 mr-2 flex-shrink-0" /> :
               <Info className="h-5 w-5 mr-2 flex-shrink-0" />}
              <p className="flex-grow">{notification.message}</p>
            </div>
          </div>
        </div>
      )}
      {verificationStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fadeIn">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Email Verification
              </h2>
              {verificationStatus === "pending" && (
              <div className="flex flex-col items-center space-y-5">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full border-2 border-[#6D712E]/30 animate-ping"></div>
                  
                  <div className="relative bg-gradient-to-b from-[#f8f8f8] to-[#eaeaea] dark:from-gray-700 dark:to-gray-800 rounded-full p-4 shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D712E]"></div>
                  </div>
                </div>

                <div className="space-y-2 max-w-xs mx-auto">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    Please check your email for verification link
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click the link in your email to verify your account
                  </p>
                </div>

                <div className="pt-4 w-full">
                  <button
                    onClick={() => {
                      setVerificationStatus(null)
                      setShowLoginModal(true)
                    }}
                    className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center"
                  >
                    <span className="dark:text-white">Go to Login</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {verificationStatus === "success" && (
              <div className="flex flex-col items-center space-y-5">
                <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-full">
                  {/* Assuming CheckCircle is imported from an icon library */}
                  <CheckCircle className="h-14 w-14 text-green-500 dark:text-green-400" />
                </div>

                <div className="space-y-2 max-w-xs mx-auto">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">Email verified successfully!</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your account is now active and ready to use
                  </p>
                </div>

                <div className="pt-4 w-full">
                  <button
                    onClick={() => {
                      setVerificationStatus(null)
                      setShowLoginModal(true)
                    }}
                    className="w-full px-4 py-3 bg-[#6D712E] hover:bg-[#7D812E] text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                  >
                    <span>Go to Login</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {verificationStatus === "error" && (
              <div className="flex flex-col items-center space-y-5">
                <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-full">
                  <XCircle className="h-14 w-14 text-red-500 dark:text-red-400" />
                </div>

                <div className="space-y-2 max-w-xs mx-auto">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {message || "Error verifying email. Please try again."}
                  </p>
                </div>

                <div className="pt-4 w-full">
                  <button
                    onClick={() => setVerificationStatus(null)}
                    className="w-full px-4 py-3 bg-[#6D712E] hover:bg-[#7D812E] text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                  >
                    <span>Close</span>
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      )}
    
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="bg-white dark:bg-gray-800 w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-full shadow-md z-10"
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faTimes} className="text-lg" />
          </button>

          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 bg-gray-100 dark:bg-gray-700">
              <div className="h-full flex items-center justify-center p-6">
                <div className="relative w-full h-64 md:h-full">
                  <img
                    src={`http://localhost:5000${pet.img}`}
                    alt={pet.name}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute top-2 right-2 bg-[#6D712E] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {pet.size}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-3/5 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{pet.name}</h2>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-[#6D712E]" />
                  <span className="dark:text-white">{pet.location}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FontAwesomeIcon icon={faMars} className="mr-2 text-[#6D712E]" />
                  <span className="dark:text-white">{pet.gender}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-[#6D712E]" />
                  <span className="dark:text-white">{pet.age}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">About</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{pet.long_desc || pet.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Adoption Process</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li className="flex items-start">
                    <span className="w-5 h-5 bg-[#6D712E] text-white rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">
                      1
                    </span>
                    Create an account or sign in
                  </li>
                  <li className="flex items-start">
                    <span className="w-5 h-5 bg-[#6D712E] text-white rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">
                      2
                    </span>
                    Complete the adoption application
                  </li>
                  <li className="flex items-start">
                    <span className="w-5 h-5 bg-[#6D712E] text-white rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">
                      3
                    </span>
                    Schedule a meet and greet
                  </li>
                  <li className="flex items-start">
                    <span className="w-5 h-5 bg-[#6D712E] text-white rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">
                      4
                    </span>
                    Finalize the adoption
                  </li>
                </ul>
              </div>

              <button
                className="w-full bg-[#6D712E] text-white py-3 rounded-md hover:bg-[#7D712E] transition-colors font-medium"
                onClick={() => setShowLoginModal(true)}
              >
                Adopt Now!
              </button>
            </div>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-fadeIn">
            <div className="relative p-6">
              <button
                onClick={toggleLoginModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6D712E]/10 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#6D712E]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.28 10.5c-.36-1.25-1.54-2.05-2.81-1.83-1.26.22-2.16 1.4-2.16 2.67 0 .23.04.46.11.68.3.94 1.13 1.53 2.07 1.53.14 0 .29-.01.43-.04 1.28-.22 2.19-1.4 2.19-2.67 0-.12-.01-.23-.03-.34M5.57 10.5c.36-1.25 1.54-2.05 2.81-1.83 1.26.22-2.16 1.4-2.16 2.67 0 .23-.04.46-.11.68-.3.94-1.13 1.53-2.07 1.53-.14 0-.29-.01.43-.04-1.28-.22-2.19-1.4-2.19-2.67 0-.12.01-.23.03-.34M10.5 5.57c1.25.36 2.05 1.54 1.83 2.81-.22 1.26-1.4 2.16-2.67 2.16-.23 0-.46-.04-.68-.11-.94-.3-1.53-1.13-1.53-2.07 0-.14.01-.29.04-.43.22-1.28 1.4-2.19 2.67-2.19.12 0 .23.01.34.03M10.5 19.28c1.25-.36 2.05-1.54 1.83-2.81-.22-1.26-1.4-2.16-2.67-2.16-.23 0-.46.04-.68.11-.94.3-1.53 1.13-1.53 2.07 0 .14.01.29.04.43.22 1.28 1.4 2.19 2.67 2.19.12 0 .23-.01.34-.03"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Sign in to continue to PawConnect</p>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2 py-2 mb-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                <GoogleIcon /> Sign in with Google
              </button>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="login-username"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="login-username"
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#6D712E] focus:border-[#6D712E] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your username"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="login-password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </label>
                    <a href="#" className="text-sm text-[#6D712E] hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#6D712E] focus:border-[#6D712E] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                    />
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#6D712E] focus:ring-[#6D712E] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#6D712E] hover:bg-[#7D812E] text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Don't have an account?{" "}
                  <button onClick={toggleRegisterModal} className="text-[#6D712E] font-medium hover:underline">
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto shadow-2xl animate-fadeIn ">
            <div className="relative p-6">
              <button
                onClick={toggleRegisterModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close registration modal"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6D712E]/10 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#6D712E]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.28 10.5c-.36-1.25-1.54-2.05-2.81-1.83-1.26.22-2.16 1.4-2.16 2.67 0 .23.04.46.11.68.3.94 1.13 1.53 2.07 1.53.14 0 .29-.01.43-.04 1.28-.22 2.19-1.4 2.19-2.67 0-.12-.01-.23-.03-.34M5.57 10.5c.36-1.25 1.54-2.05 2.81-1.83 1.26.22-2.16 1.4-2.16 2.67 0 .23-.04.46-.11.68-.3.94-1.13 1.53-2.07 1.53-.14 0-.29-.01.43-.04-1.28-.22-2.19-1.4-2.19-2.67 0-.12.01-.23.03-.34M10.5 5.57c1.25.36 2.05 1.54 1.83 2.81-.22 1.26-1.4 2.16-2.67 2.16-.23 0-.46-.04-.68-.11-.94-.3-1.53-1.13-1.53-2.07 0-.14.01-.29.04-.43.22-1.28 1.4-2.19 2.67-2.19.12 0 .23.01.34.03M10.5 19.28c1.25-.36 2.05-1.54 1.83-2.81-.22-1.26-1.4-2.16-2.67-2.16-.23 0-.46.04-.68.11-.94.3-1.53 1.13-1.53 2.07 0 .14.01.29.04.43.22 1.28 1.4 2.19 2.67 2.19.12 0 .23-.01.34-.03"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Join PawConnect and find your perfect companion</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="register-username"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="register-username"
                      type="text"
                      className={`block w-full pl-10 pr-10 py-3 border ${
                        usernameAvailable === true
                          ? "border-green-500 focus:ring-green-500 focus:border-green-500"
                          : usernameAvailable === false
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-[#6D712E] focus:border-[#6D712E]"
                      } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Choose a username"
                      required
                      autoComplete="username"
                      onChange={(e) => checkUsernameAvailability(e.target.value)}
                      aria-describedby="username-feedback"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {isTypingUsername ? (
                        <svg
                          className="animate-spin h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : usernameAvailable === true ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : usernameAvailable === false ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                  <div id="username-feedback" className="text-xs mt-1">
                    {usernameAvailable === true ? (
                      <p className="text-green-500">Username is available</p>
                    ) : usernameAvailable === false ? (
                      <p className="text-red-500">Username is already taken or invalid</p>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">Username must be at least 3 characters</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="register-email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="register-email"
                      type="email"
                      className={`block w-full pl-10 pr-10 py-3 border ${
                        isTypingEmail ? "border-gray-300 dark:border-gray-600 focus:ring-gray-300 dark:focus:ring-gray-600" :
                        isValidEmail === true && emailAvailable === true
                          ? "border-green-500 focus:ring-green-500 focus:border-green-500"
                          : isValidEmail === true && emailAvailable === false
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : isValidEmail === false
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-[#6D712E] focus:border-[#6D712E]"
                      } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                      onChange={(e) => validateEmail(e.target.value)}
                      aria-describedby="email-feedback"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {isTypingEmail ? (
                        <svg
                          className="animate-spin h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : isValidEmail === true && emailAvailable === true ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : isValidEmail === true && emailAvailable === false ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : isValidEmail === false ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                  <div id="email-feedback" className="text-xs mt-1">
                    {isTypingEmail ? (
                      <p className="text-gray-500 dark:text-gray-400">Checking email...</p>
                    ) : isValidEmail === true && emailAvailable === true ? (
                      <p className="text-green-500">Email is available</p>
                    ) : isValidEmail === true && emailAvailable === false ? (
                      <p className="text-red-500">Email is already registered</p>
                    ) : (
                      <p className="text-green-500">Email format is valid</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="register-password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="register-password"
                      type={showRegisterPassword ? "text" : "password"}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#6D712E] focus:border-[#6D712E] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Create a password"
                      required
                      autoComplete="new-password"
                      onChange={(e) => checkPasswordStrength(e.target.value)}
                      aria-describedby="password-strength"
                    />
                    <button
                      type="button"
                      onClick={toggleRegisterPasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                    >
                      {showRegisterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`transition-all duration-300 ${
                          passwordStrength === 0
                            ? "bg-gray-300 dark:bg-gray-600 w-0"
                            : passwordStrength === 1
                              ? "bg-red-500 w-1/5"
                              : passwordStrength === 2
                                ? "bg-orange-500 w-2/5"
                                : passwordStrength === 3
                                  ? "bg-yellow-500 w-3/5"
                                  : passwordStrength === 4
                                    ? "bg-green-400 w-4/5"
                                    : "bg-green-500 w-full"
                        }`}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <p
                        id="password-strength"
                        className={`text-xs ${
                          passwordStrength === 0
                            ? "text-gray-500 dark:text-gray-400"
                            : passwordStrength === 1
                              ? "text-red-500"
                              : passwordStrength === 2
                                ? "text-orange-500"
                                : passwordStrength === 3
                                  ? "text-yellow-500"
                                  : passwordStrength === 4
                                    ? "text-green-400"
                                    : "text-green-500"
                        }`}
                      >
                        {passwordFeedback}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{passwordStrength}/5</p>
                    </div>

                    <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <p
                        className={
                          /^.{8,}$/.test(document.querySelector("#register-password")?.value || "")
                            ? "text-green-500"
                            : ""
                        }
                      >
                        {/^.{8,}$/.test(document.querySelector("#register-password")?.value || "") ? "✓" : "○"} At least
                        8 characters
                      </p>
                      <p
                        className={
                          /[A-Z]/.test(document.querySelector("#register-password")?.value || "")
                            ? "text-green-500"
                            : ""
                        }
                      >
                        {/[A-Z]/.test(document.querySelector("#register-password")?.value || "") ? "✓" : "○"} At least
                        one uppercase letter
                      </p>
                      <p
                        className={
                          /[a-z]/.test(document.querySelector("#register-password")?.value || "")
                            ? "text-green-500"
                            : ""
                        }
                      >
                        {/[a-z]/.test(document.querySelector("#register-password")?.value || "") ? "✓" : "○"} At least
                        one lowercase letter
                      </p>
                      <p
                        className={
                          /[0-9]/.test(document.querySelector("#register-password")?.value || "")
                            ? "text-green-500"
                            : ""
                        }
                      >
                        {/[0-9]/.test(document.querySelector("#register-password")?.value || "") ? "✓" : "○"} At least
                        one number
                      </p>
                      <p
                        className={
                          /[^A-Za-z0-9]/.test(document.querySelector("#register-password")?.value || "")
                            ? "text-green-500"
                            : ""
                        }
                      >
                        {/[^A-Za-z0-9]/.test(document.querySelector("#register-password")?.value || "") ? "✓" : "○"} At
                        least one special character
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="register-confirm-password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="register-confirm-password"
                      type={showRegisterPassword ? "text" : "password"}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#6D712E] focus:border-[#6D712E] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Confirm your password"
                      required
                      autoComplete="new-password"
                      aria-describedby="confirm-password-feedback"
                    />
                  </div>
                  <div id="confirm-password-feedback" className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                    Please re-enter your password to confirm
                  </div>
                </div>

                <div className="flex items-start mt-4">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      className="h-4 w-4 text-[#6D712E] focus:ring-[#6D712E] border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-[#6D712E] hover:underline"
                      >
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        onClick={() => setShowPrivacyModal(true)}
                        className="text-[#6D712E] hover:underline"
                      >
                        Privacy Policy
                      </button>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full mt-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all ${
                    passwordStrength >= 3 && isValidEmail === true && usernameAvailable === true
                      ? "bg-[#6D712E] hover:bg-[#7D812E] text-white"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!(passwordStrength >= 3 && isValidEmail === true && usernameAvailable === true)}
                >
                  Create Account
                </button>
              </form>
  
              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Already have an account?{" "}
                  <button onClick={toggleLoginModal} className="text-[#6D712E] font-medium hover:underline">
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTermsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-[#6D712E]/20 to-[#6D712E]/5 dark:from-[#6D712E]/30 dark:to-[#6D712E]/10 px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowTermsModal(false)}
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
                onClick={() => setShowTermsModal(false)}
                className="px-6 py-2.5 bg-[#6D712E] hover:bg-[#5A5E26] text-white rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#6D712E]/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-[#6D712E]/20 to-[#6D712E]/5 dark:from-[#6D712E]/30 dark:to-[#6D712E]/10 px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowPrivacyModal(false)}
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

            {/* Footer - Fixed */}
            <div className="px-8 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center flex-shrink-0">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-6 py-2.5 bg-[#6D712E] hover:bg-[#5A5E26] text-white rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#6D712E]/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PetInfoModal

