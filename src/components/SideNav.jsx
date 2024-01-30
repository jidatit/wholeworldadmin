import React, { useState, useEffect } from "react";
import LOGO from "../assets/login/globe.png"
import { Link, useLocation } from "react-router-dom";
import { HiMenuAlt3, HiSpeakerphone } from "react-icons/hi";
import { FiUsers, FiShare2, FiLogOut } from 'react-icons/fi';
import { SiBlogger } from "react-icons/si";

const SideNav = () => {

  const menus = [
    // { name: "Home Page", link: "/", icon: FiUsers },
    { name: "Blog", link: "/blog", icon: SiBlogger },
    { name: "Social Media Posts", link: "/", icon: FiShare2 },
    // { name: "Social Media Posts", link: "/social-media", icon: FiShare2 },
    { name: "Announcements", link: "/announcements", icon: HiSpeakerphone },
    { name: "Logout", link: "/logout", icon: FiLogOut },
  ];
  const [open, setOpen] = useState(true);

  const location = useLocation();

  const updateScreenSize = () => {
    if (window.innerWidth <= 768) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return (
    <section className="flex relative">
      <div
        className={` bg-[#B99B55] min-h-screen shadow-md overflow-y-auto  custom-scrollbar ${open ? "w-72" : " w-14 lg:w-[75px]"
          } duration-500 text-gray-100 px-2 lg:px-4 py-1 sm:py-2 md:py-2 lg:py-4 xl:py-3 2xl:py-3`}
      >
        <div className="py-1 flex justify-end">
          {/* {open && (
            // <img className="cursor-pointer w-[90px] h-[90px] unselectable" onClick={() => setOpen(!open)} src={LOGO} alt="" />
          )} */}
          <img
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
            src={LOGO}
            alt=""
            style={{ display: !open ? "block" : "none" }}
          />
          <HiMenuAlt3
            size={26}
            className="cursor-pointer text-[#6d5825]"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-2 relative max-h-[820px] overflow-y-auto overflow-x-hidden">
          {menus?.map((menu, i) => (
            <Link
              to={menu?.link}
              key={i}
              className={`${menu?.margin && ""
                } group flex items-center text-base  gap-3.5 font-poppins hover:bg-[#827320] hover:text-white hover:duration-100 rounded-md ${open && "p-2" // Add the p-2 class when open is true
                } ${location.pathname === menu?.link ? "bg-[#dfb63b] text-white" : "text-white"}`}
            >
              <div className="p-2 lg:p-2.5 rounded-md bg-[#ce9d35] text-white">
                {React.createElement(menu?.icon, { size: "20" })}
              </div>
              <h2
                style={{
                  transitionDelay: `${i + 2}00ms`,
                }}
                className={`whitespace-pre duration-200 ${!open && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${open && "hidden"
                  } absolute left-48 bg-white font-poppins whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
};

export default SideNav;