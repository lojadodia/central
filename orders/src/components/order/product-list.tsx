import Pagination from "@components/ui/pagination";
import Image from "next/image";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { siteSettings } from "@settings/site.settings";
import usePrice from "@utils/use-price";
import { ROUTES } from "@utils/routes";
import Badge from "@components/ui/badge/badge";
import { Product, ProductPaginator } from "@ts-types/generated";
import Toggle from 'react-toggle'
import http from '@utils/api/http'
import { API_ENDPOINTS } from "@utils/api/endpoints";

const columns = [
  {
    title: "Imagem",
    dataIndex: "image",
    key: "image",
    align: "left",
    width: 30,
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
    width: 70,
    ellipsis: true,
    render: (name:string) => {
      return <span className="dark:text-white">{name}</span>
    },

  },
  // {
  //   title: "Preço/Unid",
  //   dataIndex: "price",
  //   key: "price",
  //   align: "right",
  //   width: 20,
  //   render: (value: number) => {
  //     const { price } = usePrice({
  //       amount: value,
  //     });
  //     return <span>{price}</span>;
  //   },
  // },
  {
    title: "",
    dataIndex: "available",
    key: "actions",
    align: "right",
    width: 30,
    render: (available: string, attr: { id: string }) => {
      let status:any = !!parseInt(available)
  
      return <Toggle
      id='available'
      defaultChecked={status}
      onChange={() => {
        http.post(API_ENDPOINTS.AVAILABILITY_UPDATE, {
          type: 'products',
          id: attr.id,
          status: !status
        }).then(() => {
          status = !status
         
        })
      }}
      />
    },
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
        <Table columns={columns} data={data} rowKey="id"  />
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
