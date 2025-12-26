// Firebase 서비스 워커 (백그라운드 알림 처리)
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Firebase 설정 (firebase.ts와 동일하게)
firebase.initializeApp({
    apiKey: "AIzaSyDkHzVUdoaq8f_S-aHrJwnrZf2YinX33vk",
    authDomain: "mosh-d0170.firebaseapp.com",
    projectId: "mosh-d0170",
    storageBucket: "mosh-d0170.firebasestorage.app",
    messagingSenderId: "700900535016",
    appId: "1:700900535016:web:0d3ae65f66e8ccef4af75d",
});

const messaging = firebase.messaging();

// 백그라운드 메시지 수신
messaging.onBackgroundMessage((payload) => {
    console.log('백그라운드 메시지 수신:', payload);

    const notificationTitle = payload.notification?.title || '새 알림';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        data: payload.data,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // 클릭 시 앱 열기
    event.waitUntil(
        clients.openWindow(event.notification.data?.url || '/')
    );
});
