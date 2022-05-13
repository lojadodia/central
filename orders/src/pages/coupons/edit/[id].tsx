import Layout from "@components/common/layout";
import CouponCreateOrUpdateForm from "@components/coupon/coupon-form";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useCouponQuery } from "@data/coupon/use-coupon.query";
import { useRouter } from "next/router";

export default function UpdateCouponPage() {
  const { query } = useRouter();
  const { data, isLoading: loading, error } = useCouponQuery(
    query.id as string
  );
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading dark:text-white">Editar cupom</h1>
      </div>
      <CouponCreateOrUpdateForm initialValues={data} />
    </>
  );
}
UpdateCouponPage.Layout = Layout;
