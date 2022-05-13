import Card from "@components/common/card";
import Layout from "@components/common/layout";
import Search from "@components/common/search";
import ProductList from "@components/product/product-list";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { OrderField } from "@ts-types/index";
import { SortOrder } from "@ts-types/generated";
import { useState } from "react";
import { useProductsWithWeeksQuery } from "@data/product/products.query";

import Image from "next/image";
import { siteSettings } from "@settings/site.settings";
import Toggle from 'react-toggle'
import http from '@utils/api/http'
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { settings } from "cluster";
import { useSettings } from "@contexts/settings.context";
const columns = [
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
    title: "Dom",
    dataIndex: "available",
    key: "actions",
    align: "center",
    width: 32,
    render: (_: string, attr: { id: string }) => {
      let status:any = attr?.week && attr.week["1"]
  
      return <input type="checkbox"
      defaultChecked={status}
      id='sunday'
      onChange={(e:any) => {
        http.post(API_ENDPOINTS.WEEKLY_MENU, {
          id: attr.id,
          week: 1,
          status: e.target.checked == true ? 1 : 0
        })
      }}
      />
    },
  },
  {
    title: "Seg",
    dataIndex: "available",
    key: "actions",
    align: "center",
    width: 32,
    render: (_: string, attr: { id: string }) => {
      let status:any = attr?.week && attr?.week["2"]
      return <input type="checkbox"
      defaultChecked={status}
      id='monday'
      onChange={(e:any) => {
        http.post(API_ENDPOINTS.WEEKLY_MENU, {
          id: attr.id,
          week: 2,
          status: e.target.checked == true ? 1 : 0
        }).then(({ }) => {
          status = !status
         
        })
      }}
      />
    },
  },
  {
    title: "Ter",
    dataIndex: "available",
    key: "actions",
    align: "center",
    width: 32,
    render: (_: string, attr: { id: string }) => {
      let status:any = attr?.week && attr?.week["3"]
  
      return <input type="checkbox"
      defaultChecked={status}
      id='tuesday'
      onChange={(e:any) => {
        http.post(API_ENDPOINTS.WEEKLY_MENU, {
          id: attr.id,
          week: 3,
          status: e.target.checked == true ? 1 : 0
        }).then(({ }) => {
          status = !status
         
        })
      }}
      />
    },
  },
  {
    title: "Qua",
    dataIndex: "available",
    key: "actions",
    align: "center",
    width: 32,
    render: (_: string, attr: { id: string, week: object }) => {
      let status:any = attr?.week && attr?.week["4"]
      
      return <input type="checkbox"
      defaultChecked={status}
      id='wednesday'
      onChange={(e:any) => {
        http.post(API_ENDPOINTS.WEEKLY_MENU, {
          id: attr.id,
          week: 4,
          status: e.target.checked == true ? 1 : 0
        }).then(({ }) => {
          status = !status
         
        })
      }}
      />
    },
  },
  {
    title: "Qui",
    dataIndex: "available",
    key: "actions",
    align: "center",
    width: 32,
    render: (_: string, attr: { id: string }) => {
      let status:any = attr?.week && attr?.week["5"]
  
      return <input type="checkbox"
      defaultChecked={status}
      id='thursday'
      onChange={(e:any) => {
        http.post(API_ENDPOINTS.WEEKLY_MENU, {
          id: attr.id,
          week: 5,
          status: e.target.checked == true ? 1 : 0
        }).then(({ }) => {
          status = !status
         
        })
      }}
      />
    },
  },
  {
    title: "Sex",
    dataIndex: "available",
    key: "actions",
    align: "center",
    width: 32,
    render: (_: string, attr: { id: string }) => {
      let status:any = attr?.week && attr?.week["6"]
  
      return <input type="checkbox"
      defaultChecked={status}
      id='friday'
      onChange={(e:any) => {
        http.post(API_ENDPOINTS.WEEKLY_MENU, {
          id: attr.id,
          week: 6,
          status: e.target.checked == true ? 1 : 0
        }).then(({ }) => {
          status = !status
         
        })
      }}
      />
    },
  },
  {
    title: "Sáb",
    dataIndex: "available",
    key: "actions",
    align: "center",
    width: 32,
    render: (_: string, attr: { id: string }) => {
      let status:any = attr?.week && attr?.week["7"]
  
      return <input type="checkbox"
      defaultChecked={status}
      id='saturday'
      onChange={(e:any) => {
        http.post(API_ENDPOINTS.WEEKLY_MENU, {
          id: attr.id,
          week: 7,
          status: e.target.checked == true ? 1 : 0
        }).then(({ }) => {
          status = !status
         
        })
      }}
      />
    },
  },
  {
    title: "Disponivel",
    dataIndex: "available",
    key: "actions",
    align: "right",
    width: 200,
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
  }
];
export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading: loading, error } = useProductsWithWeeksQuery({
    limit: 20,
    page,
    text: searchTerm,
    orderBy: OrderField.UpdatedAt,
    sortedBy: SortOrder.Desc,
  });
  const { menuTitle = "Programação" }  = useSettings()
  
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }
  function handlePagination(current: any) {
    setPage(current);
  }
  return (
    <>
      <Card className="flex flex-col md:flex-row items-center mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-lg font-semibold text-heading">{menuTitle}</h1>
        </div>

        <div className="w-full md:w-3/4 flex items-center ml-auto">
          <Search onSearch={handleSearch} />
        </div>
      </Card>
      <ProductList products={data?.products} defineColumns={columns} onPagination={handlePagination} />
    </>
  );
}
ProductsPage.Layout = Layout;
