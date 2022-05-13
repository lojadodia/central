import ConfirmationCard from "@components/common/confirmation-card";
import { useUI } from "@contexts/ui.context";
import { useDeleteCouponMutation } from "@data/coupon/use-coupon-delete.mutation";

const CouponDeleteView = () => {
  const {
    mutate: deleteCoupon,
    isLoading: loading,
  } = useDeleteCouponMutation();

  const { closeModal, modalData } = useUI();
  function handleDelete() {
    deleteCoupon(modalData);
    closeModal();
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default CouponDeleteView;
