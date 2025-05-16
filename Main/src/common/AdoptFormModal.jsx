"use client"

import { useState, useEffect } from "react"
import {
  User,
  Home,
  Phone,
  Mail,
  Briefcase,
  Building,
  Clock,
  Heart,
  PawPrint,
  Users,
  DollarSign,
  Plane,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  Upload,
  Instagram,
  FileText,
  Camera,
  Shield,
} from "lucide-react"

const AdoptFormModal = ({ onClose, pet }) => {
  const [selectedPetId, setSelectedPetId] = useState("")
  const [selectedPet, setSelectedPet] = useState(null)
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Address: "",
    Phone: "",
    Email: "",
    Occupation: "",
    CompanyName: "",
    SocProfile: "",
    Status: "",
    SelectedPet: "",
    ReasonToAdopt: "",
    ExperienceWithPets: "",
    LivingCondition: "",
    AllergicHouseholds: "",
    PetCareResponsible: "",
    FinancialResponsible: "",
    VacationCare: "",
    AloneHours: "",
    IntroSteps: "",
    FamilySupport: "",
    SupportExplanation: "",
  })

  const [errors, setErrors] = useState({})
  const [petData, setPetData] = useState([])
  const [currentStep, setCurrentStep] = useState(1)
  const [successMessage, setSuccessMessage] = useState(null)
  const totalSteps = 4
  const [showSuccess, setShowSuccess] = useState(false)

  // New state for photo uploads
  const [photos, setPhotos] = useState({
    front_house: null,
    street_photo: null,
    living_room: null,
    dining_area: null,
    kitchen: null,
    bedroom: null,
    windows: null,
    front_backyard: null,
    valid_id: null,
  })

  // Add state for photo previews
  const [photoPreviews, setPhotoPreviews] = useState({})

  // Add a state for terms agreement
  const [termsAgreement, setTermsAgreement] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("http://localhost:5001/pets")
        const data = await response.json()
        setPetData(data)
      } catch (error) {
        console.error("Error fetching pets:", error)
      }
    }

    fetchPets()
  }, [])

  useEffect(() => {
    if (pet && pet.pet_id && !selectedPetId) {
      setSelectedPetId(pet.pet_id.toString());
      setFormData((prevData) => ({
        ...prevData,
        SelectedPet: pet.pet_id.toString(),
      }));
    }
  }, [pet, selectedPetId]);

  const handlePetChange = (e) => {
    const selectedId = e.target.value
    console.log("Selected Pet ID from select: ", selectedId)
    setSelectedPetId(selectedId)

    setFormData((prevData) => ({
      ...prevData,
      SelectedPet: selectedId,
    }))
  }

  // Handle photo file changes
  const handlePhotoChange = (e) => {
    const { name, files } = e.target
    if (files[0]) {
      setPhotos((prev) => ({
        ...prev,
        [name]: files[0] || null,
      }))

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreviews((prev) => ({
          ...prev,
          [name]: reader.result,
        }))
      }
      reader.readAsDataURL(files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.SelectedPet) {
      alert("Please select a pet to adopt.")
      return
    }

    // Check all photo fields are filled
    const missingPhotos = Object.entries(photos).filter(([key, file]) => !file)
    if (missingPhotos.length > 0) {
      alert("Please upload all required home and ID photos before submitting.")
      return
    }

    // Check terms agreement
    if (!termsAgreement) {
      alert("You must accept the Terms and Conditions to submit your application.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Please log in to submit an adoption application.")
        return
      }

      // Use FormData for file upload
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value)
      })
      Object.entries(photos).forEach(([key, file]) => {
        if (file) form.append(key, file)
      })

      const response = await fetch("http://localhost:5001/submit-form", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      })

      if (response.ok) {
        setShowSuccess(true)
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to submit application.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred while submitting your application.")
    }
  }

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  // Group photo fields for better organization
  const photoGroups = [
    {
      title: "Home Exterior",
      fields: [
        { name: "front_house", label: "Front of House", icon: <Home size={16} /> },
        { name: "street_photo", label: "Street Photo", icon: <Home size={16} /> },
        { name: "front_backyard", label: "Front/Backyard", icon: <Home size={16} /> },
      ],
    },
    {
      title: "Home Interior",
      fields: [
        { name: "living_room", label: "Living Room", icon: <Home size={16} /> },
        { name: "dining_area", label: "Dining Area", icon: <Home size={16} /> },
        { name: "kitchen", label: "Kitchen", icon: <Home size={16} /> },
        { name: "bedroom", label: "Bedroom", icon: <Home size={16} /> },
        { name: "windows", label: "Windows", icon: <Home size={16} /> },
      ],
    },
    {
      title: "Identification",
      fields: [{ name: "valid_id", label: "Valid ID", icon: <FileText size={16} /> }],
    },
  ]

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      {showSuccess ? (
        <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
          <div className="bg-[#b8be5a] p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center">
              <PawPrint className="mr-2" size={24} />
              Application Submitted!
            </h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-[#f8faee] dark:bg-[#b8be5a]/20 rounded-full flex items-center justify-center">
                <Heart className="text-[#b8be5a]" size={32} />
              </div>
              <p className="text-gray-700 dark:text-gray-200 text-lg">
                Thank you for applying, we will review your application and hand it to the shelter you've adopted with.
                Please give us 1-2 working business days.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 flex justify-center border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#b8be5a] text-white rounded-lg hover:bg-[#a0a64e] transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#b8be5a] to-[#a0a64e] p-6 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold flex items-center">
              <PawPrint className="mr-2" size={24} />
              Adoption Application
            </h1>
            <p className="mt-1 opacity-90">Find your perfect furry companion</p>

            {/* Progress bar */}
            <div className="mt-6 bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300 ease-in-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <div className={`flex flex-col items-center ${currentStep >= 1 ? "text-white" : "text-white/60"}`}>
                <span className="hidden sm:block text-white">Personal Info</span>
                <span className="sm:hidden">1</span>
                {currentStep === 1 && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>}
              </div>
              <div className={`flex flex-col items-center ${currentStep >= 2 ? "text-white" : "text-white/60"}`}>
                <span className="hidden sm:block text-white">Pet Selection</span>
                <span className="sm:hidden">2</span>
                {currentStep === 2 && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>}
              </div>
              <div className={`flex flex-col items-center ${currentStep >= 3 ? "text-white" : "text-white/60"}`}>
                <span className="hidden sm:block text-white">Living Conditions</span>
                <span className="sm:hidden">3</span>
                {currentStep === 3 && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>}
              </div>
              <div className={`flex flex-col items-center ${currentStep >= 4 ? "text-white" : "text-white/60"}`}>
                <span className="hidden sm:block text-white">Photos & ID</span>
                <span className="sm:hidden">4</span>
                {currentStep === 4 && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center space-x-2 pb-2 border-b border-[#e8ecd4] dark:border-gray-700">
                    <div className="bg-[#b8be5a] p-1.5 rounded-md">
                      <User className="text-white" size={16} />
                    </div>
                    <h2 className="font-bold text-lg text-gray-800 dark:text-white">Applicant's Information</h2>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">First Name</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="FirstName"
                            value={formData.FirstName}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                            required
                          />
                        </div>
                        {errors.FirstName && <p className="text-red-500 text-sm">{errors.FirstName}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">Last Name</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="LastName"
                            placeholder="Enter your last name"
                            value={formData.LastName}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                            required
                          />
                        </div>
                        {errors.LastName && <p className="text-red-500 text-sm">{errors.LastName}</p>}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">Address</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Home className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="Address"
                            placeholder="Eg: Blk 218, Lot 3, Phase 8, North Fairview, Quezon City"
                            value={formData.Address}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                            required
                          />
                        </div>
                        {errors.Address && <p className="text-red-500 text-sm">{errors.Address}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">Phone</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="Phone"
                            placeholder="Enter your phone number"
                            value={formData.Phone}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                            required
                          />
                        </div>
                        {errors.Phone && <p className="text-red-500 text-sm">{errors.Phone}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">Email</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="Email"
                            placeholder="Enter your email address"
                            value={formData.Email}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                            required
                          />
                        </div>
                        {errors.Email && <p className="text-red-500 text-sm">{errors.Email}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">Occupation</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="Occupation"
                            placeholder="Enter your current occupation, N/A if none or retired"
                            value={formData.Occupation}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">Company/Business Name</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="CompanyName"
                            placeholder="N/A if unemployed"
                            value={formData.CompanyName}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                            required
                          />
                        </div>
                        {errors.CompanyName && <p className="text-red-500 text-sm">{errors.CompanyName}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">Social Media Profile</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Instagram className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="SocProfile"
                            placeholder="Enter FB/Twitter/IG Link"
                            value={formData.SocProfile}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-[#b8be5a]">Status</label>
                        <div className="flex flex-wrap gap-3 mt-2">
                          {["Single", "Married", "Others"].map((status) => (
                            <label
                              key={status}
                              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                                formData.Status === status
                                  ? "bg-[#f8faee] border-[#b8be5a] dark:bg-[#b8be5a]/20 dark:border-[#b8be5a]"
                                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#b8be5a]"
                              }`}
                            >
                              <input
                                type="radio"
                                name="Status"
                                value={status}
                                checked={formData.Status === status}
                                onChange={handleChange}
                                className="text-[#b8be5a] focus:ring-[#b8be5a]"
                              />
                              <span className="text-gray-800 dark:text-white">{status}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center space-x-2 pb-2 border-b border-[#e8ecd4] dark:border-gray-700">
                    <div className="bg-[#b8be5a] p-1.5 rounded-md">
                      <PawPrint className="text-white" size={16} />
                    </div>
                    <h2 className="font-bold text-lg text-gray-800 dark:text-white">Pet Selection</h2>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">Select a pet to adopt</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Heart className="h-4 w-4 text-gray-400" />
                          </div>
                          <select
                            name="SelectedPet"
                            value={selectedPetId}
                            onChange={handlePetChange}
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all appearance-none bg-no-repeat bg-right"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999999' strokeWidth='2'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                              backgroundSize: "1.5rem",
                              paddingRight: "2.5rem",
                            }}
                            required
                          >
                            <option value="">Select a pet</option>
                            {petData.map((pet) => (
                              <option key={pet.pet_id} value={pet.pet_id.toString()}>
                                {pet.name} - ({pet.age || "N/A"})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">Why do you want to adopt a pet?</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                          {[
                            { value: "Companionship", icon: "👥", description: "For friendship and company" },
                            { value: "Family Pet", icon: "👨‍👩‍👧‍👦", description: "For our family" },
                            { value: "Emotional Support", icon: "❤️", description: "For emotional support" },
                            { value: "Rescue", icon: "🏠", description: "To give a home to a pet in need" },
                          ].map((reason) => (
                            <label
                              key={reason.value}
                              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                                formData.ReasonToAdopt === reason.value
                                  ? "bg-[#f8faee] border-[#b8be5a] dark:bg-[#b8be5a]/20 dark:border-[#b8be5a]"
                                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#b8be5a]"
                              }`}
                            >
                              <input
                                type="radio"
                                name="ReasonToAdopt"
                                value={reason.value}
                                checked={formData.ReasonToAdopt === reason.value}
                                onChange={handleChange}
                                className="text-[#b8be5a] focus:ring-[#b8be5a] mr-3"
                              />
                              <div className="text-gray-800 dark:text-white">
                                <div className="flex items-center">
                                  <span className="mr-2 text-xl">{reason.icon}</span>
                                  <span className="font-medium dark:text-[#b8be5a]">{reason.value}</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{reason.description}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">Experience with pets</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <PawPrint className="h-4 w-4 text-gray-400" />
                          </div>
                          <select
                            name="ExperienceWithPets"
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all appearance-none bg-no-repeat bg-right"
                            value={formData.ExperienceWithPets}
                            onChange={handleChange}
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999999' strokeWidth='2'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                              backgroundSize: "1.5rem",
                              paddingRight: "2.5rem",
                            }}
                          >
                            <option value="">Select your experience level</option>
                            <option value="First-time pet owner">First-time pet owner</option>
                            <option value="Had 1-2 pets before">Had 1-2 pets before</option>
                            <option value="Experienced pet owner">Experienced pet owner</option>
                            <option value="Professional experience">
                              Professional experience (vet, trainer, etc.)
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center space-x-2 pb-2 border-b border-[#e8ecd4] dark:border-gray-700">
                    <div className="bg-[#b8be5a] p-1.5 rounded-md">
                      <Home className="text-white" size={16} />
                    </div>
                    <h2 className="font-bold text-lg text-gray-800 dark:text-white">Living Conditions</h2>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                            <span className="dark:text-[#b8be5a]">Who do you live with?</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Users className="h-4 w-4 text-gray-400" />
                            </div>
                            <select
                              name="LivingCondition"
                              className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all appearance-none bg-no-repeat bg-right"
                              value={formData.LivingCondition}
                              onChange={handleChange}
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999999' strokeWidth='2'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundSize: "1.5rem",
                                paddingRight: "2.5rem",
                              }}
                            >
                              <option value="">Select who you live with</option>
                              <option value="Living Alone">Living alone</option>
                              <option value="Spouse">Spouse</option>
                              <option value="Parents">Parents</option>
                              <option value="Children over 18">Children over 18</option>
                              <option value="Children below 18">Children below 18</option>
                              <option value="Relatives">Relatives</option>
                              <option value="Roommate(s)">Roommate(s)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                            <span className="dark:text-[#b8be5a]">Are any members of your household allergic to animals?</span>
                          </label>
                          <div className="flex space-x-4 mt-2">
                            {["Yes", "No"].map((option) => (
                              <label
                                key={option}
                                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                                  formData.AllergicHouseholds === option
                                    ? "bg-[#f8faee] border-[#b8be5a] dark:bg-[#b8be5a]/20 dark:border-[#b8be5a]"
                                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#b8be5a]"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="AllergicHouseholds"
                                  value={option}
                                  checked={formData.AllergicHouseholds === option}
                                  onChange={handleChange}
                                  className="text-[#b8be5a] focus:ring-[#b8be5a]"
                                />
                                <span className="text-gray-800 dark:text-white">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">Who will be responsible for feeding, grooming, and generally caring for your pet?</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="PetCareResponsible"
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                            value={formData.PetCareResponsible}
                            onChange={handleChange}
                            placeholder="E.g., Myself, My spouse and I, etc."
                            required
                          />
                        </div>
                        {errors.PetCareResponsible && (
                          <p className="text-red-500 text-sm">{errors.PetCareResponsible}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">Who will be financially responsible for your pet's needs?</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="FinancialResponsible"
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                            value={formData.FinancialResponsible}
                            onChange={handleChange}
                            placeholder="E.g., Myself, My parents, etc."
                            required
                          />
                        </div>
                        {errors.FinancialResponsible && (
                          <p className="text-red-500 text-sm">{errors.FinancialResponsible}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">Who will look after your pet if you go on vacation or in case of emergency?</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Plane className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="VacationCare"
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                            value={formData.VacationCare}
                            onChange={handleChange}
                            placeholder="E.g., My parents, Pet boarding facility, etc."
                            required
                          />
                        </div>
                        {errors.VacationCare && <p className="text-red-500 text-sm">{errors.VacationCare}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">How many hours in an average workday will your pet be left alone?</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            name="AloneHours"
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                            value={formData.AloneHours}
                            onChange={handleChange}
                            placeholder="Enter number of hours"
                            min="0"
                            max="24"
                            required
                          />
                        </div>
                        {errors.AloneHours && <p className="text-red-500 text-sm">{errors.AloneHours}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">What steps will you take to introduce your new pet to their new surroundings?</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="IntroSteps"
                          className="px-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                          value={formData.IntroSteps}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Describe how you'll help your new pet adjust to your home"
                          required
                        ></textarea>
                        {errors.IntroSteps && <p className="text-red-500 text-sm">{errors.IntroSteps}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                          <span className="dark:text-[#b8be5a]">Does everyone in the family support your decision to adopt a pet?</span>
                        </label>
                        <div className="flex space-x-4 mt-2">
                          {["Yes", "No"].map((option) => (
                            <label
                              key={option}
                              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                                formData.FamilySupport === option
                                  ? "bg-[#f8faee] border-[#b8be5a] dark:bg-[#b8be5a]/20 dark:border-[#b8be5a]"
                                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#b8be5a]"
                              }`}
                            >
                              <input
                                type="radio"
                                name="FamilySupport"
                                value={option}
                                checked={formData.FamilySupport === option}
                                onChange={handleChange}
                                className="text-[#b8be5a] focus:ring-[#b8be5a]"
                              />
                              <span className="text-gray-800 dark:text-white">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {formData.FamilySupport === "No" && (
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 space-x-1">
                            <span>Please explain</span>
                          </label>
                          <textarea
                            className="px-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                            rows="3"
                            name="SupportExplanation"
                            placeholder="Please explain why not everyone supports the adoption"
                            value={formData.SupportExplanation}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center space-x-2 pb-2 border-b border-[#e8ecd4] dark:border-gray-700">
                    <div className="bg-[#b8be5a] p-1.5 rounded-md">
                      <Camera className="text-white" size={16} />
                    </div>
                    <h2 className="font-bold text-lg text-gray-800 dark:text-white">Home & ID Photos</h2>
                  </div>

                  <div className="bg-[#f8faee] dark:bg-[#b8be5a]/10 p-4 rounded-lg border border-[#e8ecd4] dark:border-[#b8be5a]/20 text-gray-700 dark:text-gray-200 text-sm mb-4 flex items-start">
                    <Shield className="h-5 w-5 text-[#b8be5a] mr-2 mt-0.5 shrink-0" />
                    <div>
                      <strong className="font-medium">Privacy & Safety:</strong> These photos are only visible to the
                      admin and the shelter for adoption verification. They will never be shared publicly. Please avoid
                      including sensitive information (like house numbers, street names, or faces) if you are concerned
                      about privacy.
                    </div>
                  </div>

                  {photoGroups.map((group) => (
                    <div
                      key={group.title}
                      className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-600"
                    >
                      <h3 className="text-md font-semibold mb-4 text-gray-800 dark:text-white">{group.title}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {group.fields.map((field) => (
                          <div
                            key={field.name}
                            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-600"
                          >
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-2">
                              {field.icon}
                              <span className="ml-1.5 dark:text-[#b8be5a]">{field.label}</span>
                            </label>

                            {photoPreviews[field.name] ? (
                              <div className="mb-3 relative group">
                                <img
                                  src={photoPreviews[field.name] || "/placeholder.svg"}
                                  alt={field.label}
                                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setPhotos((prev) => ({ ...prev, [field.name]: null }))
                                        setPhotoPreviews((prev) => {
                                          const newPreviews = { ...prev }
                                          delete newPreviews[field.name]
                                          return newPreviews
                                        })
                                      }}
                                      className="bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-md text-red-500"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="mb-3 flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                                <div className="text-center p-4">
                                  <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Click to upload {field.label}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="relative">
                              <input
                                type="file"
                                id={`file-${field.name}`}
                                name={field.name}
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                              />
                              <label
                                htmlFor={`file-${field.name}`}
                                className="flex items-center justify-center w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
                              >
                                <Upload className="h-4 w-4 mr-2 text-[#b8be5a]" />
                                {photoPreviews[field.name] ? "Replace" : "Upload"}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center space-x-2 mt-4 bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                    <input
                      type="checkbox"
                      name="termsAgreement"
                      id="termsAgreement"
                      className="w-5 h-5 text-[#b8be5a] border-gray-300 rounded focus:ring-[#b8be5a] dark:border-gray-600 dark:bg-gray-800"
                      checked={termsAgreement}
                      onChange={(e) => setTermsAgreement(e.target.checked)}
                    />
                    <label htmlFor="termsAgreement" className="text-sm text-gray-700 dark:text-gray-200">
                      I agree to the{" " }
                      <a
                        href="/terms"
                        className="text-[#b8be5a] hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms and Conditions
                      </a>

                      {" "}and{" "}
                      <a href="/privacy" className="text-[#b8be5a] hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer with navigation buttons */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 flex justify-between border-t border-gray-200 dark:border-gray-600">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center space-x-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="dark:text-[#b8be5a]">Previous</span>
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 px-5 py-2.5 bg-[#b8be5a] text-white rounded-lg hover:bg-[#a0a64e] transition-colors ml-auto"
              >
                <span className="text-white">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2.5 bg-[#b8be5a] text-white rounded-lg hover:bg-[#a0a64e] transition-colors ml-auto"
                onClick={handleSubmit}
              >
                <span className="text-white">Submit Application</span>
                <Send size={18} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdoptFormModal
