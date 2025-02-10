import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <button onClick={handleGoBack} className='text-blue-500 underline cursor-pointer'>
                Go to Home
            </button>
        </div>
    );
};

export default NotFound;