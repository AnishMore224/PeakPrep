const Error = ({ message, onClose }: { message: string, onClose: () => void }) => {
    return (
        <div className="error-popup">
            <div className="error-content">
                <span className="error-message">{message}</span>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default Error;
