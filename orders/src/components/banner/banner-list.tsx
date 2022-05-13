import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { Banner } from "@ts-types/generated";
import Image from "next/image";
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
    title: "Imagem",
		dataIndex: "image",
		key: "image",
		align: "left",
		width: 74,
		render: (image: any) => (
			<Image
				src={image ?? image}
				alt={image}
				layout="fixed"
				width={42}
				height={42}
				className="rounded overflow-hidden"
			/>
		),
  },
  {
    title: "Link",
    dataIndex: "link",
    key: "link",
    align: "left",
    render: (link: any) => <span className="whitespace-nowrap">{link.substring(0, 60)}</span>,
  },
  
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    align: "right",
    render: (id: string, record: Banner) => (
      <ActionButtons
        id={record.id}
        navigationPath={`${ROUTES.BANNERS}/edit/${id}`}
        modalActionType="DELETE_BANNER"
      />
    ),
  },
];

export type IProps = {
  banners: Banner[] | undefined;
};

const BannerList = ({ banners }: IProps) => {
  return (
    <div className="rounded overflow-hidden shadow mb-8">
      {/* @ts-ignore */}
      <Table columns={columns} data={banners} rowKey="id" scroll={{ x: 380 }} />
    </div>
  );
};

export default BannerList;
