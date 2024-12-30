import React, { useState, useEffect, useRef, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import LoadingBar from "react-top-loading-bar";
import StickyTitle from "./components/StickyTitle";
import SideNav from "./components/SideNav";
import Home from "./dashboard/Home";
import Blog from "./dashboard/Blog";
import Announements from "./dashboard/Announements";
import SocialMedia from "./dashboard/SocialMedia";
import Login from "./pages/Login";
import AuthContext from "../AuthContext";
import { AuthContextProvider } from "../AuthContext";
import { auth } from "../firebase";
import NewsSocialMediaPage from "./dashboard/NewsSocialMediaPage";
import Reports from "./dashboard/Reports";

function App() {
  const { currentAdmin, adminHere } = useContext(AuthContext);
  const ref = useRef(null);

  useEffect(() => {
    ref.current.complete();
  }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      <Router>
        <LoadingBar color="#f11946" ref={ref} />
        {!adminHere && !currentAdmin ? (
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        ) : (
          <div className="fixed left-0 right-0 top-0 bottom-0 flex">
            <SideNav />
            <div className="w-full overflow-x-auto">
              <div className="min-w-full md:min-w-[300px] lg:min-w-full">
                <StickyTitle />
                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100vh"
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <AuthContextProvider>
                          <Home />
                        </AuthContextProvider>
                      }
                    />
                    <Route
                      path="/blog"
                      element={
                        <AuthContextProvider>
                          <Blog />
                        </AuthContextProvider>
                      }
                    />
                    <Route
                      path="/social-media"
                      element={
                        <AuthContextProvider>
                          <SocialMedia />
                        </AuthContextProvider>
                      }
                    />
                    <Route
                      path="/news-social-media"
                      element={
                        <AuthContextProvider>
                          <NewsSocialMediaPage />
                        </AuthContextProvider>
                      }
                    />
                    <Route
                      path="/announcements"
                      element={
                        <AuthContextProvider>
                          <Announements />
                        </AuthContextProvider>
                      }
                    />
                    <Route
                      path="/report"
                      element={
                        <AuthContextProvider>
                          <Reports />
                        </AuthContextProvider>
                      }
                    />
                    <Route
                      path="/logout"
                      element={
                        <AuthContextProvider>
                          <Logout />
                        </AuthContextProvider>
                      }
                    />
                  </Routes>
                )}
              </div>
            </div>
          </div>
        )}
      </Router>
    </>
  );
}

function Logout() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[#1F2634] bg-opacity-75">
      <div
        className="w-[70%] h-[410px] md:h-[310px] rounded-lg mt-[40px] flex flex-col gap-[23px] justify-center items-center"
        style={{ background: "linear-gradient(to right, #B08725,#BCA163)" }}
      >
        <p className="font-bold text-white text-2xl md:text-3xl text-center">
          Are you sure you want to logout?
        </p>
        <div className="w-full h-[70px] flex items-center flex-col md:flex-row gap-6 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-[#BB000E] rounded-md w-[229px] h-[56px] font-bold text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="bg-[#059C4B] rounded-md w-[229px] h-[56px] font-bold text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
