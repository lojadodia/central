import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { ROUTES } from "@utils/routes";
import { Shipping } from "@ts-types/generated";
import usePrice from "@utils/use-price";

function realign(temp:any) {

  return temp.filter(function (item:any) { 
    return item.name != "Cancelar" && item.name != "Takeaway";    
  }).map(function (item:any, index:any) {
    item.id = item.id;
    return item;
  });

}

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
    title: "De",
    dataIndex: "min_km",
    key: "min_km",
    align: "center",
    render: (value: any) => {
      return <span className="whitespace-nowrap">{value} km</span>;
    },
  },
  {
    title: "Até",
    dataIndex: "max_km",
    key: "max_km",
    align: "center",
    render: (value: any) => {
      return <span className="whitespace-nowrap">{value} km</span>;
    },
  },
  {
    title: "Valor",
    dataIndex: "amount",
    key: "amount",
    align: "center",
    render: (value: any) => {
      const { price } = usePrice({
        amount: (Number(value)),
      });
      return <span className="whitespace-nowrap">{price}</span>;
    },
  },
  
  /*{
    title: "Global",
    dataIndex: "is_global",
    key: "is_global",
    align: "center",
    render: (value: boolean) => (
      <span className="capitalize">{value.toString()}</span>
    ),
  },*/
  /*{
  {
    title: "Tipo",
    dataIndex: "type",
    key: "type",
    align: "center",
  },
  */
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    align: "center",
    render: (id: string) => (
      <ActionButtons
        id={id}
        deleteButton={false}
        navigationPath={`${ROUTES.SHIPPINGS}/edit/${id}`}
        modalActionType="DELETE_SHIPPING"
      />
    ),
    width: 200,
  },
];

export type IProps = {
  shippings: Shipping[] | undefined;
  columnHeaders?: any
};
const ShippingList = ({ shippings, columnHeaders }: IProps) => {
  return (
    <div className="rounded overflow-hidden shadow mb-8 w-full">
      <Table
        //@ts-ignore
        columns={columnHeaders || columns}
        data={realign(shippings)}
        rowKey="id"

      />
    </div>
  );
};

export default ShippingList;
