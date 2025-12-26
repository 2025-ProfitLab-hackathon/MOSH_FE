import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function PaymentMethod() {
  return (
    <>
      <div className="mt-6 mb-3 text-body-L-semibold">결제 수단</div>
      <RadioGroup defaultValue="option-one">
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="option-one"
            id="option-one"
            className={`
                    w-5 h-5 border-[var(--color-gray-300)] transition-all
                    data-[state=checked]:bg-[var(--color-pink-400)] 
                    data-[state=checked]:border-[var(--color-pink-400)] 
                    data-[state=checked]:!text-white
                  `}
          />
          <Label htmlFor="option-one">계좌이체</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="option-two"
            id="option-two"
            className={`
            w-5 h-5 border-[var(--color-gray-300)] transition-all
            data-[state=checked]:bg-[var(--color-pink-400)] 
            data-[state=checked]:border-[var(--color-pink-400)] 
            data-[state=checked]:!text-white
          `}
          />
          <Label htmlFor="option-two">네이버 페이</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="option-three"
            id="option-three"
            className={`
            w-5 h-5 border-[var(--color-gray-300)] transition-all
            data-[state=checked]:bg-[var(--color-pink-400)] 
            data-[state=checked]:border-[var(--color-pink-400)] 
            data-[state=checked]:!text-white
          `}
          />
          <Label htmlFor="option-three">신용/체크카드</Label>
        </div>
      </RadioGroup>
    </>
  );
}
