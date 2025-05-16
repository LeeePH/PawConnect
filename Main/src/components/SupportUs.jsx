import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPaw, faDonate } from "@fortawesome/free-solid-svg-icons";
import Donations from "../common/Donations";

const SupportUs = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section id="support" className="bg-gray-100 dark:bg-gray-950 py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold uppercase">Support Us</h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Your contributions help us provide a safe and loving environment for our animals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <FontAwesomeIcon icon={faDonate} className="text-[#6D712E] text-4xl mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Monetary Donations</h2>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              Help us provide food, shelter, and medical care for our pets.
            </p>
            <button
              onClick={openModal}  // Open the modal when clicked
              className="mt-6 bg-[#6D712E] text-white py-2 px-4 rounded-lg hover:bg-[#7D712E]"
            >
              Donate Now
            </button>
          </div>

          <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <FontAwesomeIcon icon={faPaw} className="text-[#6D712E] text-4xl mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">In-Kind Donations</h2>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              Donate items like pet food, blankets, toys, and more!
            </p>
            <button className="mt-6 bg-[#6D712E] text-white py-2 px-4 rounded-lg hover:bg-[#7D712E]">
              See List
            </button>
          </div>

          <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <FontAwesomeIcon icon={faHeart} className="text-[#6D712E] text-4xl mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Volunteer</h2>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              Join our team and make a difference in the lives of our animals.
            </p>
            <button className="mt-6 bg-[#6D712E] text-white py-2 px-4 rounded-lg hover:bg-[#7D712E]">
              Get Involved
            </button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-700 dark:text-gray-300">
            Thank you for supporting our mission to give every pet a loving home!
          </p>
        </div>
      </div>

      {/* Modal for Donation */}
      <Donations isOpen={isModalOpen} closeModal={closeModal} />
    </section>
  );
};

export default SupportUs;
