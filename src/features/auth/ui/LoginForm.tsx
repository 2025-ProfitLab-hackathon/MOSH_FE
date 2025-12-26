import React from 'react';
import { Input } from "@/components/ui/input"
import {Button} from "@/components/ui/button";


const LoginForm = () => {
    return (
        <div className="container px-6 flex flex-col items-center">
            <div className="h-[160px]"></div>
            <div className="text-pink-400 font-bold text-[32px]">MOSH</div>
            <div className="text-[28px] font-bold my-1">기다림은 짧게</div>
            <div className="text-[28px] font-bold mb-4">즐거움은 길게!</div>
            <div className="h-[100px]"></div>
            <Input type="text" placeholder="Enter your phone number" className="h-[52px] w-full" />
            <Button className="bg-pink-400 text-white w-full my-2 h-[52px]">로그인 하기</Button>
            <div className="flex items-center gap-4 my-8 w-full">
                <div className="flex-1 h-[1px] bg-gray-300" />
                <span className="text-gray-500 text-sm">SNS로 간편 로그인</span>
                <div className="flex-1 h-[1px] bg-gray-300" />
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
            <div>로그인 시 페스티벌앱의 서비스 이용 약관과</div>
            <div>개인정보 취급방침에 동의하게 됩니다.</div>
        </div>
    );
};

export default LoginForm;