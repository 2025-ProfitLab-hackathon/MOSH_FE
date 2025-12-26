'use client';

import React, { useState, useRef, useEffect } from 'react';
import BottomNav from "@/src/shared/ui/BottomNav";

interface Message {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: string;
}

const ChatBotForm = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: '안녕하세요! MOSH 챗봇입니다. 🎉\n무엇을 도와드릴까요?',
            isUser: false,
            timestamp: '오후 2:00',
        },
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 메시지 추가 시 스크롤 하단으로
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const now = new Date();
        const timestamp = now.toLocaleTimeString('ko-KR', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });

        // 사용자 메시지 추가
        const userMessage: Message = {
            id: messages.length + 1,
            text: inputText,
            isUser: true,
            timestamp,
        };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');

        // 봇 응답 (1초 후)
        setTimeout(() => {
            const botMessage: Message = {
                id: messages.length + 2,
                text: getBotResponse(inputText),
                isUser: false,
                timestamp: new Date().toLocaleTimeString('ko-KR', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                }),
            };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* 헤더 - 상단 고정 */}
            <header className="fixed top-0 left-0 right-0 bg-white flex items-center justify-center px-4 py-4 border-b border-gray-200 z-50">
                <h1 className="text-lg font-semibold">부스 탐색</h1>
            </header>

            {/* 채팅 메시지 영역 - 헤더 높이만큼 pt 추가 */}
            <div className="flex-1 overflow-y-auto px-4 pt-20 pb-32">
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 */}
            <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
                <div className="max-w-[430px] mx-auto flex items-center gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-mint-300"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            inputText.trim() 
                                ? 'bg-mint-100 text-black' 
                                : 'bg-gray-200 text-gray-400'
                        }`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M22 2L11 13"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M22 2L15 22L11 13L2 9L22 2Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* 하단 네비게이션 */}
            <BottomNav />
        </div>
    );
};

// 채팅 메시지 컴포넌트
const ChatMessage = ({ message }: { message: Message }) => {
    return (
        <div className={`flex mb-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%]`}>
                {/* 메시지 버블 */}
                <div
                    className={`px-4 py-3 rounded-2xl ${
                        message.isUser
                            ? 'bg-mint-100 text-black rounded-br-sm'
                            : 'bg-white text-gray-800 rounded-bl-sm'
                    }`}
                >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
                
                {/* 시간 */}
                <p className={`text-xs text-gray-400 mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
                    {message.timestamp}
                </p>
            </div>
        </div>
    );
};

// 간단한 봇 응답 로직
const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('안녕') || lowerInput.includes('하이') || lowerInput.includes('hello')) {
        return '안녕하세요! 반갑습니다 😊\n무엇을 도와드릴까요?';
    }
    if (lowerInput.includes('부스') || lowerInput.includes('위치')) {
        return '부스 위치를 찾고 계시군요!\n메인 화면에서 지도를 확인하시거나, 원하시는 부스 이름을 알려주세요.';
    }
    if (lowerInput.includes('주문') || lowerInput.includes('예약')) {
        return '주문/예약 관련 문의시군요!\n마이페이지에서 주문 내역을 확인하실 수 있어요.';
    }
    if (lowerInput.includes('대기') || lowerInput.includes('시간')) {
        return '현재 대기 시간은 부스마다 다릅니다.\n원하시는 부스 이름을 알려주시면 확인해드릴게요!';
    }
    if (lowerInput.includes('감사') || lowerInput.includes('고마워')) {
        return '도움이 되었다니 기뻐요! 😄\n더 궁금한 점이 있으시면 언제든 물어봐주세요.';
    }
    
    return '죄송해요, 잘 이해하지 못했어요 🤔\n부스 위치, 주문, 대기시간 등에 대해 물어봐주세요!';
};

export default ChatBotForm;