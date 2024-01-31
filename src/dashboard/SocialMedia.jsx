import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { TextField } from '@mui/material';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from '@firebase/storage';

const SocialMedia = () => {
    const [entity, setEntity] = useState({});
    const [updatedVideo, setUpdatedVideo] = useState(null);
    const [updatedImage, setUpdatedImage] = useState(null);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "admin_socialmedia_posts"));
                let data = {};
                querySnapshot.forEach((doc) => {
                    data = {
                        id: doc.id,
                        ...doc.data()
                    };
                });
                setEntity(data);
            } catch (error) {
                toast.error(error.message);
            }
        };
        getPosts();
    }, []);

    const handleVideoUpdate = async () => {
        try {
            if (!updatedVideo) {
                toast.error("Please select a video file.");
                return;
            }
            const storageFolderPath = `admin_socialmedia_posts/updated_video.mp4`;
            const storageRef = ref(storage, storageFolderPath);
            await uploadBytes(storageRef, updatedVideo);

            const updatedVideoDownloadUrl = await getDownloadURL(storageRef);

            const updatedImagesUrl = [...entity.imagesUrl];

            await setDoc(doc(db, "admin_socialmedia_posts", entity.id), {
                imagesUrl: updatedImagesUrl,
                title: entity.title,
                videoUrl: updatedVideoDownloadUrl
            });

            toast.success("Video updated successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleVideoDelete = async () => {
        try {
            const videoUrl = entity.videoUrl;
            if (!videoUrl) {
                toast.error("No video found to delete.");
                return;
            }

            const storageRef = ref(storage, `admin_socialmedia_posts/updated_video.mp4`);
            await deleteObject(storageRef);
            const updatedImagesUrl = [...entity.imagesUrl];

            await setDoc(doc(db, "admin_socialmedia_posts", entity.id), {
                imagesUrl: updatedImagesUrl,
                title: entity.title,
                videoUrl: ''
            });

            toast.success("Video deleted successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setUpdatedVideo(file);
    };

    const updateImage = async (index) => {
        try {
            if (!updatedImage) {
                toast.error("Please select a new image file.");
                return;
            }

            const storageFolderPath = `admin_socialmedia_posts/${index}_updated_image.jpg`;
            const storageRef = ref(storage, storageFolderPath);
            await uploadBytes(storageRef, updatedImage);

            const updatedImageUrl = await getDownloadURL(storageRef);

            const updatedImagesUrl = [...entity.imagesUrl];
            updatedImagesUrl[index] = updatedImageUrl;

            await setDoc(doc(db, "admin_socialmedia_posts", entity.id), {
                imagesUrl: updatedImagesUrl,
                title: entity.title,
                videoUrl: entity.videoUrl
            });

            toast.success("Image updated successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteImage = async (index) => {
        try {
            const updatedImagesUrl = [...entity.imagesUrl];
            updatedImagesUrl[index] = "";

            await setDoc(doc(db, "admin_socialmedia_posts", entity.id), {
                imagesUrl: updatedImagesUrl,
                title: entity.title,
                videoUrl: entity.videoUrl
            });

            toast.success("Image deleted successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };


    const handleImageChange = (index, event) => {
        const file = event.target.files[0];
        setUpdatedImage(file);
    };

    return (
        <div className='w-full flex flex-col bg-[#FAFAFA] justify-center items-center'>
            <ToastContainer />
            <div className='w-[90%] flex flex-col justify-center items-start'>
                <h1 className='text-black font-bold text-[25px] mt-5 mb-5'>Social Media Posts</h1>
            </div>

            <div className='w-[90%] gap-4 pt-5 pb-5 bg-white flex flex-col justify-center items-center rounded-md shadow-lg'>
                <div className='w-[80%] flex flex-row justify-center items-center gap-3'>
                    <TextField value={entity.title ? entity.title : ""} onChange={(e) => entity.title} className='md:w-[75%]' label="Enter Title" />
                    <button className='px-3 py-3 bg-blue-600 rounded-lg text-white'>Update</button>
                </div>
                <div className='w-full flex flex-row justify-center gap-3 items-center flex-wrap'>

                    {entity.imagesUrl && entity.imagesUrl?.map((imageUrl, index) => (
                        <div key={index} className='relative min-h-[200px] bg-gray-300 rounded-md w-full sm:w-[50%] md:w-[33%] lg:w-[25%] max-h-[200px]'>
                            <img className='w-full max-h-[200px] rounded-md' src={imageUrl} alt="" />
                            <input
                                accept="image/*"
                                id={`image-file-upload-${index}`}
                                type="file"
                                onChange={(event) => handleImageChange(index, event)}
                            />
                            <button onClick={() => updateImage(index)} className='absolute top-[20%] sm:top-[15%] md:top-[20%] bg-blue-500 right-[40%] sm:right-[35%] md:right-[40%] text-white font-semibold px-5 py-3 rounded-lg'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                            </button>
                            <button onClick={() => deleteImage(index)} className='absolute top-[55%] sm:top-[70%] md:top-[55%] bg-red-500 text-white font-semibold right-[40%] sm:right-[35%] md:right-[40%] px-5 py-3 rounded-lg'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    ))}

                </div>

                {entity.videoUrl ? (
                    <video className="w-full md:w-[75%] h-[200px]" controls>
                        <source src={entity.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <>
                        <p className='text-center font-bold'>No Video Uploaded.</p>
                    </>
                )}

                <div className="w-full flex flex-row justify-center gap-3 items-center">
                    <input
                        accept="video/*"
                        id="video-file-upload"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <button variant="contained" onClick={handleVideoUpdate}>Update Video</button>
                    <button variant="contained" onClick={handleVideoDelete}>Delete Video</button>
                </div>

            </div>
        </div>
    );
};

export default SocialMedia;