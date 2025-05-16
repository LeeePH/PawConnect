"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, MapPin, Calendar, Ruler, User, Check, ArrowRight } from "lucide-react"
import AdoptFormModal from "./AdoptFormModal"

const PetInfoModal = ({ pet, onClose }) => {
  const [isAdoptFormOpen, setAdoptFormOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [activeTab, setActiveTab] = useState("about")
  const modalRef = useRef(null)

  // Handle image loading errors
  const handleImageError = () => {
    console.error(`Failed to load image for pet: ${pet.name}, URL: ${pet.img}`)
    setImageError(true)
  }

  const handleAdoptClick = () => {
    setAdoptFormOpen(true)
  }

  const handleClose = () => {
    setAdoptFormOpen(false)
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  // Pet characteristics
  const characteristics = [
    { label: "Friendly with kids", value: pet.kid_friendly },
    { label: "Good with other pets", value: pet.pet_friendly },
    { label: "Needs training", value: pet.needs_training },
    { label: "Energetic", value: pet.energetic },
    { label: "Apartment friendly", value: pet.apartment_friendly },
  ]

  // Add personality traits if available
  let personalityTraits = []
  if (pet.personality_traits) {
    try {
      const traits = JSON.parse(pet.personality_traits)
      personalityTraits = Object.entries(traits)
        .filter(([_, value]) => value === true)
        .map(([key]) => ({
          label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          value: true
        }))
    } catch (e) {
      console.error("Error parsing personality traits:", e)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-xl shadow-xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="relative">
            {/* Header with close button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="bg-white/80 dark:bg-gray-800/80 p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <X size={20} className="text-gray-700 dark:text-gray-200" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Left side - Image and quick info */}
              <div className="md:w-2/5 relative">
                <div className="h-64 md:h-full min-h-[300px] relative">
                  {!imageError && pet.img ? (
                    <img
                      src={`http://localhost:5001${pet.img}`}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-6xl">{pet.type === "Cat" ? "🐱" : "🐶"}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-black/50 rounded-lg"> {/* Added transparent background here */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">{pet.name}</h2>
                    <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-200">
                      <Heart size={20} />
                    </button>
                  </div>

                  <div className="flex items-center mt-2">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-white">{pet.location}</span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">{pet.type}</span>
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">{pet.gender}</span>
                  </div>
                </div>
              </div>

              {/* Right side - Details */}
              <div className="md:w-3/5 p-6">
                <div className="border-b dark:border-gray-700 mb-4">
                  <div className="flex space-x-4">
                    <button
                      className={`pb-3 px-1 font-medium text-sm transition-colors duration-200 ${
                        activeTab === "about"
                          ? "text-primary border-b-2 border-primary"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                      onClick={() => setActiveTab("about")}
                    >
                      About
                    </button>
                    <button
                      className={`pb-3 px-1 font-medium text-sm transition-colors duration-200 ${
                        activeTab === "characteristics"
                          ? "text-primary border-b-2 border-primary"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                      onClick={() => setActiveTab("characteristics")}
                    >
                      Characteristics
                    </button>
                  </div>
                </div>

                <div className="h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                  {activeTab === "about" && (
                    <div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                          <Calendar size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Age</p>
                            <p className="text-gray-800 dark:text-gray-200">{pet.age || "Unknown"}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Ruler size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Size</p>
                            <p className="text-gray-800 dark:text-gray-200">{pet.size || "Medium"}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <User size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
                            <p className="text-gray-800 dark:text-gray-200">{pet.gender}</p>
                          </div>
                        </div>
                        {pet.breed && (
                          <div className="flex items-center">
                            <span className="w-5 h-5 flex items-center justify-center text-gray-500 dark:text-gray-400 mr-2">
                              {pet.type === "Cat" ? "🐱" : "🐶"}
                            </span>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Breed</p>
                              <p className="text-gray-800 dark:text-gray-200">{pet.breed}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">About {pet.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {pet.long_desc ||
                            pet.description ||
                            `
                            ${pet.name} is a wonderful ${pet.type.toLowerCase()} looking for a loving forever home. 
                            ${pet.gender === "Male" ? "He" : "She"} is ${pet.age || "young"} and has a 
                            ${Math.random() > 0.5 ? "playful" : "gentle"} personality. 
                            ${pet.gender === "Male" ? "He" : "She"} enjoys 
                            ${pet.type === "Cat" ? "chasing toys and lounging in sunny spots" : "going for walks and playing fetch"}.
                            ${pet.name} would make a great addition to 
                            ${Math.random() > 0.5 ? "any family" : "a loving home"}.
                          `}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "characteristics" && (
                    <div>
                      <ul className="space-y-3">
                        {characteristics.map((trait, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">{trait.label}</span>
                            <span className={`flex items-center ${trait.value ? "text-green-500" : "text-gray-400"}`}>
                              {trait.value ? (
                                <>
                                  <Check size={16} className="mr-1" />
                                  <span className="text-sm">Yes</span>
                                </>
                              ) : (
                                <span className="text-sm">No</span>
                              )}
                            </span>
                          </li>
                        ))}

                        {personalityTraits.length > 0 && (
                          <>
                            <li className="pt-3 border-t dark:border-gray-700">
                              <span className="text-gray-700 dark:text-gray-300 font-medium">Personality Traits</span>
                            </li>
                            {personalityTraits.map((trait, index) => (
                              <li key={`personality-${index}`} className="flex items-center justify-between">
                                <span className="text-gray-700 dark:text-gray-300">{trait.label}</span>
                                <span className="flex items-center text-green-500">
                                  <Check size={16} className="mr-1" />
                                  <span className="text-sm">Yes</span>
                                </span>
                              </li>
                            ))}
                          </>
                        )}
                      </ul>

                      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Adoption Notes</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {pet.adoption_notes ||
                            `
                            ${pet.name} is ready for adoption and has been 
                            ${Math.random() > 0.5 ? "spayed/neutered" : "vaccinated"} and microchipped. 
                            The adoption fee includes these medical services and a starter kit for your new pet.
                          `}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAdoptClick}
                    className="flex-1 bg-primary text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors duration-200"
                  >
                    <span className="text-black dark:text-white">Adopt {pet.name}</span>
                    <ArrowRight size={16} />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {isAdoptFormOpen && <AdoptFormModal pet={pet} onClose={handleClose} />}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PetInfoModal

