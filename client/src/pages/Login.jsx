import { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { BASE_URL } from "../constants/apiConstant";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const signin = (e) => {
    e.preventDefault();

    if (isValid()) {
      const loginData = {
        email,
        password,
      };
      const toastId = toast.loading("Please Wait", { type: "info" });
      fetch(BASE_URL + "api/v1/login/", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(loginData),
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

          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          navigate("/");
          toast.update(toastId, {
            render: "Logged in",
            type: "success",
            isLoading: false,
            autoClose: true,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const isValid = () => {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError("Please Enter a valid email");
      return false;
    } else if (password.length == 0) {
      setError("Password Field is required");
      return false;
    }
    setError("");
    return true;
  };

  return (
    <div className="bg-gray-100 h-full">
      <div className="flex flex-col p-4">
        <div className="grid place-items-center mx-2 my-20 sm:my-auto">
          <div
            className="w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 
        px-6 py-10 sm:px-10 sm:py-6 
        bg-white rounded-lg shadow-md lg:shadow-lg"
          >
            <h2 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800">
              Login
            </h2>

            <form className="mt-6" method="POST">
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
                onClick={(e) => signin(e)}
              >
                Login
              </button>

              <div className="sm:flex sm:flex-wrap mt-8 sm:mb-4 text-sm text-center">
                <p className="flex-1 text-gray-500 text-md mx-4 my-1 sm:my-auto">
                  Don't have an account?
                </p>
                <br />
                <Link to="/signup" className="flex-2 underline">
                  Signup
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
