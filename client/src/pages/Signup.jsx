import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../constants/apiConstant";

const Signup = () => {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [photo, setPhoto] = useState("");

  const navigate = useNavigate();

  const postData = (e) => {
    e.preventDefault();
    if (isValid()) {
      const toastId = toast.loading("Signin..Please wait....");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("photo", photo);
      console.log(formData);
      fetch(BASE_URL + "api/v1/signup/", {
        method: "POST",
        body: formData,
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
          toast.update(toastId, {
            render: "Signed in",
            type: "success",
            isLoading: false,
            autoClose: true,
          });
          navigate("/login");
        })
        .catch((err) => console.log(err));
    }
  };

  const isValid = () => {
    if (name.length == 0) {
      setError("Name Field is required");
      return false;
    } else if (name.length < 3) {
      setError("Name should be atleast 3 charcter long");
      return false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError("Please Enter a valid email");
      return false;
    } else if (password.length == 0) {
      setError("Password Field is required");
      return false;
    } else if (password.length < 6) {
      setError("Password should be atleast 6 character long");
      return false;
    } else if (!profileImage) {
      setError("Please Select profile image");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="flex flex-col  pt-4">
        <div className="grid place-items-center mx-2 my-20 sm:my-auto">
          <div
            className="w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 
    px-6 py-10 sm:px-10 sm:py-6 
    bg-white rounded-lg shadow-md lg:shadow-lg"
          >
            <h2 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800">
              Signup
            </h2>

            <form className="mt-6" method="POST">
              <div>
                <input
                  type="file"
                  onChange={(e) => {
                    setPhoto(e.target.files[0]);
                    setProfileImage(URL.createObjectURL(e.target.files[0]));
                  }}
                  accept="image/x-png,image/gif,image/jpeg"
                />
                <img
                  src={profileImage}
                  className="w-[150px] h-[100px] rounded-full p-2 m-2 "
                  alt="Profile Image"
                />
              </div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-600 uppercase"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Full name"
                autoComplete="name"
                className="block w-full py-3 px-1 mt-2 text-gray-800 appearance-none border-b-2 border-gray-100
            focus:text-gray-500 focus:outline-none focus:border-gray-200"
                required
                onChange={(e) => setName(e.target.value)}
              />

              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-600 uppercase"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="e-mail address"
                autoComplete="email"
                className="block w-full py-3 px-1 mt-2 
            text-gray-800 appearance-none 
            border-b-2 border-gray-100
            focus:text-gray-500 focus:outline-none focus:border-gray-200"
                required
                onChange={(e) => setEmail(e.target.value)}
              />

              <label
                htmlFor="password"
                className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="password"
                autoComplete="current-password"
                className="block w-full py-3 px-1 mt-2 mb-4
            text-gray-800 appearance-none 
            border-b-2 border-gray-100
            focus:text-gray-500 focus:outline-none focus:border-gray-200"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-red-600">{error}</p>
              <button
                type="submit"
                className="w-full py-3 mt-6 bg-gray-800 rounded-sm
            font-medium text-white uppercase
            focus:outline-none hover:bg-gray-700 hover:shadow-none"
                onClick={(e) => postData(e)}
              >
                Signup
              </button>

              <div className="sm:flex sm:flex-wrap mt-8 sm:mb-4 text-sm text-center">
                <p className="flex-1 text-gray-500 text-md mx-4 my-1 sm:my-auto">
                  Already have an account?
                </p>
                <br />
                <Link to="/login" className="flex-2 underline">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;
