import ConfirmationCard from "@components/common/confirmation-card";
import { useUI } from "@contexts/ui.context";
import { useDeleteBannerMutation } from "@data/banner/use-banner-delete.mutation";

const BannerDeleteView = () => {
  const { mutate: deleteBanner, isLoading: loading } = useDeleteBannerMutation();

  const { closeModal, modalData } = useUI();
  async function handleDelete() {
    deleteBanner(modalData);
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

export default BannerDeleteView;
