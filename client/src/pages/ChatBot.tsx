import React, { useState } from 'react';
import { Message } from '../types/index';
// import Header from '../components/Header';
// import { Sidebar } from '../components/Sidebar';
import { MessageList } from '../components/MessageList';
import { ActionButtons } from '../components/ActionButtons';
import { ChatInput } from '../components/ChatInput';
import { UIProvider, useUIContext } from '../contexts/UIContext';

function ChatBot() {
    const { isSidebarVisible } = useUIContext();
    const [messages, setMessages] = useState<Message[]>([
        {
            text: "Hello! How can I assist you today?",
            time: "10:00 AM",
            isUser: false
        },
        {
            text: "Can you help me schedule an interview?",
            time: "10:01 AM",
            isUser: true
        },
        {
            text: "Sure! Please provide the candidate details and preferred date.",
            time: "10:02 AM",
            isUser: false
        }
    ]);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim()) {
            setMessages([...messages, {
                text: inputText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isUser: true
            }]);
            setInputText('');
        }
    };

    return (
        <UIProvider>
            <div className={`flex-1 bg-gray-200 transition-all duration-300 ${isSidebarVisible ? "md:ml-64 ml-0" : "md:ml-20 ml-0"
                }`}>
                <div className="flex justify-center">
                    <div className="w-3/4 max-w-5xl bg-gray-200 min-h-[calc(100vh-4rem)] flex flex-col">
                        <div className="flex-1 overflow-y-auto py-3" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
                            <MessageList messages={messages} />
                        </div>
                        <div className="bg-gray-200 border-t border-gray-200">
                            <div className="max-w-5xl mx-auto px-4 py-3">
                                <ActionButtons />
                                <ChatInput
                                    inputText={inputText}
                                    setInputText={setInputText}
                                    handleSend={handleSend}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UIProvider>
    );
}

export default ChatBot;