import React, { useState, useEffect } from 'react';

const PartneredShelters = () => {
  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/shelters')
      .then((response) => response.json())
      .then((data) => setShelters(data))
      .catch((error) => console.error('Error fetching shelters:', error));
  }, []); 

  return (
    <div className="bg-gray-100 container mx-auto p-4 mt-12 dark:bg-gray-900">
      <h1 className="text-2xl md:text-4xl font-bold my-10 text-center uppercase">Shelters Partnership</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {shelters.map((shelter) => (
          <div key={shelter.id} className="bg-white dark:bg-gray-700 p-4 rounded shadow-md">
            <h2 className="text-xl text-center font-semibold">{shelter.name}</h2>
            <p className="text-gray-600 text-center dark:text-gray-50">{shelter.location}</p>
            {shelter.img && (
              <img
                src={`http://localhost:5000${shelter.img}`}
                alt={shelter.name}
                className="w-auto h-52 object-cover rounded mt-2 flex mx-auto"
              />
            )}
            <p className="mt-2 text-center">Contact: {shelter.contact_info}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartneredShelters;
