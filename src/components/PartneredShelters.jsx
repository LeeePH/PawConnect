"use client"
import { useState, useEffect } from "react"
import { MapPin, Phone, Info, X, Mail, Globe } from "lucide-react"

const PartneredShelters = () => {
  const [shelters, setShelters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedShelter, setSelectedShelter] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch("http://localhost:5000/shelters")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch shelters")
        }
        return response.json()
      })
      .then((data) => {
        setShelters(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching shelters:", error)
        setError(error.message)
        setIsLoading(false)
      })
  }, [])

  // filter shelter
  const filteredShelters = shelters.filter((shelter) => {
    const matchesSearch =
      shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shelter.location.toLowerCase().includes(searchTerm.toLowerCase())

    if (selectedFilter === "all") return matchesSearch // add more if needed
    return matchesSearch
  })

  const openShelterModal = (shelter) => {
    setSelectedShelter(shelter)
    setShowModal(true)
    document.body.style.overflow = "hidden"
  }

  const closeShelterModal = () => {
    setShowModal(false)
    setSelectedShelter(null)
    document.body.style.overflow = "auto"
  }

  return (
    <section id="shelter" className="my-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            OUR PARTNERED <span className="text-[#6D712E]">SHELTERS</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            We work with these amazing shelters to help pets find their forever homes. Each shelter is committed to the
            welfare and proper care of animals.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D712E]"></div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {filteredShelters.length === 0 ? (
              <div className="text-center text-gray-600 dark:text-gray-300 py-12">
                <p className="text-xl">No shelters found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredShelters.map((shelter) => (
                  <div
                    key={shelter.id}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700"
                  >
                    <div className="relative h-56 overflow-hidden">
                      {shelter.img ? (
                        <img
                          src={`http://localhost:5000${shelter.img}`}
                          alt={shelter.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 dark:text-gray-500">No Image Available</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <h3 className="text-white text-xl font-bold">{shelter.name}</h3>
                      </div>
                    </div>

                    <div className="p-5 flex-grow flex flex-col">
                      <div className="flex items-start gap-2 mb-3">
                        <MapPin className="h-5 w-5 text-[#6D712E] flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600 dark:text-gray-300">{shelter.location}</p>
                      </div>

                      <div className="flex items-start gap-2 mb-4">
                        <Phone className="h-5 w-5 text-[#6D712E] flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600 dark:text-gray-300">{shelter.contact_info}</p>
                      </div>

                      {shelter.description && (
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {shelter.description ||
                            "This shelter is dedicated to finding loving homes for animals in need."}
                        </p>
                      )}

                      <div className="mt-auto pt-4">
                        <button
                          onClick={() => openShelterModal(shelter)}
                          className="inline-flex items-center justify-center w-full py-3 px-4 bg-[#6D712E] border border-[#6D712E] rounded-lg hover:bg-[#6D712E] hover:text-white transition-colors duration-300 font-medium"
                        >
                          <span className="text-white">More Info</span>
                          <Info className="ml-2 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showModal && selectedShelter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedShelter.name}</h3>
              <button
                onClick={closeShelterModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex justify-center mb-6">
                    {selectedShelter.logo ? (
                      <img
                        src={`http://localhost:5000${selectedShelter.logo}`}
                        alt={`${selectedShelter.name} logo`}
                        className="h-32 w-auto object-contain"
                      />
                    ) : selectedShelter.img ? (
                      <img
                        src={`http://localhost:5000${selectedShelter.img}`}
                        alt={selectedShelter.name}
                        className="h-32 w-auto object-contain"
                      />
                    ) : (
                      <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">{selectedShelter.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#6D712E] flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Address</h4>
                        <p className="text-gray-600 dark:text-gray-300">{selectedShelter.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-[#6D712E] flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Contact</h4>
                        <p className="text-gray-600 dark:text-gray-300">{selectedShelter.contact_info}</p>
                      </div>
                    </div>

                    {selectedShelter.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-[#6D712E] flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Email</h4>
                          <p className="text-gray-600 dark:text-gray-300">{selectedShelter.email}</p>
                        </div>
                      </div>
                    )}

                    {selectedShelter.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-[#6D712E] flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Website</h4>
                          <a
                            href={selectedShelter.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#6D712E] hover:underline"
                          >
                            {selectedShelter.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-lg text-gray-900 dark:text-white mb-2">About</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedShelter.description ||
                        "This shelter is dedicated to finding loving homes for animals in need. They provide care, shelter, and medical attention to abandoned and rescued animals until they find their forever homes."}
                    </p>
                  </div>

                  {selectedShelter.hours && (
                    <div className="mt-6">
                      <h4 className="font-medium text-lg text-gray-900 dark:text-white mb-2">Hours</h4>
                      <p className="text-gray-600 dark:text-gray-300">{selectedShelter.hours}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-lg text-gray-900 dark:text-white mb-4">Location</h4>
                  <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-[300px] md:h-[400px] relative">
                    <iframe
                      className="w-full h-full"
                      src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3859.0255755083554!2d121.05109021067622!3d14.711145784568744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sen!2sph!4v1735915611144!5m2!1sen!2sph"
                      loading="lazy"
                      title="Location Map"
                    ></iframe>
                  </div>

                  <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    {selectedShelter.location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default PartneredShelters