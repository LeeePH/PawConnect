// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5001"); // Backend server URL

// const ChatConnection = ({ userId }) => {
//   const [chatOpen, setChatOpen] = useState(false);
//   const [onlineUsers, setOnlineUsers] = useState({});
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     // Join with user ID
//     socket.emit("join", userId);

//     // Listen for online users
//     socket.on("onlineUsers", (users) => {
//       setOnlineUsers(users);
//     });

//     // Listen for incoming messages
//     socket.on("message", (data) => {
//       setMessages((prev) => [...prev, { from: data.from, message: data.message }]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [userId]);

//   const sendMessage = () => {
//     if (message.trim() && selectedUser) {
//       socket.emit("privateMessage", { to: selectedUser, from: userId, message });
//       setMessages((prev) => [...prev, { from: userId, message }]);
//       setMessage("");
//     }
//   };

//   return (
//     <div className="fixed bottom-4 left-4 z-50">
//       {!chatOpen ? (
//         <button
//           onClick={() => setChatOpen(true)}
//           className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
//         >
//         </button>
//       ) : (
//         <div className="w-80 bg-white border rounded-lg shadow-lg">
//           <div className="p-4 bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
//             <h4>Chat</h4>
//             <button onClick={() => setChatOpen(false)}>X</button>
//           </div>
//           <div className="p-4">
//             {selectedUser ? (
//               <div>
//                 <h5 className="text-lg font-bold">Chat with {selectedUser}</h5>
//                 <div className="h-48 overflow-y-auto border rounded-lg p-2">
//                   {messages.map((msg, index) => (
//                     <div
//                       key={index}
//                       className={`${
//                         msg.from === userId ? "text-right" : "text-left"
//                       } my-2`}
//                     >
//                       <span className="inline-block p-2 bg-gray-200 rounded">
//                         {msg.message}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-4 flex items-center">
//                   <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     className="border rounded-lg p-2 flex-grow"
//                     placeholder="Type your message"
//                   />
//                   <button
//                     onClick={sendMessage}
//                     className="bg-blue-500 text-white p-2 rounded-lg ml-2"
//                   >
//                     Send
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 <h5 className="text-lg font-bold">Online Adoption Centers: </h5>
//                 <ul>
//                   {Object.keys(onlineUsers)
//                     .filter((id) => id !== userId)
//                     .map((id) => (
//                       <li
//                         key={id}
//                         className="cursor-pointer p-2 hover:bg-gray-100"
//                         onClick={() => setSelectedUser(id)}
//                       >
//                         {id}
//                       </li>
//                     ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatConnection;
