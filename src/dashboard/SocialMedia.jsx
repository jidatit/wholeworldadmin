import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField } from "@mui/material";

const SocialMedia = () => {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [videoRef, setVideoRef] = useState("");
  const [entity, setEntity] = useState({});
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedVideoUrl, setupdatedVideoUrl] = useState("");
  const [videoOne, setVideoOne] = useState({});
  const [videoTwo, setVideoTwo] = useState({});
  const [videoThree, setVideoThree] = useState({});
  const [updatedVideoOnePageUrl, setUpdatedVideoOnePageUrl] = useState("");
  const [updatedVideoTwoPageUrl, setUpdatedVideoTwoPageUrl] = useState("");
  const [updatedVideoThreePageUrl, setUpdatedVideoThreePageUrl] = useState("");
  const [showpopup, setshowpopup] = useState(false);

  function convertToEmbed(url) {
    const urlObj = new URL(url);
    // Check if it's a standard YouTube URL with a `v` parameter
    const videoId = urlObj.searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Handle share URLs (e.g., https://youtu.be/VIDEO_ID)
    if (urlObj.hostname === "youtu.be") {
      const videoIdFromPath = urlObj.pathname.slice(1); // Remove the leading '/'
      if (videoIdFromPath) {
        return `https://www.youtube.com/embed/${videoIdFromPath}`;
      }
    }

    // Return null for invalid or unrecognized URLs
    return null;
  }

  const getPosts = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "admin_socialmedia_posts")
      );
      let data = {};
      querySnapshot.forEach((doc) => {
        data = {
          id: doc.id,
          ...doc.data(),
        };
      });
      setEntity(data);
      setupdatedVideoUrl(data.videoUrl);
      setVideoOne(data.videoOne);
      setVideoTwo(data.videoTwo);
      setVideoThree(data.videoThree);
      setUpdatedVideoOnePageUrl(data.videoOne.pageUrl);
      setUpdatedVideoTwoPageUrl(data.videoTwo.pageUrl);
      setUpdatedVideoThreePageUrl(data.videoThree.pageUrl);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleTitleChange = (event) => {
    setUpdatedTitle(event.target.value);
  };

  const handleTitleUpdate = async () => {
    try {
      await setDoc(doc(db, "admin_socialmedia_posts", entity.id), {
        ...entity,
        title: updatedTitle,
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
          pageUrl: updatedPageUrl,
        },
      });
      toast.success(`${videoToUpdate} pageUrl updated successfully!`);
      getPosts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleVideoUrlUpdate = async () => {
    try {
      await setDoc(doc(db, "admin_socialmedia_posts", entity.id), {
        ...entity,
        videoUrl: updatedVideoUrl,
      });
      getPosts();
      toast.success("Video url updated successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
      <ToastContainer />
      <div className="w-[90%] flex flex-col justify-center items-start">
        <h1 className="text-black font-bold text-[25px] mt-5 mb-5">
          Social Media Posts
        </h1>
      </div>

      <div className="w-[90%] gap-4 pt-5 pb-5 bg-white flex flex-col justify-center items-center rounded-md shadow-lg">
        <div className="w-[80%] flex flex-row justify-center items-center gap-3">
          <TextField
            value={updatedTitle !== "" ? updatedTitle : entity.title}
            onChange={handleTitleChange}
            className="md:w-[75%]"
          />
          <button
            className="px-3 py-3 bg-blue-600 rounded-lg text-white"
            onClick={handleTitleUpdate}
          >
            Update
          </button>
        </div>

        {entity.videoUrl ? (
          <div className="md:w-[75%] w-full flex flex-col justify-center items-center gap-3">
            <iframe
              className="w-full h-[200px]"
              src={convertToEmbed(entity.videoUrl)}
              frameborder="0"
            ></iframe>
            <TextField
              onChange={(e) => setupdatedVideoUrl(e.target.value)}
              value={updatedVideoUrl}
              className="w-full"
              label="Video Url"
            />
            <button
              onClick={handleVideoUrlUpdate}
              className="md:w-[40%] w-full px-3 py-3 bg-blue-600 rounded-lg text-white"
            >
              Update
            </button>
          </div>
        ) : (
          <p className="text-center font-bold">No Main Video Uploaded.</p>
        )}

        <div className="w-full flex flex-row justify-center gap-3 items-center">
          {videoOne.url && (
            <div className="md:w-[30%] w-full flex flex-col justify-center items-center gap-3">
              <div className="w-full h-[200px] relative">
                <iframe
                  className="w-full h-[200px]"
                  src={convertToEmbed(videoOne.url)}
                  frameborder="0"
                ></iframe>

                <svg
                  onClick={() => {
                    setshowpopup(true);
                    setSelectedVideoUrl(videoOne.url);
                    setVideoRef("videoOne");
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="absolute text-white top-2 right-3 z-[12] cursor-pointer w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </div>
              <TextField
                className="w-full"
                value={updatedVideoOnePageUrl}
                onChange={(event) =>
                  setUpdatedVideoOnePageUrl(event.target.value)
                }
              />
              <button
                className="w-full bg-gray-400 px-2 py-2 rounded-md text-white"
                onClick={() =>
                  handlePageUrlUpdate("videoOne", updatedVideoOnePageUrl)
                }
              >
                Update PageUrl
              </button>
            </div>
          )}
          {videoTwo.url && (
            <div className="md:w-[30%] w-full flex flex-col justify-center items-center gap-3">
              <div className="w-full h-[200px] relative">
                <iframe
                  className="w-full h-[200px]"
                  src={convertToEmbed(videoTwo.url)}
                  frameborder="0"
                ></iframe>
                <svg
                  onClick={() => {
                    setshowpopup(true);
                    setSelectedVideoUrl(videoTwo.url);
                    setVideoRef("videoTwo");
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="absolute text-white top-2 right-3 z-[12] cursor-pointer w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </div>
              <TextField
                className="w-full"
                value={updatedVideoTwoPageUrl}
                onChange={(event) =>
                  setUpdatedVideoTwoPageUrl(event.target.value)
                }
              />
              <button
                className="w-full bg-gray-400 px-2 py-2 rounded-md text-white"
                onClick={() =>
                  handlePageUrlUpdate("videoTwo", updatedVideoTwoPageUrl)
                }
              >
                Update PageUrl
              </button>
            </div>
          )}
          {videoThree.url && (
            <div className="md:w-[30%] w-full flex flex-col justify-center items-center gap-3">
              <div className="w-full h-[200px] relative">
                <iframe
                  className="w-full h-[200px]"
                  src={convertToEmbed(videoThree.url)}
                  frameborder="0"
                ></iframe>
                <svg
                  onClick={() => {
                    setshowpopup(true);
                    setSelectedVideoUrl(videoThree.url);
                    setVideoRef("videoThree");
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="absolute text-white top-2 right-3 z-[12] cursor-pointer w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </div>
              <TextField
                className="w-full"
                value={updatedVideoThreePageUrl}
                onChange={(event) =>
                  setUpdatedVideoThreePageUrl(event.target.value)
                }
              />
              <button
                className="w-full bg-gray-400 px-2 py-2 rounded-md text-white"
                onClick={() =>
                  handlePageUrlUpdate("videoThree", updatedVideoThreePageUrl)
                }
              >
                Update PageUrl
              </button>
            </div>
          )}
        </div>
      </div>
      {showpopup && (
        <Popup
          videoUrl={selectedVideoUrl}
          handleClose={() => setshowpopup(false)}
          entity={entity}
          videoRef={videoRef}
        />
      )}
    </div>
  );
};

const Popup = ({ videoUrl, videoRef, entity, handleClose }) => {
  const [updatedUrl, setUpdatedUrl] = useState(videoUrl);

  const handleUrlChange = (event) => {
    setUpdatedUrl(event.target.value);
  };

  const handleUrlUpdate = async () => {
    try {
      await setDoc(doc(db, "admin_socialmedia_posts", entity.id), {
        ...entity,
        [videoRef]: {
          ...entity[videoRef],
          url: updatedUrl,
        },
      });
      handleClosePop();
      toast.success(`${videoRef} url changed`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClosePop = () => {
    handleClose();
  };

  return (
    <>
      <div className="fixed top-0 z-[300] left-0 w-screen h-screen flex items-center justify-center bg-[#1F2634] bg-opacity-75">
        <div
          className="w-[40%] h-[410px] md:h-[310px] rounded-lg mt-[40px] flex flex-col gap-[23px] justify-center items-center"
          style={{ background: "linear-gradient(to right, #B08725,#BCA163)" }}
        >
          <TextField
            className="bg-white w-[90%] rounded-md"
            value={updatedUrl}
            onChange={handleUrlChange}
          />
          <button
            className="w-[30%] bg-green-800 px-2 py-2 rounded-md text-white"
            onClick={handleUrlUpdate}
          >
            Update Video URL
          </button>
          <button
            className="w-[30%] bg-red-800 px-2 py-2 rounded-md text-white"
            onClick={handleClosePop}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default SocialMedia;
