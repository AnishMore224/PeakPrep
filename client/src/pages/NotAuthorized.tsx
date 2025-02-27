import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, DoorClosed, ArrowLeft } from 'lucide-react';

const NotAuthorized: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div className="h-[83vh] bg-gradient-radial from-slate-50 via-blue-50 to-white flex flex-col items-center justify-center p-4 overflow-hidden">
            <div className="max-w-lg w-full text-center space-y-12">
            {/* Animated Security Icon Section */}
            <div className="relative h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                    <div className="relative animate-float">
                    <DoorClosed className="w-32 h-32 text-blue-600" />
                    <div className="absolute -top-4 -right-4 animate-pulse">
                        <Lock className="w-12 h-12 text-green-500" />
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Text Content */}
            <div className="space-y-6">
                <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                403
                </h1>
                <div className="space-y-2">
                <h2 className="text-xl text-gray-600 max-w-md mx-auto flex items-center justify-center">
                The&nbsp;<img src="../../public/onepiece.png" alt="O" className="inline-block w-6 h-6 rounded-full border-2 border-black-500" />
                    ne Piece is real&nbsp;<b>but</b>&nbsp;you're&nbsp;<b className='text-red-500'>NOT</b>
                </h2>
                <h2 className="text-3xl font-semibold text-gray-800">
                </h2>
                <p className="text-3xl text-gray-600 max-w-md mx-auto">
                <b>Authorized</b> to view this page.
                </p>
                </div>
            </div>

            {/* Action Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                onClick={handleGoBack} 
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go to Home
                </button>
            </div>
            </div>

            {/* Custom Animation Styles */}
            <style>{`
            @keyframes float {
                0%, 100% {
                transform: translateY(0);
                }
                50% {
                transform: translateY(-20px);
                }
            }
            
            .animate-float {
                animation: float 3s ease-in-out infinite;
            }
            `}</style>
        </div>
    );
};

export default NotAuthorized;