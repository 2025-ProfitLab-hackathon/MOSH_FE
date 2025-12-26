'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from "@/src/shared/ui/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

// 더미 데이터
const festivalInfo = {
    title: '2025 Someday Christmas - 부산',
    doorOpen: '11:30',
    image: '/festival/christmas.png',
};

const dates = [
    { date: '12.25', day: '목', isSelected: true },
    { date: '12.27', day: '일', isSelected: false },
];

const timetableData = [
    { id: 1, time: '13:00', name: '프랭클리 FRankly', startTime: '13:00', endTime: '13:40', duration: 40 },
    { id: 2, time: '14:00', name: 'shininryu 신인류', startTime: '13:40', endTime: '14:30', duration: 40 },
    { id: 3, time: '15:00', name: 'Dragon Pony', startTime: '14:30', endTime: '15:20', duration: 50 },
    { id: 4, time: '16:00', name: 'Dasutt 다섯', startTime: '15:20', endTime: '16:10', duration: 50 },
    { id: 5, time: '16:00', name: '나상현씨밴드', startTime: '16:10', endTime: '17:00', duration: 50 },
    { id: 6, time: '17:00', name: 'I.M 아이엠', startTime: '17:00', endTime: '17:40', duration: 40 },
    { id: 7, time: '18:00', name: '유다빈밴드 YdBB', startTime: '17:40', endTime: '18:40', duration: 60 },
    { id: 8, time: '19:00', name: 'OWALLOIL 오월오일', startTime: '18:40', endTime: '19:40', duration: 60 },
    { id: 9, time: '20:00', name: '데이먼스 이어', startTime: '19:40', endTime: '20:40', duration: 60 },
];

const Home = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'timetable' | 'myfestival'>('timetable');
    const [selectedDate, setSelectedDate] = useState('12.25');
    const [likedItems, setLikedItems] = useState<number[]>([2, 6]);

    const toggleLike = (id: number) => {
        setLikedItems(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* 헤더 */}
            <header className="flex items-center justify-between px-4 py-4">
                <h1 className="text-2xl font-bold text-pink-400">MOSH</h1>
                <button className="p-2" onClick={() => router.push('/home/alarm')}>
                    <FontAwesomeIcon icon={faBell} className="text-2xl" />
                </button>
            </header>

            {/* 탭 */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('timetable')}
                    className={`flex-1 py-3 text-center font-medium ${
                        activeTab === 'timetable'
                            ? 'text-black border-b-2 border-black'
                            : 'text-gray-400'
                    }`}
                >
                    Timetable
                </button>
                <button
                    onClick={() => setActiveTab('myfestival')}
                    className={`flex-1 py-3 text-center font-medium ${
                        activeTab === 'myfestival'
                            ? 'text-black border-b-2 border-black'
                            : 'text-gray-400'
                    }`}
                >
                    My festival
                </button>
            </div>

            {/* 축제 정보 카드 */}
            <div className="px-4 py-4">
                <div className="flex items-center gap-4">
                    <img src="/booth/some.png" alt="포스터" className="w-18 h-20 object-cover" />
                    <div>
                        <h2 className="font-semibold text-lg">{festivalInfo.title}</h2>
                        <p className="text-gray-500 text-sm">Door open {festivalInfo.doorOpen}</p>
                    </div>
                </div>
            </div>

            {/* 날짜 선택 */}
            <div className="flex gap-2 px-4 pb-4">
                {dates.map((item) => (
                    <button
                        key={item.date}
                        onClick={() => setSelectedDate(item.date)}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                            selectedDate === item.date
                                ? 'bg-pink-400 text-white'
                                : 'bg-white text-gray-700 border border-gray-300'
                        }`}
                    >
                        {item.date}({item.day})
                    </button>
                ))}
            </div>

            {/* 타임테이블 */}
            <div className="bg-gray-50 px-4 py-4">
                {timetableData.map((item, index) => {
                    const showTime = index === 0 || timetableData[index - 1].time !== item.time;
                    
                    return (
                        <div key={item.id} className="flex mb-2">
                            {/* 시간 */}
                            <div className="w-12 flex-shrink-0 text-sm text-pink-400 pt-3">
                                {showTime && item.time}
                            </div>
                            
                            {/* 이벤트 카드 - index로 번갈아가면서 색상 */}
                            {(() => {
                                const isPink = index % 2 === 0;
                                return (
                                    <div
                                        className={`flex-1 rounded-xl p-4 flex items-center justify-between ${
                                            isPink ? 'bg-pink-100' : 'bg-pink-400'
                                        }`}
                                    >
                                        <div>
                                            <p className={`font-medium ${isPink ? 'text-pink-900 font-bold' : 'text-white'}`}>
                                                {item.name}
                                            </p>
                                            <p className={`text-sm ${isPink ? 'text-pink-800' : 'text-white'}`}>
                                                {item.startTime} - {item.endTime} ({item.duration})
                                            </p>
                                        </div>
                                        <button onClick={() => toggleLike(item.id)}>
                                            <FontAwesomeIcon 
                                                icon={likedItems.includes(item.id) ? faHeartSolid : faHeartOutline} 
                                                className={`text-xl ${isPink ? 'text-pink-400' : 'text-white'}`}
                                            />
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    );
                })}
            </div>

            <BottomNav />
        </div>
    );
};

export default Home;