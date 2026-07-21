import react from "react";
import { useState,useEffect } from "react";
export const Home = () => {
    const [users, setUsers] = useState('');
   


    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:3000/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setUsers(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    console.log(users);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Home Page</h1>
            <p className="text-lg text-gray-600">This is the home page of our application.</p>
        </div>
    );
};

export default Home;