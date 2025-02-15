import React, { useState, useEffect } from 'react';
import PetCard from '../common/PetCard.jsx';
import PetInfoModal from '../common/PetInfoModal.jsx';

import logo from '../assets/logo-modified.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const PetsSection = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [pets, setPets] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/pets')
      .then((response) => response.json())
      .then((data) => setPets(data))
      .catch((error) => console.error('Error fetching pets:', error));
  }, []); 

  const handleMoreInfoClick = (pet) => {
    setSelectedPet(pet);
  };

  const closeModal = () => {
    setSelectedPet(null);
  };

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const toggleLoginModal = () => setShowLoginModal(!showLoginModal);
  const toggleRegisterModal = () => setShowRegisterModal(!showRegisterModal);

  const handleLogin = async () => {
    const username = document.querySelector('#login-username')?.value;
    const password = document.querySelector('#login-password')?.value;

    if (!username || !password) {
      alert('Please fill in both fields.');
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
        alert(`Login failed: ${errorText}`);
      } else {
        const data = await response.json();
        alert('Login successful!');
        console.log(data.token);

        window.location.href = 'https://adopt-pet-adoption-4.netlify.app/';
      }
    } catch (error) {
      alert('Error connecting to the server.');
    }
  };

  const handleRegister = async () => {
    const username = document.querySelector('#register-username').value;
    const email = document.querySelector('#register-email').value;
    const password = document.querySelector('#register-password').value;

    if (!username || !email || !password) {
      alert('Please fill in all fields.');
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
        alert(`Registration failed: ${errorText}`);
      } else {
        alert('Registration successful!');
        setShowRegisterModal(false);
        setShowLoginModal(true);
      }
    } catch (error) {
      alert('Error connecting to the server.');
    }
  };

  return (
    <section id="pet" className="bg-gray-100 dark:bg-gray-900 py-10 mt-5">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-center text-3xl font-bold mb-5 uppercase">Take A Look At Our Adoptable Pets</h1>
        <div className="grid grid-cols-1 justify-center text-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:text-left gap-8">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onMoreInfoClick={handleMoreInfoClick} />
          ))}
        </div>
        <div className="flex justify-center">
          <button className="px-5 py-3 border bg-[#6D712E] text-white dark:bg-[#7D712E] dark:border-green-900 text-center rounded-md mt-7 duration-300 hover:bg-black" onClick={toggleLoginModal}>
            See More
          </button>
        </div>
      </div>

      {selectedPet && <PetInfoModal pet={selectedPet} onClose={closeModal} />}

      {/* Login and Register Modals */}
      {/* Modal code remains the same */}
    </section>
  );
};

export default PetsSection;
