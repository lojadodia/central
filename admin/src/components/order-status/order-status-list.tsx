import Pagination from "@components/ui/pagination";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { ROUTES } from "@utils/routes";
import { OrderStatus, OrderStatusPaginator } from "@ts-types/generated";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 70,
  },
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
    align: "left",
    render: (name: string, record: OrderStatus) => (
      <span className="font-semibold" style={{ color: record?.color! }}>
        {name}
      </span>
    ),
  },
  {
    title: "Nº Série",
    dataIndex: "serial",
    key: "serial",
    align: "center",
  },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    align: "right",
    render: (id: string, record: OrderStatus) => (
      <ActionButtons
        id={id}
        deleteButton={false}
        navigationPath={`${ROUTES.ORDER_STATUS}/edit/${record?.name}`}
        modalActionType="DELETE_ORDER_STATUS"
      />
    ),
  },
];

export type IProps = {
  order_statuses: OrderStatusPaginator | undefined | null;
  onPagination: (key: number) => void;
};
const OrderStatusList = ({ order_statuses, onPagination }: IProps) => {
  const { data, paginatorInfo } = order_statuses!;
  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6">
        <Table
          //@ts-ignore
          columns={columns}
          data={data}
          rowKey="id"
          scroll={{ x: 380 }}
        />
      </div>

      {!!paginatorInfo.total && (
        <div className="flex justify-end items-center">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default OrderStatusList;
