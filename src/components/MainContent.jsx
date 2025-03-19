"use client"

import { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import pet from '../assets/pet.jpg'
import "react-toastify/dist/ReactToastify.css"

const MainContent = () => {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal)
    if (showRegisterModal) setShowRegisterModal(false)
  }

  const toggleRegisterModal = () => {
    setShowRegisterModal(!showRegisterModal)
    if (showLoginModal) setShowLoginModal(false)
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

  return (
    <>
      <ToastContainer />
      <main id="home" className="relative overflow-hidden min-h-screen flex items-center py-16 dark:bg-gray-950">
        {/* Background with paw pattern */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-900 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#6D712E]/5 animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#6D712E]/10 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          {/* Paw print pattern - using CSS background instead of SVG for better performance */}
          <div className="absolute inset-0 opacity-5 bg-[url('/paw-pattern.png')] bg-repeat"></div>
        </div>

        <div className="container mx-auto px-4 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-block mb-4 relative">
                <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium text-[#6D712E] shadow-md">
                  Find Your Perfect Companion
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Connect and Change Hearts With <span className="text-[#6D712E]">PawConnect!</span>
              </h1>

              <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl mb-8 max-w-xl mx-auto lg:mx-0">
                Open your heart to a furry companion. Adopt today and build a lifetime of love and memories.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  className="bg-[#6D712E] hover:bg-[#7D812E] text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
                  onClick={toggleLoginModal}
                >
                  <span className="text-white">Adopt Now</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="bg-white dark:bg-gray-800 text-[#6D712E] border-2 border-[#6D712E] px-8 py-4 rounded-xl text-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center">
                  <span>Learn More</span>
                </button>
              </div>

              <div className="mt-12 flex items-center justify-center lg:justify-start">
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-bold text-[#6D712E]">Made with love!</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - 3D-like Image */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative">
                {/* 3D Effect Container */}
                <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  {/* Main Image */}
                  <img
                    src={pet}
                    alt="Cute pet"
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#6D712E]/30 to-transparent"></div>

                  {/* Floating Hearts - using CSS animations */}
                  <div className="absolute top-1/4 left-1/4 text-white animate-float" style={{ animationDelay: "0s" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <div className="absolute top-3/4 left-2/3 text-white animate-float" style={{ animationDelay: "1s" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <div className="absolute top-1/3 right-1/4 text-white animate-float" style={{ animationDelay: "2s" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-[#A3A86B] opacity-80 animate-pulse"></div>
                <div
                  className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-[#6D712E] opacity-80 animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>

                {/* Paw Print Icon */}
                <div
                  className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg animate-bounce"
                  style={{ animationDuration: "3s" }}
                >
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
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-fadeIn">
            <div className="relative p-6">
              <button
                onClick={toggleLoginModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
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
        
        @keyframes float {
          0% { opacity: 0; transform: translateY(0); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.8; }
          100% { opacity: 0.6; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}

export default MainContent

