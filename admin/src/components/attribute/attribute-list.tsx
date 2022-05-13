import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { ROUTES } from "@utils/routes";
import { Attribute } from "@ts-types/generated";

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
    title: "Valores",
    dataIndex: "values",
    key: "values",
    align: "left",
    render: (values: any) => {
      return (
        <span className="whitespace-nowrap">
          {values?.map((singleValues: any, index: number) => {
            if(index == 0){
              return singleValues.value;
            }else if(index > 0 && index < 5){
              return `, ${singleValues.value}`;
            }else if(index == 6){
              return '...';
            }
             
          })}
        </span>
      );
    },
  },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    align: "right",
    render: (id: string) => (
      <ActionButtons
        id={id}
        navigationPath={`${ROUTES.ATTRIBUTES}/edit/${id}`}
        modalActionType="DELETE_ATTRIBUTE"
      />
    ),
  },
];

export type IProps = {
  attributes: Attribute[] | undefined;
};
const AttributeList = ({ attributes }: IProps) => {
  return (
    <div className="rounded overflow-hidden shadow mb-8">
      <Table
        // @ts-ignore
        columns={columns}
        data={attributes}
        rowKey="id"
        scroll={{ x: 380 }}
      />
    </div>
  );
};

export default AttributeList;
