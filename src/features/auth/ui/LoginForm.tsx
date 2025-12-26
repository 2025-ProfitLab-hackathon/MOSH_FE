'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { authApi } from '@/src/lib/api';
import { useAuthStore } from '../store/authStore';
import AgreementModal from './AgreementModal';

type Step = 'phone' | 'verify' | 'signup';
type Mode = 'login' | 'signup';

const LoginForm = () => {
    const router = useRouter();
    const { login } = useAuthStore();
    
    // 모드 관리 (로그인 / 가입)
    const [mode, setMode] = useState<Mode>('login');
    
    // 단계 관리
    const [step, setStep] = useState<Step>('phone');
    
    // 입력값
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [phoneVerificationToken, setPhoneVerificationToken] = useState('');
    
    // 회원가입 정보
    const [nickname, setNickname] = useState('');
    const [birthday, setBirthday] = useState('');
    const [sex, setSex] = useState<'M' | 'F' | ''>('');
    
    // 상태
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 전화번호 포맷팅
    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/[^0-9]/g, '');
        return numbers.slice(0, 11);
    };

    // 인증번호 발송
    const handleSendVerification = async (selectedMode: Mode) => {
        if (phoneNumber.length < 10) {
            setError('올바른 전화번호를 입력해주세요.');
            return;
        }

        setMode(selectedMode);

        try {
            setIsLoading(true);
            setError('');
            
            const response = await authApi.sendPhoneVerification(phoneNumber);
            setVerificationId(response.verificationId);
            setStep('verify');
            
            // 카운트다운 시작
            setCountdown(response.expiresInSeconds);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            
        } catch (err: any) {
            setError(err.message || '인증번호 발송에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 인증번호 확인
    const handleVerifyCode = async () => {
        if (verificationCode.length !== 6) {
            setError('6자리 인증번호를 입력해주세요.');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            const response = await authApi.confirmPhoneVerification(
                verificationId, 
                verificationCode
            );
            setPhoneVerificationToken(response.phoneVerificationToken);
            
            // 로그인 모드면 바로 로그인 시도
            if (mode === 'login') {
                await handleLogin(response.phoneVerificationToken);
            } else {
                // 가입 모드면 회원정보 입력 단계로
                setStep('signup');
            }
            
        } catch (err: any) {
            setError(err.message || '인증번호가 일치하지 않습니다.');
            setIsLoading(false);
        }
    };

    // 로그인 시도 (기존 회원)
    const handleLogin = async (token: string) => {
        try {
            // 기존 회원은 더미 정보로 로그인 시도
            // 서버에서 기존 회원이면 200 응답, 신규면 실패
            const response = await authApi.phoneLogin({
                phoneVerificationToken: token,
                nickname: 'user', // 기존 회원은 서버에서 무시
                birthday: '1990-01-01', // 기존 회원은 서버에서 무시
            });
            
            // 로그인 성공
            login(response.accessToken, response.user);
            router.push('/home');
            
        } catch (err: any) {
            // 로그인 실패 - 계정이 없는 경우
            setError('계정을 찾을 수 없습니다. 회원가입을 진행해주세요.');
            setStep('signup');
            setMode('signup');
        } finally {
            setIsLoading(false);
        }
    };

    // 약관 동의 후 회원가입
    const handleAgree = async () => {
        setIsModalOpen(false);
        
        if (!nickname || !birthday) {
            setError('닉네임과 생년월일을 입력해주세요.');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            const response = await authApi.phoneLogin({
                phoneVerificationToken,
                nickname,
                birthday,
                sex: sex || undefined,
            });
            
            // 로그인 처리
            login(response.accessToken, response.user);
            
            // 홈으로 이동
            router.push('/home');
            
        } catch (err: any) {
            setError(err.message || '회원가입에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 소셜 로그인 (카카오/네이버)
    const handleSocialLogin = async (provider: 'KAKAO' | 'NAVER') => {
        // TODO: 실제 소셜 로그인 SDK 연동 필요
        alert(`${provider} 로그인은 SDK 연동이 필요합니다.`);
    };

    // 카운트다운 포맷
    const formatCountdown = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    // 초기화
    const resetForm = () => {
        setStep('phone');
        setMode('login');
        setVerificationCode('');
        setPhoneVerificationToken('');
        setNickname('');
        setBirthday('');
        setSex('');
        setError('');
    };

    return (
        <div className="container px-6 flex flex-col items-center min-h-screen">
            <div className="h-[100px]"></div>
            <div className="text-pink-400 font-bold text-[48px]">MOSH</div>
            <div className="h-[30px]"></div>

            {/* Step 1: 전화번호 입력 */}
            {step === 'phone' && (
                <>
                    <Input 
                        type="tel" 
                        placeholder="핸드폰 번호를 입력해주세요." 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                        className="h-[52px] w-full"
                        disabled={isLoading}
                    />
                    <div className="h-[10px]"></div>
                    
                    {error && (
                        <p className="text-red-500 text-sm w-full mb-2">{error}</p>
                    )}
                    
                    {/* 로그인 / 가입 버튼 */}
                    <div className="flex gap-3 w-full">
                        <Button 
                            variant="outline"
                            className={`flex-1 h-[52px] border-pink-400 text-pink-400 hover:bg-pink-50 ${
                                phoneNumber.length < 10 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={() => handleSendVerification('login')}
                            disabled={phoneNumber.length < 10 || isLoading}
                        >
                            {isLoading && mode === 'login' ? '발송 중...' : '로그인'}
                        </Button>
                        <Button 
                            className={`flex-1 h-[52px] ${
                                phoneNumber.length >= 10 
                                    ? 'bg-pink-400 hover:bg-pink-500 text-white' 
                                    : 'bg-gray-400 text-gray-800 cursor-not-allowed'
                            }`}
                            onClick={() => handleSendVerification('signup')}
                            disabled={phoneNumber.length < 10 || isLoading}
                        >
                            {isLoading && mode === 'signup' ? '발송 중...' : '가입하기'}
                        </Button>
                    </div>
                </>
            )}

            {/* Step 2: 인증번호 입력 */}
            {step === 'verify' && (
                <>
                    <div className="w-full mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                            mode === 'login' 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-pink-100 text-pink-600'
                        }`}>
                            {mode === 'login' ? '로그인' : '회원가입'}
                        </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 w-full">
                        {phoneNumber}로 발송된 인증번호를 입력해주세요.
                    </p>
                    
                    <div className="relative w-full">
                        <Input 
                            type="text" 
                            placeholder="인증번호 6자리" 
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            className="h-[52px] w-full pr-16"
                            disabled={isLoading}
                            maxLength={6}
                        />
                        {countdown > 0 && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 font-medium">
                                {formatCountdown(countdown)}
                            </span>
                        )}
                    </div>
                    
                    <div className="h-[10px]"></div>
                    
                    {error && (
                        <p className="text-red-500 text-sm w-full mb-2">{error}</p>
                    )}
                    
                    <Button 
                        className={`w-full my-2 h-[52px] ${
                            verificationCode.length === 6 
                                ? 'bg-pink-400 hover:bg-pink-500 text-white' 
                                : 'bg-gray-400 text-gray-800 cursor-not-allowed'
                        }`}
                        onClick={handleVerifyCode}
                        disabled={verificationCode.length !== 6 || isLoading}
                    >
                        {isLoading ? '확인 중...' : '인증하기'}
                    </Button>
                    
                    <button 
                        className="text-gray-500 text-sm mt-2"
                        onClick={resetForm}
                    >
                        처음으로 돌아가기
                    </button>
                    
                    {countdown === 0 && (
                        <button 
                            className="text-pink-400 text-sm mt-2"
                            onClick={() => handleSendVerification(mode)}
                        >
                            인증번호 재발송
                        </button>
                    )}
                </>
            )}

            {/* Step 3: 회원정보 입력 (가입 모드에서만) */}
            {step === 'signup' && (
                <>
                    <div className="w-full mb-4">
                        <span className="inline-block px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-600">
                            회원가입
                        </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 w-full text-center">
                        회원 정보를 입력해주세요.
                    </p>
                    
                    <Input 
                        type="text" 
                        placeholder="닉네임" 
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="h-[52px] w-full mb-3"
                        disabled={isLoading}
                    />
                    
                    <Input 
                        type="date" 
                        placeholder="생년월일" 
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className="h-[52px] w-full mb-3"
                        disabled={isLoading}
                    />
                    
                    <div className="flex gap-3 w-full mb-4">
                        <button
                            type="button"
                            onClick={() => setSex('M')}
                            className={`flex-1 h-[52px] rounded-lg border-2 font-medium transition-colors ${
                                sex === 'M' 
                                    ? 'border-pink-400 bg-pink-50 text-pink-400' 
                                    : 'border-gray-300 text-gray-600'
                            }`}
                        >
                            남성
                        </button>
                        <button
                            type="button"
                            onClick={() => setSex('F')}
                            className={`flex-1 h-[52px] rounded-lg border-2 font-medium transition-colors ${
                                sex === 'F' 
                                    ? 'border-pink-400 bg-pink-50 text-pink-400' 
                                    : 'border-gray-300 text-gray-600'
                            }`}
                        >
                            여성
                        </button>
                    </div>
                    
                    {error && (
                        <p className="text-red-500 text-sm w-full mb-2">{error}</p>
                    )}
                    
                    <Button 
                        className={`w-full my-2 h-[52px] mb-4 ${
                            nickname && birthday 
                                ? 'bg-pink-400 hover:bg-pink-500 text-white' 
                                : 'bg-gray-400 text-gray-800 cursor-not-allowed'
                        }`}
                        onClick={() => setIsModalOpen(true)}
                        disabled={!nickname || !birthday || isLoading}
                    >
                        {isLoading ? '처리 중...' : '가입하기'}
                    </Button>
                    
                    <button 
                        className="text-gray-500 text-sm"
                        onClick={resetForm}
                    >
                        처음으로 돌아가기
                    </button>
                </>
            )}

            {/* SNS 로그인 (전화번호 입력 단계에서만 표시) */}
            {step === 'phone' && (
                <>
                    <div className="flex items-center gap-4 my-8 w-full">
                        <div className="flex-1 h-[1px] bg-gray-300"/>
                        <span className="text-gray-500 text-sm">SNS로 간편 로그인</span>
                        <div className="flex-1 h-[1px] bg-gray-300"/>
                    </div>

                    <div className="flex justify-center gap-8">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('NAVER')}
                            className="w-14 h-14 rounded-full overflow-hidden hover:opacity-90 transition-opacity"
                        >
                            <img
                                src="/icons/NAVER_login.png"
                                alt="네이버 로그인"
                                width={56}
                                height={56}
                                className="object-cover"
                            />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('KAKAO')}
                            className="w-14 h-14 rounded-full overflow-hidden hover:opacity-90 transition-opacity"
                        >
                            <img
                                src="/icons/kakao_login.png"
                                alt="카카오 로그인"
                                width={56}
                                height={56}
                                className="object-cover"
                            />
                        </button>
                    </div>
                    <div className="m-4"></div>
                    <div className="text-gray-500 text-[14px] text-center">
                        로그인 시 페스티벌앱의 서비스 이용 약관과
                        <br />
                        개인정보 취급방침에 동의하게 됩니다.
                    </div>
                </>
            )}

            <AgreementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAgree={handleAgree}
            />
        </div>
    );
};

export default LoginForm;