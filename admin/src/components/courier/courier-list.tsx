import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { Courier } from "@ts-types/generated";
import Image from "next/image";
import { ROUTES } from "@utils/routes";
import { siteSettings } from "@settings/site.settings";
const columns = [
  {
    title: "Avatar",
    dataIndex: "image",
    key: "image",
    align: "center",
    width: 74,
    render: (image: any) => (

      <Image
        src={image ?? siteSettings.avatar.placeholder}
        layout="fixed"
        width={42}
        height={42}
        className="rounded overflow-hidden"
      />
    ),
  },
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
    align: "left",
    render: (title: any) => <span className="whitespace-nowrap">{title.substring(0, 60)}</span>,
  },
  {
    title: "Contato",
    dataIndex: "phone",
    key: "phone",
    align: "left",
    render: (description: any) => <span className="whitespace-nowrap">{description.substring(0, 80)}</span>,
  },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    align: "right",
    render: (id: string, record: Courier) => (
      <ActionButtons
        id={record.id}
        navigationPath={`${ROUTES.COURIERS}/edit/${id}`}
        modalActionType="DELETE_COURIER"
      />
    ),
  },
];

export type IProps = {
  couriers: Courier[] | undefined;
};

const CourierList = ({ couriers }: IProps) => {
  return (
    <div className="rounded overflow-hidden shadow mb-8">
      {/* @ts-ignore */}
      <Table columns={columns} data={couriers} rowKey="id" scroll={{ x: 380 }} />
    </div>
  );
};

export default CourierList;
