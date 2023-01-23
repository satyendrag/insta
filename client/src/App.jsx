import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import { useEffect, createContext } from "react";
import { useReducer } from "react";
import { reducer, initialState } from "./reducers/userReducer";
import { useContext } from "react";
export const UserContext = createContext();
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Routing = () => {
  const { _, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "USER", payload: user });
      navigate("/");
    } else {
      navigate("/login");
    }
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Navbar />
      <Routing />
      <ToastContainer />
    </UserContext.Provider>
  );
}

export default App;
