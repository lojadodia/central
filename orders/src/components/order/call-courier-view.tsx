import ConfirmationCardCourier from "@components/common/confirmation-card-courier";
import { useUI } from "@contexts/ui.context";
import { useDeleteBannerMutation } from "@data/banner/use-banner-delete.mutation";

const CallCourierView = () => {


  const { closeModal, modalData } = useUI();
  
  async function handleConfirm() {

    closeModal();
  }
  
  return (
    <ConfirmationCardCourier
      onCancel={closeModal}

    />
  );
};

export default CallCourierView;
