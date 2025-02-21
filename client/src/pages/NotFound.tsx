import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, MapPin, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div className="h-[83vh] bg-white flex flex-col items-center justify-center overflow-hidden">
            <div className="max-w-lg w-full text-center space-y-12">
            {/* Animated Icon Section */}
            <div className="relative h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                    <Compass className="w-32 h-32 text-purple-600 animate-spin-slow" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Search className="w-12 h-12 text-pink-500" />
                    </div>
                </div>
                </div>
                <MapPin className="absolute bottom-0 right-1/4 w-8 h-8 text-purple-400 animate-bounce" />
                <MapPin className="absolute top-0 left-1/4 w-8 h-8 text-pink-400 animate-bounce delay-100" />
            </div>

            {/* Text Content */}
            <div className="space-y-6">
                <h1 className="text-8xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                404
                </h1>
                <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-gray-800">Lost in Space</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                    Houston, we have a problem! The page you're looking for seems to have drifted into another dimension.
                </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                onClick={handleGoBack}
                className="group inline-flex items-center px-6 py-3 text-base font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to Home
                </button>
                <button 
                onClick={() => window.history.back()}
                className="inline-flex items-center px-6 py-3 text-base font-medium text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 transform hover:scale-105"
                >
                Previous Page
                </button>
            </div>
            </div>

            {/* Custom Animation Styles */}
            <style>{`
            @keyframes spin-slow {
                from {
                transform: rotate(0deg);
                }
                to {
                transform: rotate(360deg);
                }
            }
            .animate-spin-slow {
                animation: spin-slow 10s linear infinite;
            }
            .delay-100 {
                animation-delay: 0.1s;
            }
            `}</style>
        </div>
    );
};

export default NotFound;