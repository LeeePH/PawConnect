"use client"
import { Heart } from "lucide-react"
import { useState } from "react"
import logo from "../assets/logo-modified.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons"

const PetCard = ({ pet, onMoreInfoClick }) => {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const openLoginModal = () => {
    setShowRegisterModal(false)
    setShowLoginModal(true)
  }

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
    const username = document.querySelector("#login-username")?.value
    const password = document.querySelector("#login-password")?.value

    if (!username || !password) {
      alert("Please fill in both fields.")
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
        alert(`Login failed: ${errorText}`)
      } else {
        const data = await response.json()
        alert("Login successful!")
        console.log(data.token)

        window.location.href = "https://adopt-pet-adoption-4.netlify.app/"
      }
    } catch (error) {
      alert("Error connecting to the server.")
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault() // Prevent form submission
    const username = document.querySelector("#register-username").value
    const email = document.querySelector("#register-email").value
    const password = document.querySelector("#register-password").value

    if (!username || !email || !password) {
      alert("Please fill in all fields.")
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
        alert(`Registration failed: ${errorText}`)
      } else {
        alert("Registration successful!")
        openLoginModal() // Switch to login modal after successful registration
      }
    } catch (error) {
      alert("Error connecting to the server.")
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
            onClick={openLoginModal} // Fixed: Call the function instead of passing the state
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
    </div>
  )
}

export default PetCard

