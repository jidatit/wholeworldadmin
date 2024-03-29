import React, { useState } from 'react'
import { TextField, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material'
import Button from "../components/Button"
import { addDoc, collection } from "firebase/firestore";
import { db } from '../../firebase';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Blog = () => {

    const [MainImage, setMainImage] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        author: '',
        description: '',
        MainImageUrl: '',
        imagePreviews: [],
        dynamicContent: [{ heading: '', paragraph: '', images: [] }],
        keywords: [],
    });

    const handleFileChange = async (event, index) => {
        const files = Array.from(event.target.files);

        try {
            const urls = await Promise.all(files.map(async (file) => {
                const storageRef = ref(storage, `admin_blog_posts/${file.name}`);
                await uploadBytes(storageRef, file);
                return getDownloadURL(storageRef);
            }));

            setFormData(prevData => {
                const updatedDynamicContent = [...prevData.dynamicContent];
                if (!updatedDynamicContent[index]) {
                    updatedDynamicContent[index] = { heading: '', paragraph: '', images: [] };
                }
                updatedDynamicContent[index].images = urls;
                return { ...prevData, dynamicContent: updatedDynamicContent };
            });
        } catch (error) {
            console.error("Error uploading images:", error);
            toast.error("Error uploading images", {
                position: "top-center"
            });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddContent = () => {
        setFormData(prevData => ({
            ...prevData,
            dynamicContent: [...prevData.dynamicContent, { heading: '', paragraph: '' }]
        }));
    };

    const handleDynamicContentChange = (index, type, value) => {
        const updatedContent = [...formData.dynamicContent];
        updatedContent[index][type] = value;
        setFormData(prevData => ({
            ...prevData,
            dynamicContent: updatedContent
        }));
    };

    const handleKeywordsChange = (event) => {
        // Split the entered keywords by comma and trim any extra whitespace
        const keywords = event.target.value.split(',').map((keyword) => keyword.trim());
        setFormData((prevData) => ({
            ...prevData,
            keywords: keywords,
        }));
    };

    const handleClearKeywords = () => {
        setFormData((prevData) => ({
            ...prevData,
            keywords: [],
        }));
    };

    const handleMainImageUpload = async (event) => {
        const file = event.target.files[0];
        try {
            const storageRef = ref(storage, `admin_blog_posts/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setMainImage(downloadURL)
            setFormData(prevData => ({
                ...prevData,
                imagePreviews: [...prevData.imagePreviews, URL.createObjectURL(file)]
            }));
        } catch (error) {
            console.error("Error uploading main image:", error);
            toast.error("Error uploading main image", {
                position: "top-center"
            });
        }
    };


    const handleSubmit = async () => {
        let imagesUrl = [];
        try {
            if (formData.photos_field) {
                await Promise.all(
                    formData.photos_field.map(async (photo) => {
                        const storageRef = ref(storage, `admin_blog_posts/${photo.name}`);
                        await uploadBytes(storageRef, photo);
                        const downloadURL = await getDownloadURL(storageRef);
                        imagesUrl.push(downloadURL);
                    })
                );
            }

            const postData = {
                title: formData.title,
                category: formData.category,
                author: formData.author,
                description: formData.description,
                imagesUrl: MainImage,
                dynamicContent: formData.dynamicContent,
                keywords: formData.keywords,
            };
            await addDoc(collection(db, 'admin_blog_posts'), postData);
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
                <h1 className='text-black font-bold text-[25px] mt-5 mb-5'>Blogs</h1>
            </div>

            <div className='w-[90%] gap-4 pt-5 mb-10 bg-white flex flex-col justify-center items-center rounded-md shadow-lg'>
                <TextField required label="Enter Blog Title" type='text' onChange={handleChange} name='title' value={formData.title} className='w-[70%]' />
                <FormControl className='w-[70%]'>
                    <InputLabel id="demo-simple-select-label">Select Category of Blog</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Select Category of Item"
                        onChange={handleChange} name='category' value={formData.category}
                        required
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>

                <div className='w-[70%] flex flex-col md:flex-row justify-center items-center gap-1'>
                    <TextField
                        label="Keywords"
                        type="text"
                        onChange={handleKeywordsChange}
                        name="keywords"
                        value={formData.keywords.join(', ')}
                        className='w-[95%]'
                    />
                    <IconButton className='w-[25%] md:w-[5%]' onClick={handleClearKeywords} size="medium">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </IconButton>
                </div>

                <TextField required label="Name of Author" type='text' onChange={handleChange} name='author' value={formData.author} className='w-[70%]' />
                <TextField required label="Blog Description" type='text' onChange={handleChange} name='description' value={formData.description} className='w-[70%]' />

                {/* Dynamic content */}
                {formData.dynamicContent.map((content, index) => (
                    <div className='w-[70%] flex flex-col justify-center items-center gap-2' key={index}>
                        <TextField
                            label={`Heading ${index + 1}`}
                            value={content.heading}
                            onChange={(e) => handleDynamicContentChange(index, 'heading', e.target.value)}
                            className="w-full mt-2 mb-5"
                        />
                        <TextField
                            label={`Paragraph ${index + 1}`}
                            value={content.paragraph}
                            onChange={(e) => handleDynamicContentChange(index, 'paragraph', e.target.value)}
                            multiline
                            rows={4}
                            className="w-full mb-5"
                        />
                        {/* Image upload for each dynamic content */}
                        <div className="w-[70%] mb-5">
                            <input type="file" onChange={(e) => handleFileChange(e, index)} multiple />
                        </div>
                        {/* Display image previews */}
                        <div className='w-full flex flex-row justify-center items-center'>
                            {content.imagePreviews && content.imagePreviews.map((preview, i) => (
                                <img key={i} src={preview} alt={`Image ${i}`} className="w-10 h-10 m-2 object-cover rounded-lg" />
                            ))}
                        </div>
                    </div>
                ))}


                {/* Plus button to add new dynamic content */}
                <div className='w-[10%]'>
                    <Button onClickProp={handleAddContent} text="+" />
                </div> 

                <div className="flex items-center justify-center w-[70%]">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-34 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-white-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 text-center dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 text-center dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" onChange={handleMainImageUpload} type="file" className="hidden" />
                    </label>
                </div>

                <p className='text-center italic'>Select main image of the blog</p>

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

export default Blog