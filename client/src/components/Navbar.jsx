import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Navbar = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);

  const logout = () => {
    localStorage.clear();
    dispatch({ type: "USER", payload: null });
    navigate("/login");
  };
  return (
    <nav className="bg-white dark:bg-gray-800  shadow ">
      <div className="px-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="w-full justify-between flex items-center">
            <NavLink className="flex-shrink-0" to={state ? "/" : "/login"}>
              <h1 className="font-bold text-[30px]">Insta Clone</h1>
            </NavLink>
            <div className="">
              <div className="flex items-baseline ml-10 space-x-4">
                {state ? (
                  <>
                    <NavLink
                      className="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      to={state ? "/" : "/login"}
                      style={({ isActive }) => ({
                        color: isActive ? "black" : "",
                      })}
                    >
                      Home
                    </NavLink>
                    <NavLink
                      className="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      to="/create"
                      style={({ isActive }) => ({
                        color: isActive ? "black" : "",
                      })}
                    >
                      Create Post
                    </NavLink>
                    <NavLink
                      className="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      to="/profile"
                      style={({ isActive }) => ({
                        color: isActive ? "black" : "",
                      })}
                    >
                      Profile
                    </NavLink>

                    <NavLink
                      className="text-white  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium bg-red-400"
                      onClick={() => logout()}
                      to="/login"
                    >
                      Logout
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      className="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      to="/login"
                      style={({ isActive }) => ({
                        color: isActive ? "black" : "",
                      })}
                    >
                      Login
                    </NavLink>
                    <NavLink
                      className="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      to="/signup"
                      style={({ isActive }) => ({
                        color: isActive ? "black" : "",
                      })}
                    >
                      Signup
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="block">
            <div className="flex items-center ml-4 md:ml-6"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
