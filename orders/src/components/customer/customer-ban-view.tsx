import ConfirmationCard from "@components/common/confirmation-card";
import { useUI } from "@contexts/ui.context";
import { useBlockUserMutation } from "@data/user/use-user-block.mutation";
import { useUnblockUserMutation } from "@data/user/use-user-unblock.mutation";

const CustomerBanView = () => {
  const { mutate: blockUser, isLoading: loading } = useBlockUserMutation();
  const {
    mutate: unblockUser,
    isLoading: activeLoading,
  } = useUnblockUserMutation();

  const {
    closeModal,
    modalData: { id, type },
  } = useUI();
  async function handleDelete() {
    if (type === "ban") {
      blockUser(id);
    } else {
      unblockUser(id);
    }
    closeModal();
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnText={type === "ban" ? "Bloquear" : "Desbloquear"}
      title={type === "ban" ? "Bloquear Cliente" : "Desbloquear Cliente"}
      description="Tem certeza de que deseja bloquear este cliente?"
      deleteBtnLoading={loading || activeLoading}
    />
  );
};

export default CustomerBanView;
