import React, { useEffect } from "react";
import Home from "./pages/Home/Home";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Player from "./pages/Player/Player";
import Browse from "./pages/Browse/Browse";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Logged In");
        if (location.pathname === "/login") {
          navigate("/");
        }
      } else if (location.pathname !== "/login") {
        console.log("Logged Out");
        navigate("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [location.pathname, navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/:pageType" element={<Browse />} />
        <Route path="/player/:mediaType/:id" element={<Player />} />
        <Route path="/player/:id" element={<Player />} />
      </Routes>
    </div>
  );
};

export default App;
