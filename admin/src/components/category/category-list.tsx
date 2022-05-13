import Pagination from "@components/ui/pagination";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { getIcon } from "@utils/get-icon";
import * as categoriesIcon from "@components/icons/category";
import { ROUTES } from "@utils/routes";
import { CategoryPaginator } from "@ts-types/generated";
import Image from "next/image";

import { useState } from "react";

import Toggle from 'react-toggle'
import http from '@utils/api/http'
import { API_ENDPOINTS } from "@utils/api/endpoints";

const columns = [
  {
    title: "ID",
    accessor: 'id',
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 60,
  },
  {
    title: "Nome",
    accessor: 'name',
    dataIndex: "name",
    key: "name",
    align: "left",
    width: 150,
  }, /*
  {
    title: "Detalhes",
    accessor: 'details',
    dataIndex: "details",
    key: "details",
    align: "left",
    width: 200,
  }, */
  {
    title: "Imagem",
    accessor: 'image',
    dataIndex: "image",
    key: "image",
    align: "center",

    render: (image: any, { name }: { name: string }) => {
      if (!image?.thumbnail) return null;

      return (
        <Image
          src={image?.thumbnail ?? "/"}
          alt={name}
          layout="fixed"
          width={24}
          height={24}
          className="rounded overflow-hidden"
        />
      );
    },
  },
  {
    title: "Icon",
    accessor: 'icon',
    dataIndex: "icon",
    key: "icon",
    align: "center",
    render: (icon: string) => {
      if (!icon) return null;
      return (
        <span className="flex items-center justify-center">
          {getIcon({
            iconList: categoriesIcon,
            iconName: icon,
            className: "w-5 h-5 max-h-full max-w-full",
          })}
        </span>
      );
    },
  },
  {
    title: "Slug",
    accessor: 'slug',
    dataIndex: "slug",
    key: "slug",
    align: "center",
    ellipsis: true,
    width: 150,
    render: (slug: any) => (
      <div className="whitespace-nowrap truncate overflow-hidden" title={slug}>
        {slug}
      </div>
    ),
  },

  {
    title: "Ação",
    accessor: 'actions',
    dataIndex: "id",
    key: "actions",
    align: "center",
    width: 90,
    render: (id: string) => (
      <ActionButtons
        id={id}
        navigationPath={`${ROUTES.CATEGORIES}/edit/${id}`}
        modalActionType="DELETE_CATEGORY"
      />
    ),
  },
  {
    title: "Disponível",
    dataIndex: "available",
    key: "actions",
    align: "right",
    render: (available: string, attr: { id: string }) => {
      let status:any = !!parseInt(available)
  
      return <Toggle
      value={status}
      id='available'
      defaultChecked={status}
      onChange={(e:any) => {
        http.post(API_ENDPOINTS.AVAILABILITY_UPDATE, {
          type: 'categories',
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
  categories: CategoryPaginator | undefined | null;
  onPagination: (key: number) => void;
};
const CategoryList = ({ categories, onPagination }: IProps) => {
  
  const { data, paginatorInfo } = categories!;
  const rowExpandable = (record: any) => record.children?.length;
  let [position, setPosition] = useState()

  position = data;
  
  const dragProps = {
    onDragEnd(fromIndex:any , toIndex:any) {
      const position:any = [...data];
      const item = position.splice(fromIndex, 1)[0];
      position.splice(toIndex, 0, item);
      setPosition(position);
    },
    nodeSelector: 'li',
    handleSelector: 'a'
  };

  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6">
        <Table
          //@ts-ignore
          columns={columns}
          data={position}
          rowKey="id"
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: () => "",
            rowExpandable: rowExpandable,
          }}
          
        />
        {/* <TableDragDrop columns={columns} data={data} /> */}
       
      </div>
     
      {!!paginatorInfo.total && (
        <div className="flex justify-end items-center">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default CategoryList;
