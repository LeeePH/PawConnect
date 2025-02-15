import React from 'react';
import groupLogo from '../assets/logo-modified.png';
import mainLogo from '../assets/main-modified.png';
import galope from '../assets/galope.jpg';
import murphy from '../assets/murphy.jpg';
import lee from '../assets/lee.jpg';
import calipes from '../assets/calipes.jpg';
import allysa from '../assets/allysa.jpg';
import ayes from '../assets/ayes.jpg';
import jeff from '../assets/jeff.jpg';
import matt from '../assets/matt.jpg';
import judy from '../assets/judy.jpg';
import ali from '../assets/ali.png'
import briagas from '../assets/briagas.jpg'
import franc from '../assets/franc.png'


const AboutUs = () => {
    const members = [
        { name: 'Mark Christopher Galope', role: 'Project Manager [COUPS]', img: galope },
        { name: 'Murphy De Guzman', role: 'System Analyst [COUPS]', img: murphy },
        { name: 'Lee Bernard Nillar', role: 'Lead Programmer [COUPS]', img: lee },
        { name: 'John Rey Calipes', role: 'Database Designer', img: calipes },
        { name: 'Mark Jefferson Orgado', role: 'Programmer [COUPS]', img: jeff },
        { name: 'John Matthew Capadocia', role: 'Technical Writer [COUPS]', img: matt },
        { name: 'Noberto Ayes III', role: 'Network Designer', img: ayes },
        { name: 'Jean Allysa Vallez', role: 'UI/UX Designer', img: allysa },
        { name: 'Judylyn Fedelson', role: 'Researcher', img: judy },
    ];

    return (
        <section id="aboutus" className="bg-gray-100 dark:bg-gray-950 py-10 my-5">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
                    <div className="grid grid-cols-1 gap-5 lg:w-1/2">
                        <img
                            src={groupLogo}
                            alt="Group Logo"
                            className="w-60 h-60 md:ml-52 object-contain"
                        />

                        <img
                            src={mainLogo}
                            alt="Group Logo"
                            className="w-60 h-60 object-contain"
                        />
                    </div>

                    <div className="lg:w-2/3">
                        <h2 className="text-3xl font-bold text-center lg:text-left mb-6 uppercase text-gray-800 dark:text-white">
                            About Our Group
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            We are a passionate group along with the <span>COUPS</span> that are dedicated to creating innovative solutions in the world of technology specifically about animals. Our team collaborates to design and deliver meaningful projects that make a difference.
                        </p>

                        <div className="mt-4">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                Vision
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                To inspire innovation and build technology that transforms lives.
                            </p>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                Mission
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                To create solutions that blend creativity and functionality for real-world challenges.
                            </p>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                Goals
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                - Deliver high-quality projects on time. <br />
                                - Foster collaboration and learning within the team. <br />
                                - Drive impact through technology and innovation.
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-center mb-10 uppercase text-gray-800 dark:text-white">
                        Meet the Team
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
                        {members.map((member, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
                            >
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-32 h-32 object-cover rounded-full mb-4"
                                />
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                    {member.name}
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    {member.role}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
