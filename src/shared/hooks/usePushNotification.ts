'use client';

import { useState, useEffect } from 'react';
import { getFCMToken, onMessageListener } from '@/src/lib/firebase';

interface Notification {
    title: string;
    body: string;
}

export const usePushNotification = () => {
    const [token, setToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        // 브라우저 지원 확인
        if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
            setIsSupported(true);
        }
    }, []);

    // 알림 권한 요청 및 토큰 가져오기
    const requestPermission = async () => {
        if (!isSupported) {
            alert('이 브라우저는 푸시 알림을 지원하지 않습니다.');
            return null;
        }

        try {
            // 서비스 워커 등록
            const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            console.log('서비스 워커 등록 완료:', registration);

            // FCM 토큰 가져오기
            const fcmToken = await getFCMToken();
            if (fcmToken) {
                setToken(fcmToken);
                // TODO: 서버에 토큰 저장
                console.log('토큰을 서버에 저장하세요:', fcmToken);
            }
            return fcmToken;
        } catch (error) {
            console.error('알림 권한 요청 실패:', error);
            return null;
        }
    };

    // 포그라운드 메시지 리스너
    useEffect(() => {
        if (!isSupported) return;

        const unsubscribe = onMessageListener()
            .then((payload: any) => {
                if (payload) {
                    setNotification({
                        title: payload.notification?.title || '',
                        body: payload.notification?.body || '',
                    });

                    // 포그라운드에서는 브라우저 알림 표시 안 함 (서비스 워커가 처리)
                    // 대신 앱 내에서 토스트/배너로 표시할 수 있음
                    console.log('포그라운드 알림 수신:', payload.notification?.title);
                }
            })
            .catch((err) => console.error('메시지 리스너 에러:', err));

        return () => {
            // cleanup if needed
        };
    }, [isSupported]);

    return {
        token,
        notification,
        isSupported,
        requestPermission,
    };
};
