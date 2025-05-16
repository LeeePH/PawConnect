"use client"

import {
  X,
  Heart,
  Mail,
  Calendar,
  FileText,
  BarChart3,
  Edit,
  Clock,
  ChevronRight,
  Award,
  Home,
  User,
} from "lucide-react"
import { useState } from "react"
import EditApplicationModal from "./EditApplicationModal"

const ProfileModal = ({
  isOpen,
  onClose,
  userData,
  applications,
  onApplicationClick,
  onSettingsClick,
  getStatusColor,
  onEditApplication,
  isSubmittingEdit,
  onEditProfile,
}) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [editApplication, setEditApplication] = useState(null)

  if (!isOpen) return null

  const handleEditClick = (application) => {
    setEditApplication(application)
    setShowEditModal(true)
  }

  const handleEditSubmit = async (form) => {
    if (onEditApplication && editApplication) {
      await onEditApplication(editApplication.application_id, form)
      setShowEditModal(false)
      setEditApplication(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full my-6 relative border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header with brand color */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Pet Lover Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none bg-gray-100 dark:bg-gray-700 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[calc(100vh-180px)] overflow-y-auto">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="col-span-1">
              {/* User Info Section */}
              <div className="mb-6 bg-gradient-to-r from-[#f8faee] to-[#f0f3e0] dark:from-gray-700 dark:to-gray-800 rounded-xl p-5 border-l-4 border-[#b8be5a] shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-[#b8be5a] h-12 w-12 rounded-full flex items-center justify-center text-white shrink-0">
                    <User size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white ml-3">{userData.name || "User"}</h4>
                </div>

                <div className="space-y-2.5">
                  {userData.email && (
                    <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                      <Mail size={14} className="mr-2 text-[#b8be5a] mt-0.5 shrink-0" />
                      <div className="flex flex-col sm:flex-row sm:flex-wrap break-all">
                        <span className="font-medium text-[#6D712E] dark:text-[#b8be5a] mr-1">Email:</span>
                        <span className="dark:text-white">{userData.email}</span>
                      </div>
                    </div>
                  )}

                  {userData.created_at && (
                    <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                      <Calendar size={14} className="mr-2 text-[#b8be5a] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-[#6D712E] dark:text-[#b8be5a]">Member since: </span>
                        <span className="dark:text-white">
                          {(() => {
                            const date = new Date(userData.created_at)
                            if (!isNaN(date)) {
                              return date.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            }
                            return userData.created_at
                          })()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Adoption Stats */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-[#b8be5a]" />
                  Adoption Activity
                </h5>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="flex justify-center mb-1">
                      <Award className="h-5 w-5 text-[#b8be5a]" />
                    </div>
                    <div className="text-2xl font-bold text-[#b8be5a]">2</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Adopted</div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="flex justify-center mb-1">
                      <Heart className="h-5 w-5 text-[#b8be5a]" />
                    </div>
                    <div className="text-2xl font-bold text-[#b8be5a]">5</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Favorites</div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="flex justify-center mb-1">
                      <Home className="h-5 w-5 text-[#b8be5a]" />
                    </div>
                    <div className="text-2xl font-bold text-[#b8be5a]">12</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Visits</div>
                  </div>
                </div>
              </div>

              {/* Favorite Pets */}
              <div>
                <h5 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-[#b8be5a]" />
                  Favorite Pets
                </h5>
                {userData.favoritePets && userData.favoritePets.length > 0 ? (
                  <div className="space-y-2">
                    {userData.favoritePets.map((pet, idx) => (
                      <div
                        key={pet.pet_id || idx}
                        className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-600 flex items-center"
                      >
                        <div className="bg-[#f8faee] dark:bg-gray-600 h-8 w-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold text-[#6D712E] dark:text-white">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-gray-800 dark:text-white">{pet.name}</span>
                          <span className="text-gray-500 dark:text-gray-300 text-sm ml-1">({pet.type})</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-4 text-center text-gray-600 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-gray-600">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-500" />
                    <p className="text-sm">
                      No favorite pets yet. Click the heart icon on a pet card to add favorites!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Application Status */}
            <div className="col-span-2">
              <div>
                <h5 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#b8be5a]" />
                  Application Status
                </h5>
                {applications.length > 0 ? (
                  <div className="space-y-3">
                    {applications.map((application) => (
                      <div
                        key={application.application_id}
                        className="bg-white dark:bg-gray-700 rounded-xl p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm border border-gray-100 dark:border-gray-600"
                        onClick={() => onApplicationClick(application)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h6 className="font-medium text-gray-800 dark:text-white">{application.pet_name}</h6>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{application.pet_type}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}
                          >
                            {application.status || "Pending"}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          Applied on: {new Date(application.created_at).toLocaleDateString()}
                        </div>

                        {/* Timeline */}
                        {application.status_history && application.status_history.length > 0 && (
                          <div className="mt-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                            <h6 className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">Timeline</h6>
                            <div className="space-y-2 relative">
                              {application.status_history
                                .slice()
                                .reverse()
                                .map((item, idx) => (
                                  <div key={item.id || idx} className="flex items-start relative">
                                    <div className="relative mr-3">
                                      <div className="w-3 h-3 bg-[#b8be5a] rounded-full mt-1.5"></div>
                                      {idx !== application.status_history.length - 1 && (
                                        <div className="absolute top-3 left-1.5 w-0.5 h-full -ml-px bg-[#e8ecd4] dark:bg-[#6D712E]/30"></div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <span className="text-xs font-medium text-gray-800 dark:text-white capitalize">
                                        {item.status.replace(/_/g, " ")}
                                      </span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                        {new Date(item.changed_at).toLocaleString()}
                                      </span>
                                      {item.notes && (
                                        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 bg-white dark:bg-gray-700 p-2 rounded-md border border-gray-100 dark:border-gray-600">
                                          {item.notes}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditClick(application)
                            }}
                            className="flex items-center text-xs font-medium text-[#b8be5a] hover:text-[#6D712E] transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Edit Application
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-4 text-center text-gray-600 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-gray-600">
                    <FileText className="h-10 w-10 mx-auto mb-2 text-gray-300 dark:text-gray-500" />
                    <p>No applications submitted yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onEditProfile || onSettingsClick}
              className="px-4 py-2 bg-[#b8be5a] text-white rounded-lg hover:bg-[#a0a64e] transition-colors shadow-sm font-medium flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm font-medium"
            >
              Close
            </button>
          </div>

          {/* Edit Application Modal */}
          {showEditModal && editApplication && (
            <EditApplicationModal
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false)
                setEditApplication(null)
              }}
              application={editApplication}
              onSubmit={handleEditSubmit}
              isSubmitting={isSubmittingEdit}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
