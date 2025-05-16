"use client"

import { useState } from "react"
import {
  X,
  Save,
  Upload,
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Building,
  Heart,
  FileText,
  ImageIcon,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Instagram,
  Eye,
} from "lucide-react"

const photoFields = [
  { name: "front_house", label: "Front of House", icon: <ImageIcon size={16} /> },
  { name: "street_photo", label: "Street Photo", icon: <ImageIcon size={16} /> },
  { name: "living_room", label: "Living Room", icon: <ImageIcon size={16} /> },
  { name: "dining_area", label: "Dining Area", icon: <ImageIcon size={16} /> },
  { name: "kitchen", label: "Kitchen", icon: <ImageIcon size={16} /> },
  { name: "bedroom", label: "Bedroom", icon: <ImageIcon size={16} /> },
  { name: "windows", label: "Windows", icon: <ImageIcon size={16} /> },
  { name: "front_backyard", label: "Front/Backyard", icon: <ImageIcon size={16} /> },
  { name: "valid_id", label: "Valid ID", icon: <FileText size={16} /> },
]

const EditApplicationModal = ({ isOpen, onClose, application, onSubmit, isSubmitting, onSuccess }) => {
  const [form, setForm] = useState({
    first_name: application?.first_name || "",
    last_name: application?.last_name || "",
    address: application?.address || "",
    phone: application?.phone || "",
    email: application?.email || "",
    occupation: application?.occupation || "",
    company_name: application?.company_name || "",
    soc_profile: application?.soc_profile || "",
    civil_status: application?.civil_status || "",
    reason_to_adopt: application?.reason_to_adopt || "",
    experience_with_pets: application?.experience_with_pets || "",
    user_remark: "",
  })

  // Track new photo files
  const [photoFiles, setPhotoFiles] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState({})

  // Map of current photos by type
  const currentPhotos = {}
  if (application && application.photos) {
    application.photos.forEach((photo) => {
      currentPhotos[photo.photo_type] = photo.file_path
    })
  }

  if (!isOpen || !application) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e, field) => {
    const file = e.target.files[0]
    if (file) {
      setPhotoFiles((prev) => ({ ...prev, [field]: file }))

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview((prev) => ({
          ...prev,
          [field]: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    // Use FormData for file upload
    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value)
    })
    // Attach new photo files
    Object.entries(photoFiles).forEach(([field, file]) => {
      if (file) data.append(field, file)
    })
    await onSubmit(data)
    setTimeout(() => {
      setShowSuccess(true)
      setSubmitting(false)
      // Call onSuccess after a delay to allow parent to close modals
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 5000)
      }
    }, 1000)
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center border border-gray-200 dark:border-gray-700">
          <div className="bg-[#f8faee] dark:bg-[#b8be5a]/20 rounded-full p-4 mb-4">
            <CheckCircle className="h-8 w-8 text-[#b8be5a]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Application Updated!</h2>
          <p className="text-gray-700 dark:text-gray-200 mb-6 text-center">
            Your changes have been submitted for evaluation. You cannot edit this application again unless requested by
            the admin.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#b8be5a] text-white rounded-lg hover:bg-[#a0a64e] transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 relative">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-gradient-to-r from-[#f8faee] to-[#f0f3e0] dark:from-gray-800 dark:to-gray-700 z-10">
          <div className="flex items-center">
            <div className="bg-[#b8be5a] p-2 rounded-lg shadow-sm mr-3">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Edit Application</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none bg-white/80 dark:bg-gray-700/80 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6" encType="multipart/form-data">
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-600">
              <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-[#b8be5a]" />
                Personal Information
              </h4>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Phone</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-600">
              <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-[#b8be5a]" />
                Employment & Additional Information
              </h4>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                      Occupation
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="occupation"
                        value={form.occupation}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                      Company Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="company_name"
                        value={form.company_name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Social Profile
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Instagram className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="soc_profile"
                      value={form.soc_profile}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent transition-all"
                      placeholder="Instagram, Facebook, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                      Civil Status
                    </label>
                    <select
                      name="civil_status"
                      value={form.civil_status}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent transition-all"
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pet Information */}
            <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-600">
              <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <Heart className="h-5 w-5 mr-2 text-[#b8be5a]" />
                Pet Information
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Reason to Adopt
                  </label>
                  <textarea
                    name="reason_to_adopt"
                    value={form.reason_to_adopt}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent transition-all"
                    placeholder="Why do you want to adopt this pet?"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Pet Experience
                  </label>
                  <textarea
                    name="experience_with_pets"
                    value={form.experience_with_pets}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent transition-all"
                    placeholder="Describe your experience with pets"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Photo Uploads */}
            <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-600">
              <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-[#b8be5a]" />
                Required Documents & Photos
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {photoFields.map((field) => (
                  <div
                    key={field.name}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-600"
                  >
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center mb-2">
                      {field.icon}
                      <span className="ml-1.5">{field.label}</span>
                    </label>

                    <div className="relative">
                      {/* Current or new preview */}
                      {(photoPreview[field.name] || currentPhotos[field.name]) && (
                        <div className="mb-2 relative group">
                          <img
                            src={photoPreview[field.name] || `http://localhost:5001${currentPhotos[field.name]}`}
                            alt={field.label}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
                            <a
                              href={photoPreview[field.name] || `http://localhost:5001${currentPhotos[field.name]}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="opacity-0 group-hover:opacity-100 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-md transition-opacity"
                            >
                              <Eye className="h-4 w-4 text-[#b8be5a]" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* File input */}
                      <div className="relative">
                        <input
                          type="file"
                          id={`file-${field.name}`}
                          accept="image/*"
                          onChange={(e) => handlePhotoChange(e, field.name)}
                          className="hidden"
                        />
                        <label
                          htmlFor={`file-${field.name}`}
                          className="flex items-center justify-center w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                          <Upload className="h-4 w-4 mr-2 text-[#b8be5a]" />
                          {currentPhotos[field.name] || photoPreview[field.name] ? "Replace" : "Upload"}
                        </label>
                      </div>

                      {!currentPhotos[field.name] && !photoPreview[field.name] && (
                        <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Required
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Remarks */}
            <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-600">
              <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-[#b8be5a]" />
                Your Remarks
              </h4>

              <div>
                <textarea
                  name="user_remark"
                  value={form.user_remark}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#b8be5a] focus:border-transparent transition-all"
                  placeholder="Add any additional information or message for the admin"
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || submitting}
                className="px-5 py-2.5 bg-[#b8be5a] text-white rounded-lg hover:bg-[#a0a64e] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {submitting ? "Submitting..." : isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditApplicationModal
