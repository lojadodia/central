import Pagination from "@components/ui/pagination";
import Image from "next/image";
import { Table } from "@components/ui/table";
import { siteSettings } from "@settings/site.settings";
import usePrice from "@utils/use-price";
import Badge from "@components/ui/badge/badge";
import { Product, ProductPaginator, ProductType } from "@ts-types/generated";
import Toggle from 'react-toggle'
import http from '@utils/api/http'
import { API_ENDPOINTS } from "@utils/api/endpoints";
import ActionButtons from "@components/common/action-buttons";
import { ROUTES } from "@utils/routes";

const columns = [
	{
		title: "ID",
		dataIndex: "id",
		key: "id",
		align: "center",
		width: 64,
	},
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
	/*
	{
		title: "Descrição",
		dataIndex: "description",
		key: "description",
		align: "left",
		width: 220,
		ellipsis: true,
	}, */
	{
		title: "Preço/Unid",
		dataIndex: "price",
		key: "price",
		align: "right",
		width: 180,
		render: (value: number, record: Product) => {
			if (record?.product_type === ProductType.Variable) {
				const { price: max_price } = usePrice({
					amount: record?.max_price as number,
				});
				const { price: min_price } = usePrice({
					amount: record?.min_price as number,
				});
				return (
					<span
						className="whitespace-nowrap"
						title={`${min_price} - ${max_price}`}
					>{`${min_price} - ${max_price}`}</span>
				);
			} else {
				const { price } = usePrice({
					amount: value,
				});
				return (
					<span className="whitespace-nowrap" title={price}>
						{price}
					</span>
				);
			}
		},
	},
	{
		title: "Qtd",
		dataIndex: "quantity",
		key: "quantity",
		align: "center",
		width: 100,
	},
	{
		title: "Tipo",
		dataIndex: "product_type",
		key: "product_type",
		width: 120,
		align: "center",
		render: (product_type: string) => (
			<span className="whitespace-nowrap truncate">{product_type}</span>
		),
	},
	
	

	{
		title: "Status",
		dataIndex: "status",
		key: "status",
		align: "center",
		width: 100,
		render: (status: string) => (
			<Badge
				text={status}
				color={status === "DRAFT" ? "bg-yellow-400" : "bg-primary"}
			/>
		),
	},
	{
		title: "Ações",
		dataIndex: "id",
		key: "actions",
		align: "center",
		render: (id: string, record: Product) => {
			return !record?.sync_id && (
				<ActionButtons
					id={id}
					deleteButton={true}
					navigationPath={`${ROUTES.PRODUCTS}/edit/${record?.slug}`}
					modalActionType="DELETE_PRODUCT"
				/>
			)

		},
		width: 100,
	  },
	{
    title: "Disponível",
    dataIndex: "available",
    key: "actions",
    align: "right",
	width: 100,
    render: (available: string, attr: { id: string }) => {
      let status:any = !!parseInt(available)
  
      return <Toggle
      value={status}
      id='available'
      defaultChecked={status}
      onChange={(e:any) => {
        http.post(API_ENDPOINTS.AVAILABILITY_UPDATE, {
          type: 'products',
          id: attr.id,
          status: !status
        }).then(({ data }) => {
          status = data.status
         
        })
      }}
      />
    }
    ,
  }
];

export type IProps = {
	products?: ProductPaginator;
	defineColumns?: Array<object> | null
	onPagination: (current: number) => void;
};

const ProductList = ({ products, onPagination, defineColumns = null }: IProps) => {
	const { data, paginatorInfo } = products!;

	return (
		<>
			<div className="rounded overflow-hidden shadow mb-6">
				{/* @ts-ignore */}
				<Table columns={defineColumns || columns} data={data}
				 rowKey="id"
				 scroll={{ x: 900 }} />
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
