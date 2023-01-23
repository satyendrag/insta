import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import { BASE_URL } from "../constants/apiConstant";

const CreatePost = () => {
  const { state, dispatch } = useContext(UserContext);

  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState([]);

  const handleFileChange = (e) => {
    e.preventDefault();
    setPhotos(e.target.files);
    console.log(photos);
  };

  const createPost = (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.append("title", title);
    postData.append("body", body);
    Array.from(photos).forEach((photo) => {
      postData.append("photos", photo);
    });
    console.log(postData);
    const toastId = toast.loading("Creating post. Please wait...");
    fetch(BASE_URL + "api/v1/post/", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: postData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          toast.update(toastId, {
            render: data.message,
            type: "error",
            isLoading: false,
            autoClose: true,
          });
          return;
        }

        if (data.success) {
          toast.update(toastId, {
            render: "Post created.",
            type: "success",
            isLoading: false,
            autoClose: true,
          });
          navigate("/");
        }
      })
      .catch((err) =>
        toast.update(toastId, {
          render: "Internal Server Error",
          type: "error",
          isLoading: false,
          autoClose: true,
        })
      );
  };

  return (
    <div>
      <div className="p-4 bg-gray-100">
        <div className="grid place-items-center mx-2 my-20 sm:my-auto">
          <div
            className="w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 
        px-6 py-10 sm:px-10 sm:py-6 
        bg-white rounded-lg shadow-md lg:shadow-lg"
          >
            <h2 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800">
              Create Post
            </h2>

            <form className="mt-10" method="POST">
              <label
                htmlFor="title"
                className="block text-xs font-semibold text-gray-600 uppercase"
              >
                Post Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Post Title"
                className="block w-full py-3 px-1 mt-2 
                text-gray-800 appearance-none 
                border-b-2 border-gray-100
                focus:text-gray-500 focus:outline-none focus:border-gray-200"
                onChange={(e) => setTitle(e.target.value)}
              />

              <label
                htmlFor="body"
                className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
              >
                Post Body
              </label>
              <input
                id="body"
                type="text"
                name="body"
                placeholder="Post body"
                className="block w-full py-3 px-1 mt-2 mb-4
                text-gray-800 appearance-none 
                border-b-2 border-gray-100
                focus:text-gray-500 focus:outline-none focus:border-gray-200"
                onChange={(e) => setBody(e.target.value)}
              />
              <input
                type="file"
                onChange={(e) => handleFileChange(e)}
                accept="image/x-png,image/gif,image/jpeg"
                multiple
              />

              <button
                type="submit"
                className="w-full py-3 mt-10 bg-gray-800 rounded-sm
                font-medium text-white uppercase
                focus:outline-none hover:bg-gray-700 hover:shadow-none"
                onClick={(e) => createPost(e)}
              >
                Create Post
              </button>
            </form>
          </div>
        </div>
        <div className="w-1/2 container grid grid-cols-3 gap-2 mx-auto mt-8">
          {Array.from(photos).map((image, index) => (
            <div className="w-full rounded" key={index}>
              <img src={URL.createObjectURL(image)} alt="image" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CreatePost;
