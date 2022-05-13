import Layout from "@components/common/layout";
import CouponCreateOrUpdateForm from "@components/coupon/coupon-form";

export default function CreateCouponPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading">
        Criar novo Voucher
        </h1>
      </div>
      <CouponCreateOrUpdateForm />
    </>
  );
}
CreateCouponPage.Layout = Layout;
