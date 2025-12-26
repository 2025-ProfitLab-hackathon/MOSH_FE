'use client';

import React, { useState, useRef, useEffect } from 'react';
import BottomNav from "@/src/shared/ui/BottomNav";
import { chatbotApi } from '@/src/lib/api';

interface Message {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: string;
    citations?: string[];
}

const ChatBotForm = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: '안녕하세요! MOSH 챗봇입니다. 🎉\n축제 일정, 부스 정보, 공연 추천 등 무엇이든 물어보세요!',
            isUser: false,
            timestamp: formatTime(new Date()),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 메시지 추가 시 스크롤 하단으로
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 대화 세션 생성
    const initConversation = async () => {
        try {
            const response = await chatbotApi.createConversation({
                festivalId: 1, // 기본 축제 ID
                context: { userGoal: '일반 문의' }
            });
            setConversationId(response.conversationId);
            return response.conversationId;
        } catch (err) {
            console.error('대화 세션 생성 실패:', err);
            throw err;
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userText = inputText.trim();
        const timestamp = formatTime(new Date());

        // 사용자 메시지 추가
        const userMessage: Message = {
            id: messages.length + 1,
            text: userText,
            isUser: true,
            timestamp,
        };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);
        setError(null);

        try {
            // 대화 세션이 없으면 생성
            let currentConversationId = conversationId;
            if (!currentConversationId) {
                currentConversationId = await initConversation();
            }

            // 메시지 전송 및 응답 받기
            const response = await chatbotApi.sendMessage(currentConversationId, userText);

            const botMessage: Message = {
                id: messages.length + 2,
                text: response.answer,
                isUser: false,
                timestamp: formatTime(new Date()),
                citations: response.citations,
            };
            setMessages(prev => [...prev, botMessage]);

        } catch (err: unknown) {
            console.error('메시지 전송 실패:', err);

            // 에러 시 폴백 응답
            const errorMessage: Message = {
                id: messages.length + 2,
                text: '죄송합니다. 일시적인 오류가 발생했어요. 😅\n잠시 후 다시 시도해주세요!',
                isUser: false,
                timestamp: formatTime(new Date()),
            };
            setMessages(prev => [...prev, errorMessage]);
            setError(err instanceof Error ? err.message : '알 수 없는 오류');

            // 세션 초기화 (다음 메시지에서 새 세션 생성)
            setConversationId(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // 빠른 질문 버튼
    const quickQuestions = [
        '오늘 공연 일정 알려줘',
        '맛집 부스 추천해줘',
        '대기시간 짧은 부스는?',
    ];

    const handleQuickQuestion = (question: string) => {
        setInputText(question);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* 헤더 - 상단 고정 */}
            <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
                <div className="max-w-[430px] mx-auto flex items-center justify-center px-4 py-4">
                    <h1 className="text-lg font-semibold">AI 챗봇</h1>
                </div>
            </header>

            {/* 채팅 메시지 영역 */}
            <div className="flex-1 overflow-y-auto px-4 pt-20 pb-40">
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}

                {/* 로딩 인디케이터 */}
                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* 빠른 질문 버튼 - 첫 메시지만 있을 때 표시 */}
            {messages.length === 1 && (
                <div className="fixed bottom-32 left-0 right-0 px-4">
                    <div className="max-w-[430px] mx-auto flex flex-wrap gap-2">
                        {quickQuestions.map((question, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickQuestion(question)}
                                className="px-3 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 입력 영역 */}
            <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
                <div className="max-w-[430px] mx-auto flex items-center gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="메시지를 입력하세요..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-mint-300 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim() || isLoading}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            inputText.trim() && !isLoading
                                ? 'bg-mint-100 text-black' 
                                : 'bg-gray-200 text-gray-400'
                        }`}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
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
                        )}
                    </button>
                </div>
            </div>

            {/* 하단 네비게이션 */}
            <BottomNav />
        </div>
    );
};

// 시간 포맷팅
function formatTime(date: Date): string {
    return date.toLocaleTimeString('ko-KR', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// 채팅 메시지 컴포넌트
const ChatMessage = ({ message }: { message: Message }) => {
    return (
        <div className={`flex mb-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            {/* 봇 아바타 */}
            {!message.isUser && (
                <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-white text-xs font-bold">M</span>
                </div>
            )}

            <div className={`max-w-[70%]`}>
                {/* 메시지 버블 */}
                <div
                    className={`px-4 py-3 rounded-2xl ${
                        message.isUser
                            ? 'bg-mint-100 text-black rounded-br-sm'
                            : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                    }`}
                >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>

                    {/* 참조 링크 */}
                    {message.citations && message.citations.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-400 mb-1">참고:</p>
                            {message.citations.map((citation, index) => (
                                <a
                                    key={index}
                                    href={citation}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-500 underline block"
                                >
                                    {citation}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* 시간 */}
                <p className={`text-xs text-gray-400 mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
                    {message.timestamp}
                </p>
            </div>
        </div>
    );
};

export default ChatBotForm;