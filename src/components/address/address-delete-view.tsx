import ConfirmationCard from "@components/common/confirmation-card";
import { useUI } from "@contexts/ui.context";
import { useDeleteAddressMutation } from "@data/customer/use-address.mutation";
import { useCheckout } from "@contexts/checkout.context";

const AddressDeleteView = () => {
  const { closeModal, modalData } = useUI();
  const { mutate: deleteAddressById, isLoading } = useDeleteAddressMutation();
  const { updateBillingAddress, updateShippingAddress, updateClient, client } = useCheckout();

  function handleDelete() {
    deleteAddressById({ id: modalData.addressId });
    setTimeout(() => {
      updateBillingAddress(null)
    }, 600);
    
    updateShippingAddress(null)
 
    return closeModal();
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={isLoading}
    />
  );
};

export default AddressDeleteView;
