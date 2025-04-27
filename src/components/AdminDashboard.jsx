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

  // fetch data
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsRefreshing(true)
      const [petsRes, sheltersRes, usersRes, petsCountRes, sheltersCountRes] = await Promise.all([
        fetch("http://localhost:5000/pets"),
        fetch("http://localhost:5000/shelters"),
        fetch("http://localhost:5000/admin/total-users"),
        fetch("http://localhost:5000/admin/total-pets"),
        fetch("http://localhost:5000/admin/total-shelters"),
      ])

      const petsData = await petsRes.json()
      const sheltersData = await sheltersRes.json()

      const usersData = await usersRes.json()
      const petsCountData = await petsCountRes.json()
      const sheltersCountData = await sheltersCountRes.json()

      setPets(petsData)
      setShelters(sheltersData)
      setTotalUsers(usersData.total || 0)
      setTotalPets(petsCountData.total || petsData.length)
      setTotalShelters(sheltersCountData.total || sheltersData.length)

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

      // Mock user registration data (replace with actual data when available)
      setUserRegistrations([
        { month: "Jan", count: 0 },
        { month: "Feb", count: 0 },
        { month: "Mar", count: 8 },
        { month: "Apr", count: 0 },
        { month: "May", count: 0 },
        { month: "Jun", count: 0 },
      ])

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
    if (!id) {
      toast.error("Invalid pet ID");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/pets/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        toast.success("Pet deleted successfully");
        logAction(`Deleted pet: ${name}`);
        fetchDashboardData();
      } else {
        const errorText = await response.text();
        toast.error(`Failed to delete pet: ${errorText}`);
      }
    } catch (error) {
      console.error("Error deleting pet:", error);
      toast.error("Error connecting to the server");
    }
  };
  

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

  const handleDeleteShelter = async (shelter_id, name) => {
    console.log("Deleting Shelter with ID:", shelter_id); // ✅ Debugging log

    if (!shelter_id) {
      toast.error("Invalid shelter ID");
      return;
    }

    try {
      const url = `http://localhost:5000/shelters/${shelter_id}`;
      console.log("DELETE Request URL:", url); // ✅ Debug URL

      const response = await fetch(url, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Shelter deleted successfully");
        logAction(`Deleted shelter: ${name}`);
        fetchDashboardData();
      } else {
        const errorText = await response.text();
        toast.error(`Failed to delete shelter: ${errorText}`);
      }
    } catch (error) {
      console.error("Error deleting shelter:", error);
      toast.error("Error connecting to the server");
    }
};

  

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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Pets</h2>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-[#6D712E] text-white rounded-lg hover:bg-[#5a5d26] transition-colors"
                  onClick={() => {
                    setEditPet(null)
                    setAddPetModal(true)
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-white">Add Pet</span>
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D712E]"></div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Age
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {pets.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                              No pets found. Add a new pet to get started.
                            </td>
                          </tr>
                        ) : (
                          pets.map((pet) => (
                            <tr key={pet.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                                {pet.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {pet.type}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {pet.location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {pet.age}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                {pet.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {pet.size}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                  <button
                                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    onClick={() => {
                                      setEditPet(pet)
                                      setAddPetModal(true)
                                    }}
                                  >
                                    <Edit className="h-5 w-5" />
                                    <span className="sr-only">Edit</span>
                                  </button>
                                  <button
                                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to delete ${pet.name}?`)) {
                                        handleDeletePet(pet.id, pet.name)
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-5 w-5" />
                                    <span className="sr-only">Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Shelters View */}
          {activeTab === "shelters" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Shelters</h2>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-[#6D712E] text-white rounded-lg hover:bg-[#5a5d26] transition-colors"
                  onClick={() => {
                    setEditShelter(null)
                    setAddShelterModal(true)
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-white">Add Shelter</span>
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D712E]"></div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Contact Info
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {shelters.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                              No shelters found. Add a new shelter to get started.
                            </td>
                          </tr>
                        ) : (
                          shelters.map((shelter) => (
                            <tr key={shelter.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                                {shelter.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {shelter.location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {shelter.contact_info}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                  <button
                                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    onClick={() => {
                                      setEditShelter(shelter)
                                      setAddShelterModal(true)
                                    }}
                                  >
                                    <Edit className="h-5 w-5" />
                                    <span className="sr-only">Edit</span>
                                  </button>
                                  <button
                                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to delete ${shelter.name}?`)) {
                                        handleDeleteShelter(shelter.shelter_id, shelter.name)
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-5 w-5" />
                                    <span className="sr-only">Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
                    <input
                      type="text"
                      id="location"
                      className="w-full dark:text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6D712E] focus:border-[#6D712E]"
                      value={editPet ? editPet.location : newPet.location}
                      onChange={(e) =>
                        editPet
                          ? setEditPet({ ...editPet, location: e.target.value })
                          : setNewPet({ ...newPet, location: e.target.value })
                      }
                      required
                    />
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
    </div>
  )
}

export default AdminDashboard

