import BasketMenu from '@/src/features/payment/ui/basketMenu';
import PaymentMethod from '@/src/features/payment/ui/paymentMethod';
import ReceiveMethod from '@/src/features/payment/ui/receiveMethod';
import TotalPriceBox from '@/src/features/payment/ui/totalPriceBox';

export default function PaymentPage() {
  return (
    <>
      <div className="px-4">
        <BasketMenu />
        <ReceiveMethod />
        <PaymentMethod />
        <div className="border-t border-gray-200 my-4"></div>
        <TotalPriceBox />
      </div>
    </>
  );
}
