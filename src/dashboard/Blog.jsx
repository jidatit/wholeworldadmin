import React from 'react'
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import Button from "../components/Button"

const Blog = () => {
    return (
        <div className='w-full flex flex-col bg-[#FAFAFA] justify-center items-center'>

            <div className='w-[90%] flex flex-col justify-center items-start'>
                <h1 className='text-black font-bold text-[25px] mt-5 mb-5'>Blogs</h1>
            </div>

            <div className='w-[90%] gap-4 pt-5 mb-10 bg-white flex flex-col justify-center items-center rounded-md shadow-lg'>
                <TextField label="Enter Blog Title" type='text' className='w-[70%]' />
                <FormControl className='w-[70%]'>
                    <InputLabel id="demo-simple-select-label">Select Category of Blog</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={category}
                        label="Select Category of Item"
                    // onChange={handleChange}
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
                <TextField label="Name of Writer" type='text' className='w-[70%]' />
                <TextField label="Blog Description" type='text' className='w-[70%]' />
                <div className="flex items-center justify-center w-[70%]">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-34 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-white-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 text-center dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 text-center dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" />
                    </label>
                </div>
                <textarea className='w-[70%] border-2 rounded-lg p-2 outline-none min-h-28 max-h-60' placeholder='Write the Blog here' />
                <div className='w-[90%] mb-5 flex flex-col justify-end items-end'>
                    <div className='md:w-[30%] w-full pr-0 md:pr-2'>
                        <Button text="Publish" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Blog