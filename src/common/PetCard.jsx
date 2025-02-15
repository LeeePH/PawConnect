import React from 'react';

const PetCard = ({ pet, onMoreInfoClick }) => {
  return (
    <div className="rounded-lg shadow-md dark:bg-gray-800 dark:rounded-lg">
      {/* Dynamically load the image */}
      {pet.img ? (
        <img
          src={`http://localhost:5000${pet.img}`} // Use the dynamic URL for images
          alt={pet.name}
          className="w-full h-40 object-cover rounded-t-lg"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-t-lg">Image Not Found</div>
      )}
      <div className="ml-2">
        <h2 className="text-gray-900 dark:text-white text-xl font-bold mt-4">{pet.name}</h2>
        <p className="text-gray-700 dark:text-white italic">{pet.location}</p>
        <p className="text-gray-700 dark:text-white mt-2">
          Gender: {pet.gender} <span className="text-black dark:text-white ml-16">Size: {pet.size}</span>
        </p>
        <p className="text-gray-700 dark:text-white text-[0.9rem] mt-2">{pet.description}</p>
      </div>
      <div className="flex justify-center text-center w-full">
        <button
          className="hidden md:block bg-transparent text-[#7D712E] border border-[#7D712E] my-5 px-[5.8rem] py-3 rounded-md duration-300 dark:bg-[#7D712E] dark:text-white hover:bg-[#7D712E] hover:text-white"
          onClick={() => onMoreInfoClick(pet)}
        >
          More Info
        </button>
      </div>
    </div>
  );
};

export default PetCard;
