import ConfirmationCard from "@components/common/confirmation-card";
import { useUI } from "@contexts/ui.context";
import { useDeleteAttributeValueMutation } from "@data/attribute-value/use-attribute-delete.mutation";

const AttributeValueDeleteView = () => {
  const {
    mutate: deleteAttributeValueByID,
    isLoading: loading,
  } = useDeleteAttributeValueMutation();

  const { closeModal, modalData } = useUI();
  async function handleDelete() {
    deleteAttributeValueByID(modalData);
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

export default AttributeValueDeleteView;
