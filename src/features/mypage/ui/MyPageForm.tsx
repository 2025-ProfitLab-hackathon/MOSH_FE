'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from "@/src/shared/ui/BottomNav";
import { useAuthStore } from '@/src/features/auth';
import { orderApi, OrderSummaryResponse } from '@/src/lib/api';

const MyPageForm = () => {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [orders, setOrders] = useState<OrderSummaryResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // 주문 목록 조회
    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }
            
            try {
                const response = await orderApi.getList({ size: 50 });
                setOrders(response.content);
            } catch (err) {
                console.error('주문 목록 조회 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated]);

    // 로그아웃 처리
    const handleLogout = () => {
        if (confirm('로그아웃 하시겠습니까?')) {
            logout();
            router.push('/login');
        }
    };

    // 로그인 필요
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-100 pb-20">
                <header className="bg-white flex items-center justify-center px-4 py-4">
                    <h1 className="text-lg font-semibold">마이페이지</h1>
                </header>
                
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <p className="text-gray-500 mb-4">로그인이 필요합니다.</p>
                    <button 
                        onClick={() => router.push('/login')}
                        className="px-6 py-3 bg-pink-400 text-white rounded-full"
                    >
                        로그인하기
                    </button>
                </div>
                
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            {/* 상단 헤더 */}
            <header className="bg-white flex items-center justify-between px-4 py-4">
                <div className="w-10"></div>
                <h1 className="text-lg font-semibold">마이페이지</h1>
                <button 
                    onClick={handleLogout}
                    className="text-sm text-gray-500"
                >
                    로그아웃
                </button>
            </header>

            {/* 프로필 카드 */}
            <div className="bg-white mx-4 mt-4 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                        {user?.imageUrl ? (
                            <img src={user.imageUrl} alt="프로필" className="w-full h-full object-cover" />
                        ) : (
                            <img src="/mypage/dior.jpeg" alt="프로필" className="w-full h-full object-cover" />
                        )}
                    </div>
                    <span className="font-semibold">{user?.nickname || '사용자'} 님</span>
                    <span className="px-2 py-1 bg-pink-50 text-pink-500 text-xs rounded-md">Fast Pass</span>
                </div>
                <button className="p-2" onClick={() => router.push('/mypage/detail')}>
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                        <path d="M1 1L7 7L1 13" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {/* 캐시 잔액 */}
            {user?.reward !== undefined && (
                <div className="bg-white mx-4 mt-4 p-4 rounded-xl flex items-center justify-between">
                    <span className="text-gray-600">보유 캐시</span>
                    <span className="font-bold text-pink-500">{user.reward.toLocaleString()}원</span>
                </div>
            )}

            {/* 주문 건수 */}
            <div className="px-4 py-4">
                <span className="text-gray-700 font-medium">총 {orders.length.toString().padStart(2, '0')}건</span>
            </div>

            {/* 로딩 */}
            {loading && (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
                </div>
            )}

            {/* 주문 목록 */}
            {!loading && (
                <div className="space-y-4 px-4">
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                            주문 내역이 없습니다.
                        </div>
                    ) : (
                        orders.map((order) => (
                            <OrderCard key={order.orderId} order={order} />
                        ))
                    )}
                </div>
            )}

            {/* 하단 네비게이션 */}
            <BottomNav />
        </div>
    );
};


const OrderCard = ({ order }: { order: OrderSummaryResponse }) => {
    // 상태별 진행도 계산
    const getProgress = (status: string) => {
        switch (status) {
            case 'QUEUED': return 0;
            case 'RESERVED': return 33;
            case 'READY_FOR_PICKUP': return 65;
            case 'PICKED_UP': return 100;
            default: return 0;
        }
    };

    // 상태 한글 변환
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'QUEUED': return '접수중';
            case 'RESERVED': return '주문 확인';
            case 'READY_FOR_PICKUP': return '준비 중';
            case 'PICKED_UP': return '준비 완료';
            case 'CANCELED': return '취소됨';
            case 'FAILED': return '실패';
            default: return status;
        }
    };

    const progress = getProgress(order.reservationStatus);
    const isCompleted = order.reservationStatus === 'PICKED_UP';
    const isCanceled = order.status === 'CANCELED' || order.status === 'FAILED';

    // 상태 목록
    const statusList = ['QUEUED', 'RESERVED', 'READY_FOR_PICKUP', 'PICKED_UP'];
    const statusLabels = ['접수중', '주문 확인', '준비 중', '준비 완료'];

    // 취소된 주문
    if (isCanceled) {
        return (
            <div className="bg-white rounded-xl p-4 opacity-60">
                <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">주문번호: {order.orderNumber}</span>
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-md">
                        {getStatusLabel(order.status)}
                    </span>
                </div>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-500">가격 : {order.totalPrice.toLocaleString()}원</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-4">
            {/* 상단: 주문번호 + Fast Pass */}
            <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">주문번호: {order.orderNumber}</span>
                {order.type === 'FASTPASS' && (
                    <span className="px-2 py-1 border border-gray-300 text-gray-600 text-xs rounded-md">
                        Fast Pass
                    </span>
                )}
            </div>

            {/* 진행 바 + 점 */}
            <div className="relative w-full mb-2">
                {/* 배경 바 */}
                <div className="w-full h-1 bg-gray-200 rounded-full">
                    <div
                        className={`h-full rounded-full transition-all ${isCompleted ? 'bg-mint-500' : 'bg-pink-400'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* 점들 */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
                    {statusList.map((status, index) => {
                        const statusIndex = statusList.indexOf(order.reservationStatus);
                        const isPassed = index <= statusIndex;

                        return (
                            <div
                                key={status}
                                className={`w-3 h-3 rounded-full border-2 ${
                                    isPassed
                                        ? isCompleted ? 'bg-mint-500 border-mint-500' : 'bg-pink-400 border-pink-400'
                                        : 'bg-white border-gray-300'
                                }`}
                            />
                        );
                    })}
                </div>
            </div>

            {/* 상태 표시 */}
            <div className="flex justify-between mb-3">
                {statusList.map((status, index) => {
                    const isCurrent = order.reservationStatus === status;
                    const statusIndex = statusList.indexOf(status);
                    const currentIndex = statusList.indexOf(order.reservationStatus);
                    const isPassed = statusIndex <= currentIndex;

                    return (
                        <span
                            key={status}
                            className={`text-xs ${
                                isCurrent 
                                    ? isCompleted ? 'text-mint-500 font-semibold' : 'text-pink-400 font-semibold'
                                    : isPassed ? 'text-gray-700' : 'text-gray-300'
                            }`}
                        >
                            {statusLabels[index]}
                        </span>
                    );
                })}
            </div>

            {/* 주문 정보 */}
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500 mb-1">가격 : {order.totalPrice.toLocaleString()}원</p>
                    {order.pickupAt && (
                        <p className="text-sm text-gray-500">
                            픽업 예상 시간: {new Date(order.pickupAt).toLocaleString('ko-KR')}
                        </p>
                    )}
                    {order.estimatedWaitMinutes && (
                        <p className="text-sm text-gray-500">
                            예상 대기: {order.estimatedWaitMinutes}분
                        </p>
                    )}
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded-lg" />
            </div>

            {/* 버튼들 */}
            <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">
                    주문 취소
                </button>
                <button 
                    className={`flex-1 py-2 border border-gray-300 rounded-lg text-sm ${
                        isCompleted ? 'text-pink-400' : 'text-gray-400'
                    }`}
                    disabled={!isCompleted}
                >
                    리뷰 남기기
                </button>
            </div>
        </div>
    );
};


export default MyPageForm;