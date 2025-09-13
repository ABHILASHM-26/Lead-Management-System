import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext";

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="form-wrapper">
      <h2>Profile</h2>

      {user ? (
        <>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" value={user.name} readOnly />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={user.email} readOnly />
          </div>

          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <p className="text-center">No user information available.</p>
      )}
    </div>
  );
};

export default ProfilePage;
