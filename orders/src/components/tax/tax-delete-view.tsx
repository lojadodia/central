import ConfirmationCard from "@components/common/confirmation-card";
import { useUI } from "@contexts/ui.context";
import { useDeleteTaxMutation } from "@data/tax/use-tax-delete.mutation";

const TaxDeleteView = () => {
  const { mutate: deleteTax, isLoading: loading } = useDeleteTaxMutation();
  const { closeModal, modalData } = useUI();
  async function handleDelete() {
    deleteTax(modalData);
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

export default TaxDeleteView;
