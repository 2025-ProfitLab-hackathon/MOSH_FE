'use client';

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {BOOTH_TYPE} from '@/src/shared/constants/boothType';
import BoothCard from './boothCard';
import BottomNav from "@/src/shared/ui/BottomNav";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons";
import { boothApi, BoothResponse } from '@/src/lib/api';

export default function BoothTab() {
    const router = useRouter();
    const [booths, setBooths] = useState<BoothResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('F&B');

    // 부스 목록 조회
    const fetchBooths = async (type?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await boothApi.getList({ 
                type: type,
                size: 50 
            });
            setBooths(response.content);
        } catch (err) {
            console.error('부스 목록 조회 실패:', err);
            setError('부스 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooths();
    }, []);

    // 탭 변경 시 해당 타입만 필터링 (이미 전체 데이터를 가져온 경우)
    const filteredBooths = booths.filter(booth => booth.type === activeTab);

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* 헤더 - 상단 고정 */}
            <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
                <div className="max-w-[430px] mx-auto flex items-center px-4 py-4">
                    <button onClick={() => router.back()} className="p-2">
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                    <h1 className="flex-1 text-center text-lg font-semibold pr-10">부스 탐색</h1>
                </div>
            </header>
            
            {/* 본문 - 헤더 높이만큼 패딩 */}
            <div className="pt-20 px-4">
                <div className="font-bold text-3xl mb-2">F&B List</div>
                <Tabs defaultValue="F&B" onValueChange={setActiveTab}>
                    <TabsList className="flex gap-2 bg-transparent py-3 h-auto">
                        {BOOTH_TYPE.map((type) => (
                            <TabsTrigger
                                key={type.value}
                                value={type.value}
                                className="
                                    rounded-full px-4 py-2 text-sm cursor-pointer
                                    border border-gray-300 bg-white text-gray-700
                                    data-[state=active]:bg-pink-400
                                    data-[state=active]:text-white
                                    data-[state=active]:border-pink-400
                                "
                            >
                                {type.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    
                    {/* 로딩 상태 */}
                    {loading && (
                        <div className="flex justify-center items-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
                        </div>
                    )}
                    
                    {/* 에러 상태 */}
                    {error && (
                        <div className="text-center py-10 text-red-500">
                            <p>{error}</p>
                            <button 
                                onClick={() => fetchBooths()}
                                className="mt-2 px-4 py-2 bg-pink-400 text-white rounded-full"
                            >
                                다시 시도
                            </button>
                        </div>
                    )}
                    
                    {/* 부스 목록 */}
                    {!loading && !error && BOOTH_TYPE.map((type) => (
                        <TabsContent
                            key={type.value}
                            value={type.value}
                            className="flex flex-col gap-3"
                        >
                            {booths
                                .filter((booth) => booth.type === type.value)
                                .map((booth) => (
                                    <BoothCard key={booth.boothId} booth={booth}/>
                                ))}
                            
                            {/* 부스가 없을 때 */}
                            {booths.filter((booth) => booth.type === type.value).length === 0 && (
                                <div className="text-center py-10 text-gray-500">
                                    등록된 부스가 없습니다.
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
            <BottomNav/>
        </div>
    );
}
