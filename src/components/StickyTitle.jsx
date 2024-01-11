import React from 'react';
import usericon from "../assets/stickytitle/u.png"
import bell from "../assets/stickytitle//b.png"

function StickyTitle() {
  return (
    <div className='sticky z-[1000] w-full flex items-center justify-around top-0 bg-white shadow-md'>
      <div className="relative mt-5 mb-5">
        <input type="text" className="w-full h-[32px] bg-[#F6F6FB] rounded-md text-black outline-none pl-3 pr-12" placeholder="Search" />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="cursor-pointer w-5 h-5 opacity-30">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      </div>

      <div className='hidden md:flex h-[70px] flex-row gap-3 items-center'>
        <div className='flex flex-row gap-3 items-center'>
          <img className='w-[30px] h-[30px] rounded-full unselectable' src={usericon} alt="" />
          <span className='text-black font-semibold'>Kyle Brian</span>
        </div>
        <img src={bell} alt="" className="cursor-pointer rounded-lg w-[22px] h-[22px] hover:shadow-xl transition-transform transform hover:scale-105" />
      </div>
    </div>
  );
}

export default StickyTitle;
