'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import AgreementModal from './AgreementModal';


const LoginForm = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLoginClick = () => {
        setIsModalOpen(true);
    };

    const handleAgree = () => {
        setIsModalOpen(false);
        // TODO: 동의 후 로그인 처리
        console.log('약관 동의 완료');
    };

    return (
        <div className="container px-6 flex flex-col items-center">
            <div className="h-[160px]"></div>
            <div className="text-pink-400 font-bold text-[48px]">MOSH</div>
            <div className="h-[60px]"></div>
            <Input type="text" placeholder="핸드폰 번호를 입력해주세요." className="h-[52px] w-full"/>
            <div className="h-[10px]"></div>
            <Button 
                className="bg-pink-400 text-white w-full my-2 h-[52px] mb-10"
                onClick={handleLoginClick}
            >
                가입하기
            </Button>
            <div className="flex items-center gap-4 my-8 w-full mb-14">
                <div className="flex-1 h-[1px] bg-gray-300"/>
                <span className="text-gray-500 text-sm">SNS로 간편 로그인</span>
                <div className="flex-1 h-[1px] bg-gray-300"/>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    type="button"
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
                    className="w-14 h-14 rounded-full overflow-hidden hover:opacity-90 transition-opacity ml-8"
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
            <div className="text-gray-500 text-[14px]">로그인 시 페스티벌앱의 서비스 이용 약관과</div>
            <div className="text-gray-500 text-[14px]">개인정보 취급방침에 동의하게 됩니다.</div>

            {/* 약관 동의 모달 */}
            <AgreementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAgree={handleAgree}
            />
        </div>
    );
};

export default LoginForm;