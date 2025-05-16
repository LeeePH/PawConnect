"use client"

import {
  X, Edit, Eye, Calendar,
  FileText,
  MessageSquare,
  Paperclip,
  XCircle,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Building,
  Heart,
  FileImage,
} from "lucide-react"
import { useState } from "react"
import EditApplicationModal from "./EditApplicationModal"

const ApplicationModal = ({
  isOpen,
  onClose,
  application,
  getStatusColor,
  onCancel,
  userRemark,
  setUserRemark,
  isSubmittingRemark,
  onSubmitRemark,
  onEditApplication,
  isSubmittingEdit,
}) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [remarkText, setRemarkText] = useState(userRemark || "")

  if (!isOpen || !application) return null

  const handleEditClick = () => {
    setShowEditModal(true)
  }

  const handleEditSubmit = async (form) => {
    if (onEditApplication) {
      await onEditApplication(application.application_id, form)
    }
  }

  // Handler to close both modals after success
  const handleEditSuccess = () => {
    setShowEditModal(false)
    if (onClose) onClose()
  }


  // Function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "positive":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "negative":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "pending":
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#f8faee] to-[#f0f3e0] dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center">
            <div className="bg-[#b8be5a] p-2.5 rounded-lg shadow-sm mr-3">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Application Details</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none bg-white/80 dark:bg-gray-700/80 p-2 rounded-full transition-colors shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Pet Info and Application Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pet Information */}
              <div className="bg-gradient-to-r from-[#f8faee] to-[#f0f3e0] dark:from-gray-700 dark:to-gray-800 rounded-xl p-5 shadow-sm border border-[#e8ecd4] dark:border-gray-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white">{application.pet_name}</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{application.pet_type}</p>

                    <div className="flex items-center mt-3 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="h-4 w-4 mr-1.5 text-[#b8be5a]" />
                      Applied on:{" "}
                      {new Date(application.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}
                  >
                    {application.status || ""}
                  </span>
                </div>
              </div>

              {/* Application Details */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#b8be5a]" />
                  Application Details
                </h4>
                <div className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-600">
                    {/* Personal Information */}
                    <div className="p-4">
                      <h5 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
                        Personal Information
                      </h5>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <User className="h-4 w-4 text-[#b8be5a] mt-0.5 mr-2 shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Full Name</div>
                            <div className="text-sm text-gray-800 dark:text-white">
                              {application.first_name} {application.last_name}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-[#b8be5a] mt-0.5 mr-2 shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Address</div>
                            <div className="text-sm text-gray-800 dark:text-white">{application.address}</div>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Phone className="h-4 w-4 text-[#b8be5a] mt-0.5 mr-2 shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Phone</div>
                            <div className="text-sm text-gray-800 dark:text-white">{application.phone}</div>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Mail className="h-4 w-4 text-[#b8be5a] mt-0.5 mr-2 shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</div>
                            <div className="text-sm text-gray-800 dark:text-white">{application.email}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Employment & Additional Info */}
                    <div className="p-4">
                      <h5 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
                        Employment & Additional Info
                      </h5>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Briefcase className="h-4 w-4 text-[#b8be5a] mt-0.5 mr-2 shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Occupation</div>
                            <div className="text-sm text-gray-800 dark:text-white">{application.occupation}</div>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Building className="h-4 w-4 text-[#b8be5a] mt-0.5 mr-2 shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Company</div>
                            <div className="text-sm text-gray-800 dark:text-white">{application.company_name}</div>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <User className="h-4 w-4 text-[#b8be5a] mt-0.5 mr-2 shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Civil Status</div>
                            <div className="text-sm text-gray-800 dark:text-white">{application.civil_status}</div>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Clock className="h-4 w-4 text-[#b8be5a] mt-0.5 mr-2 shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Application ID</div>
                            <div className="text-sm text-gray-800 dark:text-white">{application.application_id}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reason to Adopt & Experience */}
                  <div className="border-t border-gray-200 dark:border-gray-600 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <Heart className="h-4 w-4 text-[#b8be5a] mr-2" />
                          <h5 className="text-sm font-semibold text-gray-800 dark:text-white">Reason to Adopt</h5>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          {application.reason_to_adopt}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center mb-2">
                          <Paperclip className="h-4 w-4 text-[#b8be5a] mr-2" />
                          <h5 className="text-sm font-semibold text-gray-800 dark:text-white">Pet Experience</h5>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          {application.experience_with_pets}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Uploaded Photos Section */}
              {application.photos && application.photos.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                    <FileImage className="h-5 w-5 mr-2 text-[#b8be5a]" />
                    Uploaded Documents & Photos
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {application.photos.map((photo) => (
                        <div key={photo.id} className="group relative">
                          <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600">
                            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-2 rounded-t-lg z-10">
                              <span className="text-xs font-medium text-white capitalize">
                                {photo.photo_type.replace(/_/g, " ")}
                              </span>
                            </div>
                            <a
                              href={`http://localhost:5001${photo.file_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block relative aspect-square"
                            >
                              <img
                                src={`http://localhost:5001${photo.file_path}`}
                                alt={photo.photo_type}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="bg-white dark:bg-gray-800 rounded-full p-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                  <Eye className="h-4 w-4 text-[#b8be5a]" />
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Admin Remarks */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-[#b8be5a]" />
                  Admin Remarks
                </h4>

                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 overflow-hidden">
                  <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
                    {application.status_history && application.status_history.length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-600">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-gray-800 dark:text-white text-sm">Admin</div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeColor(application.status)}`}>
                            {application.status === "positive"
                              ? "Approved"
                              : application.status === "negative"
                                ? "Rejected"
                                : application.status === "for compliance"
                                  ? "For Compliance"
                                  : ""}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {application.status_history[application.status_history.length - 1].notes || "No remarks provided"}
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(application.status_history[application.status_history.length - 1].changed_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Replace Add Remark Form with Summary Section */}
                  <div className="border-t border-gray-200 dark:border-gray-600 p-4">
                    <h5 className="text-sm font-medium text-gray-800 dark:text-white mb-2">Application Summary</h5>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-[#b8be5a]" />
                        <span className="dark:text-white">Submitted: {new Date(application.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <FileText className="h-4 w-4 mr-2 text-[#b8be5a]" />
                        <span className="dark:text-white">Application ID: {application.application_id}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <User className="h-4 w-4 mr-2 text-[#b8be5a]" />
                        <span className="dark:text-white">Applicant: {application.first_name} {application.last_name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-600">
          {application.status === "for compliance" && (
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-[#b8be5a] text-white rounded-lg hover:bg-[#a0a64e] transition-colors shadow-sm font-medium flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Application
            </button>
          )}
          {application.status !== "canceled" && (
            <button
              onClick={() => onCancel(application.application_id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm font-medium flex items-center"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Application
            </button>
          )}
        </div>

        {/* Edit Application Modal */}
        {showEditModal && (
          <EditApplicationModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            application={application}
            onSubmit={handleEditSubmit}
            isSubmitting={isSubmittingEdit}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </div>
  )
}

export default ApplicationModal
