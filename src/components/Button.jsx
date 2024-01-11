import React from 'react'

const Button = ({text, onClickProp}) => {
  return (
    <button onClick={onClickProp} className='w-full h-[50px] rounded-lg bg-gradient-to-r from-[#B08725] to-[#BCA163] font-bold text-[20px] text-white'>{text}</button>
  )
}

export default Button