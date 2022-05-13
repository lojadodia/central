import ConfirmationCard from "@components/common/confirmation-card";
import { useUI } from "@contexts/ui.context";
import { useDeleteProductMutation } from "@data/product/product-delete.mutation";

const ProductDeleteView = () => {
	const {
		mutate: deleteProduct,
		isLoading: loading,
	} = useDeleteProductMutation();
	const { closeModal, modalData } = useUI();
	async function handleDelete() {
		deleteProduct(modalData);
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

export default ProductDeleteView;
