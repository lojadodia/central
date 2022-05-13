import ConfirmationCard from "@components/common/confirmation-card";
import { useUI } from "@contexts/ui.context";
import { useDeleteShippingClassMutation } from "@data/shipping/use-shipping-delete.mutation";

const ShippingDeleteView = () => {
  const {
    mutate: deleteShippingClass,
    isLoading: loading,
  } = useDeleteShippingClassMutation();

  const { closeModal, modalData } = useUI();
  function handleDelete() {
    deleteShippingClass(modalData);
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

export default ShippingDeleteView;
