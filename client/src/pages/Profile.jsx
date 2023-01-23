import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../App";
import { BASE_URL } from "../constants/apiConstant";

const Profile = () => {
  const { state, dispatch } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(BASE_URL + "api/v1/postofuser", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div classNameName="bg-gray-100">
      <div className="w-1/2 flex justify-between items-center mx-auto">
        <div className="object-center">
          <img
            src={state?.photo?.secure_url}
            className="rounded-full w-32 h-32 p-5"
          />
        </div>

        <div className="col-span-4 flex flex-col gap-4">
          <div className="text-gray-800 flex flex-row gap-5 items-center">
            <div className="text-2xl">{state?.name}</div>

            {/* <button className="text-xs font-bold border-2 border-gray-300 p-2 rounded">
              Edit Profile
            </button> */}
          </div>

          <div className="text-gray-800 flex flex-row gap-10 items-center">
            <div>
              <span className="font-semibold">{posts.length} </span> Posts
            </div>

            {/* <div>
              <span className="font-semibold"> 0 </span> Followers
            </div>

            <div>
              <span className="font-semibold"> 0 </span> Following
            </div> */}
          </div>
        </div>
      </div>
      {/* Gallery */}

      <div className="w-1/2 container grid grid-cols-3 gap-2 mx-auto my-8">
        {posts.map((post) => (
          <div className="w-full rounded" key={post.photos[0]._id}>
            <img src={post?.photos[0]?.secure_url} alt={post.title} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Profile;
