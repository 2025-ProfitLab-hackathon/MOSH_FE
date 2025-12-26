import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase 콘솔에서 복사한 설정값으로 교체하세요
const firebaseConfig = {
    apiKey: "AIzaSyDkHzVUdoaq8f_S-aHrJwnrZf2YinX33vk",
    authDomain: "mosh-d0170.firebaseapp.com",
    projectId: "mosh-d0170",
    storageBucket: "mosh-d0170.firebasestorage.app",
    messagingSenderId: "700900535016",
    appId: "1:700900535016:web:0d3ae65f66e8ccef4af75d",
    measurementId: "G-8T9PM75RJG"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 메시징 인스턴스 (클라이언트에서만 사용)
export const getMessagingInstance = () => {
    if (typeof window !== 'undefined') {
        return getMessaging(app);
    }
    return null;
};

// FCM 토큰 가져오기
export const getFCMToken = async () => {
    try {
        const messaging = getMessagingInstance();
        if (!messaging) return null;

        // 알림 권한 요청
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('알림 권한이 거부되었습니다.');
            return null;
        }

        // FCM 토큰 가져오기 (VAPID 키는 Firebase 콘솔에서 확인)
        const token = await getToken(messaging, {
            vapidKey: 'BMXmCQNaM359YDe7poJ6pfRl8tKM1ZyYpa4aIKshTPqG0kXoR-q-C9TPMmYatKONCUY19tAF0DrI3kagvSICm6Y',
        });

        console.log('FCM Token:', token);
        return token;
    } catch (error) {
        console.error('FCM 토큰 가져오기 실패:', error);
        return null;
    }
};

// 포그라운드 메시지 수신
export const onMessageListener = () => {
    const messaging = getMessagingInstance();
    if (!messaging) return Promise.resolve(null);

    return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log('포그라운드 메시지 수신:', payload);
            resolve(payload);
        });
    });
};
