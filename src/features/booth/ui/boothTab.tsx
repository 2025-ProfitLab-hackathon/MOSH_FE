'use client';

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {booths} from '@/src/mocks/booths';
import {BOOTH_TYPE} from '@/src/shared/constants/boothType';
import BoothCard from './boothCard';
import BottomNav from "@/src/shared/ui/BottomNav";
import React from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons";

export default function BoothTab() {
    const router = useRouter();
    
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
            <div className="pt-25 px-4">
                <div className="font-bold text-3xl">F&B List</div>
                <Tabs defaultValue="F&B">
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
                    {BOOTH_TYPE.map((type) => (
                        <TabsContent
                            key={type.value}
                            value={type.value}
                            className="flex flex-col gap-3"
                        >
                            {booths.content
                                .filter((booth) => booth.type === type.value)
                                .map((booth) => (
                                    <BoothCard key={booth.boothId} booth={booth}/>
                                ))}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
            <BottomNav/>
        </div>
    );
}
