import ConfirmationCard from "@components/common/confirmation-card";
import { useUI } from "@contexts/ui.context";
import { useDeleteCategoryMutation } from "@data/category/use-category-delete.mutation";

const CategoryDeleteView = () => {
  const {
    mutate: deleteCategory,
    isLoading: loading,
  } = useDeleteCategoryMutation();

  const { closeModal, modalData } = useUI();
  function handleDelete() {
    deleteCategory(modalData);
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

export default CategoryDeleteView;
