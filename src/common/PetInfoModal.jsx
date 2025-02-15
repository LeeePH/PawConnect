import React, { useState, useEffect } from 'react';

import logo from '../assets/logo-modified.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PetInfoModal = ({ pet, onClose }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const toggleLoginModal = () => setShowLoginModal(!showLoginModal);
    const toggleRegisterModal = () => setShowRegisterModal(!showRegisterModal);

    useEffect(() => {
      fetch('http://localhost:5000/pets')
        .then((response) => response.json())
        .then((data) => setPets(data))
        .catch((error) => console.error('Error fetching pets:', error));
    }, []); 

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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 w-full h-auto sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto max-w-4xl rounded-lg shadow-lg p-6">
                <div className="flex justify-end">
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    ✖
                </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                <div className="sm:w-1/3 w-full">
                    <img
                    src={`http://localhost:5000${pet.img}`}
                    alt={pet.name}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                    <div className="mt-4">
                    <p className="text-gray-800 dark:text-gray-50">
                        <strong>Location:</strong> {pet.location}
                    </p>
                    <p className="text-gray-800 dark:text-gray-50">
                        <strong>Gender:</strong> {pet.gender}
                    </p>
                    <p className="text-gray-800 dark:text-gray-50">
                        <strong>Size:</strong> {pet.size}
                    </p>
                    <p className="text-gray-800 dark:text-gray-50">
                        <strong>Age:</strong> {pet.age}
                    </p>
                    </div>
                </div>

                <div className="sm:w-2/3 w-full mt-4 sm:mt-0">
                    <h2 className="text-2xl font-bold text-center sm:text-left mb-4 text-gray-800 dark:text-gray-50">
                    {pet.name}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-50">{pet.longdesc}</p>
                </div>
                </div>

                <div className="flex justify-center sm:justify-start mt-4">
                <button
                    className="w-1/2 sm:w-1/3 bg-[#6D712E] text-white py-2 rounded-md hover:bg-[#7D712E] mt-4"
                    onClick={toggleLoginModal}
                >
                    Adopt Now!
                </button>
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
                type="button"
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
    </div>
    </>
    );
};

export default PetInfoModal;
