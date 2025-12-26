'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

const BottomNav = () => {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        {
            // name: '홈',
            path: '/',
            icon: (active: boolean) => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                        stroke={active ? '#F7558B' : '#AEAEAE'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9 22V12H15V22"
                        stroke={active ? '#F7558B' : '#AEAEAE'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
        {
            // name: '주문내역',
            path: '/orders',
            icon: (active: boolean) => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                        stroke={active ? '#F7558B' : '#AEAEAE'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M14 2V8H20"
                        stroke={active ? '#F7558B' : '#AEAEAE'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M16 13H8"
                        stroke={active ? '#F7558B' : '#AEAEAE'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M16 17H8"
                        stroke={active ? '#F7558B' : '#AEAEAE'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
        {
            // name: '채팅',
            path: '/chat',
            icon: (active: boolean) => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                        stroke={active ? '#F7558B' : '#AEAEAE'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
        {
            // name: '마이',
            path: '/mypage',
            icon: (active: boolean) => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                        stroke={active ? '#F7558B' : '#AEAEAE'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                        stroke={active ? '#F7558B' : '#AEAEAE'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
            <div className="max-w-[430px] mx-auto flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`flex flex-col items-center justify-center gap-1 w-16 h-full ${
                                isActive ? 'text-pink-400' : 'text-gray-500'
                            }`}
                        >
                            {item.icon(isActive)}
                            <span className="text-xs">{item.name}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
