'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RewardModal from './RewardModal';

const TicketNumberInput = () => {
    const [ticketNumber, setTicketNumber] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBack = () => {
        console.log('뒤로가기');
    };

    const handleSkip = () => {
        console.log('스킵');
    };

    const handleSubmit = () => {
        console.log('티켓번호:', ticketNumber);
        // 모달 열기
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        // TODO: 다음 페이지로 이동
        console.log('가입 완료!');
    };

    // 입력값이 있을 때만 버튼 활성화
    const isValid = ticketNumber.length > 0;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* 상단 헤더 */}
            <header className="flex items-center justify-between px-4 py-3">
                <button onClick={handleBack} className="p-2">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M15 18L9 12L15 6"
                            stroke="#333333"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <button
                    onClick={handleSkip}
                    className="text-gray-400 text-base px-2 py-1"
                >
                    Skip
                </button>
            </header>
            <div className="h-20"></div>
            {/* 본문 */}
            <div className="flex-1 px-6 pt-4">

                {/* 리워드 적립 태그 */}
                <p className="text-pink-400 text-sm font-medium mb-2">
                    리워드 적립
                </p>

                {/* 제목 */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    티켓 예매 번호 입력
                </h1>

                {/* 설명 */}
                <p className="text-gray-500 text-sm mb-10">
                    예매하신 티켓 번호를 입력하면 리워드를 드려요!
                </p>

                {/* 티켓 번호 입력 */}
                <Input
                    type="text"
                    placeholder="000 0000 0000"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                    className="w-full h-[52px] px-4 rounded-xl border border-gray-300 focus:border-pink-400 text-base"
                />
            </div>

            {/* 하단 버튼 */}
            <div className="px-6 pb-8 pt-4">
                <Button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    className={`w-full h-[52px] rounded-xl text-base font-medium ${
                        isValid
                            ? 'bg-pink-400 hover:bg-pink-500 text-white'
                            : 'bg-gray-400 text-gray-800 cursor-not-allowed'
                    }`}
                >
                    가입하기
                </Button>
            </div>

            {/* 리워드 지급 완료 모달 */}
            <RewardModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                points={3000}
            />
        </div>
    );
};

export default TicketNumberInput;