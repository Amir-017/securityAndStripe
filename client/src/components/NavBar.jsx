import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setUser(null);
            return;
        }

        fetch("http://localhost:3000/auth/me", {
            headers: { authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("unauthorized");
                return res.json();
            })
            .then((data) => setUser(data))
            .catch(() => {
                localStorage.removeItem("token");
                setUser(null);
            });
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    return (
        <div className="bg-gray-800 p-4 w-full fixed top-0 left-0 z-50 flex items-center justify-between">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white font-bold text-xl">My App</div>

                <div className="flex items-center gap-4">
                    <Link to="/" className="text-white hover:text-gray-300 mx-2">
                        Home
                    </Link>

                    {user ? (
                        <>
                            <div className="flex items-center gap-2">
                                {user.picture ? (
                                    <img
                                        src={user.picture}
                                        alt={user.firstName}
                                        referrerPolicy="no-referrer"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                        {user.firstName?.[0]?.toUpperCase()}
                                    </div>
                                )}
                                <span className="text-white">{user.firstName}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-white hover:text-gray-300 mx-2">
                                Login
                            </Link>
                            <Link to="/register" className="text-white hover:text-gray-300 mx-2">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavBar;
