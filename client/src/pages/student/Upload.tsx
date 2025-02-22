import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { SyncLoader } from 'react-spinners';
import { useUIContext } from '../../contexts/ui.context';
import { getRequest, postRequest } from '../../utils/services';

const Upload = () => {
    const { isSidebarVisible } = useUIContext();
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [uploadLoading, setUploadLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

     const handleDrop = (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) {
                setFile(droppedFile);
                setUploadStatus('idle');
            }
        };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setUploadStatus('idle');
        }
    };


    const handleUpload = async () => {
        if (!file) return;
        try {
            setUploadLoading(true);
            const url = `${import.meta.env.VITE_CLOUDINARY_BACKEND_URL}/signature/PeakPrepDocs`;
            const res = await getRequest(url);
            const { signature, timestamp, uploadPreset } = res.data;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
            formData.append('timestamp', timestamp.toString());
            formData.append('upload_preset', uploadPreset);
            formData.append('signature', signature);
            
            // Detect file type
            const isImage = file.type.startsWith('image/');
            formData.append('resource_type', isImage ? 'image' : 'auto');

            const uploadResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            console.log('Upload response:', uploadResponse);
            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                console.error("Upload failed:", errorData);
                throw new Error(errorData.error.message || "Upload failed");
            }
            const data = await uploadResponse.json();
            console.log('Upload response:', data);
            if (!data.secure_url) throw new Error('Upload failed');

            const uploadData = {
                public_id: data.public_id,
                secure_url: data.secure_url,
                format: data.format || "unknown",
                resource_type: data.resource_type || (isImage ? 'image' : 'auto'),
                created_at: data.created_at || new Date().toISOString(),
                bytes: data.bytes || 0,
            };
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');
            const saveResponse = await postRequest(
                'http://localhost:3030/api/cloudinary/save',
                JSON.stringify(uploadData),
                token
            );

            if (!saveResponse.success) throw new Error('Failed to save asset');

            setUploadStatus('success');
        } catch (error) {
            setUploadStatus('error');
        } finally {
            setUploadLoading(false);
        }
    };


    const handleRemoveFile = () => {
        setFile(null);
        setUploadStatus('idle');
    };

    return (
        <div className="flex h-[83vh]">
            {/* <Sidebar /> */}
            <div className="flex-1 flex flex-col">
                {/* <Header title="Upload PDF" /> */}
                <main
                    className={`flex-1 p-6 md:p-8 transition-all duration-300 ${
                        isSidebarVisible ? 'md:ml-64 ml-0' : 'md:ml-20 ml-0'
                    }`}
                >
                    <div className="flex items-center justify-center h-full">
                        <div className="w-full max-w-md">
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="text-center mb-8">
                                    <FileText className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                                    <h1 className="text-2xl font-bold text-gray-800">Files Upload</h1>
                                    <p className="text-gray-600 mt-2">Upload your files here</p>
                                </div>

                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                                        isDragging
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-blue-400'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*,.pdf"
                                        className="hidden"
                                    />
                                    <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">
                                        {file
                                            ? file.name
                                            : 'Drag and drop your PDF here, or click to browse'}
                                    </p>
                                </div>

                                {file && (
                                    <div className="mt-6 flex justify-between items-center">
                                        <button
                                            onClick={handleUpload}
                                            disabled={uploadStatus === 'success' || uploadLoading}
                                            className={`cursor-pointer flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                                                uploadStatus === 'success'
                                                    ? 'bg-green-500 text-white cursor-not-allowed'
                                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                            }`}
                                        >
                                            {uploadLoading ? (
                                                <SyncLoader size={10} color="#fff" />
                                            ) : uploadStatus === 'success' ? (
                                                'Uploaded!'
                                            ) : (
                                                'Upload File'
                                            )}
                                        </button>
                                        <div className="flex justify-center items-center ml-4">
                                            <button
                                                onClick={handleRemoveFile}
                                                className="cursor-pointer p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {uploadStatus === 'success' && (
                                    <div className="mt-4 flex items-center justify-center text-green-500">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        <span>File uploaded successfully!</span>
                                    </div>
                                )}

                                {uploadStatus === 'error' && (
                                    <div className="mt-4 flex items-center justify-center text-red-500">
                                        <AlertCircle className="w-5 h-5 mr-2" />
                                        <span>Upload failed. Please try again.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Upload;
