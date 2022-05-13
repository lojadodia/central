import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { Tax } from "@ts-types/generated";
import { ROUTES } from "@utils/routes";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 62,
  },
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
    align: "left",
    width: 150,
  },
  {
    title: "Taxa (%)",
    dataIndex: "rate",
    key: "rate",
    align: "center",
  },
  {
    title: "País",
    dataIndex: "country",
    key: "country",
    align: "center",
  },
  {
    title: "Cidade",
    dataIndex: "city",
    key: "city",
    align: "center",
  },
  {
    title: "Conselho",
    dataIndex: "state",
    key: "state",
    align: "center",
  },
  {
    title: "Código Postal",
    dataIndex: "zip",
    key: "zip",
    align: "center",
  },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    align: "center",
    render: (id: string) => (
      <ActionButtons
        id={id}
        navigationPath={`${ROUTES.TAXES}/edit/${id}`}
        modalActionType="DELETE_TAX"
      />
    ),
    width: 200,
  },
];

export type IProps = {
  taxes: Tax[] | undefined;
};
const TaxList = ({ taxes }: IProps) => {
  return (
    <div className="rounded overflow-hidden shadow mb-8">
      {/* @ts-ignore */}
      <Table columns={columns} data={taxes} rowKey="id" scroll={{ x: 900 }} />
    </div>
  );
};

export default TaxList;
