import React, { useState } from 'react';
import axios from 'axios';
import { Message } from '../types/index';
import { MessageList } from '../components/MessageList';
import { ActionButtons } from '../components/ActionButtons';
import { ChatInput } from '../components/ChatInput';
import { useUIContext } from '../contexts/ui.context';

function ChatBot() {
    const { isSidebarVisible } = useUIContext();
    const [messages, setMessages] = useState<Message[]>([
        {
            text: "Hello! How can I assist you today?",
            time: "10:00 AM",
            isUser: false
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [chatHistory, setChatHistory] = useState<string[]>([]);

    const handleInputChange = (text: string) => {
        setInputText(text);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!uploadedFile) {
            alert("Please upload a resume PDF first.");
            return;
        }

        try {
            const pdfContent = await inputPdfSetup(uploadedFile);
            const response = await getGeminiResponse(inputText, pdfContent, chatHistory);
            setMessages([...messages, { text: inputText, time: new Date().toLocaleTimeString(), isUser: true }, { text: response, time: new Date().toLocaleTimeString(), isUser: false }]);
            setChatHistory([...chatHistory, `User: ${inputText}`, `Bot: ${response}`]);
            setInputText('');
        } catch (error) {
            console.error("Error handling submit:", error);
        }
    };

    const inputPdfSetup = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/api/pdf-to-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    };

    const getGeminiResponse = async (inputText: string, pdfContent: any, chatHistory: string[]) => {
        const response = await axios.post('/api/gemini-response', {
            inputText,
            pdfContent,
            chatHistory
        });

        return response.data.text;
    };

    return (
        <div className="chatbot-container ml-20">
            <div className="chatbot-header">
                <h1>Resume ChatBot</h1>
            </div>
            <div className="chatbot-content">
                <MessageList messages={messages} />
                <div className="chatbot-input">
                    <input type="file" accept="application/pdf" onChange={handleFileChange} />
                    <ChatInput inputText={inputText} setInputText={handleInputChange} handleSend={handleSubmit} />
                </div>
            </div>
        </div>
    );
}

export default ChatBot;