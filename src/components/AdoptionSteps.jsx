import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faHouseUser, faSearch } from '@fortawesome/free-solid-svg-icons';

const AdoptionSteps = () => {
  return (
    <section id='guide' className="max-w-7xl items-center mx-auto py-12 px-4 mt-12">
      <h2 className="text-3xl font-bold text-center mb-6">Adopt A Pet In Just <span>3 Easy Steps</span></h2>
      <div className="grid grid-cols-1 justify-around items-center md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col mb-4 items-center p-6 rounded-lg shadow-lg w-full md:max-w-xs md:mx-4 dark:bg-gray-800">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-200 dark:bg-gray-700 text-[#7D712E] mb-4">
            <span className="text-lg font-bold">1</span>
          </div>
          <FontAwesomeIcon icon={faUserPlus} className="text-4xl text-[#7D712E] mb-4" />
          <p className="text-center">Set up your profile (including photos) in minutes</p>
        </div>

        <div className="flex flex-col mb-4 items-center p-6 rounded-lg shadow-lg w-full md:max-w-xs md:mx-4 dark:bg-gray-800">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-200 dark:bg-gray-700 text-[#7D712E] mb-4">
            <span className="text-lg font-bold">2</span>
          </div>
          <FontAwesomeIcon icon={faHouseUser} className="text-4xl text-[#7D712E] mb-4" />
          <p className="text-center">Describe your home and routine so we can see if it’s suitable for the pet</p>
        </div>

        <div className="flex flex-col mb-4 items-center p-6 rounded-lg shadow-lg w-full md:max-w-xs md:mx-4 dark:bg-gray-800">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-200 dark:bg-gray-700 text-[#7D712E] mb-4">
            <span className="text-lg font-bold">3</span>
          </div>
          <FontAwesomeIcon icon={faSearch} className="text-4xl text-[#7D712E] mb-4" />
          <p className="text-center">Start your search!</p>
        </div>
      </div>
    </section>
  );
};

export default AdoptionSteps;
