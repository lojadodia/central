import ConfirmationCard from "@components/common/confirmation-card";
import { useUI } from "@contexts/ui.context";
import { useDeleteAttributeMutation } from "@data/attributes/use-attribute-delete.mutation";

const AttributeDeleteView = () => {
  const {
    mutate: deleteAttributeByID,
    isLoading: loading,
  } = useDeleteAttributeMutation();

  const { closeModal, modalData } = useUI();
  async function handleDelete() {
    deleteAttributeByID(modalData);
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

export default AttributeDeleteView;
