"use client"

import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Moon, Sun, User, Lock, Mail, Menu, X } from "lucide-react"

const NavSection = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Handle dark mode toggle
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

  // Check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Add scroll event listener to change nav appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const username = document.querySelector("#login-username").value
    const password = document.querySelector("#login-password").value

    if (!username || !password) {
      toast.error("Please fill in both fields.")
      return
    }

    if (username === "Admin" && password === "123") {
      toast.success("Admin login successful!")
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
        toast.error(`Login failed: ${errorText}`)
      } else {
        const data = await response.json()
        toast.success("Login successful!")
        setTimeout(() => {
          window.location.href = `http://localhost:5174/?username=${encodeURIComponent(username)}`
          localStorage.setItem("token", data.token)
        }, 2000)
      }
    } catch (error) {
      toast.error("Error connecting to the server.")
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const username = document.querySelector("#register-username").value
    const email = document.querySelector("#register-email").value
    const password = document.querySelector("#register-password").value

    if (!username || !email || !password) {
      toast.error("Please fill in all fields.")
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
        setShowRegisterModal(false)
        setShowLoginModal(true)
      }
    } catch (error) {
      toast.error("Error connecting to the server.")
    }
  }

  const handleNavLinkClick = (e) => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute("href")
    const targetId = href.replace("#", "")
    const element = document.getElementById(targetId)

    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Offset for the fixed header
        behavior: "smooth",
      })
    }

    // Close mobile menu after clicking a link
    setMobileMenuOpen(false)
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={1}
      />

      {/* Fixed spacer to prevent content from being hidden under the navbar */}
      <div className="h-5"></div>

      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md py-3"
            : "bg-white dark:bg-gray-900 py-4"
        }`}
      >
        <nav className="container mx-auto flex justify-between items-center px-6">
          <div className="flex items-center">
            <div className="text-xl md:text-2xl font-bold text-[#6D712E] dark:text-white flex items-center">
              {/* You can add your logo image here */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-2 text-[#6D712E] dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.28 10.5c-.36-1.25-1.54-2.05-2.81-1.83-1.26.22-2.16 1.4-2.16 2.67 0 .23.04.46.11.68.3.94 1.13 1.53 2.07 1.53.14 0 .29-.01.43-.04 1.28-.22 2.19-1.4 2.19-2.67 0-.12-.01-.23-.03-.34M5.57 10.5c.36-1.25 1.54-2.05 2.81-1.83 1.26.22 2.16 1.4 2.16 2.67 0 .23-.04.46-.11.68-.3.94-1.13 1.53-2.07 1.53-.14 0-.29-.01-.43-.04-1.28-.22-2.19-1.4-2.19-2.67 0-.12.01-.23.03-.34M10.5 5.57c1.25.36 2.05 1.54 1.83 2.81-.22 1.26-1.4 2.16-2.67 2.16-.23 0-.46-.04-.68-.11-.94-.3-1.53-1.13-1.53-2.07 0-.14.01-.29.04-.43.22-1.28 1.4-2.19 2.67-2.19.12 0 .23.01.34.03M10.5 19.28c1.25-.36 2.05-1.54 1.83-2.81-.22-1.26-1.4-2.16-2.67-2.16-.23 0-.46.04-.68.11-.94.3-1.53 1.13-1.53 2.07 0 .14.01.29.04.43.22 1.28 1.4 2.19 2.67 2.19.12 0 .23-.01.34-.03"
                />
              </svg>
              PawConnect
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a
              href="#home"
              onClick={handleNavLinkClick}
              className="text-gray-700 hover:text-[#6D712E] dark:text-gray-200 dark:hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#6D712E] after:transition-all"
            >
              Home
            </a>
            <a
              href="#pet"
              onClick={handleNavLinkClick}
              className="text-gray-700 hover:text-[#6D712E] dark:text-gray-200 dark:hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#6D712E] after:transition-all"
            >
              Pets
            </a>
            <a
              href="#shelter"
              onClick={handleNavLinkClick}
              className="text-gray-700 hover:text-[#6D712E] dark:text-gray-200 dark:hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#6D712E] after:transition-all"
            >
              Shelters
            </a>
            <a
              href="#coexist"
              onClick={handleNavLinkClick}
              className="text-gray-700 hover:text-[#6D712E] dark:text-gray-200 dark:hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#6D712E] after:transition-all"
            >
              CoExistences
            </a>
            <a
              href="#guide"
              onClick={handleNavLinkClick}
              className="text-gray-700 hover:text-[#6D712E] dark:text-gray-200 dark:hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#6D712E] after:transition-all"
            >
              Process
            </a>
            <a
              href="#FAQ"
              onClick={handleNavLinkClick}
              className="text-gray-700 hover:text-[#6D712E] dark:text-gray-200 dark:hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#6D712E] after:transition-all"
            >
              FAQ
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleLoginModal}
              className="text-gray-700 hover:text-[#6D712E] dark:text-gray-200 dark:hover:text-white transition-colors font-medium"
            >
              Login
            </button>
            <button
              onClick={toggleRegisterModal}
              className="bg-[#6D712E] hover:bg-[#7D812E] text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Register
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              ) : (
                <Sun className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              ) : (
                <Sun className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg animate-fadeIn">
            <div className="px-6 py-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
              <a
                href="#home"
                onClick={handleNavLinkClick}
                className="block py-2 text-gray-700 hover:text-[#6D712E] dark:text-gray-200 dark:hover:text-white"
              >
                Home
              </a>
              <a
                href="#pet"
                onClick={handleNavLinkClick}
                className="block py-2 text-gray-700 hover:text-[#6D712E] dark:text-gray-200 dark:hover:text-white"
              >
                Pets
              </a>
              <a
                href="#shelter"
                onClick={handleNavLinkClick}
                className="block py-2 text-gray-700 hover:text-[#6D712E] dark:text-gray-200 dark:hover:text-white"
              >
                Shelters
              </a>
              <a
                href="#coexist"
                onClick={handleNavLinkClick}
                className="block py-2 text-gray-700 hover:text-[#6D712E] dark:text-gray-200 dark:hover:text-white"
              >
                CoExistences
              </a>
              <a
                href="#guide"
                onClick={handleNavLinkClick}
                className="block py-2 text-gray-700 hover:text-[#6D712E] dark:text-gray-200 dark:hover:text-white"
              >
                Process
              </a>
              <a
                href="#FAQ"
                onClick={handleNavLinkClick}
                className="block py-2 text-gray-700 hover:text-[#6D712E] dark:text-gray-200 dark:hover:text-white"
              >
                FAQ
              </a>

              <div className="pt-2 flex flex-col space-y-2">
                <button
                  onClick={toggleLoginModal}
                  className="w-full text-left py-2 text-gray-700 hover:text-[#6D712E] dark:text-gray-200 dark:hover:text-white font-medium"
                >
                  Login
                </button>
                <button
                  onClick={toggleRegisterModal}
                  className="w-full bg-[#6D712E] hover:bg-[#7D812E] text-white py-2 rounded-lg transition-colors font-medium text-center"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
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
                      d="M19.28 10.5c-.36-1.25-1.54-2.05-2.81-1.83-1.26.22-2.16 1.4-2.16 2.67 0 .23.04.46.11.68.3.94 1.13 1.53 2.07 1.53.14 0 .29-.01.43-.04 1.28-.22 2.19-1.4 2.19-2.67 0-.12-.01-.23-.03-.34M5.57 10.5c.36-1.25 1.54-2.05 2.81-1.83 1.26.22 2.16 1.4 2.16 2.67 0 .23-.04.46-.11.68-.3.94-1.13 1.53-2.07 1.53-.14 0-.29-.01-.43-.04-1.28-.22-2.19-1.4-2.19-2.67 0-.12.01-.23.03-.34M10.5 5.57c1.25.36 2.05 1.54 1.83 2.81-.22 1.26-1.4 2.16-2.67 2.16-.23 0-.46-.04-.68-.11-.94-.3-1.53-1.13-1.53-2.07 0-.14.01-.29.04-.43.22-1.28 1.4-2.19 2.67-2.19.12 0 .23.01.34.03M10.5 19.28c1.25-.36 2.05-1.54 1.83-2.81-.22-1.26-1.4-2.16-2.67-2.16-.23 0-.46.04-.68.11-.94.3-1.53 1.13-1.53 2.07 0 .14.01.29.04.43.22 1.28 1.4 2.19 2.67 2.19.12 0 .23-.01.34-.03"
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
                      type="password"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#6D712E] focus:border-[#6D712E] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
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

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-fadeIn">
            <div className="relative p-6">
              <button
                onClick={toggleRegisterModal}
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
                      d="M19.28 10.5c-.36-1.25-1.54-2.05-2.81-1.83-1.26.22-2.16 1.4-2.16 2.67 0 .23.04.46.11.68.3.94 1.13 1.53 2.07 1.53.14 0 .29-.01.43-.04 1.28-.22 2.19-1.4 2.19-2.67 0-.12-.01-.23-.03-.34M5.57 10.5c.36-1.25 1.54-2.05 2.81-1.83 1.26.22 2.16 1.4 2.16 2.67 0 .23-.04.46-.11.68-.3.94-1.13 1.53-2.07 1.53-.14 0-.29-.01-.43-.04-1.28-.22-2.19-1.4-2.19-2.67 0-.12.01-.23.03-.34M10.5 5.57c1.25.36 2.05 1.54 1.83 2.81-.22 1.26-1.4 2.16-2.67 2.16-.23 0-.46-.04-.68-.11-.94-.3-1.53-1.13-1.53-2.07 0-.14.01-.29.04-.43.22-1.28 1.4-2.19 2.67-2.19.12 0 .23.01.34.03M10.5 19.28c1.25-.36 2.05-1.54 1.83-2.81-.22-1.26-1.4-2.16-2.67-2.16-.23 0-.46.04-.68.11-.94.3-1.53 1.13-1.53 2.07 0 .14.01.29.04.43.22 1.28 1.4 2.19 2.67 2.19.12 0 .23-.01.34-.03"
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
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#6D712E] focus:border-[#6D712E] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Choose a username"
                      required
                    />
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
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#6D712E] focus:border-[#6D712E] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your email"
                      required
                    />
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
                      type="password"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#6D712E] focus:border-[#6D712E] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#6D712E] hover:bg-[#7D812E] text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
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

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }h
      `}</style>
    </>
  )
}

export default NavSection

