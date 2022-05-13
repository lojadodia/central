import ConfirmationCardGlovo from "@components/common/confirmation-card-glovo";
import { useUI } from "@contexts/ui.context";
import { useDeleteBannerMutation } from "@data/banner/use-banner-delete.mutation";
import { toast } from "react-toastify";

const CallGlovoView = () => {
  const { mutate: deleteBanner, isLoading: loading } = useDeleteBannerMutation();

  const { closeModal, modalData } = useUI();
  
  async function handleConfirm() {
    if(modalData.type == "confirm"){
      fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/glovo/confirm/${modalData.hash}`)
        .then(res => res.json()).then(res => {
          if(res?.error){
            toast.success(`${res?.error} (${res?.code})`);
          }else{
            toast.success(res?.success);
            location.href="";
          }
      })
    }else{
      fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/glovo/cancel/${modalData.hash}`)
        .then(res => res.json()).then(res => {
          if(res?.error){
            toast.success(`${res?.error} (${res?.code})`);
          }else{
            toast.success(res?.success);
            location.href="";
          }
      })
    }
    

    closeModal();
  }
  
  return (
    <ConfirmationCardGlovo
      onCancel={closeModal}
      onDelete={handleConfirm}
      disableConfirm={modalData.disable}
      deleteBtnText="Confirmar"
      title={modalData.title}
      description={modalData.message}
      deleteBtnLoading={loading}
    />
  );
};

export default CallGlovoView;
