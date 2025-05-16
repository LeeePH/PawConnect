"use client"

import { useState, useEffect } from "react"

// image resources
import dogBreed from "../assets/dogbreed.jpg"
import trainingCats from '../assets/cattraining.jpg'
import dogNutrition from '../assets/dognutrition.jfif'
import catBehavior from '../assets/catbehavior.jpg'
import dogTraining from '../assets/dogtraining.jpg'
import catNutrition from '../assets/catnutrition.jpg'

// Resource data
const resourcesData = [
  {
    id: 1,
    title: "Dog Breeds",
    category: "dogs",
    type: "guide",
    image: dogBreed,
    description: "The group of dogs of the original type includes hunting dogs, herding dogs...",
    fullDescription:
      "The group of dogs of the original type includes hunting dogs, herding dogs, and working dogs. Each breed has its own characteristics and history, from small lap dogs to large working breeds like German Shepherds and Huskies. Understanding the breed helps in proper training and care, making sure that the dog thrives in its environment.",
    referenceLink: "https://www.akc.org/dog-breeds/",
  },
  {
    id: 2,
    title: "Training Cats",
    category: "cats",
    type: "training",
    image: trainingCats,
    description: "The process of training the animal to be a grateful eater can take months...",
    fullDescription:
      "Training cats to be more compliant and less finicky is essential for both their well-being and your own peace of mind. Training involves using positive reinforcement and patience to encourage good behavior, from eating habits to litter box use. Cats are intelligent and capable of learning tricks or commands with the right approach.",
    referenceLink: "https://www.cesarsway.com/cat-training-tips/",
  },
  {
    id: 3,
    title: "Nutrition of Dogs",
    category: "dogs",
    type: "nutrition",
    image: dogNutrition,
    description: "Food intolerances in animals are a common problem...",
    fullDescription:
      "Food intolerances in dogs can lead to skin problems, digestive issues, and overall discomfort. A balanced diet with the right nutrients is critical for maintaining a dog's health. Understanding which foods are beneficial and which ones to avoid can drastically improve your dog's quality of life. This article covers the essentials of dog nutrition, along with common allergens and how to spot them.",
    referenceLink: "https://www.petmd.com/dog/nutrition/evr_dg_guide_to_dog_nutrition",
  },
  {
    id: 4,
    title: "Cat Behavior",
    category: "cats",
    type: "behavior",
    image: catBehavior,
    description: "Cats communicate with each other and with humans through their voices...",
    fullDescription:
      "Cats have a complex set of behaviors, including vocalizations, body language, and scent marking. Understanding these behaviors can enhance the bond between you and your cat. Whether it's deciphering a meow or recognizing body language signals, the more you understand your cat, the more enjoyable your companionship will be.",
    referenceLink: "https://www.cats.org.uk/cat-behaviour",
  },
  {
    id: 5,
    title: "Dog Training Basics",
    category: "dogs",
    type: "training",
    image: dogTraining,
    description: "Learn the fundamentals of positive reinforcement training for dogs...",
    fullDescription:
      "Positive reinforcement training is one of the most effective methods for teaching your dog new behaviors. This guide covers the basics of clicker training, reward timing, and how to gradually shape behaviors. With consistency and patience, you can teach your dog everything from basic commands to complex tricks.",
    referenceLink: "https://www.akc.org/expert-advice/training/",
  },
  {
    id: 6,
    title: "Cat Nutrition Guide",
    category: "cats",
    type: "nutrition",
    image: catNutrition,
    description: "Understanding the dietary needs of your feline companion...",
    fullDescription:
      "Cats are obligate carnivores, which means they require animal protein to maintain optimal health. This comprehensive guide covers everything from kitten to senior cat nutrition, including how to read pet food labels, common nutritional deficiencies, and special dietary considerations for cats with health issues.",
    referenceLink: "https://www.cornell.edu/cats/nutrition",
  },
]

// Resource type badge colors
const typeBadgeColors = {
  guide: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  training: "bg-green-100 text-green-800 hover:bg-green-200",
  nutrition: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  behavior: "bg-purple-100 text-purple-800 hover:bg-purple-200",
}

export default function PetNewsSection() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedResource, setSelectedResource] = useState(null)
  const [bookmarkedResources, setBookmarkedResources] = useState([])
  const [selectedTypes, setSelectedTypes] = useState(["guide", "training", "nutrition", "behavior"])
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("petResourceBookmarks")
    if (savedBookmarks) {
      setBookmarkedResources(JSON.parse(savedBookmarks))
    }
  }, [])

  // Save bookmarks to localStorage when they change
  useEffect(() => {
    localStorage.setItem("petResourceBookmarks", JSON.stringify(bookmarkedResources))
  }, [bookmarkedResources])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (showFilterDropdown && !event.target.closest("#filter-dropdown-container")) {
        setShowFilterDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showFilterDropdown])

  const toggleBookmark = (resourceId) => {
    if (bookmarkedResources.includes(resourceId)) {
      setBookmarkedResources(bookmarkedResources.filter((id) => id !== resourceId))
    } else {
      setBookmarkedResources([...bookmarkedResources, resourceId])
    }
  }

  const openResourceDetails = (resource) => {
    setSelectedResource(resource)
    document.body.style.overflow = "hidden"
  }

  const closeResourceDetails = () => {
    setSelectedResource(null)
    document.body.style.overflow = "auto"
  }

  const toggleResourceType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  // Filter resources based on active tab, search query, and selected types
  const filteredResources = resourcesData.filter((resource) => {
    // Filter by tab (category)
    if (activeTab !== "all" && resource.category !== activeTab) return false

    // Filter by search query
    if (
      searchQuery &&
      !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    // Filter by selected types
    if (!selectedTypes.includes(resource.type)) return false

    return true
  })

  return (
    <div id="guide" className="container mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Pet Resources</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Discover helpful guides, training tips, and nutrition advice for your furry friends
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative w-full md:w-auto" id="filter-dropdown-container">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span className="dark:text-white text-black">Filter</span>
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
              <div className="p-2">
                <div className="font-medium text-sm mb-2 text-gray-500 dark:text-gray-400">Resource Types</div>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded text-blue-600 focus:ring-blue-500"
                      checked={selectedTypes.includes("guide")}
                      onChange={() => toggleResourceType("guide")}
                    />
                    <span className="text-sm">Guides</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded text-blue-600 focus:ring-blue-500"
                      checked={selectedTypes.includes("training")}
                      onChange={() => toggleResourceType("training")}
                    />
                    <span className="text-sm">Training</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded text-blue-600 focus:ring-blue-500"
                      checked={selectedTypes.includes("nutrition")}
                      onChange={() => toggleResourceType("nutrition")}
                    />
                    <span className="text-sm">Nutrition</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded text-blue-600 focus:ring-blue-500"
                      checked={selectedTypes.includes("behavior")}
                      onChange={() => toggleResourceType("behavior")}
                    />
                    <span className="text-sm">Behavior</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "all"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Resources
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center gap-1 ${
              activeTab === "dogs"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("dogs")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 5.172C10 3.12 8.21 1.55 6.17 1.952c-1.4.28-2.47 1.47-2.6 2.91-.08 1.02.18 1.975.6 2.862l.01.028c.5 1 1.069 2.07 1.976 2.923a8.723 8.723 0 0 0 4.75 2.82c.71.18 1.356-.29 1.438-1.01a1.06 1.06 0 0 0-.013-.333A10.571 10.571 0 0 1 10 5.172Z"></path>
              <path d="M14.5 5.03c0-1.95 1.53-3.53 3.47-3.53 1.4 0 2.558.975 2.93 2.25a3.3 3.3 0 0 1-.6 3.1l-.1.12c-.5.55-1.5 1.52-1.5 2.25V11h1a2 2 0 0 1 2 2v1c0 1.1-.9 2-2 2h-1v3l3 3"></path>
              <path d="M7 15v-3a2 2 0 0 1 2-2h6"></path>
              <path d="M11 21v-6"></path>
              <path d="M7 18a3 3 0 0 1-3-3V7"></path>
            </svg>
            Dogs
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center gap-1 ${
              activeTab === "cats"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("cats")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"></path>
              <path d="M8 14v.5"></path>
              <path d="M16 14v.5"></path>
              <path d="M11.25 16.25h1.5L12 17l-.75-.75Z"></path>
            </svg>
            Cats
          </button>
        </div>

        {/* Resource Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              isBookmarked={bookmarkedResources.includes(resource.id)}
              onToggleBookmark={toggleBookmark}
              onViewDetails={openResourceDetails}
              badgeColor={typeBadgeColors[resource.type]}
            />
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No resources found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Resource Details Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold">{selectedResource.title}</h3>
              <button
                onClick={closeResourceDetails}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${typeBadgeColors[selectedResource.type]}`}
                >
                  {selectedResource.type.charAt(0).toUpperCase() + selectedResource.type.slice(1)}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 flex items-center gap-1">
                  {selectedResource.category === "dogs" ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 5.172C10 3.12 8.21 1.55 6.17 1.952c-1.4.28-2.47 1.47-2.6 2.91-.08 1.02.18 1.975.6 2.862l.01.028c.5 1 1.069 2.07 1.976 2.923a8.723 8.723 0 0 0 4.75 2.82c.71.18 1.356-.29 1.438-1.01a1.06 1.06 0 0 0-.013-.333A10.571 10.571 0 0 1 10 5.172Z"></path>
                        <path d="M14.5 5.03c0-1.95 1.53-3.53 3.47-3.53 1.4 0 2.558.975 2.93 2.25a3.3 3.3 0 0 1-.6 3.1l-.1.12c-.5.55-1.5 1.52-1.5 2.25V11h1a2 2 0 0 1 2 2v1c0 1.1-.9 2-2 2h-1v3l3 3"></path>
                        <path d="M7 15v-3a2 2 0 0 1 2-2h6"></path>
                        <path d="M11 21v-6"></path>
                        <path d="M7 18a3 3 0 0 1-3-3V7"></path>
                      </svg>
                      Dogs
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"></path>
                        <path d="M8 14v.5"></path>
                        <path d="M16 14v.5"></path>
                        <path d="M11.25 16.25h1.5L12 17l-.75-.75Z"></path>
                      </svg>
                      Cats
                    </>
                  )}
                </span>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                <img
                  src={selectedResource.image || "/placeholder.svg"}
                  alt={selectedResource.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedResource.fullDescription}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => toggleBookmark(selectedResource.id)}
              >
                {bookmarkedResources.includes(selectedResource.id) ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-500"
                    >
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                      <path d="m9 10 2 2 4-4"></path>
                    </svg>
                    Saved
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                    </svg>
                    Save Resource
                  </>
                )}
              </button>

              <a
                href={selectedResource.referenceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Read Full Article
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Resource Card Component
function ResourceCard({ resource, isBookmarked, onToggleBookmark, onViewDetails, badgeColor }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={resource.image || "/placeholder.svg"}
          alt={resource.title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleBookmark(resource.id)
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white"
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {isBookmarked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-500"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
              <path d="m9 10 2 2 4-4"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
            </svg>
          )}
        </button>

        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeColor}`}>
            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{resource.title}</h3>
          {resource.category === "dogs" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M10 5.172C10 3.12 8.21 1.55 6.17 1.952c-1.4.28-2.47 1.47-2.6 2.91-.08 1.02.18 1.975.6 2.862l.01.028c.5 1 1.069 2.07 1.976 2.923a8.723 8.723 0 0 0 4.75 2.82c.71.18 1.356-.29 1.438-1.01a1.06 1.06 0 0 0-.013-.333A10.571 10.571 0 0 1 10 5.172Z"></path>
              <path d="M14.5 5.03c0-1.95 1.53-3.53 3.47-3.53 1.4 0 2.558.975 2.93 2.25a3.3 3.3 0 0 1-.6 3.1l-.1.12c-.5.55-1.5 1.52-1.5 2.25V11h1a2 2 0 0 1 2 2v1c0 1.1-.9 2-2 2h-1v3l3 3"></path>
              <path d="M7 15v-3a2 2 0 0 1 2-2h6"></path>
              <path d="M11 21v-6"></path>
              <path d="M7 18a3 3 0 0 1-3-3V7"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"></path>
              <path d="M8 14v.5"></path>
              <path d="M16 14v.5"></path>
              <path d="M11.25 16.25h1.5L12 17l-.75-.75Z"></path>
            </svg>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{resource.description}</p>

        <button
          onClick={() => onViewDetails(resource)}
          className="w-full px-4 py-2 text-white bg-[#6D712E] border border-[#6D712E] dark:border-[#6D712E] rounded-md text-center hover:bg-[#46491c] dark:hover:bg-[#46491c] transition-colors"
        >
          Read More
        </button>
      </div>
    </div>
  )
}

