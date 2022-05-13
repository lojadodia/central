import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { Type } from "@ts-types/generated";
import { getIcon } from "@utils/get-icon";
import * as typeIcons from "@components/icons/type";
import { ROUTES } from "@utils/routes";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 60,
  },
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
    align: "left",
    render: (name: any) => <span className="whitespace-nowrap">{name}</span>,
  },
  {
    title: "Icon",
    dataIndex: "icon",
    key: "slug",
    align: "center",
    render: (icon: string) => {
      if (!icon) return null;
      return (
        <span className="flex items-center justify-center">
          {getIcon({
            iconList: typeIcons,
            iconName: icon,
            className: "w-5 h-5 max-h-full max-w-full",
          })}
        </span>
      );
    },
  },
  {
    title: "Ações",
    dataIndex: "slug",
    key: "actions",
    align: "right",
    render: (id: string, record: Type) => (
      <ActionButtons
        id={record.id}
        navigationPath={`${ROUTES.TYPES}/edit/${id}`}
        modalActionType="DELETE_TYPE"
      />
    ),
  },
];

export type IProps = {
  types: Type[] | undefined;
};

const TypeList = ({ types }: IProps) => {
  return (
    <div className="rounded overflow-hidden shadow mb-8">
      {/* @ts-ignore */}
      <Table columns={columns} data={types} rowKey="id" scroll={{ x: 380 }} />
    </div>
  );
};

export default TypeList;
