import { Table } from "@components/ui/table";
import { Product } from "@ts-types/generated";
import usePrice from "@utils/use-price";

const columns = [
	{
		title: "ID",
		dataIndex: "id",
		key: "id",
		align: "center",
		width: 64,
	},
	{
		title: "Nome",
		dataIndex: "name",
		key: "name",
		align: "left",
		width: 200,
		render: (name: string) => <span className="whitespace-nowrap">{name}</span>,
	},
	{
		title: "Tipo",
		dataIndex: "type",
		key: "type",
		align: "center",
		render: (type: any) => (
			<span className="whitespace-nowrap">{type?.name}</span>
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
		width: 80,
	},
];

export type IProps = {
	products: Product[] | null | undefined;
	title?: string;
};

const PopularProductList = ({ products, title }: IProps) => {
	return (
		<div className="rounded overflow-hidden shadow mb-6">
			<h3 className="text-heading text-center font-semibold px-4 py-3 bg-white border-b border-gray-200">
				{title}
			</h3>
			<Table
				//@ts-ignore
				columns={columns}
				//@ts-ignore
				data={products}
				rowKey="id"
				scroll={{ x: 700 }}
			/>
		</div>
	);
};

export default PopularProductList;
