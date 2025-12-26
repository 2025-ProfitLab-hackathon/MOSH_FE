// Firebase Cloud Messaging v1 API로 푸시 알림 보내기
// 실행: node scripts/sendNotification.js

const https = require('https');
const { google } = require('googleapis');
const path = require('path');

// Firebase 프로젝트 ID
const PROJECT_ID = 'mosh-d0170';

// FCM 토큰
const FCM_TOKEN = 'f45r0OrHi7FHHKdaEBnMni:APA91bEsM8CF00Ur1sLZM9nrCsWVFuFo4AEwMd-SlcYRfQAPWxF9r53PQ9iIthpPoSOa4s0YTlBjVz3YsT3kRjU0Sj492vL2rluZexssZnX9Na5AlRqiZeI';

// 서비스 계정 키 파일 (절대 경로로 로드)
const SERVICE_ACCOUNT_PATH = path.join(__dirname, 'serviceAccountKey.json');
const SERVICE_ACCOUNT = require(SERVICE_ACCOUNT_PATH);

async function getAccessToken() {
    const jwtClient = new google.auth.JWT({
        email: SERVICE_ACCOUNT.client_email,
        key: SERVICE_ACCOUNT.private_key,
        scopes: ['https://www.googleapis.com/auth/firebase.messaging']
    });
    const tokens = await jwtClient.authorize();
    return tokens.access_token;
}

async function sendNotification() {
    try {
        console.log('🔑 토큰 가져오는 중...');
        const accessToken = await getAccessToken();
        
        const message = {
            message: {
                token: FCM_TOKEN,
                notification: {
                    title: '🍽️ 음식 준비 완료!',
                    body: '주문하신 음식이 모두 준비되었습니다. A홀 28번 부스로 방문해주세요.',
                },
                data: {
                    type: '음식',
                    url: '/home/alarm',
                },
                webpush: {
                    notification: {
                        icon: '/icons/icon-192x192.png',
                    },
                },
            },
        };

        const postData = JSON.stringify(message);

        const options = {
            hostname: 'fcm.googleapis.com',
            path: `/v1/projects/${PROJECT_ID}/messages:send`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'Authorization': `Bearer ${accessToken}`,
            },
        };

        console.log('📤 알림 전송 중...');

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ 알림 전송 성공!');
                    console.log('응답:', data);
                } else {
                    console.log('❌ 알림 전송 실패 (상태 코드:', res.statusCode, ')');
                    console.log('응답:', data);
                }
            });
        });

        req.on('error', (e) => console.error('에러:', e));
        req.write(postData);
        req.end();

    } catch (error) {
        console.error('❌ 에러:', error.message);
    }
}

sendNotification();
