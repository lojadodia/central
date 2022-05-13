import { BanUser } from "@components/icons/ban-user";
import Edit from "@components/icons/edit";
import Trash from "@components/icons/trash";
import { useUI } from "@contexts/ui.context";
import Link from "@components/ui/link";
import { CheckMarkCircle } from "@components/icons/checkmark-circle";

type Props = {
  id: string;
  modalActionType: string;
  navigationPath?: string;
  editButton?: boolean;
  deleteButton?: boolean;
  banButton?: boolean;
  activeButton?: boolean;
  editButtonText?: string;
};

const ActionButtons = ({
  id,
  modalActionType,
  editButton = true,
  deleteButton = true,
  banButton = false,
  activeButton = false,
  navigationPath,
}: Props) => {
  const { openModal, setModalData, setModalView } = useUI();
  function handleDelete() {
    setModalView(modalActionType);
    setModalData(id);
    return openModal();
  }
  function handleCustomer(type: string) {
    setModalView(modalActionType);
    setModalData({ id, type });
    return openModal();
  }
  return (
    <div className="space-x-3 inline-flex items-center w-auto">
      {editButton && navigationPath ? (
        <Link
          href={navigationPath}
          className="text-body transition duration-200 hover:text-heading dark:text-white"
        >
          <Edit width={16} />
        </Link>
      ) : null}
      {deleteButton && (
        <button
          onClick={handleDelete}
          className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
        >
          <Trash width={16} />
        </button>
      )}
      {banButton && (
        <button
          onClick={() => handleCustomer("ban")}
          className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
          title="Banir usuário"
        >
          <BanUser width={20} />
        </button>
      )}
      {activeButton && (
        <button
          onClick={() => handleCustomer("active")}
          className="text-primary transition duration-200 hover:text-gossamer-700 focus:outline-none"
          title="Ativar usuário"
        >
          <CheckMarkCircle width={20} />
        </button>
      )}
      
    </div>
  );
};

export default ActionButtons;
