import React from "react";
import { Link } from "react-router-dom";
import { auth, db, functions } from "../firebase";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/Login");
      })
      .catch((error) => alert(error.message));
  };
  return (
    <nav className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h2 className="text-xl font-bold mx-2">Inker App</h2>
        <div>
          {!auth.currentUser ? (
            <>
              <Link
                to="/login"
                className="bg-white text-gray-800 font-semibold py-2 px-4 rounded mr-2"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-gray-800 font-semibold py-2 px-4 rounded mr-2"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="py-1">
              <Link
                to="/profileEdit"
                className="bg-white text-gray-800 font-semibold py-2 px-4 rounded mr-2"
              >
                Profile Page
              </Link>
              <Link
                to="/createsession"
                className="bg-white text-gray-800 font-semibold py-2 px-4 rounded mr-2"
              >
                Create Session
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-white text-gray-800 font-semibold py-2 px-4 rounded"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
