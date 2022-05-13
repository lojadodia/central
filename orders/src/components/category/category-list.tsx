import Pagination from "@components/ui/pagination";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { getIcon } from "@utils/get-icon";
import * as categoriesIcon from "@components/icons/category";
import { ROUTES } from "@utils/routes";
import { CategoryPaginator } from "@ts-types/generated";
import Image from "next/image";

import { useEffect, useState, useRef, useCallback } from "react";
import TableDragDrop from '@components/ui/table-drag-drop'
import ReactDragListView  from 'react-drag-listview';

import Toggle from 'react-toggle'
import http from '@utils/api/http'
import { API_ENDPOINTS } from "@utils/api/endpoints";

const columns = [

  {
    title: "Nome",
    accessor: 'name',
    dataIndex: "name",
    key: "name",
    align: "left",
    width: 150,
    render: (name:string) => {
      return <span className="dark:text-white">{name}</span>
    },
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
    title: "",
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
      console.log(position)
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
