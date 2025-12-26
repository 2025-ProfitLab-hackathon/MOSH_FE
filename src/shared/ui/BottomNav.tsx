'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faReceipt, faMessage, faUser } from '@fortawesome/free-solid-svg-icons';





const BottomNav = () => {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        {
            // name: '홈',
            path: '/home',
            icon: (active: boolean) => (
                <FontAwesomeIcon icon={faHouse} className="text-xl " />
            ),
        },
        {
            // name: '주문내역',
            path: '/booth',
            icon: (active: boolean) => (
                <FontAwesomeIcon icon={faReceipt} className="text-xl" />
            ),
        },
        {
            // name: '채팅',
            path: '/chat',
            icon: (active: boolean) => (
                <FontAwesomeIcon icon={faMessage} className="text-xl" />
            ),
        },
        {
            // name: '마이',
            path: '/mypage',
            icon: (active: boolean) => (
                <FontAwesomeIcon icon={faUser} className="text-xl" />
            ),
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
            <div className="max-w-[430px] mx-auto flex justify-around items-center h-16">
                {navItems.map((item) => {
                    // /order 경로일 때 /booth 탭 활성화
                    const isActive = pathname === item.path || 
                        (item.path === '/booth' && pathname.startsWith('/order'));
                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`flex flex-col items-center justify-center gap-1 w-16 h-full ${
                                isActive ? 'text-pink-400 bg-pink-50' : 'text-gray-500' 
                            }`}
                        >
                            {item.icon(isActive)}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
