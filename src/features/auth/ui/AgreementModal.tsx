'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TermsDetailModal from './TermsDetailModal';

interface AgreementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAgree: () => void;
}

type TermsType = 'service' | 'privacy' | 'location' | 'marketing';

const AgreementModal = ({ isOpen, onClose, onAgree }: AgreementModalProps) => {
    const [agreements, setAgreements] = useState({
        all: false,
        service: false,
        privacy: false,
        location: false,
        marketing: false,
    });

    const [detailModal, setDetailModal] = useState<{
        isOpen: boolean;
        type: TermsType;
    }>({
        isOpen: false,
        type: 'service',
    });

    // 전체 동의 핸들러
    const handleAllAgree = () => {
        const newValue = !agreements.all;
        setAgreements({
            all: newValue,
            service: newValue,
            privacy: newValue,
            location: newValue,
            marketing: newValue,
        });
    };

    // 개별 동의 핸들러
    const handleSingleAgree = (key: keyof typeof agreements) => {
        const newAgreements = {
            ...agreements,
            [key]: !agreements[key],
        };

        // 필수 항목들이 모두 체크되었는지 확인
        const allRequired =
            newAgreements.service &&
            newAgreements.privacy &&
            newAgreements.location &&
            newAgreements.marketing;

        newAgreements.all = allRequired;
        setAgreements(newAgreements);
    };

    // 상세 모달 열기
    const openDetailModal = (type: TermsType) => {
        setDetailModal({ isOpen: true, type });
    };

    // 필수 항목 모두 동의했는지 확인
    const isRequiredAgreed =
        agreements.service && agreements.privacy && agreements.location;

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-end justify-center">
                {/* 배경 오버레이 */}
                <div
                    className="absolute inset-0 bg-black/50"
                    onClick={onClose}
                />

                {/* 모달 컨텐츠 */}
                <div className="relative w-full max-w-[430px] bg-white rounded-t-3xl px-6 pt-8 pb-6 animate-slide-up">
                    {/* 전체 동의 */}
                    <label className="flex items-center gap-3 pb-4 border-b border-gray-200 cursor-pointer">
                        <CheckBox
                            checked={agreements.all}
                            onChange={handleAllAgree}
                        />
                        <span className="text-base font-medium">전체 동의하기</span>
                    </label>

                    {/* 개별 약관 리스트 */}
                    <div className="py-4 space-y-4">
                        <AgreementItem
                            checked={agreements.service}
                            onChange={() => handleSingleAgree('service')}
                            onDetailClick={() => openDetailModal('service')}
                            label="서비스 이용 약관"
                            required
                        />
                        <AgreementItem
                            checked={agreements.privacy}
                            onChange={() => handleSingleAgree('privacy')}
                            onDetailClick={() => openDetailModal('privacy')}
                            label="개인정보처리방침"
                            required
                        />
                        <AgreementItem
                            checked={agreements.location}
                            onChange={() => handleSingleAgree('location')}
                            onDetailClick={() => openDetailModal('location')}
                            label="위치 정보 제공 동의"
                            required
                        />
                        <AgreementItem
                            checked={agreements.marketing}
                            onChange={() => handleSingleAgree('marketing')}
                            onDetailClick={() => openDetailModal('marketing')}
                            label="마케팅 수신 동의 (선택)"
                            required={false}
                        />
                    </div>

                    {/* 동의하기 버튼 */}
                    <Button
                        className="w-full h-[52px] bg-pink-400 hover:bg-pink-500 text-white rounded-xl mt-4"
                        onClick={onAgree}
                        disabled={!isRequiredAgreed}
                    >
                        동의하기
                    </Button>

                    {/* 닫기 */}
                    <button
                        className="w-full text-center text-gray-400 text-sm mt-4"
                        onClick={onClose}
                    >
                        닫기
                    </button>
                </div>
            </div>

            {/* 약관 상세 모달 */}
            <TermsDetailModal
                isOpen={detailModal.isOpen}
                onClose={() => setDetailModal({ ...detailModal, isOpen: false })}
                type={detailModal.type}
            />
        </>
    );
};

// 체크박스 컴포넌트
const CheckBox = ({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: () => void;
}) => {
    return (
        <div
            onClick={onChange}
            className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer transition-colors ${
                checked ? 'bg-pink-400' : 'border-2 border-gray-300'
            }`}
        >
            {checked && (
                <svg
                    width="14"
                    height="10"
                    viewBox="0 0 14 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1 5L5 9L13 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
        </div>
    );
};

// 약관 아이템 컴포넌트
const AgreementItem = ({
    checked,
    onChange,
    onDetailClick,
    label,
    required,
}: {
    checked: boolean;
    onChange: () => void;
    onDetailClick: () => void;
    label: string;
    required: boolean;
}) => {
    return (
        <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
                <CheckBox checked={checked} onChange={onChange} />
                <span className="text-sm text-gray-700">
                    {label}
                    {required && <span className="text-pink-400 ml-0.5">*</span>}
                </span>
            </label>
            <button className="text-gray-400 p-1" onClick={onDetailClick}>
                <svg
                    width="8"
                    height="14"
                    viewBox="0 0 8 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1 1L7 7L1 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    );
};

export default AgreementModal;
