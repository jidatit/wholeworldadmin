import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import Button from "../components/Button";
import { getDocs,collection, doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Home = () => {

    const [title, setTitle] = useState('');
    const [video, setVideo] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [docId, setDocId] = useState('');

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
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        setVideo(file);
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

    const handleUpdateVideo = async () => {
        try {
            if (video) {
                const storageRef = ref(storage, `admin_homepage_videos/${video.name}`);
                await uploadBytes(storageRef, video);
                const downloadURL = await getDownloadURL(storageRef);
                setVideoUrl(downloadURL);

                await updateDoc(doc(db, "admin_homepage_posts", docId), {
                    videoUrl: downloadURL
                });
                console.log("Video updated successfully.");
                toast.success("Video updated successfully.", {
                    position: "top-center"
                });
            } else {
                toast.error("Select a video first.", {
                    position: "top-center"
                });
            }
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
                    <video className="w-[70%] h-[200px]" controls>
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}

                <div className="flex items-center justify-center w-[70%]">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-34 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-white-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 text-center dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 text-center dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" onChange={handleVideoChange} name='imagesUrl' type="file" multiple className="hidden" />
                    </label>
                </div>

                <div className='w-[90%] mb-5 flex flex-col justify-end items-end'>
                    <div className='md:w-[30%] w-full pr-0 md:pr-2'>
                        <Button onClickProp={handleUpdateVideo} text="Publish Video" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;