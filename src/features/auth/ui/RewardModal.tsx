'use client';

import React from 'react';

interface RewardModalProps {
    isOpen: boolean;
    onClose: () => void;
    points?: number;
}

const RewardModal = ({ isOpen, onClose, points = 3000 }: RewardModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 배경 오버레이 */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* 모달 컨텐츠 */}
            <div className="relative bg-white rounded-2xl px-8 py-8 mx-6 w-full max-w-[320px] animate-scale-up">
                {/* 제목 */}
                <h2 className="text-center text-lg font-semibold mb-2">
                    <span className="text-pink-400">{points.toLocaleString()}p</span> 지급 완료
                </h2>

                {/* 설명 */}
                <p className="text-center text-gray-500 text-sm mb-6">
                    리워드를 첫 주문에 사용하세요!
                </p>

                {/* 확인 버튼 */}
                <button
                    onClick={onClose}
                    className="w-full py-3 border-1 border-pink-400 text-pink-400 rounded-md font-medium hover:bg-pink-50 transition-colors"
                >
                    확인
                </button>
            </div>
        </div>
    );
};

export default RewardModal;
