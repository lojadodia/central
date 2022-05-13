import { Table } from "@components/ui/table";
import { Invoice } from "@ts-types/generated";

const columns = [

  {
    title: "ID",
    dataIndex: "code",
    key: "code",
    align: "left",
    width: 400,
  },
  {
    title: "Referência",
    dataIndex: "order",
    key: "order",
    align: "left",
    width: 120,
  },
  {
    title: "",
    dataIndex: "type",
    key: "type",
    align: "left",
    render: (type: any) => (
      <span dangerouslySetInnerHTML={{__html: type}} />
    ),
    width: 350,
  },
  {
    title: "Data",
    dataIndex: "date",
    key: "date",
    align: "center",
    width: 300,

  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    align: "center",
    width: 150,
  },
  {
    title: "Taxa",
    dataIndex: "ldd",
    key: "fee",
    align: "center",
    width: 150,
  },
  {
    title: "Repasse",
    dataIndex: "value",
    key: "value",
    align: "center",
    width: 150,
  },
  
  
  {
    title: "Estado",
    dataIndex: "status",
    key: "status",
    align: "center",
    render: (status: any) => (
      <span dangerouslySetInnerHTML={{__html: status}} />
    ),
  },

  {
    title: "",
    dataIndex: "actions",
    key: "actions",
    align: "center",
    render: (actions: any) => (
  
      <span dangerouslySetInnerHTML={{__html: actions}} />
      
    ),
    width: 1000,
  },
  
];

export type IProps = {
  invoices: Invoice[] | undefined;
};
const rowExpandable = (record: any) => record.children?.length;
const InvoiceList = ({ invoices }: IProps) => {
  return (
    <div className="rounded overflow-hidden shadow mb-8">
      {/* @ts-ignore */}
      <Table columns={columns} data={invoices} rowKey="id" scroll={{ x: 900 }}
       expandable={{
        expandedRowRender: () => "",
        rowExpandable: rowExpandable,
      }}
       />
    </div>
  );
};

export default InvoiceList;
