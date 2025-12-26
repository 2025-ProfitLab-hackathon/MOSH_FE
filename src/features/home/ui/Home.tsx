'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from "@/src/shared/ui/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { festivalApi, alarmApi, FestivalResponse, PerformanceResponse } from '@/src/lib/api';

const Home = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'timetable' | 'myfestival'>('timetable');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [likedItems, setLikedItems] = useState<string[]>([]);
    
    // API 데이터
    const [festival, setFestival] = useState<FestivalResponse | null>(null);
    const [performances, setPerformances] = useState<PerformanceResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 축제 및 타임테이블 데이터 조회
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 축제 목록 조회 (첫 번째 축제 사용)
                const festivalsResponse = await festivalApi.getList({ size: 1 });
                
                if (festivalsResponse.content.length === 0) {
                    setError('등록된 축제가 없습니다.');
                    setLoading(false);
                    return;
                }

                const festivalData = festivalsResponse.content[0];
                setFestival(festivalData);

                // 타임테이블 조회
                const timetableResponse = await festivalApi.getTimetable(festivalData.festivalId);
                setPerformances(timetableResponse.items);

                // 첫 번째 날짜 선택
                if (timetableResponse.items.length > 0) {
                    const firstDate = formatDateKey(timetableResponse.items[0].startAt);
                    setSelectedDate(firstDate);
                }

            } catch (err: unknown) {
                console.error('데이터 조회 실패:', err);
                const errorMessage = err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 날짜 키 생성 (YYYY-MM-DD)
    const formatDateKey = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    };

    // 날짜 표시 포맷 (MM.DD)
    const formatDateDisplay = (dateStr: string) => {
        const date = new Date(dateStr);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}.${day}`;
    };

    // 요일 구하기
    const getDayName = (dateStr: string) => {
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const date = new Date(dateStr);
        return days[date.getDay()];
    };

    // 시간 포맷 (HH:mm)
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // 시간대 표시 (13:00 형태)
    const formatHourDisplay = (dateStr: string) => {
        const date = new Date(dateStr);
        const hour = date.getHours().toString().padStart(2, '0');
        return `${hour}:00`;
    };

    // 공연 시간 (분)
    const getDuration = (startAt: string, endAt: string) => {
        const start = new Date(startAt);
        const end = new Date(endAt);
        return Math.round((end.getTime() - start.getTime()) / 60000);
    };

    // 날짜별 그룹화
    const dateGroups = performances.reduce((acc, perf) => {
        const dateKey = formatDateKey(perf.startAt);
        if (!acc.includes(dateKey)) {
            acc.push(dateKey);
        }
        return acc;
    }, [] as string[]);

    // 선택된 날짜의 공연 필터링
    const filteredPerformances = performances
        .filter(perf => formatDateKey(perf.startAt) === selectedDate)
        .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

    // 좋아요 토글
    const toggleLike = async (performanceId: string) => {
        if (likedItems.includes(performanceId)) {
            setLikedItems(prev => prev.filter(id => id !== performanceId));
        } else {
            setLikedItems(prev => [...prev, performanceId]);
            
            // 알림 설정 API 호출
            if (festival) {
                try {
                    await alarmApi.create({
                        festivalId: festival.festivalId,
                        performanceId,
                        notifyMinutesBefore: 20,
                    });
                } catch (err) {
                    console.error('알림 설정 실패:', err);
                }
            }
        }
    };

    // 로딩 상태
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
            </div>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-pink-400 text-white rounded-full"
                >
                    다시 시도
                </button>
                <BottomNav />
            </div>
        );
    }

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
            {festival && (
                <div className="px-4 py-4">
                    <div className="flex items-center gap-4">
                        <img src="/booth/some.png" alt="포스터" className="w-18 h-20 object-cover rounded-lg" />
                        <div>
                            <h2 className="font-semibold text-lg">{festival.title}</h2>
                            <p className="text-gray-500 text-sm">
                                {formatDateDisplay(festival.startAt)} ~ {formatDateDisplay(festival.endAt)}
                            </p>
                            <p className="text-gray-500 text-sm">{festival.place}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 날짜 선택 */}
            <div className="flex gap-2 px-4 pb-4 overflow-x-auto">
                {dateGroups.map((dateKey) => (
                    <button
                        key={dateKey}
                        onClick={() => setSelectedDate(dateKey)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                            selectedDate === dateKey
                                ? 'bg-pink-400 text-white'
                                : 'bg-white text-gray-700 border border-gray-300'
                        }`}
                    >
                        {formatDateDisplay(dateKey)}({getDayName(dateKey)})
                    </button>
                ))}
            </div>

            {/* 타임테이블 */}
            {activeTab === 'timetable' && (
                <div className="bg-gray-50 px-4 py-4">
                    {filteredPerformances.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            해당 날짜에 공연이 없습니다.
                        </div>
                    ) : (
                        filteredPerformances.map((item, index) => {
                            const showTime = index === 0 || 
                                formatHourDisplay(filteredPerformances[index - 1].startAt) !== formatHourDisplay(item.startAt);
                            const isPink = index % 2 === 0;
                            const duration = getDuration(item.startAt, item.endAt);

                            return (
                                <div key={item.performanceId} className="flex mb-2">
                                    {/* 시간 */}
                                    <div className="w-14 flex-shrink-0 text-sm text-pink-400 pt-3">
                                        {showTime && formatHourDisplay(item.startAt)}
                                    </div>
                                    
                                    {/* 이벤트 카드 */}
                                    <div
                                        className={`flex-1 rounded-xl p-4 flex items-center justify-between ${
                                            isPink ? 'bg-pink-100' : 'bg-pink-400'
                                        }`}
                                    >
                                        <div className="flex-1">
                                            <p className={`font-medium ${isPink ? 'text-pink-900 font-bold' : 'text-white'}`}>
                                                {item.title}
                                            </p>
                                            <p className={`text-sm ${isPink ? 'text-pink-800' : 'text-white'}`}>
                                                {formatTime(item.startAt)} - {formatTime(item.endAt)} ({duration}분)
                                            </p>
                                            <p className={`text-xs mt-1 ${isPink ? 'text-pink-600' : 'text-pink-100'}`}>
                                                {item.stage}
                                            </p>
                                        </div>
                                        <button onClick={() => toggleLike(item.performanceId)} className="ml-2">
                                            <FontAwesomeIcon 
                                                icon={likedItems.includes(item.performanceId) ? faHeartSolid : faHeartOutline} 
                                                className={`text-xl ${isPink ? 'text-pink-400' : 'text-white'}`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* My Festival 탭 */}
            {activeTab === 'myfestival' && (
                <div className="bg-gray-50 px-4 py-4">
                    {likedItems.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <FontAwesomeIcon icon={faHeartOutline} className="text-4xl text-gray-300 mb-3" />
                            <p>하트를 눌러 관심 공연을 추가해보세요!</p>
                        </div>
                    ) : (
                        performances
                            .filter(perf => likedItems.includes(perf.performanceId))
                            .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
                            .map((item, index) => {
                                const isPink = index % 2 === 0;
                                const duration = getDuration(item.startAt, item.endAt);

                                return (
                                    <div key={item.performanceId} className="flex mb-2">
                                        {/* 날짜 */}
                                        <div className="w-14 flex-shrink-0 text-sm text-pink-400 pt-3">
                                            {formatDateDisplay(item.startAt)}
                                        </div>
                                        
                                        {/* 이벤트 카드 */}
                                        <div
                                            className={`flex-1 rounded-xl p-4 flex items-center justify-between ${
                                                isPink ? 'bg-pink-100' : 'bg-pink-400'
                                            }`}
                                        >
                                            <div className="flex-1">
                                                <p className={`font-medium ${isPink ? 'text-pink-900 font-bold' : 'text-white'}`}>
                                                    {item.title}
                                                </p>
                                                <p className={`text-sm ${isPink ? 'text-pink-800' : 'text-white'}`}>
                                                    {formatTime(item.startAt)} - {formatTime(item.endAt)} ({duration}분)
                                                </p>
                                                <p className={`text-xs mt-1 ${isPink ? 'text-pink-600' : 'text-pink-100'}`}>
                                                    {item.stage}
                                                </p>
                                            </div>
                                            <button onClick={() => toggleLike(item.performanceId)} className="ml-2">
                                                <FontAwesomeIcon 
                                                    icon={faHeartSolid} 
                                                    className={`text-xl ${isPink ? 'text-pink-400' : 'text-white'}`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                    )}
                </div>
            )}

            <BottomNav />
        </div>
    );
};

export default Home;