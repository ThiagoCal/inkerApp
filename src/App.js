import logo from "./logo.svg";
import "./App.css";
import Login from "./Components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import LandingPage from "./Components/LandingPage";
import Signup from "./Components/SignUp";
import CreateSession from "./Components/CreateSession";
import ProfilePage from "./Components/ProfilePage";
import ShowProfile from "./Components/ShowProfile";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <LandingPage />
              </>
            }
          ></Route>
          <Route
            path="/login"
            element={
              <>
                <Login />
              </>
            }
          ></Route>
          <Route
            path="/showProfile"
            element={
              <>
                <ShowProfile />
              </>
            }
          ></Route>
          <Route
            path="/signup"
            element={
              <>
                <Signup />
              </>
            }
          ></Route>
          <Route
            path="/profileEdit"
            element={
              <>
                <ProfilePage />
              </>
            }
          ></Route>
          <Route
            path="/createsession"
            element={
              <>
                <CreateSession />
              </>
            }
          ></Route>
        </Routes>
        {/* <Switch> */}
        {/* You can add more routes here */}
      </div>
    </Router>
  );
}

export default App;
