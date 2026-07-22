import react from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../Api/axios";
export const Home = () => {
    const [users, setUsers] = useState('');
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState(0);

    const fetchUsers = async () => {
        try {
           const {data} = await api.get("/users");
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('https://dummyjson.com/products');
            setProducts([...data.products.map(product => ({ ...product, quantity: 0 }))]);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    useEffect(() => {
        fetchUsers();
        fetchProducts();
    }, []);

    const handleProduct = async (product) => {
        try {
            const response = await axios.post('http://localhost:3000/payments/checkout', {
                productName: product.title,
                price: product.price,
                quantity: product.quantity,
            });
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Error creating checkout session:", error);
        }
    };
    const increaseQuantity = (product) => {
        const updatedProducts = products.map(p => {
            if (p.id === product.id) {
                if (p.quantity < p.stock) {
                    return { ...p, quantity: p.quantity + 1 };
                }
            }
            return p;
        });
        setProducts(updatedProducts);
    };

    const decreaseQuantity = (product) => {
        const updatedProducts = products.map(p => {
            if (p.id === product.id) {
                if (p.quantity > 0) {
                    return { ...p, quantity: p.quantity - 1 };
                }
            }
            return p;
        });
        setProducts(updatedProducts);
    };
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {products.map((product) => (
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
                                {product.quantity}
                            </span>

                            <button
                                onClick={() => increaseQuantity(product)}
                                className="w-10 h-10 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xl font-bold transition"
                            >
                                +
                            </button>
                        </div>
                        <button
                        disabled={product.quantity === 0}
                            onClick={() => handleProduct(product)}
                            className="w-full mt-4 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            🛒
                            <span>BUY NOW</span>
                        </button>
                        </div>
                </div>
            ))}
            {products.length === 0 && <div className="w-full min-h-screen flex items-center justify-center col-span-full">
                <div className="loader"></div>
                </div>}
        </div>
    );
};

export default Home;

