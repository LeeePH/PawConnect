"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Search, ArrowRight, Check, PawPrintIcon as Paw } from "lucide-react"

const PetMatchingSystem = ({ onClose, onMatchFound, allPets }) => {
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState({
    petType: "",
    size: "",
    age: "",
    energyLevel: "",
    petType: "",
    size: "",
    age: "",
    energyLevel: "",
    lifestyle: "",
    otherPets: false,
    children: false,
  })
  const [isMatching, setIsMatching] = useState(false)
  const [matchResults, setMatchResults] = useState([])

  // Questions for each step
  const questions = [
    {
      title: "What type of pet are you looking for?",
      options: [
        { value: "Dog", label: "Dog", icon: "🐶" },
        { value: "Cat", label: "Cat", icon: "🐱" },
        { value: "Any", label: "No preference", icon: "🐾" },
      ],
      field: "petType",
    },
    {
      title: "What size pet would fit your living situation?",
      options: [
        { value: "Small", label: "Small", icon: "S" },
        { value: "Medium", label: "Medium", icon: "M" },
        { value: "Large", label: "Large", icon: "L" },
        { value: "Any", label: "No preference", icon: "🔄" },
      ],
      field: "size",
    },
    {
      title: "What age pet are you looking for?",
      options: [
        { value: "Baby", label: "Baby", icon: "👶" },
        { value: "Young", label: "Young", icon: "🧒" },
        { value: "Adult", label: "Adult", icon: "👨" },
        { value: "Senior", label: "Senior", icon: "👴" },
        { value: "Any", label: "No preference", icon: "🔄" },
      ],
      field: "age",
    },
    {
      title: "What energy level are you looking for?",
      options: [
        { value: "Low", label: "Low energy", icon: "😴" },
        { value: "Medium", label: "Medium energy", icon: "🚶" },
        { value: "High", label: "High energy", icon: "🏃" },
        { value: "Any", label: "No preference", icon: "🔄" },
      ],
      field: "energyLevel",
    },
    {
      title: "What's your lifestyle like?",
      options: [
        { value: "Active", label: "Very active", icon: "🏃" },
        { value: "Moderate", label: "Moderately active", icon: "🚶" },
        { value: "Relaxed", label: "Relaxed/homebody", icon: "🏠" },
      ],
      field: "lifestyle",
    },
  ]

  // Additional questions
  const additionalQuestions = [
    {
      title: "Do you have other pets at home?",
      field: "otherPets",
    },
    {
      title: "Do you have children at home?",
      field: "children",
    },
  ]

  // Handle option selection
  const handleOptionSelect = (field, value) => {
    setPreferences({
      ...preferences,
      [field]: value,
    })
  }

  // Handle boolean toggle
  const handleToggle = (field) => {
    setPreferences({
      ...preferences,
      [field]: !preferences[field],
    })
  }

  // Go to next step
  const handleNextStep = () => {
    if (step < questions.length + 1) {
      setStep(step + 1)
    } else {
      findMatches()
    }
  }

  // Go to previous step
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Find matching pets based on preferences
  const findMatches = () => {
    setIsMatching(true)

    // Simulate AI matching algorithm with a scoring system
    setTimeout(() => {
      const scoredPets = allPets.map((pet) => {
        let score = 0

        // Type matching (highest weight)
        if (preferences.petType === "Any" || preferences.petType === pet.type) {
          score += 30
        } else {
          return { pet, score: 0 }
        }

        // Size matching (strict matching)
        if (preferences.size === "Any") {
          score += 20
        } else if (preferences.size.toLowerCase() === (pet.size || "medium").toLowerCase()) {
          score += 20
        } else {
          // If size doesn't match and it's not "Any", this is a deal-breaker
          return { pet, score: 0 }
        }

        // Age matching with more sophisticated logic
        const petAge = (pet.age || "").toLowerCase()
        if (preferences.age === "Any") {
          score += 15
        } else {
          const ageMatches = {
            "Baby": ["baby", "puppy", "kitten", "infant", "young", "newborn"],
            "Young": ["young", "adolescent", "teen", "juvenile", "1 year", "2 year"],
            "Adult": ["adult", "mature", "grown", "3 year", "4 year", "5 year"],
            "Senior": ["senior", "older", "elderly", "aged", "7 year", "8 year", "9 year", "10 year"]
          }
          
          if (ageMatches[preferences.age].some(ageTerm => petAge.includes(ageTerm))) {
            score += 15
          }
        }

        // Energy level matching using actual data
        if (preferences.energyLevel === "Any") {
          score += 15
        } else if (pet.energy_level === preferences.energyLevel) {
          score += 15
        }

        // Lifestyle compatibility using actual characteristics
        if (preferences.lifestyle === "Active" && pet.energetic) {
          score += 10
        } else if (preferences.lifestyle === "Moderate" && !pet.energetic && !pet.needs_training) {
          score += 10
        } else if (preferences.lifestyle === "Relaxed" && !pet.energetic) {
          score += 10
        }

        // Other pets compatibility using actual data
        if (preferences.otherPets && pet.pet_friendly) {
          score += 5
        }

        // Children compatibility using actual data
        if (preferences.children && pet.kid_friendly) {
          score += 5
        }

        // Apartment compatibility
        if (pet.apartment_friendly) {
          score += 5
        }

        // Training needs consideration
        if (!pet.needs_training) {
          score += 5
        }

        // Personality traits matching
        if (pet.personality_traits) {
          try {
            const traits = JSON.parse(pet.personality_traits)
            const matchingTraits = Object.entries(traits).filter(([_, value]) => value === true)
            score += Math.min(10, matchingTraits.length * 2) // Up to 10 points for matching traits
          } catch (e) {
            console.error("Error parsing personality traits:", e)
          }
        }

        return { pet, score }
      })

      // Sort by score and filter out poor matches
      const matches = scoredPets
        .filter((item) => item.score > 30) // Minimum threshold
        .sort((a, b) => b.score - a.score)
        .map((item) => item.pet)

      setMatchResults(matches)
      setIsMatching(false)

      // If we have matches, return them to the parent component
      if (matches.length > 0) {
        onMatchFound(matches)
      } else {
        // If no matches, show all pets
        onMatchFound(allPets)
      }
    }, 2000) // Simulate processing time
  }

  // Current question based on step
  const currentQuestion =
    step <= questions.length ? questions[step - 1] : { title: "Additional Information", field: "additional" }

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="relative bg-primary/10 dark:bg-primary/20 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <X size={18} className="text-gray-700 dark:text-gray-200" />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-primary/20 dark:bg-primary/30 p-2 rounded-full">
              <Search size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Pet Matching System</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Answer a few questions to find your perfect pet match
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: `${(step / (questions.length + 1)) * 100}%` }}
              animate={{ width: `${(step / (questions.length + 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
            Step {step} of {questions.length + 1}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isMatching ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
                <Paw
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary"
                  size={24}
                />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Finding your perfect match</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                Our AI is analyzing your preferences to find the best pet matches for you...
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-6">{currentQuestion.title}</h3>

              {step <= questions.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {currentQuestion.options.map((option) => (
                    <motion.button
                      key={option.value}
                      className={`p-4 rounded-lg border-2 flex items-center gap-3 transition-all duration-200 ${
                        preferences[currentQuestion.field] === option.value
                          ? "border-primary bg-primary/10 dark:bg-primary/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                      onClick={() => handleOptionSelect(currentQuestion.field, option.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-lg ${
                          preferences[currentQuestion.field] === option.value
                            ? "bg-primary text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {option.icon}
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{option.label}</span>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6 mb-8">
                  {additionalQuestions.map((question, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{question.title}</span>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences[question.field] ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                        }`}
                        onClick={() => handleToggle(question.field)}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences[question.field] ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}

                  <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-lg mt-6">
                    <h4 className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200 mb-2">
                      <Check size={16} className="text-primary" />
                      Ready to find your matches
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Based on your preferences, we'll find the pets that best match your lifestyle and needs.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700 flex justify-between">
          <button
            className={`px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              step === 1 || isMatching ? "invisible" : ""
            }`}
            onClick={handlePrevStep}
            disabled={step === 1 || isMatching}
          >
            Back
          </button>

          <motion.button
            className={`px-6 py-2 rounded-lg bg-primary text-white flex items-center gap-2 hover:bg-primary/90 transition-colors ${
              isMatching ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleNextStep}
            disabled={isMatching}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {step === questions.length + 1 ? (
              <>
                <span>Find Matches</span>
                <Search size={16} />
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PetMatchingSystem

