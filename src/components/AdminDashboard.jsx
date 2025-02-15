import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('main');
  const [pets, setPets] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [addPetModal, setAddPetModal] = useState(false);
  const [editPet, setEditPet] = useState(null);
  const [editShelter, setEditShelter] = useState(null);
  const [addShelterModal, setAddShelterModal] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPets, setTotalPets] = useState(0);
  const [totalShelters, setTotalShelters] = useState(0);
  const [logHistory, setLogHistory] = useState([]);

  const [userRegistrations, setUserRegistrations] = useState([]);
  const [petTypes, setPetTypes] = useState({});
  const [shelterLocations, setShelterLocations] = useState({});


  const lineData = {
    labels: userRegistrations.map(entry => entry.month),
    datasets: [
      {
        label: 'User Registrations',
        data: userRegistrations.map(entry => entry.count),
        borderColor: '#6D712E',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const barData = {
    labels: Object.keys(petTypes),
    datasets: [
      {
        label: 'Pets Available',
        data: Object.values(petTypes),
        backgroundColor: ['#6D712E', '#FFD700', '#4CAF50', '#2196F3', '#9C27B0'],
      },
    ],
  };

  const pieData = {
    labels: Object.keys(shelterLocations),
    datasets: [
      {
        data: Object.values(shelterLocations),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const [newPet, setNewPet] = useState({
    name: '',
    type: '',
    location: '',
    gender: '',
    age: '',
    size: '',
    description: '',
    longdesc: '',
    img: '',
  });

  const [newShelter, setNewShelter] = useState({
    name: '',
    location: '',
    contact_info: '',
    img: '',
  });

  const handleAddPet = async () => {
    try {
      const response = await fetch('http://localhost:5000/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPet),
      });
      if (response.ok) {
        toast.success('Pet added successfully');
        fetchPets();
      } else {
        toast.error('Failed to add pet');
      }
    } catch (error) {
      console.error('Error adding pet:', error);
    }
  };

  const handleEditPet = (pet) => {
    setEditPet(pet);
  };

  const handleUpdatePet = async () => {
    try {
      const response = await fetch(`http://localhost:5000/pets/${editPet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPet),
      });
      if (response.ok) {
        toast.success('Pet updated successfully');
        fetchPets();
        setEditPet(null);
      } else {
        toast.error('Failed to update pet');
      }
    } catch (error) {
      console.error('Error updating pet:', error);
    }
  };

  const handleDeletePet = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/pets/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success('Pet deleted successfully');
        fetchPets();
      } else {
        toast.error('Failed to delete pet');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  const handleAddShelter = async () => {
    try {
      const response = await fetch('http://localhost:5000/shelters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShelter),
      });
      if (response.ok) {
        toast.success('Shelter added successfully');
        fetchShelters();
      } else {
        toast.error('Failed to add shelter');
      }
    } catch (error) {
      console.error('Error adding shelter:', error);
    }
  };

  const handleEditShelter = (shelter) => {
    setEditShelter(shelter);
  };

  const handleUpdateShelter = async () => {
    try {
      const response = await fetch(`http://localhost:5000/shelters/${editShelter.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editShelter),
      });
      if (response.ok) {
        toast.success('Shelter updated successfully');
        fetchShelters();
        setEditShelter(null);
      } else {
        toast.error('Failed to update shelter');
      }
    } catch (error) {
      console.error('Error updating shelter:', error);
    }
  };

  const handleDeleteShelter = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/shelters/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success('Shelter deleted successfully');
        fetchShelters();
      } else {
        toast.error('Failed to delete shelter');
      }
    } catch (error) {
      console.error('Error deleting shelter:', error);
    }
  };

  useEffect(() => {
    // Fetch data for dashboard
    fetch('http://localhost:5000/pets')
      .then((res) => res.json())
      .then((data) => setPets(data));

    fetch('http://localhost:5000/shelters')
      .then((res) => res.json())
      .then((data) => setShelters(data));

      const fetchData = async () => {
        try {
          const [petsRes, sheltersRes, usersRes, petsCountRes, sheltersCountRes] = await Promise.all([
            fetch('http://localhost:5000/pets'),
            fetch('http://localhost:5000/shelters'),
            fetch('http://localhost:5000/admin/total-users'),
            fetch('http://localhost:5000/admin/total-pets'),
            fetch('http://localhost:5000/admin/total-shelters')
          ]);
  
          const petsData = await petsRes.json();
          const sheltersData = await sheltersRes.json();
          const usersData = await usersRes.json();
          const petsCountData = await petsCountRes.json();
          const sheltersCountData = await sheltersCountRes.json();
  
          setPets(petsData);
          setShelters(sheltersData);
          setTotalUsers(usersData.total);
          setTotalPets(petsCountData.total);
          setTotalShelters(sheltersCountData.total);
  
          // Process pet types
          const types = petsData.reduce((acc, pet) => {
            acc[pet.type] = (acc[pet.type] || 0) + 1;
            return acc;
          }, {});
          setPetTypes(types);
  
          // Process shelter locations
          const locations = sheltersData.reduce((acc, shelter) => {
            acc[shelter.location] = (acc[shelter.location] || 0) + 1;
            return acc;
          }, {});
          setShelterLocations(locations);
  
          // Mock user registration data (replace with actual data when available)
          setUserRegistrations([
            { month: 'Jan', count: 10 },
            { month: 'Feb', count: 20 },
            { month: 'Mar', count: 15 },
            { month: 'Apr', count: 25 },
            { month: 'May', count: 22 },
            { month: 'Jun', count: 30 },
          ]);
        } catch (error) {
          console.error('Error fetching data:', error);
          toast.error('Failed to fetch dashboard data');
        }
      };
  
      fetchData();

    const storedLogs = localStorage.getItem('logHistory');
    if (storedLogs) {
      setLogHistory(JSON.parse(storedLogs));
    }
  }, []);

  const logAction = (action) => {
    const newLog = { timestamp: new Date().toLocaleString(), action };
    setLogHistory((prevLogs) => {
      const updatedLogs = [newLog, ...prevLogs];
      localStorage.setItem('logHistory', JSON.stringify(updatedLogs));
      return updatedLogs;
    });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-100 p-4 shadow-md h-screen">
        <h1 className="text-2xl font-bold text-[#6D712E] mb-6">Pawsitivity</h1>
        <ul>
          <li
            className={`cursor-pointer py-2 px-4 rounded-md mb-2 ${
              activeTab === 'main' ? 'bg-[#6D712E] text-white' : 'text-gray-700'
            }`}
            onClick={() => setActiveTab('main')}
          >
            Dashboard
          </li>
          <li
            className={`cursor-pointer py-2 px-4 rounded-md mb-2 ${
              activeTab === 'pets' ? 'bg-[#6D712E] text-white' : 'text-gray-700'
            }`}
            onClick={() => setActiveTab('pets')}
          >
            Pets
          </li>
          <li
            className={`cursor-pointer py-2 px-4 rounded-md mb-2 ${
              activeTab === 'shelters' ? 'bg-[#6D712E] text-white' : 'text-gray-700'
            }`}
            onClick={() => setActiveTab('shelters')}
          >
            Shelters
          </li>
          <li
            className={`cursor-pointer py-2 px-4 rounded-md ${
              activeTab === 'logs' ? 'bg-[#6D712E] text-white' : 'text-gray-700'
            }`}
            onClick={() => setActiveTab('logs')}
          >
            Logs
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === 'main' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-[#6D712E] text-white p-4 rounded-md shadow-md">
                <h3>Total Users</h3>
                <p className="text-3xl font-bold">{totalUsers}</p>
              </div>
              <div className="bg-[#FFD700] text-white p-4 rounded-md shadow-md">
                <h3>Total Pets</h3>
                <p className="text-3xl font-bold">{totalPets}</p>
              </div>
              <div className="bg-[#6D712E] text-white p-4 rounded-md shadow-md">
                <h3>Total Shelters</h3>
                <p className="text-3xl font-bold">{totalShelters}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-white rounded-md shadow-md">
                <h3 className="font-bold mb-4">User Registrations</h3>
                <Line data={lineData} />
              </div>
              <div className="p-4 bg-white rounded-md shadow-md">
                <h3 className="font-bold mb-4">Pets Available by Type</h3>
                <Bar data={barData} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-4 bg-white rounded-md shadow-md">
                <h3 className="font-bold mb-4">Shelter Locations</h3>
                <Pie data={pieData} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Logs</h2>
            <table className="w-full bg-white shadow-md rounded-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4">Timestamp</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {logHistory.map((log, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4">{log.timestamp}</td>
                    <td className="py-2 px-4">{log.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'pets' && (
        <div className="pets-section">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Pets</h2>
            <button
              className="bg-[#6D712E] text-white px-4 py-2 rounded-md hover:bg-[#5a5d26] transition-colors"
              onClick={() => setAddPetModal(true)}
            >
              Add Pet
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Type</th>
                  <th className="py-2 px-4 text-left">Location</th>
                  <th className="py-2 px-4 text-left">Age</th>
                  <th className="py-2 px-4 text-left">Description</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => (
                  <tr key={pet.id} className="border-b border-gray-200">
                    <td className="py-2 px-4">{pet.name}</td>
                    <td className="py-2 px-4">{pet.type}</td>
                    <td className="py-2 px-4">{pet.location}</td>
                    <td className="py-2 px-4">{pet.age}</td>
                    <td className="py-2 px-4">{pet.description}</td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2 hover:bg-blue-600 transition-colors"
                        onClick={() => handleEditPet(pet)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this pet?')) {
                            handleDeletePet(pet.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {addPetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-bold mb-4">{editPet ? 'Edit Pet' : 'Add New Pet'}</h2>
            <form onSubmit={editPet ? handleUpdatePet : handleAddPet}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border rounded-md"
                  value={editPet ? editPet.name : newPet.name}
                  onChange={(e) => editPet ? setEditPet({...editPet, name: e.target.value}) : setNewPet({...newPet, name: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="type">Type</label>
                <input
                  type="text"
                  id="type"
                  className="w-full px-3 py-2 border rounded-md"
                  value={editPet ? editPet.type : newPet.type}
                  onChange={(e) => editPet ? setEditPet({...editPet, type: e.target.value}) : setNewPet({...newPet, type: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  className="w-full px-3 py-2 border rounded-md"
                  value={editPet ? editPet.location : newPet.location}
                  onChange={(e) => editPet ? setEditPet({...editPet, location: e.target.value}) : setNewPet({...newPet, location: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="age">Age</label>
                <input
                  type="text"
                  id="age"
                  className="w-full px-3 py-2 border rounded-md"
                  value={editPet ? editPet.age : newPet.age}
                  onChange={(e) => editPet ? setEditPet({...editPet, age: e.target.value}) : setNewPet({...newPet, age: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 border rounded-md"
                  value={editPet ? editPet.description : newPet.description}
                  onChange={(e) => editPet ? setEditPet({...editPet, description: e.target.value}) : setNewPet({...newPet, description: e.target.value})}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400 transition-colors"
                  onClick={() => {
                    setAddPetModal(false);
                    setEditPet(null);
                    setNewPet({name: '', type: '', location: '', age: '', description: ''});
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#6D712E] text-white px-4 py-2 rounded-md hover:bg-[#5a5d26] transition-colors"
                >
                  {editPet ? 'Update' : 'Add'} Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'shelters' && (
        <div className="shelters-section">
          <h2>Shelters</h2>
          <button onClick={() => setNewShelter({ name: '', location: '', contactInfo: '' })}>Add Shelter</button>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Contact Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shelters.map((shelter) => (
                <tr key={shelter.id}>
                  <td>{shelter.name}</td>
                  <td>{shelter.location}</td>
                  <td>{shelter.contactInfo}</td>
                  <td>
                    <button onClick={() => handleEditShelter(shelter)}>Edit</button>
                    <button onClick={() => handleDeleteShelter(shelter.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;
