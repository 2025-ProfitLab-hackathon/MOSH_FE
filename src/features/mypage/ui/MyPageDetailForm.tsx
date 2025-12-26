'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from "@/src/shared/ui/BottomNav";

const MyPageDetailForm = () => {
    const router = useRouter();
    
    // 폼 상태
    const [name, setName] = useState('김모쉬');
    const [year, setYear] = useState('2025');
    const [month, setMonth] = useState('12');
    const [day, setDay] = useState('26');
    const [gender, setGender] = useState('설정 안함');
    
    // 알림 설정 상태
    const [allNotification, setAllNotification] = useState(false);
    const [pickupNotification, setPickupNotification] = useState(true);
    const [showNotification, setShowNotification] = useState(true);
    const [marketingNotification, setMarketingNotification] = useState(false);

    const handleSave = () => {
        // 저장 로직
        alert('저장되었습니다!');
        router.back();
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-17">
            {/* 헤더 */}
            <header className="fixed bg-white flex items-center px-4 py-4 border-b border-gray-200 w-full z-100">
                <button onClick={() => router.back()} className="p-2">
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                        <path d="M9 1L1 9L9 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold pr-10">계정 관리</h1>
            </header>

            {/* 내 정보 섹션 */}
            <div className="bg-white px-4 py-6 ">
                <h2 className="text-base font-semibold mb-4 mt-16">내 정보</h2>
                
                {/* 프로필 이미지 */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                        <img src="/mypage/dior.jpeg" alt="프로필" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <button className="px-4 py-2 border border-gray-300 rounded-full text-sm">
                            + 이미지 업로드
                        </button>
                        <p className="text-xs text-gray-400 mt-1">10MB 이내의 파일만 업로드 가능합니다.</p>
                    </div>
                </div>

                {/* 이름 */}
                <div className="mb-4">
                    <label className="text-sm text-gray-700 mb-2 block">
                        이름 <span className="text-pink-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-400"
                    />
                </div>

                {/* 생년월일 */}
                <div className="mb-4">
                    <label className="text-sm text-gray-700 mb-2 block">
                        생년월일 <span className="text-pink-400">*</span>
                    </label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-pink-400"
                            >
                                {Array.from({ length: 100 }, (_, i) => 2025 - i).map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <ChevronDown />
                        </div>
                        <div className="relative flex-1">
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-pink-400"
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <ChevronDown />
                        </div>
                        <div className="relative flex-1">
                            <select
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-pink-400"
                            >
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            <ChevronDown />
                        </div>
                    </div>
                </div>

                {/* 성별 */}
                <div className="mb-4">
                    <label className="text-sm text-gray-700 mb-2 block">성별</label>
                    <div className="relative">
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-pink-400"
                        >
                            <option value="설정 안함">설정 안함</option>
                            <option value="남성">남성</option>
                            <option value="여성">여성</option>
                        </select>
                        <ChevronDown />
                    </div>
                </div>

                {/* 연동된 계정 */}
                <div>
                    <label className="text-sm text-gray-700 mb-2 block">연동된 계정</label>
                    <input
                        type="text"
                        value="google"
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-400"
                    />
                </div>
            </div>

            {/* 알림 설정 섹션 */}
            <div className="bg-white px-4 py-6 mt-2">
                <h2 className="text-base font-semibold mb-4">알림 설정</h2>

                {/* 기기 알림 안내 */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4 flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-500 flex-shrink-0 mt-0.5">
                        <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-blue-600">기기 알림을 켜주세요</p>
                        <p className="text-xs text-blue-500">정보 알림을 받기 위해 기기 알림을 켜주세요</p>
                    </div>
                </div>

                {/* 전체 알림 */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-medium">전체 알림</span>
                    <Toggle checked={allNotification} onChange={setAllNotification} />
                </div>

                {/* 앱 정보 알림 */}
                <div className="py-3 border-b border-gray-100">
                    <p className="text-sm font-medium mb-3">앱 정보 알림</p>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">픽업 알림</span>
                        <Toggle checked={pickupNotification} onChange={setPickupNotification} />
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">공연 알림</span>
                        <Toggle checked={showNotification} onChange={setShowNotification} />
                    </div>
                </div>

                {/* 마케팅 푸시 동의 */}
                <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600">마케팅 푸시 동의</span>
                    <Toggle checked={marketingNotification} onChange={setMarketingNotification} />
                </div>
            </div>

            {/* 하단 버튼 */}
            <div className=" bottom-20 left-0 right-0 px-4 py-4 bg-white border-t border-gray-200">
                <div className="max-w-[430px] mx-auto flex gap-3">
                    <button
                        onClick={() => router.back()}
                        className="flex-1 py-3 border border-pink-400 text-pink-400 rounded-full font-medium"
                    >
                        뒤로가기
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 bg-pink-400 text-white rounded-full font-medium"
                    >
                        저장하기
                    </button>
                </div>
            </div>
            <BottomNav />
        </div>
    );
};

// 드롭다운 화살표 아이콘
const ChevronDown = () => (
    <svg 
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" 
        width="12" 
        height="8" 
        viewBox="0 0 12 8" 
        fill="none"
    >
        <path d="M1 1.5L6 6.5L11 1.5" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// 토글 스위치 컴포넌트
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) => (
    <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-7 rounded-full transition-colors ${checked ? 'bg-pink-400' : 'bg-gray-300'}`}
    >
        <div
            className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                checked ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
    </button>
);

export default MyPageDetailForm;
