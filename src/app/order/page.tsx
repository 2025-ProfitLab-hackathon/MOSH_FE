'use client';

import { Suspense } from 'react';
import MenuCard from '@/src/features/order/ui/menuCard';
import {OrderDrawerButton} from '@/src/features/order/ui/orderDrawerButton';
import ReviewSlider from '@/src/features/order/ui/reviewSlider';
import {useSearchParams, useRouter} from 'next/navigation';
import React, { useEffect, useState } from "react";
import BottomNav from "@/src/shared/ui/BottomNav";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleRight, faVolumeLow} from "@fortawesome/free-solid-svg-icons";
import { boothApi, menuApi, BoothResponse, MenuResponse, ReviewResponse } from '@/src/lib/api';
import { useBasketStore } from '@/src/shared/store/useBasketStore';

// 로딩 컴포넌트
function OrderPageLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
        </div>
    );
}

// 실제 컨텐츠 컴포넌트
function OrderPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const boothId = searchParams.get('boothId');
    
    const { setBoothInfo, clearBasket } = useBasketStore();
    
    const [booth, setBooth] = useState<BoothResponse | null>(null);
    const [menus, setMenus] = useState<MenuResponse[]>([]);
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 부스 상세 및 메뉴 조회
    useEffect(() => {
        const fetchData = async () => {
            if (!boothId) {
                setError('부스 정보가 없습니다.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                // 부스 상세 조회
                const boothData = await boothApi.getById(Number(boothId));
                setBooth(boothData);
                setBoothInfo(boothData.boothId, boothData.title);
                
                // 메뉴 목록 조회
                const menuData = await boothApi.getMenus(Number(boothId));
                setMenus(menuData.items);
                
                // 첫 번째 메뉴의 리뷰 조회 (대표 리뷰)
                if (menuData.items.length > 0) {
                    try {
                        const reviewData = await menuApi.getReviews(menuData.items[0].menuId, { size: 10 });
                        setReviews(reviewData.content);
                    } catch {
                        // 리뷰 조회 실패해도 무시
                    }
                }
                
            } catch (err: unknown) {
                console.error('데이터 조회 실패:', err);
                const errorMessage = err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        // 페이지 진입 시 장바구니 초기화
        clearBasket();
        fetchData();
    }, [boothId, clearBasket, setBoothInfo]);

    // 시간 포맷팅
    const formatTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        } catch {
            return dateStr;
        }
    };

    // 로딩 상태
    if (loading) {
        return <OrderPageLoading />;
    }

    // 에러 상태
    if (error || !booth) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <p className="text-red-500 mb-4">{error || '부스를 찾을 수 없습니다.'}</p>
                <button 
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-pink-400 text-white rounded-full"
                >
                    돌아가기
                </button>
            </div>
        );
    }

    return (
        <>
            <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
                <div className="max-w-[430px] mx-auto flex items-center px-4 py-4">
                    <button onClick={() => router.back()} className="p-2">
                        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                            <path d="M9 1L1 9L9 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <h1 className="flex-1 text-center text-lg font-semibold pr-10">주문 하기</h1>
                </div>
            </header>

            <div className="relative px-4 pb-40 overflow-y-auto">
                <div className="mt-20">
                </div>
                <div className="mt-4 flex items-start justify-between">
                    <div className="flex-1">
                        <h1 className="text-xl font-bold mb-2">{booth.title}</h1>
                        <div className="flex flex-col gap-1 text-sm text-gray-600">
                            <div className="flex gap-2">
                                <span className="text-gray-500">시간</span>
                                <span>{formatTime(booth.startAt)} ~ {formatTime(booth.endAt)}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-gray-500">장소</span>
                                <span>{booth.place}</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="text-yellow-500">★</span>
                                <span>{booth.avgReviewRating.toFixed(1)}</span>
                                <span className="text-gray-400">({booth.totalReviewCount})</span>
                            </div>
                        </div>
                    </div>
                    <img src="/food/food1.png" alt="food" className="w-24 h-24 rounded-lg object-cover"/>
                </div>
                <div className="flex rounded-xl gap-2 mt-3 border border-blue-300 bg-blue-50 py-4 px-3">
                    <FontAwesomeIcon icon={faVolumeLow} className="text-blue-500 text-2xl"/>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-blue-600">
                            패스트패스로 구매 시 빠른 수령 가능합니다.
                        </span>
                        <span className="text-xs text-blue-600">
                            일반 구매 시 20분 소요됩니다.
                        </span>
                    </div>
                </div>

                {/* 구분선 */}
                <div className="border-t border-gray-200 mt-6 mb-4"></div>

                {/* 리뷰 섹션 */}
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <span className="font-medium">리뷰({booth.totalReviewCount})</span>
                    </div>
                    <div className="flex items-center">
                        <button className="text-sm text-gray-500 flex items-center">
                            전체보기
                            <FontAwesomeIcon icon={faAngleRight}/>
                        </button>
                    </div>
                </div>

                {/* 리뷰 슬라이더 */}
                <div className="mt-4 -mx-4">
                    <div className="pl-4 overflow-hidden">
                        <ReviewSlider reviews={reviews} />
                    </div>
                </div>

                {/* 구분선 */}
                <div className="border-t border-gray-200 mt-6 mb-4"></div>

                {/* 메뉴 섹션 */}
                <div className="mt-4">
                    <h2 className="text-lg font-bold mb-4">메뉴</h2>
                    {menus.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            등록된 메뉴가 없습니다.
                        </div>
                    ) : (
                        menus.map((menu) => (
                            <MenuCard key={menu.menuId} menu={menu}/>
                        ))
                    )}
                </div>
            </div>

            {/* 주문하기 버튼 - 하단 고정 */}
            <OrderDrawerButton boothId={booth.boothId} title={booth.title}/>

            <BottomNav/>
        </>
    );
}

// 메인 페이지 - Suspense로 감싸기
export default function OrderPage() {
    return (
        <Suspense fallback={<OrderPageLoading />}>
            <OrderPageContent />
        </Suspense>
    );
}
