import OrderDetailsCard from "@components/common/order-details-card";
import { useUI } from "@contexts/ui.context";


const OrderDetailsView = () => {


  const { closeModal, modalData } = useUI();
  
  async function handleConfirm() {

    closeModal();
  }
  
  return (
    <OrderDetailsCard
      onCancel={closeModal}
    />
  );
};

export default OrderDetailsView;
