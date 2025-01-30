// AddAdmin.js
import React, { useState } from "react";
import { db, collection, addDoc } from "../firebaseConfig";

const AddAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const usersRef = collection(db, "users"); // Store new admins in the 'users' collection
      await addDoc(usersRef, { email, password }); // Add admin data to Firestore
      setMessage("Admin added successfully.");
    } catch (err) {
      setMessage("Failed to add admin. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Admin</h2>
      <form onSubmit={handleAddAdmin}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Add Admin</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default AddAdmin;
