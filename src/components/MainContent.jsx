import React, { useState } from 'react';
import Paw from '../assets/paw.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import logo from '../assets/logo-modified.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const MainContent = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const toggleLoginModal = () => setShowLoginModal(!showLoginModal);
  const toggleRegisterModal = () => setShowRegisterModal(!showRegisterModal);

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = document.querySelector('#login-username').value;
    const password = document.querySelector('#login-password').value;
  
    if (!username || !password) {
      toast.error('Please fill in both fields.');
      return;
    }
  
    if (username === 'Admin' && password === '123') {
      toast.success('Admin login successful!');
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 2000);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Login failed: ${errorText}`);
      } else {
        const data = await response.json();
        toast.success('Login successful!');
        setTimeout(() => {
          window.location.href = `http://localhost:5174/?username=${encodeURIComponent(username)}`;
          localStorage.setItem('token', data.token);
        }, 2000);
        return
      }
    } catch (error) {
      toast.error('Error connecting to the server.');
    }
  };
  
  

  const handleRegister = async (e) => {
    e.preventDefault();
    const username = document.querySelector('#register-username').value;
    const email = document.querySelector('#register-email').value;
    const password = document.querySelector('#register-password').value;
  
    if (!username || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Registration failed: ${errorText}`);
      } else {
        toast.success('Registration successful!');
        setShowRegisterModal(false);
        setShowLoginModal(true); 
      }
    } catch (error) {
      toast.error('Error connecting to the server.');
    }
  };

  return (
    <>
    <ToastContainer/>
    <main id="home" className="py-16 mt-20 md:h-[40rem]">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 text-center md:text-left md:mt-7">
          <h2 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-4">
            Give A New Life To <span>Pawsitivity</span>
          </h2>

          <p className="text-gray-600 dark:text-white mb-10 mt-10 text-[1.1rem] mx-10 md:text-[1.4rem] md:mx-auto">
            Embrace endless love with your new furry best friend. <br />
            Adopt now and start creating unforgettable memories together.
          </p>

          <button
            className="bg-[#6D712E] text-white px-20 py-4 rounded-md text-lg hover:bg-[#7D712E]"
            onClick={toggleLoginModal}
          >
            Adopt Now
          </button>
        </div>

        <div className="w-[250px] md:w-1/2 mt-8 md:mt-0 flex justify-center align-center">
          <img
            src={Paw}
            alt="Pets"
            className="h-[300px] md:w-2/3 sm:w-1/2 rounded-lg shadow-md"
          />
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 w-[80%] mx-auto max-w-md rounded-lg shadow-lg p-6">
            <div className="flex justify-end">
              <button
                onClick={toggleLoginModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            <div className='flex justify-center items-center'>
              <img src={logo} className='h-30 w-32 mb-5' alt="Logo" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-gray-50">Sign In</h2>
            <p className="text-center text-gray-700 dark:text-gray-50 mb-6">
              Please login so you could enjoy picking your favorite purry!
            </p>

            <form className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <FontAwesomeIcon icon={faUser}/>
                </span>
                <input
                  id="login-username"
                  type="text"
                  placeholder="Username"
                  className="w-full border border-gray-300 rounded-md px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-700"
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <FontAwesomeIcon icon={faLock}/>
                </span>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-md px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-700"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#6D712E] text-white py-2 rounded-md hover:bg-[#7D712E]"
                onClick={handleLogin}
              >
                Log in
              </button>
            </form>

            <p className="text-center text-gray-500 mt-4">
              <a href="#" className="text-blue-600 hover:underline" onClick={toggleRegisterModal}>
                No Account? Register!
              </a>
            </p>
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 w-[80%] mx-auto max-w-md rounded-lg shadow-lg p-6">
            <div className="flex justify-end">
              <button
                onClick={toggleRegisterModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            <div className='flex justify-center items-center'>
              <img src={logo} className='h-30 w-32 mb-5' alt="Logo" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-gray-50">Sign Up</h2>
            <p className="text-center text-gray-700 dark:text-gray-50 mb-6">
              Feel free to register! It's free after all!
            </p>

            <form className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <FontAwesomeIcon icon={faUser}/>
                </span>
                <input
                  id="register-username"
                  type="text"
                  placeholder="Username"
                  className="w-full border border-gray-300 rounded-md px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-700"
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <FontAwesomeIcon icon={faEnvelope}/>
                </span>
                <input
                  id="register-email"
                  type="text"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-md px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-700"
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <FontAwesomeIcon icon={faLock}/>
                </span>
                <input
                  id="register-password"
                  type="password"
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-md px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-700"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#6D712E] text-white py-2 rounded-md hover:bg-[#7D712E]"
                onClick={handleRegister}
              >
                Register
              </button>
            </form>

            <p className="text-center text-gray-500 mt-4">
              <a href="#" className="text-blue-600 hover:underline">
                Group 4 Pawsitivity | Lee@2024
              </a>
            </p>
          </div>
        </div>
      )}
    </main>
    </>
  );
};

export default MainContent;
