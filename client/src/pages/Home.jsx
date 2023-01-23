import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { UserContext } from "../App";
import ImageSlider from "../components/ImageSlider";
import { BASE_URL } from "../constants/apiConstant";

const Home = () => {
  const { state, dispatch } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [likePost, setLikePost] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    //const url = `?skip=${skip}&limit=${limit}`;
    fetch(BASE_URL + "api/v1/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.posts);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [skip, likePost]);

  const like = (postId) => {
    const postData = {
      postId,
    };
    fetch(BASE_URL + "api/v1/like/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLikePost((likePost) => !likePost);
        }
      })
      .catch((err) => console.log("err"));
  };

  const disLike = (postId) => {
    const postData = {
      postId,
    };
    fetch(BASE_URL + "api/v1/dislike/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLikePost((likePost) => !likePost);
        }
      })
      .catch((err) => console.log("err"));
  };
  return (
    <div className="bg-gray-100 w-full">
      {posts.map((post) => (
        <div className="w-1/3 pt-2 mx-auto" key={post._id}>
          <div className="bg-white border rounded-sm max-w-md">
            <div className="flex items-center px-4 py-3">
              <img
                className="h-8 w-8 rounded-full"
                src={post?.postedBy?.photo?.secure_url}
              />
              <div className="ml-3 ">
                <span className="text-sm font-semibold antialiased block leading-tight">
                  {post?.postedBy?.name}
                </span>
                <span className="text-gray-600 text-xs block">
                  {post?.postedBy?.email}
                </span>
              </div>
            </div>
            <div className="pl-4">
              {post.title ? (
                <h2 className="font-bold text-[16px] ">{post.title}</h2>
              ) : (
                ""
              )}
              {post.body ? (
                <p className="text-gray-500 text-[14px]">{post.body}</p>
              ) : (
                ""
              )}
            </div>
            <ImageSlider photos={post.photos} />
            <div className="flex items-center justify-between mx-4 mt-3 mb-2">
              <div className="flex gap-5">
                {post?.likes?.includes(state?._id) ? (
                  <button onClick={() => disLike(post._id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="24"
                      fill="red"
                    >
                      <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Z" />
                    </svg>
                  </button>
                ) : (
                  <button onClick={() => like(post._id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="24"
                    >
                      <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Zm0-2.7q2.4-2.15 3.95-3.688 1.55-1.537 2.45-2.674.9-1.138 1.25-2.026.35-.887.35-1.762 0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662-1 .663-1.375 1.688h-1.9q-.375-1.025-1.375-1.688-1-.662-2.175-.662-1.5 0-2.5 1t-1 2.5q0 .875.35 1.762.35.888 1.25 2.026.9 1.137 2.45 2.674Q9.6 16.15 12 18.3Zm0-6.825Z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="font-semibold text-sm mx-4 mt-2 mb-4">
              <span>{post?.likes?.length} likes </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Home;
