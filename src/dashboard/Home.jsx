import React, { useState } from 'react'
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import Button from "../components/Button"
import { addDoc, collection } from "firebase/firestore";
import { db } from '../../firebase';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Home = () => {

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        imagesUrl: [],
        imagePreviews: [], // Store data URLs for image previews
    });

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const imagePreviews = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreviews.push(e.target.result); // Push data URL to imagePreviews array
                setFormData((prevData) => ({
                    ...prevData,
                    imagePreviews: [...imagePreviews],
                }));
            };
            reader.readAsDataURL(file);
        });

        setFormData((prevData) => ({
            ...prevData,
            photos_field: files,
        }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        let imagesUrl = [];
        try {
            if (formData.photos_field) {
            await Promise.all(
                formData.photos_field.map(async (photo) => {
                    const storageRef = ref(storage, `admin_homepage_posts/${photo.name}`);
                    await uploadBytes(storageRef, photo);
                    const downloadURL = await getDownloadURL(storageRef);
                    imagesUrl.push(downloadURL);
                })
            );
            }

            const postData = {
                title: formData.title,
                category: formData.category,
                description: formData.description,
                imagesUrl: imagesUrl,
            };

            await addDoc(collection(db, 'admin_homepage_posts'), postData);
            console.log("Document successfully written to Firestore.");
            toast.success("Success !", {
                position: "top-center"
            });
        } catch (error) {
            console.error("Error writing document to Firestore:", error);
            toast.error("Error !", {
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

            <div className='w-[90%] gap-4 h-[600px] bg-white flex flex-col justify-center items-center rounded-md shadow-lg'>
                <TextField required label="Enter Title of Section" type='text' onChange={handleChange} value={formData.title} name='title' className='w-[70%]' />
                <FormControl className='w-[70%]'>
                    <InputLabel id="demo-simple-select-label">Select Category of Section</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Select Category of Item"
                        onChange={handleChange} value={formData.category} name='category'
                        required
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
                <TextField required label="Write Section Description here" onChange={handleChange} value={formData.description} name='description' type='text' className='w-[70%]' />

                <div className="flex items-center justify-center w-[70%]">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-34 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-white-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 text-center dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 text-center dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" onChange={handleFileChange} name='imagesUrl' type="file" multiple className="hidden" />
                    </label>
                </div>

                <div className='w-full flex flex-row justify-center items-center'>
                    {formData.imagePreviews.length > 0 && formData.imagePreviews.map((preview, index) => (
                        <img key={index} src={preview} alt={`Thumbnail ${index}`} className="w-10 h-10 m-2 object-cover rounded-lg" />
                    ))}
                </div>

                <div className='w-[90%] mb-5 flex flex-col justify-end items-end'>
                    <div className='md:w-[30%] w-full pr-0 md:pr-2'>
                        <Button onClickProp={handleSubmit} text="Publish" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home