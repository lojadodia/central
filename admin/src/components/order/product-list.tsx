import Pagination from "@components/ui/pagination";
import Image from "next/image";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { siteSettings } from "@settings/site.settings";
import usePrice from "@utils/use-price";
import { ROUTES } from "@utils/routes";
import Badge from "@components/ui/badge/badge";
import { Product, ProductPaginator } from "@ts-types/generated";

const columns = [
  // {
  //   title: "ID",
  //   dataIndex: "id",
  //   key: "id",
  //   align: "center",
  //   width: 64,
  // },
  {
    title: "Imagem",
    dataIndex: "image",
    key: "image",
    align: "left",
    width: 74,
    render: (image: any, { name }: { name: string }) => (
      <Image
        src={image?.thumbnail ?? siteSettings.product.placeholder}
        alt={name}
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
    width: 200,
    ellipsis: true,
  },
  {
    title: "Tipo",
    dataIndex: "type",
    key: "type",
    width: 120,
    align: "center",
    ellipsis: true,
    render: (type: any) => (
      <span className="whitespace-nowrap truncate">{type?.name}</span>
    ),
  },
  {
    title: "Preço/Unid",
    dataIndex: "price",
    key: "price",
    align: "right",
    width: 100,
    render: (value: number) => {
      const { price } = usePrice({
        amount: value,
      });
      return <span>{price}</span>;
    },
  },
  {
    title: "Quantidade",
    dataIndex: "quantity",
    key: "quantity",
    align: "center",
    width: 100,
  },
  // {
  //   title: "Description",
  //   dataIndex: "description",
  //   key: "description",
  //   align: "left",
  //   width: 220,
  //   ellipsis: true,
  // },
  // {
  //   title: "Status",
  //   dataIndex: "status",
  //   key: "status",
  //   align: "center",
  //   width: 100,
  //   render: (status: string) => (
  //     <Badge
  //       text={status}
  //       color={status === "DRAFT" ? "bg-yellow-400" : "bg-primary"}
  //     />
  //   ),
  // },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    align: "center",
    width: 80,
    render: (id: string, record: Product) => <button>Add to Cart</button>,
  },
];

export type IProps = {
  products?: ProductPaginator;
  onPagination: (current: number) => void;
};

const ProductList = ({ products, onPagination }: IProps) => {
  const { data, paginatorInfo } = products!;

  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6">
        {/* @ts-ignore */}
        <Table columns={columns} data={data} rowKey="id" scroll={{ x: 900 }} />
      </div>

      {!!paginatorInfo.total && (
        <div className="flex justify-end items-center">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
            showLessItems
          />
        </div>
      )}
    </>
  );
};

export default ProductList;
