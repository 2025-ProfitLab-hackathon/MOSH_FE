'use client';

import React from 'react';
import BottomNav from "@/src/shared/ui/BottomNav";

// 임시 주문 데이터
const orders = [
    {
        id: 1,
        boothName: '부스 이름',
        isFastPass: true,
        status: '주문 확인',
        progress: 30,
        menuName: 'Menu name',
        price: 23500,
        pickupTime: '12월 26일 오후 06:00',
    },
    {
        id: 2,
        boothName: '부스 이름',
        isFastPass: true,
        status: '준비 완료',
        progress: 100,
        menuName: 'Menu name',
        price: 23500,
        pickupTime: '12월 26일 오후 06:00',
    },
];

interface Order {
    id: number;
    boothName: string;
    isFastPass: boolean;
    status: string;
    progress: number;
    menuName: string;
    price: number;
    pickupTime: string;
}

const MyPageForm = () => {
    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            {/* 상단 헤더 */}
            <header className="bg-white flex items-center justify-center px-4 py-4">
                <h1 className="text-lg font-semibold">마이페이지</h1>
            </header>

            {/* 프로필 카드 */}
            <div className="bg-white mx-4 mt-4 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <span className="font-semibold">모쉬 님</span>
                    <span className="px-2 py-1 bg-pink-50 text-pink-500 text-xs rounded-md">Fast Pass</span>
                </div>
                <button className="p-2">
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                        <path d="M1 1L7 7L1 13" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {/* 주문 건수 */}
            <div className="px-4 py-4">
                <span className="text-gray-700 font-medium">총 {orders.length.toString().padStart(2, '0')}건</span>
            </div>

            {/* 주문 목록 */}
            <div className="space-y-4 px-4">
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>

            {/* 하단 네비게이션 */}
            <BottomNav />
        </div>
    );
};



const OrderCard = ({ order }: { order: Order }) => {
    const isCompleted = order.status === '준비 완료';

    return (
        <div className="bg-white rounded-xl p-4">
            {/* 상단: 부스 이름 + Fast Pass */}
            <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">{order.boothName}</span>
                {order.isFastPass && (
                    <span className="px-2 py-1 border border-gray-300 text-gray-600 text-xs rounded-md">
                        Fast Pass
                    </span>
                )}
            </div>

            {/* 진행 바 */}
            <div className="w-full h-1 bg-gray-200 rounded-full mb-2">
                <div
                    className="h-full bg-mint-500 rounded-full transition-all"
                    style={{ width: `${order.progress}%` }}
                />
            </div>

            {/* 상태 */}
            <div className="text-right mb-3">
                <span className={`text-sm ${isCompleted ? 'text-mint-500' : 'text-pink-400'}`}>
                    {order.status}
                </span>
            </div>

            {/* 메뉴 정보 */}
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-medium mb-1">{order.menuName}</p>
                    <p className="text-sm text-gray-500 mb-1">가격 : {order.price.toLocaleString()}원</p>
                    <p className="text-sm text-gray-500">픽업 예상 시간 {order.pickupTime}</p>
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded-lg" />
            </div>

            {/* 버튼들 */}
            <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">
                    주문 취소
                </button>
                <button className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-400">
                    리뷰 남기기
                </button>
            </div>
        </div>
    );
};


export default MyPageForm;