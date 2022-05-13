import ConfirmationCard from "@components/common/confirmation-card";
import { useUI } from "@contexts/ui.context";
import { useDeleteCourierMutation } from "@data/courier/use-courier-delete.mutation";

const CourierDeleteView = () => {
  const { mutate: deleteCourier, isLoading: loading } = useDeleteCourierMutation();

  const { closeModal, modalData } = useUI();
  async function handleDelete() {
    deleteCourier(modalData);
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

export default CourierDeleteView;
