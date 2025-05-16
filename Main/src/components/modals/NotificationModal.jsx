import React from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

const statusIcons = {
  approved: <CheckCircle className="h-6 w-6 text-green-500" />,
  pending: <Info className="h-6 w-6 text-yellow-500" />,
  rejected: <XCircle className="h-6 w-6 text-red-500" />,
  "for compliance": <AlertTriangle className="h-6 w-6 text-purple-500" />,
  evaluate: <Info className="h-6 w-6 text-blue-500" />,
  default: <Info className="h-6 w-6 text-gray-500" />,
};

const NotificationModal = ({ isOpen, onClose, title, message, statusType }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 border border-gray-200 dark:border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 mb-3">
          {statusIcons[statusType] || statusIcons.default}
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
        </div>
        <div className="text-gray-700 dark:text-gray-200 text-sm mb-2">{message}</div>
      </div>
    </div>
  );
};

export default NotificationModal; 