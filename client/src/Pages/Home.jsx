import react from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../Api/axios";
import AuthBackground from "../Pages/Login_Register/AuthBackground";
import { useMutation, useQuery } from "@tanstack/react-query";
export const Home = () => {
    const [quantities, setQuantities] = useState({});

    // Fetch products from the API using react-query
    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data } = await api.get('https://dummyjson.com/products');
            return data.products;
        },
    })
    
    // Handle post request to create a checkout session for a product
    const handleProduct = useMutation({
        mutationFn: async (product) => {
            const response = await api.post('/payments/checkout', {
                productName: product.title,
                price: product.price,
                quantity: quantities[product.id] || 0,
            });
            return response.data.url;
        },
        onSuccess: (url) => {
            window.location.href = url;
        },
        onError: (error) => {
            console.error("Error creating checkout session:", error);
        },
    });

    // Increase and decrease quantity for a product
    const increaseQuantity = (product) => {
        setQuantities((prev) => ({
            ...prev,
            [product.id]: Math.min((prev[product.id] || 0) + 1, product.stock),
        }));
    };

    const decreaseQuantity = (product) => {
        setQuantities((prev) => ({
            ...prev,
            [product.id]: Math.max((prev[product.id] || 0) - 1, 0),
        }));
    };

    return (
        <div className="relative min-h-screen bg-slate-950 overflow-hidden">
            {/* three js animated background */}
            <AuthBackground />

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                {products?.map((product) => (
                    <div
                        key={product.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/40 transition-all duration-300"
                    >
                        <div className="h-56 bg-slate-950 flex items-center justify-center p-4">
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="h-full object-contain hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col gap-3">
                            <span className="w-fit px-3 py-1 rounded-full text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                {product.category}
                            </span>

                            <h2 className="text-lg font-semibold text-white line-clamp-1">
                                {product.title}
                            </h2>

                            <p className="text-sm text-slate-400">
                                Brand:
                                <span className="text-slate-200 ml-1">{product.brand ? product.brand : "Not specified"}</span>
                            </p>

                            <p className="text-sm text-slate-500 line-clamp-3">
                                {product.description}
                            </p>

                            <div className="flex justify-between text-sm">
                                <span className="text-yellow-400">
                                    ⭐ {product.rating}
                                </span>

                                <span
                                    className={`font-medium ${product.stock > 0
                                        ? "text-green-400"
                                        : "text-red-400"
                                        }`}
                                >
                                    {product.availabilityStatus}
                                </span>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div>
                                    <p className="text-2xl font-bold text-amber-400">
                                        ${product.price}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {product.discountPercentage}% OFF
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-2">
                                <button
                                    onClick={() => decreaseQuantity(product)}
                                    className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xl transition"
                                >
                                    -
                                </button>

                                <span className="text-xl font-bold text-white">
                                    {quantities[product.id] || 0}
                                </span>

                                <button
                                    onClick={() => increaseQuantity(product)}
                                    className="w-10 h-10 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xl font-bold transition"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                disabled={quantities[product.id] === 0}
                                onClick={() => handleProduct.mutate(product)}
                                className="w-full mt-4 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                🛒
                                <span>BUY NOW</span>
                            </button>
                        </div>
                    </div>
                ))}
                {products?.length === 0 && <div className="w-full min-h-screen flex items-center justify-center col-span-full">
                    <div className="loader"></div>
                </div>}
            </div>
        </div>
    );
};

export default Home;