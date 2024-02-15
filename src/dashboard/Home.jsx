import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import Button from "../components/Button";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Home = () => {

    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [docId, setDocId] = useState('');
    const [updatedUrl, setUpdatedUrl] = useState('')

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "admin_homepage_posts"));
            let data = {};
            querySnapshot.forEach((doc) => {
                data = {
                    id: doc.id,
                    ...doc.data()
                };
            });
            setTitle(data.title);
            setDocId(data.id);
            setVideoUrl(data.videoUrl);
            setUpdatedUrl(data.videoUrl)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleUpdateTitle = async () => {
        try {
            await updateDoc(doc(db, "admin_homepage_posts", docId), {
                title: title
            });
            console.log("Title updated successfully.");
            toast.success("Title updated successfully.", {
                position: "top-center"
            });
        } catch (error) {
            console.error("Error updating title:", error);
            toast.error("Error updating title.", {
                position: "top-center"
            });
        }
    };

    const handleUpdateVideoUrl = async () => {
        try {
            await updateDoc(doc(db, "admin_homepage_posts", docId), {
                videoUrl: updatedUrl
            });
            console.log("Video updated successfully.");
            toast.success("Video updated successfully.", {
                position: "top-center"
            });
        } catch (error) {
            console.error("Error updating video:", error);
            toast.error("Error updating video.", {
                position: "top-center"
            });
        }
    };

    return (
        <div className='w-full flex flex-col bg-[#FAFAFA] justify-center items-center'>
            <ToastContainer />
            <div className='w-[90%] flex flex-col justify-center items-start'>
                <h1 className='text-black font-bold text-[25px] mt-5 mb-5'>Add New Section to Home Page</h1>
            </div>

            <div className='w-[90%] gap-4 pt-10 bg-white flex flex-col justify-center items-center rounded-md shadow-lg'>
                <TextField required label="Enter Title of Section" value={title} type='text' onChange={handleTitleChange} name='title' className='w-[70%]' />

                <div className='w-[90%] mb-5 flex flex-col justify-end items-end'>
                    <div className='md:w-[30%] w-full pr-0 md:pr-2'>
                        <Button onClickProp={handleUpdateTitle} text="Update Title" />
                    </div>
                </div>

                {videoUrl && (
                    <iframe className='w-[70%] h-[200px]' src={videoUrl} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                )}
                <TextField required label="Enter Video Url" value={updatedUrl} type='text' onChange={(e) => setUpdatedUrl(e.target.value)} name='updatedUrl' className='w-[70%]' />
                <div className='w-[90%] mb-5 flex flex-col justify-end items-end'>
                    <div className='md:w-[30%] w-full pr-0 md:pr-2'>
                        <Button onClickProp={handleUpdateVideoUrl} text="Change Video Url" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;