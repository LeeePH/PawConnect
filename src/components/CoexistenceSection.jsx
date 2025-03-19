import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faDog, faCat } from '@fortawesome/free-solid-svg-icons';

import humananimals from '../assets/mascot.jfif'
const CoexistenceSection = () => {
    return (
    <section id='coexist' className="bg-gray-100 dark:bg-gray-900 max-w-full mx-auto py-12 px-4">
        <h2 className="text-4xl font-bold text-center mb-10 uppercase">
            Peaceful Coexistence <br />
            <span>Human & Animals</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex justify-center">
                <img
                    src={humananimals}
                    alt="Human and Animals"
                    className="w-auto h-auto object-cover rounded-md max-w-sm"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg shadow-md flex flex-col items-center dark:bg-gray-800">
                <FontAwesomeIcon icon={faCat} className="text-4xl text-[#7D712E] mb-4" />
                <h3 className="text-xl font-semibold mb-2">Emotional relationship</h3>
                <p className="text-center">
                    The emotional bond between cats and humans is deeply rooted in felines' unconditional love and companionship.
                </p>
            </div>

            <div className="p-6 rounded-lg shadow-md flex flex-col items-center dark:bg-gray-800">
                <FontAwesomeIcon icon={faDog} className="text-4xl text-[#7D712E] mb-4" />
                <h3 className="text-xl font-semibold mb-2">Communication</h3>
                <p className="text-center">
                    Animals can communicate better with people in such conditions, as verbal communication is replaced by non-verbal.
                </p>
            </div>

            <div className="p-6 rounded-lg shadow-md flex flex-col items-center dark:bg-gray-800">
                <FontAwesomeIcon icon={faDog} className="text-4xl text-[#7D712E] mb-4" />
                <h3 className="text-xl font-semibold mb-2">Children and pets</h3>
                <p className="text-center">
                    Pets establish emotional attachments to children, reinforcing the child's personality.
                </p>
            </div>

            <div className="p-6 rounded-lg shadow-md flex flex-col items-center dark:bg-gray-800">
                <FontAwesomeIcon icon={faCat} className="text-4xl text-[#7D712E] mb-4" />
                <h3 className="text-xl font-semibold mb-2">Health</h3>
                <p className="text-center">
                    Some studies suggest that owning a pet can lower blood pressure and improve heart health.
                </p>
            </div>
        </div>
    </div>
    </section>
  );
};

export default CoexistenceSection;
