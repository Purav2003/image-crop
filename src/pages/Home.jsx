import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 text-white p-10">
            <div className="text-center mb-10">
                <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight">
                    Welcome to <span className="text-yellow-300">Our Amazing</span> Service!
                </h1>
                <p className="text-xl md:text-2xl mb-8">
                    We're thrilled to have you here. Discover innovative solutions and explore our features.
                </p>
                <button
                          className="bg-yellow-300 text-gray-900 font-semibold py-4 px-8 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300 text-lg"

                >
                    <Link to="/upload" >
                        Get Started
                    </Link>
                </button>
            </div>
           
        </div>
    );
};

export default Home;
