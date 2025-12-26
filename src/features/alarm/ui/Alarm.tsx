'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from "@/src/shared/ui/BottomNav";
import { onMessageListener } from "@/src/lib/firebase";

// 알림 타입
interface Notification {
    id: number;
    type: '음식' | '공연' | '굿즈';
    message: string;
    date: string;
}

// 더미 데이터
const initialNotifications: Notification[] = [
    {
        id: 1,
        type: '음식',
        message: '주문하신 음식이 모두 준비되었습니다! A홀 28번 부스로 방문해주세요.',
        date: '2025-12-25 18:30',
    },
    {
        id: 2,
        type: '음식',
        message: '주문하신 음식이 20분 소요될 예정입니다.',
        date: '2025-12-25 18:10',
    },
    {
        id: 3,
        type: '공연',
        message: '12월 25일 Someday Christmas 관람일입니다.',
        date: '2025-12-25 00:00',
    },
    {
        id: 4,
        type: '굿즈',
        message: '굿즈가 오픈되었습니다!',
        date: '2025-12-20 00:00',
    },
];

const Alarm = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

    // 실시간 알림 수신
    useEffect(() => {
        const unsubscribe = onMessageListener()
            .then((payload: any) => {
                if (payload) {
                    const newNotification: Notification = {
                        id: Date.now(),
                        type: '음식',
                        message: payload.notification?.body || '',
                        date: new Date().toLocaleString('ko-KR'),
                    };
                    setNotifications(prev => [newNotification, ...prev]);
                }
            });
    }, []);

    // 타입별 배지 색상
    const getBadgeStyle = (type: string) => {
        switch (type) {
            case '음식':
                return 'bg-pink-50 text-pink-500';
            case '공연':
                return 'bg-mint-50 text-mint-600';
            case '굿즈':
                return 'bg-gray-100 text-gray-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    // 날짜 포맷
    const formatDate = (dateStr: string) => {
        return dateStr.replace('T', ' ').slice(0, 16);
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* 헤더 */}
            <header className="flex items-center px-4 py-4 border-b border-gray-100">
                <button onClick={() => router.back()} className="p-2">
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                        <path d="M9 1L1 9L9 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold pr-10">알림</h1>
            </header>

            {/* 오늘 섹션 */}
            <div className="px-4 py-4">
                <h2 className="text-sm font-semibold text-gray-800 mb-3">오늘</h2>
                
                {/* 알림 목록 */}
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="bg-gray-50 rounded-xl p-4"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getBadgeStyle(notification.type)}`}>
                                    {notification.type}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {formatDate(notification.date)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">
                                {notification.message}
                            </p>
                        </div>
                    ))}
                </div>

                {/* 알림 없을 때 */}
                {notifications.length === 0 && (
                    <div className="flex items-center justify-center h-[50vh]">
                        <p className="text-gray-400">알림이 없습니다.</p>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
};

export default Alarm;