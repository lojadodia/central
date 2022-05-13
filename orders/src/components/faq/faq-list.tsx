import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { Faq } from "@ts-types/generated";

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
    title: "Titulo",
    dataIndex: "title",
    key: "title",
    align: "left",
    render: (title: any) => <span className="whitespace-nowrap">{title.substring(0, 60)}</span>,
  },
  {
    title: "Descrição",
    dataIndex: "description",
    key: "description",
    align: "left",
    render: (description: any) => <span className="whitespace-nowrap">{description.substring(0, 80)}</span>,
  },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    align: "right",
    render: (id: string, record: Faq) => (
      <ActionButtons
        id={record.id}
        navigationPath={`${ROUTES.FAQS}/edit/${id}`}
        modalActionType="DELETE_FAQ"
      />
    ),
  },
];

export type IProps = {
  faqs: Faq[] | undefined;
};

const FaqList = ({ faqs }: IProps) => {
  return (
    <div className="rounded overflow-hidden shadow mb-8">
      {/* @ts-ignore */}
      <Table columns={columns} data={faqs} rowKey="id" scroll={{ x: 380 }} />
    </div>
  );
};

export default FaqList;
