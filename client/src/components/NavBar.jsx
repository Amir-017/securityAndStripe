import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../Api/axios";
import { QueryClient, useQuery } from "@tanstack/react-query";

export const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const queryClient = new QueryClient();
    const {data,isLoading,error} = useQuery({
        queryKey:['user'],
        queryFn:async()=>{
            const {data} = await api.get('/auth/me')
            return data;
        },
        enabled:!!token
    })

   
    useEffect(() => {
        setMenuOpen(false);

        const curenttoken = localStorage.getItem("token");
        setToken(curenttoken);
        if (!curenttoken) {
            queryClient.removeQueries(['user']);
            return;
        }

       
    }, [location]);
    const handleLogout = userMutaion({
        mutationFn: async () => {
            await api.post('/auth/logout');
        },
        onSuccess: () => {
            localStorage.removeItem("token");
            queryClient.clear();
            navigate("/login");
        },
        onError: (error) => {
            console.error("Error logging out:", error);
        },
    })

    return (
        <div className="bg-gray-800 w-full fixed top-0 left-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="text-white font-bold text-xl">My App</div>

                {/* Desktop links */}
                <div className="hidden sm:flex items-center gap-4">
                    <Link to="/" className="text-white hover:text-gray-300 mx-2">
                        Home
                    </Link>

                    {data ? (
                        <>
                            <div className="flex items-center gap-2">
                                {data.picture ? (
                                    <img
                                        src={data.picture}
                                        alt={data.firstName}
                                        referrerPolicy="no-referrer"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                        {data.firstName?.[0]?.toUpperCase()}
                                    </div>
                                )}
                                <span className="text-white">{data.firstName}</span>
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

                {/* Mobile hamburger toggle */}
                <button
                    onClick={() => setMenuOpen((open) => !open)}
                    className="sm:hidden text-white p-2"
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="sm:hidden border-t border-gray-700 px-4 pb-4 flex flex-col gap-3">
                    <Link to="/" className="text-white hover:text-gray-300 py-1">
                        Home
                    </Link>

                    {data ? (
                        <>
                            <div className="flex items-center gap-2 py-1">
                                {data.picture ? (
                                    <img
                                        src={data.picture}
                                        alt={data.firstName}
                                        referrerPolicy="no-referrer"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                        {data.firstName?.[0]?.toUpperCase()}
                                    </div>
                                )}
                                <span className="text-white">{data.firstName}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-white hover:text-gray-300 py-1">
                                Login
                            </Link>
                            <Link to="/register" className="text-white hover:text-gray-300 py-1">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default NavBar;
