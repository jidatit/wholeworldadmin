import React, { useState } from 'react'
import globe from "../assets/login/globe.png"
import { TextField } from '@mui/material'
import Button from '../components/Button'
import { auth } from '../../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const Login = () => {

    const [UserInfo, setUserInfo] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...UserInfo,
            [name]: value
        });
    };

    async function handleSignIn() {
        try {
            if (!UserInfo.email || !UserInfo.password) {
                return;
            }
            await signInWithEmailAndPassword(auth, UserInfo.email, UserInfo.password);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);
        }
    }

    return (
        <>
            <div className='min-h-screen bg-[#BCA163]'>
                <div className='w-full min-h-screen flex flex-col justify-center items-center'>
                    <div className='w-[90%] md:w-[40%] bg-white min-h-[600px] gap-5 flex flex-col justify-center items-center shadow-xl rounded-lg'>
                        <div className='w-[70%] flex flex-col justify-center gap-2 pb-3 items-center'>
                            <img className='md:w-[150px] md:h-[149px] mt-[20px] mb-[20px]' src={globe} alt="" />
                            <h1 className='md:text-[32px] text-[28px] text-center font-bold'>Login</h1>
                            <TextField onChange={handleChange} value={UserInfo.email} name='email' label="Email" type='email' className='w-full' />
                            <TextField label="Password" onChange={handleChange} name='password' value={UserInfo.password} type='password' className='w-full' />
                            <Button onClickProp={handleSignIn} text="Login" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login