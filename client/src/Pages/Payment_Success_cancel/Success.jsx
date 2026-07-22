import { Navigate, useNavigate } from "react-router-dom";

export const Success = () => {
    const navigate = useNavigate();
  return (
    <div className="w-screen min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-md sm:max-w-lg bg-slate-900 border border-slate-800 shadow-2xl shadow-black/40 rounded-2xl p-6 sm:p-8 lg:p-10">
        <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-700" />
        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-700" />
        <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-700" />
        <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-700" />
        <div
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-slate-950"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-semibold text-slate-100 text-center mb-2">
          Payment Successful
        </h1>

        <p className="text-sm text-slate-500 text-center mb-8">
          Your payment was successful. Thank you for your purchase!
        </p>
        <button onClick={() => navigate('/')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center w-full transition duration-300 ease-in-out transform hover:scale-105">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Success;
