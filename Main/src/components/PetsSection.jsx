"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PetCards from "../common/PetCards"; 
import PetInfoModal from "../common/PetInfoModal"
import PetMatchingSystem from "../common/PetMatchingSystem"
import { Search, Filter, PawPrintIcon as Paw, RefreshCw } from "lucide-react"

const PetsSection = () => {
  const [pets, setPets] = useState([])
  const [selectedPet, setSelectedPet] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchCriteria, setSearchCriteria] = useState("name")
  const [filter, setFilter] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showMatchingSystem, setShowMatchingSystem] = useState(false)
  const [matchedPets, setMatchedPets] = useState([])
  const [isMatchingActive, setIsMatchingActive] = useState(false)

  // Fetch pets data from the backend
  useEffect(() => {
    setLoading(true)
    fetch("http://localhost:5001/pets")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          console.log("Pets data received:", data)
          setPets(data)
        } else {
          console.error("Pets data is not an array:", data)
          setError("Invalid data format received from server")
        }
      })
      .catch((err) => {
        console.error("Error fetching pets:", err)
        setError("Failed to fetch pets. Please try again later.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleMoreInfoClick = (pet) => {
    setSelectedPet(pet)
  }

  const closeModal = () => {
    setSelectedPet(null)
  }

  const filteredPets =
    isMatchingActive && matchedPets.length > 0
      ? matchedPets
      : pets.filter((pet) => {
          const searchTermLower = searchTerm.toLowerCase()
          let matchesSearch = false

          switch (searchCriteria) {
            case "name":
              matchesSearch = pet.name.toLowerCase().includes(searchTermLower)
              break
            case "type":
              matchesSearch = pet.type.toLowerCase().includes(searchTermLower)
              break
            case "breed":
              matchesSearch = pet.breed?.toLowerCase().includes(searchTermLower) || false
              break
            case "age":
              matchesSearch = pet.age?.toLowerCase().includes(searchTermLower) || false
              break
            case "location":
              matchesSearch = pet.location?.toLowerCase().includes(searchTermLower) || false
              break
            case "description":
              matchesSearch = (pet.description?.toLowerCase().includes(searchTermLower) || 
                             pet.long_desc?.toLowerCase().includes(searchTermLower)) || false
              break
            default:
              matchesSearch = Object.values(pet).some(value => 
                value?.toString().toLowerCase().includes(searchTermLower)
              )
          }

          const matchesFilter = filter === "All" || pet.type.toLowerCase() === filter.toLowerCase()
          return matchesSearch && matchesFilter
        })

  const handleMatchedPets = (matches) => {
    setMatchedPets(matches)
    setIsMatchingActive(true)
    setShowMatchingSystem(false)
  }

  const resetMatches = () => {
    setIsMatchingActive(false)
    setMatchedPets([])
  }

  const handleFavoriteChange = () => {
    window.dispatchEvent(new Event("refreshFavoritePet"));
  };

  return (
    <section id="pet" className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 py-16">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-4xl font-bold mb-3 text-gray-800 dark:text-white"
        >
          Find Your Perfect Companion
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto"
        >
          Browse our available pets or use our smart matching system to find your ideal furry friend
        </motion.p>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search pets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
              />
            </div>

            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
              >
                <option value="name">Search by Name</option>
                <option value="type">Search by Type</option>
                <option value="breed">Search by Breed</option>
                <option value="age">Search by Age</option>
                <option value="location">Search by Location</option>
                <option value="description">Search in Description</option>
                <option value="all">Search All Fields</option>
              </select>
            </div>

            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
              >
                <option value="All">All Pets</option>
                <option value="Cat">Cats</option>
                <option value="Dog">Dogs</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {isMatchingActive && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 border-gray-200 border-2 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                onClick={resetMatches}
              >
                <RefreshCw size={16} />
                <span className="dark:text-white">Reset Matches</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 w-full md:w-auto"
              onClick={() => setShowMatchingSystem(true)}
            >
              <Paw className="text-black dark:text-white" size={18} />
              <span className="text-black dark:text-white">Find My Perfect Match</span>
            </motion.button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
              <Paw
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary"
                size={20}
              />
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-6 bg-red-50 rounded-lg shadow-sm dark:bg-red-900/20">{error}</div>
        ) : (
          <>
            {isMatchingActive && matchedPets.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-primary/10 rounded-lg dark:bg-primary/20"
              >
                <h2 className="text-xl font-semibold text-primary mb-2">Your Matched Pets</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Based on your preferences, we've found {matchedPets.length} pets that might be perfect for you!
                </p>
              </motion.div>
            )}

            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredPets.length > 0 ? (
                  filteredPets.map((pet) => (
                    <motion.div
                      key={pet.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PetCards pet={pet} onMoreInfoClick={handleMoreInfoClick} onFavoriteChange={handleFavoriteChange} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-16 px-4"
                  >
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-xl shadow-sm">
                      <Paw className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No pets found</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Try adjusting your search or filters to find more pets.
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedPet && <PetInfoModal pet={selectedPet} onClose={closeModal} />}

        {showMatchingSystem && (
          <PetMatchingSystem
            onClose={() => setShowMatchingSystem(false)}
            onMatchFound={handleMatchedPets}
            allPets={pets}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default PetsSection

