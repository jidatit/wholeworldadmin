import React, { useContext, useState } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import AuthContext from "../../AuthContext";

const NewsSocialMediaPage = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [platform, setPlatform] = useState("");
  const [embedLink, setEmbedLink] = useState("");
  const { currentAdmin: currentUser } = useContext(AuthContext);

  //   console.log("current user", currentUser);

  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required";
    if (!category) newErrors.category = "Category is required";
    if (!platform) newErrors.platform = "Platform is required";
    if (!embedLink) newErrors.embedLink = "Embed link is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = async () => {
    if (!validateFields()) {
      //   console.log("Validation failed");

      return;
    }

    // console.log("Publishing...");
    if (currentUser.uid) {
      try {
        const docRef = await addDoc(collection(db, "news_social_posts"), {
          title,
          category,
          platform,
          embed: embedLink,
          likes: [],
          votes: [],
          author: currentUser.uid,
        });
        // console.log("Document written with ID: ", docRef.id);
        setTitle("");
        setCategory("");
        setPlatform("");
        setEmbedLink("");
        setErrors({});
        toast.success("post published");
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      toast.error("Please login to publish a post");
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
      <div className="w-[90%] flex flex-col justify-center items-start">
        <h1 className="text-black font-bold text-[25px] mt-5 mb-5">
          Social Media
        </h1>
      </div>

      <div className="w-[90%] gap-4 h-[500px] bg-white flex flex-col justify-center items-center rounded-md shadow-lg">
        <TextField
          label="Enter Title of Post"
          type="text"
          className="w-[70%]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
        />
        <FormControl className="w-[70%]" error={!!errors.category}>
          <InputLabel id="category-label">Select Category of Post</InputLabel>
          <Select
            labelId="category-label"
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value={"entertainment"}>Entertainment</MenuItem>
            <MenuItem value={"information"}>Information</MenuItem>
            <MenuItem value={"sports"}>Sports</MenuItem>
          </Select>
          {errors.category && (
            <p style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.category}
            </p>
          )}
        </FormControl>
        <FormControl className="w-[70%]" error={!!errors.platform}>
          <InputLabel id="platform-label">Select Video Platform</InputLabel>
          <Select
            labelId="platform-label"
            id="platform-select"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <MenuItem value={"Instagram"}>Instagram</MenuItem>
            <MenuItem value={"TikTok"}>TikTok</MenuItem>
            <MenuItem value={"Youtube"}>Youtube</MenuItem>
            <MenuItem value={"Facebook"}>Facebook</MenuItem>
          </Select>
          {errors.platform && (
            <p style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.platform}
            </p>
          )}
        </FormControl>
        <TextField
          label="Embed link"
          type="text"
          className="w-[70%]"
          value={embedLink}
          onChange={(e) => setEmbedLink(e.target.value)}
          error={!!errors.embedLink}
          helperText={errors.embedLink}
        />
        <div className="w-[90%] mb-5 flex flex-col justify-end items-end">
          <div className="md:w-[30%] w-full pr-0 md:pr-2">
            <button
              onClick={handlePublish}
              className="px-6 py-4  rounded-lg bg-gradient-to-r from-[#B08725] to-[#BCA163] font-bold text-xl text-white w-full"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSocialMediaPage;
