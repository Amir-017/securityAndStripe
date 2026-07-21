import { Link } from "react-router-dom";

export const NavBar = () => {
  

return(


<div className="bg-gray-800 p-4 w-full fixed top-0 left-0 z-50 flex items-center justify-between">
    <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">My App</div>
        <div>
            <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
                Logout
            </button>
        </div>
        <Link to="/" className="text-white hover:text-gray-300 mx-2">
            Home
        </Link>
        <Link to="/login" className="text-white hover:text-gray-300 mx-2">
            Login
        </Link>
        <Link to="/register" className="text-white hover:text-gray-300 mx-2">
            Register
        </Link>
    </div>
</div>






)}
export default NavBar;