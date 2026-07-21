export const Login = () => {
    const handleLogin = () => {
        window.location.href = "http://localhost:3000/auth/google";
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Login Page</h1>
            <p className="text-lg text-gray-600">This is the login page of our application.</p>
            <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Login
            </button>
        </div>
    );
};

export default Login;