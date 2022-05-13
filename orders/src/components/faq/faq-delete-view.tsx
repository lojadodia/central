import ConfirmationCard from "@components/common/confirmation-card";
import { useUI } from "@contexts/ui.context";
import { useDeleteFaqMutation } from "@data/faq/use-faq-delete.mutation";

const FaqDeleteView = () => {
  const { mutate: deleteFaq, isLoading: loading } = useDeleteFaqMutation();

  const { closeModal, modalData } = useUI();
  async function handleDelete() {
    deleteFaq(modalData);
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

export default FaqDeleteView;
