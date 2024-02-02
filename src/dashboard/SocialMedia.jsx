import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { TextField } from '@mui/material';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';

const SocialMedia = () => {
    const [entity, setEntity] = useState({});
    const [updatedMainVideo, setUpdatedMainVideo] = useState(null);
    const [updatedVideo, setUpdatedVideo] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [videoOne, setVideoOne] = useState({});
    const [videoTwo, setVideoTwo] = useState({});
    const [videoThree, setVideoThree] = useState({});
    const [updatedVideoOnePageUrl, setUpdatedVideoOnePageUrl] = useState("");
    const [updatedVideoTwoPageUrl, setUpdatedVideoTwoPageUrl] = useState("");
    const [updatedVideoThreePageUrl, setUpdatedVideoThreePageUrl] = useState("");

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
                setVideoOne(data.videoOne)
                setVideoTwo(data.videoTwo)
                setVideoThree(data.videoThree)
                setUpdatedVideoOnePageUrl(data.videoOne.pageUrl)
                setUpdatedVideoTwoPageUrl(data.videoTwo.pageUrl)
                setUpdatedVideoThreePageUrl(data.videoThree.pageUrl)
            } catch (error) {
                toast.error(error.message);
            }
        };
        getPosts();
    }, []);

    const handleVideoUpdate = async (videoToUpdate, updatedVideoFile) => {
        try {
            if (!updatedVideoFile) {
                toast.error("Please select a video file.");
                return;
            }
            const storageFolderPath = `admin_socialmedia_posts/${videoToUpdate}.mp4`;
            const storageRef = ref(storage, storageFolderPath);
            await uploadBytes(storageRef, updatedVideoFile);

            const updatedVideoDownloadUrl = await getDownloadURL(storageRef);

            await setDoc(doc(db, "admin_socialmedia_posts", entity.id), {
                ...entity,
                [videoToUpdate]: {
                    ...entity[videoToUpdate],
                    url: updatedVideoDownloadUrl
                }
            });

            toast.success(`${videoToUpdate} updated successfully!`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleMainVideoUpdate = async () => {
        try {
            if (!updatedMainVideo) {
                toast.error("Please select a main video file.");
                return;
            }
            const storageFolderPath = `admin_socialmedia_posts/main_video.mp4`;
            const storageRef = ref(storage, storageFolderPath);
            await uploadBytes(storageRef, updatedMainVideo);

            const updatedMainVideoDownloadUrl = await getDownloadURL(storageRef);

            await setDoc(doc(db, "admin_socialmedia_posts", entity.id), {
                ...entity,
                videoUrl: updatedMainVideoDownloadUrl
            });

            toast.success("Main video updated successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setUpdatedVideo(file);
    };

    const handleMainFileChange = (event) => {
        const file = event.target.files[0];
        setUpdatedMainVideo(file);
    };

    const handleTitleChange = (event) => {
        setUpdatedTitle(event.target.value);
    };

    const handleTitleUpdate = async () => {
        try {
            await setDoc(doc(db, "admin_socialmedia_posts", entity.id), {
                ...entity,
                title: updatedTitle
            });
            toast.success("Title updated successfully!");
            setEntity({ ...entity, title: updatedTitle });
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handlePageUrlUpdate = async (videoToUpdate, updatedPageUrl) => {
        try {
            await setDoc(doc(db, "admin_socialmedia_posts", entity.id), {
                ...entity,
                [videoToUpdate]: {
                    ...entity[videoToUpdate],
                    pageUrl: updatedPageUrl
                }
            });
            toast.success(`${videoToUpdate} pageUrl updated successfully!`);
        } catch (error) {
            toast.error(error.message);
        }
    };


    return (
        <div className='w-full flex flex-col bg-[#FAFAFA] justify-center items-center'>
            <ToastContainer />
            <div className='w-[90%] flex flex-col justify-center items-start'>
                <h1 className='text-black font-bold text-[25px] mt-5 mb-5'>Social Media Posts</h1>
            </div>

            <div className='w-[90%] gap-4 pt-5 pb-5 bg-white flex flex-col justify-center items-center rounded-md shadow-lg'>
                <div className='w-[80%] flex flex-row justify-center items-center gap-3'>
                    <TextField
                        value={updatedTitle !== "" ? updatedTitle : entity.title}
                        onChange={handleTitleChange}
                        className='md:w-[75%]'
                    />
                    <button
                        className='px-3 py-3 bg-blue-600 rounded-lg text-white'
                        onClick={handleTitleUpdate}
                    >
                        Update
                    </button>
                </div>

                {/* Render main video */}
                {entity.videoUrl ? (
                    <div className='md:w-[75%] w-full flex flex-col justify-center items-center gap-3'>
                        <video className="w-full h-[200px]" controls>
                            <source src={entity.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <input
                            accept="video/*"
                            id="main-video-file-upload"
                            type="file"
                            onChange={handleMainFileChange}
                        />
                        <button className='bg-blue-600 px-2 py-2 rounded-md text-white' variant="contained" onClick={handleMainVideoUpdate}>Update Main Video</button>
                    </div>
                ) : (
                    <p className='text-center font-bold'>No Main Video Uploaded.</p>
                )}

                {/* Render controls for main video */}

                <div className="w-full flex flex-row justify-center gap-3 items-center">
                    {/* Render videoOne */}
                    {videoOne.url && (
                        <div className='md:w-[30%] w-full flex flex-col justify-center items-center gap-3'>
                            <video className="w-full h-[200px]" controls>
                                <source src={videoOne.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <input
                                accept="video/*"
                                id="video-file-upload"
                                type="file"
                                onChange={(event) => handleFileChange(event, "videoOne")}
                            />
                            <button className='bg-blue-600 px-2 py-2 rounded-md text-white' variant="contained" onClick={() => handleVideoUpdate("videoOne", updatedVideo)}>Update Video One</button>
                            <TextField
                                className='w-full'
                                value={updatedVideoOnePageUrl}
                                onChange={(event) => setUpdatedVideoOnePageUrl(event.target.value)}
                            />
                            <button className='w-full bg-gray-400 px-2 py-2 rounded-md text-white' onClick={() => handlePageUrlUpdate("videoOne", updatedVideoOnePageUrl)}>Update PageUrl</button>
                        </div>
                    )}
                    {/* Render videoTwo */}
                    {videoTwo.url && (
                        <div className='md:w-[30%] w-full flex flex-col justify-center items-center gap-3'>
                            <video className="w-full h-[200px]" controls>
                                <source src={videoTwo.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <input
                                accept="video/*"
                                id="video-file-upload"
                                type="file"
                                onChange={(event) => handleFileChange(event, "videoTwo")}
                            />
                            <button className='bg-blue-600 px-2 py-2 rounded-md text-white' variant="contained" onClick={() => handleVideoUpdate("videoTwo", updatedVideo)}>Update Video Two</button>
                            <TextField
                                className='w-full'
                                value={updatedVideoTwoPageUrl}
                                onChange={(event) => setUpdatedVideoTwoPageUrl(event.target.value)}
                            />
                            <button className='w-full bg-gray-400 px-2 py-2 rounded-md text-white' onClick={() => handlePageUrlUpdate("videoTwo", updatedVideoTwoPageUrl)}>Update PageUrl</button>
                        </div>
                    )}
                    {/* Render videoThree */}
                    {videoThree.url && (
                        <div className='md:w-[30%] w-full flex flex-col justify-center items-center gap-3'>
                            <video className="w-full h-[200px]" controls>
                                <source src={videoThree.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <input
                                accept="video/*"
                                id="video-file-upload"
                                type="file"
                                onChange={(event) => handleFileChange(event, "videoThree")}
                            />
                            <button className='bg-blue-600 px-2 py-2 rounded-md text-white' variant="contained" onClick={() => handleVideoUpdate("videoThree", updatedVideo)}>Update Video Three</button>
                            <TextField
                                className='w-full'
                                value={updatedVideoThreePageUrl}
                                onChange={(event) => setUpdatedVideoThreePageUrl(event.target.value)}
                            />
                            <button className='w-full bg-gray-400 px-2 py-2 rounded-md text-white' onClick={() => handlePageUrlUpdate("videoThree", updatedVideoThreePageUrl)}>Update PageUrl</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SocialMedia;

