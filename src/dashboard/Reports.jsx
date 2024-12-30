import React, { useContext, useEffect, useState } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";
import AuthContext from "../../AuthContext";
import { db } from "../../firebase";

const Reports = () => {
  const [posts, setPosts] = useState([]);
  //   const { currentUser } = useContext(AuthContext);
  const { currentAdmin: currentUser } = useContext(AuthContext);
  console.log(currentUser.uid);

  const fetchPosts = async () => {
    if (!currentUser) return; // Ensure currentUser is available
    try {
      // Create a query to filter posts by author
      const postsQuery = query(
        collection(db, "news_social_posts"),
        where("author", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(postsQuery);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  console.log(posts);

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-[90%] flex flex-col justify-center items-start ">
          <h1 className="text-black font-bold text-[25px] mt-5 mb-5">
            Reports
          </h1>
        </div>

        <div className="w-[90%] flex flex-col justify-center items-start shadow rounded-lg p-4 md:p-6 mb-5">
          <h1 className="text-black font-bold text-base  mb-5">
            Uploaded Videos
          </h1>
          <div className="w-full rounded-md overflow-auto">
            <table className="table-auto w-full border-collapse border  rounded-md overflow-auto ">
              <thead className="bg-[#F2F4FF]">
                <tr>
                  <th className="px-4 py-2  text-left  font-normal">
                    Video Title
                  </th>
                  <th className="px-4 py-2  text-left font-normal">
                    Date Uploaded
                  </th>
                  <th className="px-4 py-2  text-center font-normal">Votes</th>
                  <th className="px-4 py-2  text-center font-normal">Likes</th>
                  <th className="px-4 py-2  text-center font-normal">Clicks</th>
                  <th className="px-4 py-2  text-center font-normal">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="overflow-auto">
                {posts.length > 0 &&
                  posts.map((post) => (
                    <tr
                      key={post.id}
                      title={post.title}
                      className="text-xs lg:text-sm"
                    >
                      <td className="px-4   max-w-[40ch] truncate py-3 my-1">
                        {post.title}
                      </td>
                      <td className="px-4   py-3 my-1">
                        {new Date(
                          post.createdAt?.seconds * 1000
                        ).toLocaleDateString() || "N/A"}
                      </td>
                      <td className="px-4   text-center py-3 my-1">
                        {post.votes ? post.votes.length : 0}
                      </td>
                      <td className="px-4   text-center py-3 my-1">
                        {post.likes ? post.likes.length : 0}
                      </td>
                      <td className="px-4   text-center py-3 my-1">
                        {post.votes ? post.votes.length + post.likes.length : 0}
                      </td>
                      <td className="px-4   text-center py-3 my-1 min-w-[140px]">
                        <a
                          href={post.embed}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-1.5 bg-[#B99B55] rounded-2xl text-white "
                        >
                          View Video
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
