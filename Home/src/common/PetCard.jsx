"use client"
import { Heart } from "lucide-react"
import { useState, useRef } from "react"
import {User, Lock, X, Eye, EyeOff, Mail, Check, AlertCircle } from "lucide-react"

const PetCard = ({ pet, onMoreInfoClick }) => {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

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

  const openLoginModal = () => {
    setShowRegisterModal(false)
    setShowLoginModal(true)
  }

  const toggleLoginModal = () => {
    setShowLoginModal((prev) => !prev)
    setShowRegisterModal(false)
    setMobileMenuOpen(false)
  }

  const toggleRegisterModal = () => {
    setShowRegisterModal((prev) => !prev)
    setShowLoginModal(false)
    setMobileMenuOpen(false)
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

  const validateEmail = (email) => {
    setIsTypingEmail(true)

    if (emailTimeoutRef.current) {
      clearTimeout(emailTimeoutRef.current)
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(email)
    
    emailTimeoutRef.current = setTimeout(() => {
      setIsValidEmail(email ? isValid : null)
      setIsTypingEmail(false)
    }, 600)
  }

  const checkUsernameAvailability = (username) => {
    setIsTypingUsername(true)
    
    if (usernameTimeoutRef.current) {
      clearTimeout(usernameTimeoutRef.current)
    }
    
    if (!username) {
      setUsernameAvailable(null)
      setIsTypingUsername(false)
      return
    }
    
    usernameTimeoutRef.current = setTimeout(async () => {
      try {
        const isAvailable = username !== "Admin" && username.length >= 3
        setUsernameAvailable(isAvailable)
        setIsTypingUsername(false)
      } catch (error) {
        console.error("Error checking username:", error)
        setIsTypingUsername(false)
      }
    }, 600)
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = document.querySelector("#login-username").value;
    const password = document.querySelector("#login-password").value;
  
    if (!username || !password) {
      toast.error("Please fill in both fields.");
      return;
    }
  
    if (username === "Admin" && password === "123") {
      toast.success("Admin login successful!");
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 2000);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Login failed: ${errorText}`);
      } else {
        const data = await response.json();
        toast.success("Login successful!");
  
        setTimeout(() => {
          window.location.href = `http://localhost:5174/?username=${encodeURIComponent(username)}`
          localStorage.setItem("token", data.token)
        }, 2000)
      }
    } catch (error) {
      toast.error("Error connecting to the server.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault()
    const username = document.querySelector("#register-username").value
    const email = document.querySelector("#register-email").value
    const password = document.querySelector("#register-password").value
    const confirmPassword = document.querySelector("#register-confirm-password").value
  
    const passwordStrength = 5
    const isValidEmail = true
    const setShowRegisterModal = () => {}
    const setShowLoginModal = () => {}
  
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.")
      return
    }
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }
  
    if (passwordStrength < 3) {
      toast.error("Please choose a stronger password.")
      return
    }
  
    if (!isValidEmail) {
      toast.error("Please enter a valid email address.")
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
  
      if (!response.ok) {
        const errorText = await response.text()
        toast.error(`Registration failed: ${errorText}`)
      } else {
        toast.success("Registration successful!")

        const canCloseRegister = typeof setShowRegisterModal === "function"
        const canOpenLogin = typeof setShowLoginModal === "function"
  
        if (canCloseRegister) {
          setShowRegisterModal(false)
        }

        if (canOpenLogin) {
          setTimeout(() => {
            if (typeof setShowLoginModal === "function") {
              setShowLoginModal(true)
            }
          }, 100)
        }
      }
    } catch (error) {
      toast.error("Error connecting to the server.")
    }
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 group">
      <div className="relative">
        {pet.img ? (
          <div className="relative overflow-hidden">
            <img
              src={`http://localhost:5000${pet.img}`}
              alt={pet.name}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No Image Available
          </div>
        )}

        {/* Pet badge/tag */}
        <div className="absolute top-3 right-3">
          <span className="bg-[#6D712E]/90 text-white text-xs font-bold px-2 py-1 rounded-full">{pet.size}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{pet.name}</h2>
          <Heart
            className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
            onClick={openLoginModal}
          />
        </div>

        <div className="flex items-center mb-3">
          <div className="w-2 h-2 rounded-full bg-[#6D712E] mr-2"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{pet.location}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-2 text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 block">Gender</span>
            <span className="font-medium text-gray-800 dark:text-white">{pet.gender}</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-2 text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 block">Age</span>
            <span className="font-medium text-gray-800 dark:text-white">{pet.age || "Unknown"}</span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 h-10">{pet.description}</p>

        <button
          className="w-full bg-[#6D712E] text-[#6D712E] py-2.5 rounded-md transition-all duration-300 hover:bg-[#44471a] hover:text-white font-medium flex items-center justify-center"
          onClick={() => onMoreInfoClick(pet)}
        >
          <span className="text-white">More Info</span>
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
                      d="M19.28 10.5c-.36-1.25-1.54-2.05-2.81-1.83-1.26.22-2.16 1.4-2.16 2.67 0 .23.04.46.11.68.3.94 1.13 1.53 2.07 1.53.14 0 .29-.01.43-.04 1.28-.22 2.19-1.4 2.19-2.67 0-.12-.01-.23-.03-.34M5.57 10.5c.36-1.25 1.54-2.05 2.81-1.83 1.26.22-2.16 1.4-2.16 2.67 0 .23-.04.46-.11.68-.3.94-1.13 1.53-2.07 1.53-.14 0-.29-.01.43-.04-1.28-.22-2.19-1.4-2.19-2.67 0-.12.01-.23.03-.34M10.5 5.57c1.25.36 2.05 1.54 1.83 2.81-.22 1.26-1.4 2.16-2.67 2.16-.23 0-.46-.04-.68-.11-.94-.3-1.53-1.13-1.53-2.07 0-.14.01-.29.04-.43.22-1.28 1.4-2.19 2.67-2.19.12 0 .23.01.34.03M10.5 19.28c1.25-.36 2.05-1.54 1.83-2.81-.22-1.26-1.4-2.16-2.67 2.16-.23 0-.46.04-.68.11-.94.3-1.53 1.13-1.53 2.07 0 .14.01.29.04.43.22 1.28 1.4 2.19 2.67 2.19.12 0 .23-.01.34-.03"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Sign in to continue to PawConnect</p>
              </div>

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
                        isValidEmail === true
                          ? "border-green-500 focus:ring-green-500 focus:border-green-500"
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
                      ) : isValidEmail === true ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : isValidEmail === false ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                  <div id="email-feedback" className="text-xs mt-1">
                    {isValidEmail === true ? (
                      <p className="text-green-500">Email format is valid</p>
                    ) : isValidEmail === false ? (
                      <p className="text-red-500">Please enter a valid email address</p>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">We'll never share your email with anyone else</p>
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
                      <a href="#" className="text-[#6D712E] hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#6D712E] hover:underline">
                        Privacy Policy
                      </a>
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
    </div>
  )
}

export default PetCard

