import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import StickyTitle from './components/StickyTitle';
import SideNav from './components/SideNav';
import Home from './dashboard/Home';
import Blog from './dashboard/Blog';
import Announements from './dashboard/Announements';
import SocialMedia from './dashboard/SocialMedia';

function App() {

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
        <div className="fixed left-0 right-0 top-0 bottom-0 flex">
          <SideNav />
          <div className="w-full overflow-x-auto">
            <div className="min-w-full md:min-w-[300px] lg:min-w-full">
              <StickyTitle />
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                  <CircularProgress />
                </Box>
              ) : (
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/social-media" element={<SocialMedia />} />
                  <Route path="/announcements" element={<Announements />} />
                  <Route path="/logout" element={<Logout />} />
                </Routes>
              )}
            </div>
          </div>
        </div>
      </Router>
    </>
  );
}


function Logout() {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[#1F2634] bg-opacity-75">
      <div
        className="w-[70%] h-[410px] md:h-[310px] rounded-lg mt-[40px] flex flex-col gap-[23px] justify-center items-center"
        style={{ background: 'linear-gradient(to right, #B08725,#BCA163)' }}
      >
        <p className="font-bold text-white text-2xl md:text-3xl text-center">Are you sure you want to logout?</p>
        <div className="w-full h-[70px] flex items-center flex-col md:flex-row gap-6 justify-center">
          <button onClick={() => navigate('/')} className="bg-[#BB000E] rounded-md w-[229px] h-[56px] font-bold text-white">
            Cancel
          </button>
          <button className="bg-[#059C4B] rounded-md w-[229px] h-[56px] font-bold text-white">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default App;
