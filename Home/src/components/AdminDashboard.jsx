"use client"
import { useState, useEffect, useCallback } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Bar, Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js"
import {
  LayoutDashboard,
  PawPrint,
  Home,
  ClipboardList,
  Plus,
  X,
  Edit,
  Trash2,
  RefreshCw,
  Moon,
  Sun,
  LogOut
} from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend)
import axios from "axios";

const API_URL = "http://localhost:5000";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("main")
  const [pets, setPets] = useState([])
  const [shelters, setShelters] = useState([])
  const [addPetModal, setAddPetModal] = useState(false)
  const [addShelterModal, setAddShelterModal] = useState(false)
  const [editPet, setEditPet] = useState(null)
  const [editShelter, setEditShelter] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // statistics
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPets, setTotalPets] = useState(0)
  const [totalShelters, setTotalShelters] = useState(0)
  const [logHistory, setLogHistory] = useState([])
  const [userRegistrations, setUserRegistrations] = useState([])
  const [petTypes, setPetTypes] = useState({})
  const [shelterLocations, setShelterLocations] = useState({})
  const [totalApplications, setTotalApplications] = useState(0)
  const [applicationsByStatus, setApplicationsByStatus] = useState([])

  const [newPet, setNewPet] = useState({
    name: "",
    type: "",
    location: "",
    gender: "",
    age: "",
    size: "",
    description: "",
    long_desc: "",
    img: "",
  })

  const [newShelter, setNewShelter] = useState({
    name: "",
    location: "",
    contact_info: "",
    img: "",
  })

  const [applications, setApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState("")
  const [applicationNotes, setApplicationNotes] = useState("")

  const [confirmDelete, setConfirmDelete] = useState({ open: false, type: '', id: null, name: '' })

  const lineData = {
    labels: userRegistrations.map((entry) => entry.month),
    datasets: [
      {
        label: "User Registrations",
        data: userRegistrations.map((entry) => entry.count),
        borderColor: "#6D712E",
        backgroundColor: "rgba(109, 113, 46, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  }

  const barData = {
    labels: Object.keys(petTypes),
    datasets: [
      {
        label: "Pets Available",
        data: Object.values(petTypes),
        backgroundColor: ["#6D712E", "#FFD700", "#4CAF50", "#2196F3", "#9C27B0"],
      },
    ],
  }

  const pieData = {
    labels: Object.keys(shelterLocations),
    datasets: [
      {
        data: Object.values(shelterLocations),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  }

  const applicationsStatusChartData = {
    labels: applicationsByStatus.map((entry) => entry.status),
    datasets: [
      {
        label: "Applications",
        data: applicationsByStatus.map((entry) => entry.count),
        backgroundColor: ["#6D712E", "#FFD700", "#4CAF50", "#2196F3", "#9C27B0", "#FF6384"],
      },
    ],
  }

  // fetch data
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsRefreshing(true)
      const [petsRes, sheltersRes, usersRes, petsCountRes, sheltersCountRes, userRegistrationsRes, applicationsCountRes, applicationsByStatusRes] = await Promise.all([
        fetch("http://localhost:5000/pets"),
        fetch("http://localhost:5000/shelters"),
        fetch("http://localhost:5000/admin/total-users"),
        fetch("http://localhost:5000/admin/total-pets"),
        fetch("http://localhost:5000/admin/total-shelters"),
        fetch("http://localhost:5000/admin/user-registrations"),
        fetch("http://localhost:5000/admin/total-applications"),
        fetch("http://localhost:5000/admin/applications-by-status")
      ])

      const petsData = await petsRes.json()
      const sheltersData = await sheltersRes.json()
      const usersData = await usersRes.json()
      const petsCountData = await petsCountRes.json()
      const sheltersCountData = await sheltersCountRes.json()
      const userRegistrationsData = await userRegistrationsRes.json()
      const applicationsCountData = await applicationsCountRes.json()
      const applicationsByStatusData = await applicationsByStatusRes.json()

      setPets(petsData)
      setShelters(sheltersData)
      setTotalUsers(usersData.total || 0)
      setTotalPets(petsCountData.total || petsData.length)
      setTotalShelters(sheltersCountData.total || sheltersData.length)
      setUserRegistrations(userRegistrationsData)
      setTotalApplications(applicationsCountData.total || 0)
      setApplicationsByStatus(applicationsByStatusData)

      // Process pet types
      const types = petsData.reduce((acc, pet) => {
        acc[pet.type] = (acc[pet.type] || 0) + 1
        return acc
      }, {})
      setPetTypes(types)

      // Process shelter locations
      const locations = sheltersData.reduce((acc, shelter) => {
        acc[shelter.location] = (acc[shelter.location] || 0) + 1
        return acc
      }, {})
      setShelterLocations(locations)

      logAction("Dashboard data refreshed")
      setIsLoading(false)
      setIsRefreshing(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to fetch dashboard data")
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // CRUD operations for pets
  const handleAddPet = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.entries(newPet).forEach(([key, value]) => {
      if (key === "img" && value instanceof File) {
        formData.append("img", value);
      } else {
        formData.append(key, value);
      }
    });
  
    try {
      const response = await fetch("http://localhost:5000/pets", {
        method: "POST",
        body: formData, 
      });
  
      if (response.ok) {
        toast.success("Pet added successfully");
        logAction(`Added new pet: ${newPet.name}`);
        setAddPetModal(false);
        setNewPet({
          name: "",
          type: "",
          location: "",
          gender: "",
          age: "",
          size: "",
          description: "",
          long_desc: "",
          img: "",
        });
        fetchDashboardData();
      } else {
        const errorText = await response.text();
        toast.error(`Failed to add pet: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding pet:", error);
      toast.error("Error connecting to the server");
    }
  };  

  const handleUpdatePet = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.entries(editPet).forEach(([key, value]) => {
      if (key === "img" && value instanceof File) {
        formData.append("img", value); // Handle file upload
      } else {
        formData.append(key, value);
      }
    });
  
    try {
      const response = await fetch(`http://localhost:5000/pets/${editPet.id}`, {
        method: "PUT",
        body: formData, // No Content-Type needed; FormData sets it automatically
      });
  
      if (response.ok) {
        toast.success("Pet updated successfully");
        logAction(`Updated pet: ${editPet.name}`);
        setAddPetModal(false);
        setEditPet(null);
        fetchDashboardData();
      } else {
        const errorText = await response.text();
        toast.error(`Failed to update pet: ${errorText}`);
      }
    } catch (error) {
      console.error("Error updating pet:", error);
      toast.error("Error connecting to the server");
    }
  };  

  const handleDeletePet = async (id, name) => {
    setConfirmDelete({ open: true, type: 'pet', id, name })
  }
  

  // CRUD operations for shelters
  const handleAddShelter = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.entries(newShelter).forEach(([key, value]) => {
      if (key === "img" && value instanceof File) {
        formData.append("img", value);
      } else {
        formData.append(key, value);
      }
    });
  
    try {
      const response = await fetch("http://localhost:5000/shelters", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        toast.success("Shelter added successfully");
        logAction(`Added new shelter: ${newShelter.name}`);
        setAddShelterModal(false);
        setNewShelter({
          name: "",
          location: "",
          contact_info: "",
          img: "",
        });
        fetchDashboardData();
      } else {
        const errorText = await response.text();
        toast.error(`Failed to add shelter: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding shelter:", error);
      toast.error("Error connecting to the server");
    }
  };

  const handleUpdateShelter = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.entries(editShelter).forEach(([key, value]) => {
      if (key === "img" && value instanceof File) {
        formData.append("img", value);
      } else {
        formData.append(key, value);
      }
    });

    console.log("Updating Shelter with:", [...formData.entries()]);
  
    try {
      const response = await fetch(`http://localhost:5000/shelters/${editShelter.shelter_id}`, {
        method: "PUT",
        body: formData,
      });
  
      if (response.ok) {
        toast.success("Shelter updated successfully");
        logAction(`Updated shelter: ${editShelter.name}`);
        setAddShelterModal(false);
        setEditShelter(null);
        fetchDashboardData();
      } else {
        const errorText = await response.text();
        toast.error(`Failed to update shelter: ${errorText}`);
      }
    } catch (error) {
      console.error("Error updating shelter:", error);
      toast.error("Error connecting to the server");
    }
  };

  const handleDeleteShelter = async (id, name) => {
    setConfirmDelete({ open: true, type: 'shelter', id, name })
  }

  const confirmDeleteAction = async () => {
    if (!confirmDelete.id) return;
    if (confirmDelete.type === 'pet') {
      try {
        const response = await fetch(`http://localhost:5000/pets/${confirmDelete.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          toast.success("Pet deleted successfully");
          logAction(`Deleted pet: ${confirmDelete.name}`);
          fetchDashboardData();
        } else {
          const errorText = await response.text();
          toast.error(`Failed to delete pet: ${errorText}`);
        }
      } catch (error) {
        console.error("Error deleting pet:", error);
        toast.error("Error connecting to the server");
      }
    } else if (confirmDelete.type === 'shelter') {
      try {
        const response = await fetch(`http://localhost:5000/shelters/${confirmDelete.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          toast.success("Shelter deleted successfully");
          logAction(`Deleted shelter: ${confirmDelete.name}`);
          fetchDashboardData();
        } else {
          const errorText = await response.text();
          toast.error(`Failed to delete shelter: ${errorText}`);
        }
      } catch (error) {
        console.error("Error deleting shelter:", error);
        toast.error("Error connecting to the server");
      }
    }
    setConfirmDelete({ open: false, type: '', id: null, name: '' })
  }

  const cancelDeleteAction = () => {
    setConfirmDelete({ open: false, type: '', id: null, name: '' })
  }

  const logAction = (action) => {
    const newLog = { timestamp: new Date().toLocaleString(), action }
    setLogHistory((prevLogs) => {
      const updatedLogs = [newLog, ...prevLogs]
      localStorage.setItem("logHistory", JSON.stringify(updatedLogs))
      return updatedLogs
    })
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    localStorage.setItem("darkMode", newDarkMode ? "dark" : "light")

    logAction(`Switched to ${newDarkMode ? "dark" : "light"} mode`)
  }

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      toast.success("Logged out successfully!");
  
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
  
      logAction("Logged out at " + new Date().toLocaleString());
    }
  };
  

  // Setup WebSocket for real-time updates (if available)
  useEffect(() => {
    // Initial data fetch
    fetchDashboardData()

    // Load logs from localStorage
    const storedLogs = localStorage.getItem("logHistory")
    if (storedLogs) {
      setLogHistory(JSON.parse(storedLogs))
    }
  }, [])


  useEffect(() => {
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem("darkMode")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    // Set initial dark mode state
    const initialDarkMode = savedTheme === "dark" || (!savedTheme && prefersDark)
    setDarkMode(initialDarkMode)

    // Apply the theme
    if (initialDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Fetch applications for admin
  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/applications");
      const data = await res.json();
      console.log("Admin applications response:", data) //temporary
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
    }
  }, [])

  // Polling for real-time updates
  useEffect(() => {
    if (activeTab === "applications") {
      fetchApplications();
      const interval = setInterval(fetchApplications, 5000);
      return () => clearInterval(interval);
    } else if (activeTab === "pets" || activeTab === "shelters" || activeTab === "main") {
      fetchDashboardData();
    }
  }, [activeTab, fetchApplications, fetchDashboardData]);

  // Open modal and set details
  const openApplicationModal = (app) => {
    setSelectedApplication(app)
    setApplicationStatus(app.status || "pending")
    setApplicationNotes(app.notes || "")
    setShowApplicationModal(true)
  }

  // Save status/notes
  const handleSaveApplication = async () => {
    if (!selectedApplication) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/applications/${selectedApplication.application_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: applicationStatus, notes: applicationNotes })
      })
      if (res.ok) {
        toast.success("Application updated!")
        setShowApplicationModal(false)
        fetchApplications()
      } else {
        toast.error("Failed to update application")
      }
    } catch (error) {
      toast.error("Error updating application")
    }
  }

  // Group applications by status
  const groupedApplications = applications.reduce((acc, app) => {
    const status = (app.status || 'pending').toLowerCase();
    if (!acc[status]) acc[status] = [];
    acc[status].push(app);
    return acc;
  }, {});

  const statusOrder = [
    'pending',
    'evaluate',
    'for compliance',
    'approved',
    'rejected',
  ];

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900`}>
      <ToastContainer position="top-right" autoClose={3000} theme={darkMode ? "dark" : "light"} />

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#6D712E] flex items-center gap-2">
            <PawPrint className="h-6 w-6" />
            <span>PawConnect</span>
          </h1>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "main"
                    ? "bg-[#6D712E] text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab("main")}
              >
                <LayoutDashboard className="h-5 w-5 mr-3" />
                <span className="text-black dark:text-white">Dashboard</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "pets"
                    ? "bg-[#6D712E] text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab("pets")}
              >
                <PawPrint className="h-5 w-5 mr-3" />
                <span className="text-black dark:text-white">Pets</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "shelters"
                    ? "bg-[#6D712E] text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab("shelters")}
              >
                <Home className="h-5 w-5 mr-3" />
                <span className="text-black dark:text-white">Shelters</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "applications"
                    ? "bg-[#6D712E] text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab("applications")}
              >
                <ClipboardList className="h-5 w-5 mr-3" />
                <span className="text-black dark:text-white">Applications</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "logs"
                    ? "bg-[#6D712E] text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab("logs")}
              >
                <ClipboardList className="h-5 w-5 mr-3" />
                <span className="text-black dark:text-white">Logs</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "logout"
                    ? "bg-[#6D712E] text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span className="text-black dark:text-white">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard View */}
          {activeTab === "main" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h2>
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={toggleDarkMode}
                    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    <span className="text-black dark:text-white">{darkMode ? "Light Mode" : "Dark Mode"}</span>
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      fetchDashboardData()
                    }}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span className="text-black dark:text-white">Refresh Data</span>
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D712E]"></div>
                </div>
              ) : (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-[#6D712E]">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Users</h3>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">{totalUsers}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-[#FFD700]">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Pets</h3>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">{totalPets}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-[#6D712E]">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Shelters</h3>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">{totalShelters}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-[#FF6384]">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Applications</h3>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">{totalApplications}</p>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">User Registrations</h3>
                      <div className="h-64">
                        <Line
                          data={lineData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "top",
                              },
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Pets by Type</h3>
                      <div className="h-64">
                        <Bar
                          data={barData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Applications by Status</h3>
                      <div className="h-64">
                        <Bar
                          data={applicationsStatusChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                            },
                            scales: { y: { beginAtZero: true } },
                          }}
                        />
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Shelter Locations</h3>
                      <div className="h-64 flex justify-center">
                        <Pie
                          data={pieData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "right",
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
                      <div className="space-y-4 max-h-64 overflow-y-auto">
                        {logHistory.slice(0, 5).map((log, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700"
                          >
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                              <ClipboardList className="h-4 w-4 text-[#6D712E]" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-800 dark:text-white">{log.action}</p>
                              <p className="text-xs text-gray-500">{log.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Pets View */}
          {activeTab === "pets" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Pets</h2>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-[#6D712E] text-white rounded-lg shadow-sm"
                  onClick={() => setAddPetModal(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Pet
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Age</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Size</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {pets.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No pets found.
                          </td>
                        </tr>
                      ) : (
                        pets.map((pet) => (
                          <tr key={pet.id}>
                            <td className="px-6 py-4">{pet.name}</td>
                            <td className="px-6 py-4">{pet.type}</td>
                            <td className="px-6 py-4">{pet.location}</td>
                            <td className="px-6 py-4">{pet.gender}</td>
                            <td className="px-6 py-4">{pet.age}</td>
                            <td className="px-6 py-4">{pet.size}</td>
                            <td className="px-6 py-4 text-right">
                              <button
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                                onClick={() => {
                                  setEditPet(pet);
                                  setAddPetModal(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </button>
                              <button
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                onClick={() => handleDeletePet(pet.id, pet.name)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Shelters View */}
          {activeTab === "shelters" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Shelters</h2>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-[#6D712E] text-white rounded-lg shadow-sm"
                  onClick={() => setAddShelterModal(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Shelter
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact Info</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {shelters.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No shelters found.
                          </td>
                        </tr>
                      ) : (
                        shelters.map((shelter) => (
                          <tr key={shelter.shelter_id}>
                            <td className="px-6 py-4">{shelter.name}</td>
                            <td className="px-6 py-4">{shelter.location}</td>
                            <td className="px-6 py-4">{shelter.contact_info}</td>
                            <td className="px-6 py-4 text-right">
                              <button
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                                onClick={() => {
                                  setEditShelter(shelter);
                                  setAddShelterModal(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </button>
                              <button
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                onClick={() => handleDeleteShelter(shelter.shelter_id, shelter.name)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Applications View */}
          {activeTab === "applications" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Applications</h2>
              </div>
              {statusOrder.map((status) => (
                <div key={status} className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2 capitalize">
                    {status.replace(/_/g, ' ')} Applications
                  </h3>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pet</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {groupedApplications[status] && groupedApplications[status].length > 0 ? (
                            groupedApplications[status].map((app) => (
                              <tr key={app.application_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{app.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{app.pet_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{app.pet_type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    app.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                    app.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                    app.status === 'evaluate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                    app.status === 'for compliance' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                  }`}>
                                    {app.status || 'Pending'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(app.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    onClick={() => openApplicationModal(app)}
                                  >
                                    Review
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                No {status.replace(/_/g, ' ')} applications found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Application Review Modal */}
          {showApplicationModal && selectedApplication && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Review Application</h3>
                  <button
                    onClick={() => setShowApplicationModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Pet: {selectedApplication.pet_name} ({selectedApplication.pet_type})</h4>
                    <h5 className="text-md text-gray-700 dark:text-gray-300 mb-1">User: {selectedApplication.username} ({selectedApplication.email})</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      applicationStatus === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      applicationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      applicationStatus === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {applicationStatus || 'Pending'}
                    </span>
                    <span className="ml-4 text-xs text-gray-500 dark:text-gray-400">Applied on: {new Date(selectedApplication.created_at).toLocaleString()}</span>
                  </div>

                  {/* Show latest user remark below status dropdown */}
                  {selectedApplication.status_history && selectedApplication.status_history.length > 0 && (() => {
                        // Find the latest non-empty user_remark
                        const latestUserRemark = [...selectedApplication.status_history].reverse().find(h => h.user_remark && h.user_remark.trim() !== "");
                        if (latestUserRemark) {
                          return (
                            <div className="my-2 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 rounded">
                              <span className="block text-xs text-blue-700 dark:text-blue-200 font-semibold mb-1">User Remark:</span>
                              <span className="text-sm text-blue-900 dark:text-blue-100">{latestUserRemark.user_remark}</span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">Application Details</h4>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        <tr><td className="px-4 py-2 font-medium">Name</td><td className="px-4 py-2">{selectedApplication.first_name} {selectedApplication.last_name}</td></tr>
                        <tr><td className="px-4 py-2 font-medium">Address</td><td className="px-4 py-2">{selectedApplication.address}</td></tr>
                        <tr><td className="px-4 py-2 font-medium">Phone</td><td className="px-4 py-2">{selectedApplication.phone}</td></tr>
                        <tr><td className="px-4 py-2 font-medium">Occupation</td><td className="px-4 py-2">{selectedApplication.occupation}</td></tr>
                        <tr><td className="px-4 py-2 font-medium">Company</td><td className="px-4 py-2">{selectedApplication.company_name}</td></tr>
                        <tr><td className="px-4 py-2 font-medium">Social Profile</td><td className="px-4 py-2">{selectedApplication.soc_profile}</td></tr>
                        <tr><td className="px-4 py-2 font-medium">Civil Status</td><td className="px-4 py-2">{selectedApplication.civil_status}</td></tr>
                        <tr><td className="px-4 py-2 font-medium">Reason to Adopt</td><td className="px-4 py-2">{selectedApplication.reason_to_adopt}</td></tr>
                        <tr><td className="px-4 py-2 font-medium">Pet Experience</td><td className="px-4 py-2">{selectedApplication.experience_with_pets}</td></tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Uploaded Photos Section */}
                  {selectedApplication.photos && selectedApplication.photos.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">Uploaded Home & ID Photos</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedApplication.photos.map((photo) => (
                          <div key={photo.id} className="flex flex-col items-center">
                            <span className="text-xs text-gray-600 dark:text-gray-300 mb-1 capitalize">{photo.photo_type.replace(/_/g, ' ')}</span>
                            <a href={`http://localhost:5001${photo.file_path}`} target="_blank" rel="noopener noreferrer">
                              <img
                                src={`http://localhost:5001${photo.file_path}`}
                                alt={photo.photo_type}
                                className="w-28 h-28 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-105 transition-transform"
                              />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">Admin Review</h4>
                    <div className="flex flex-col gap-3">
                      <label className="font-medium">Status</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        value={applicationStatus}
                        onChange={e => setApplicationStatus(e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="evaluate">Evaluate</option>
                        <option value="for compliance">For Compliance</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <label className="font-medium mt-2">Remarks/Notes</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        rows={3}
                        value={applicationNotes}
                        onChange={e => setApplicationNotes(e.target.value)}
                        placeholder="Write remarks for the user (visible to user)"
                      />
                    </div>
                  </div>
             
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 flex justify-end border-t border-gray-200 dark:border-gray-600 gap-3">
                  <button
                    onClick={() => setShowApplicationModal(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveApplication}
                    className="px-4 py-2 bg-[#6D712E] text-white rounded-md hover:bg-[#5a5d26] transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Logs View */}
          {activeTab === "logs" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Activity Logs</h2>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-[#6D712E] border border-gray-300 rounded-lg shadow-sm transition-colors"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear all logs?")) {
                      setLogHistory([])
                      localStorage.removeItem("logHistory")
                      toast.success("Logs cleared successfully")
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 text-white" />
                  <span className="text-white">Clear Logs</span>
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {logHistory.length === 0 ? (
                        <tr>
                          <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No logs found. Actions will be recorded here.
                          </td>
                        </tr>
                      ) : (
                        logHistory.map((log, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {log.timestamp}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 dark:text-white">{log.action}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Pet Modal */}
      {addPetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {editPet ? "Edit Pet" : "Add New Pet"}
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => {
                    setAddPetModal(false)
                    setEditPet(null)
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={editPet ? handleUpdatePet : handleAddPet}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full dark:text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6D712E] focus:border-[#6D712E]"
                      value={editPet ? editPet.name : newPet.name}
                      onChange={(e) =>
                        editPet
                          ? setEditPet({ ...editPet, name: e.target.value })
                          : setNewPet({ ...newPet, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      id="type"
                      className="w-full dark:text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6D712E] focus:border-[#6D712E]"
                      value={editPet ? editPet.type : newPet.type}
                      onChange={(e) =>
                        editPet
                          ? setEditPet({ ...editPet, type: e.target.value })
                          : setNewPet({ ...newPet, type: e.target.value })
                      }
                      required
                    >
                      <option value="">Select a type</option>
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Location
                    </label>
                    <select
                      id="location"
                      className="w-full dark:text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6D712E] focus:border-[#6D712E]"
                      value={editPet ? editPet.location : newPet.location}
                      onChange={(e) =>
                        editPet
                          ? setEditPet({ ...editPet, location: e.target.value })
                          : setNewPet({ ...newPet, location: e.target.value })
                      }
                      required
                    >
                      <option value="">Select a shelter</option>
                      {shelters.map((shelter) => (
                        <option key={shelter.shelter_id} value={`${shelter.name} - ${shelter.location}`}>
                          {shelter.name} - {shelter.location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        className="w-full dark:text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6D712E] focus:border-[#6D712E]"
                        value={editPet ? editPet.gender : newPet.gender}
                        onChange={(e) =>
                          editPet
                            ? setEditPet({ ...editPet, gender: e.target.value })
                            : setNewPet({ ...newPet, gender: e.target.value })
                        }
                        required
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Age
                      </label>
                      <input
                        type="text"
                        id="age"
                        className="w-full dark:text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6D712E] focus:border-[#6D712E]"
                        value={editPet ? editPet.age : newPet.age}
                        onChange={(e) =>
                          editPet
                            ? setEditPet({ ...editPet, age: e.target.value })
                            : setNewPet({ ...newPet, age: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Short Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      className="w-full dark:text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6D712E] focus:border-[#6D712E]"
                      value={editPet ? editPet.description : newPet.description}
                      onChange={(e) =>
                        editPet
                          ? setEditPet({ ...editPet, description: e.target.value })
                          : setNewPet({ ...newPet, description: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="long_desc"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Full Description
                    </label>
                    <textarea
                      id="long_desc"
                      rows={3}
                      className="w-full dark:text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6D712E] focus:border-[#6D712E]"
                      value={editPet ? editPet.long_desc : newPet.long_desc}
                      onChange={(e) =>
                        editPet
                          ? setEditPet({ ...editPet, long_desc: e.target.value })
                          : setNewPet({ ...newPet, long_desc: e.target.value })
                      }
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Size
                    </label>
                    <select
                      id="size"
                      className="w-full dark:text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6D712E] focus:border-[#6D712E]"
                      value={editPet ? editPet.size : newPet.size}
                      onChange={(e) =>
                        editPet
                          ? setEditPet({ ...editPet, size: e.target.value })
                          : setNewPet({ ...newPet, size: e.target.value })
                      }
                      required
                    >
                      <option value="">Select a size</option>
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="img" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      id="img"
                      accept="image/*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                      onChange={(e) => setNewPet({ ...newPet, img: e.target.files[0] })} // Capture the file
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D712E]"
                    onClick={() => {
                      setAddPetModal(false)
                      setEditPet(null)
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#6D712E] hover:bg-[#5a5d26] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D712E]"
                  >
                    {editPet ? "Update" : "Add"} Pet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Shelter Modal */}
      {addShelterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {editShelter ? "Edit Shelter" : "Add New Shelter"}
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => {
                    setAddShelterModal(false)
                    setEditShelter(null)
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={editShelter ? handleUpdateShelter : handleAddShelter}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="shelter-name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="shelter-name"
                      className="w-full dark:text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6D712E] focus:border-[#6D712E]"
                      value={editShelter ? editShelter.name : newShelter.name}
                      onChange={(e) =>
                        editShelter
                          ? setEditShelter({ ...editShelter, name: e.target.value })
                          : setNewShelter({ ...newShelter, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="shelter-location"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="shelter-location"
                      className="w-full dark:text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6D712E] focus:border-[#6D712E]"
                      value={editShelter ? editShelter.location : newShelter.location}
                      onChange={(e) =>
                        editShelter
                          ? setEditShelter({ ...editShelter, location: e.target.value })
                          : setNewShelter({ ...newShelter, location: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="shelter-contact"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Contact Information
                    </label>
                    <input
                      type="text"
                      id="shelter-contact"
                      className="w-full dark:text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6D712E] focus:border-[#6D712E]"
                      value={editShelter ? editShelter.contact_info : newShelter.contact_info}
                      onChange={(e) =>
                        editShelter
                          ? setEditShelter({ ...editShelter, contact_info: e.target.value })
                          : setNewShelter({ ...newShelter, contact_info: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="img" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      id="img"
                      accept="image/*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                      onChange={(e) => setNewShelter({ ...newShelter, img: e.target.files[0] })} // Capture the file
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D712E]"
                    onClick={() => {
                      setAddShelterModal(false)
                      setEditShelter(null)
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#6D712E] hover:bg-[#5a5d26] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D712E]"
                  >
                    {editShelter ? "Update" : "Add"} Shelter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {confirmDelete.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to remove this {confirmDelete.type === 'pet' ? 'pet' : 'shelter'}: <span className="font-bold">{confirmDelete.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                onClick={cancelDeleteAction}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                onClick={confirmDeleteAction}
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

