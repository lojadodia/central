import Pagination from "@components/ui/pagination";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { getIcon } from "@utils/get-icon";
import * as categoriesIcon from "@components/icons/category";
import { ROUTES } from "@utils/routes";
import { CategoryPaginator } from "@ts-types/generated";
import Image from "next/image";
import axios from 'axios';
import { useEffect, useState, useRef, useCallback } from "react";
import TableDragDrop from '@components/ui/table-drag-drop'
import ReactDragListView  from 'react-drag-listview';

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
  },
  {
    title: "Detalhes",
    accessor: 'details',
    dataIndex: "details",
    key: "details",
    align: "left",
    width: 200,
  },
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
];
export type IProps = {
  categories: CategoryPaginator | undefined | null;
  onPagination: (key: number) => void;
};
const CategoryListPosition = ({ categories, onPagination }: IProps) => {
  
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
      // UPDATE DATABASE
      axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}api/ldd/order_categories`,
        data: position
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    },
    nodeSelector: 'li',
    handleSelector: 'a'
  };

  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6">

      <ReactDragListView {...dragProps}>
        <div className="bg-white dark:bg-neutral-900  rounded-lg shadow " >
        <ul className="divide-y-2 divide-gray-100">
          {position.map((item, index) => (
            <li className="py-2 px-4 text-gray-600 dark:text-neutral hover:bg-gray-100 dark:bg-black " key={index}>
               <a href="#" style={{width:'100%'}}>
                <span className="text-primary">
                  ☰  
                </span>
                <span className="ml-5">
                  {item.name}
                </span>
               </a>
            </li>
          ))}
        </ul>
        </div>
       
        </ReactDragListView>
       
      </div>
   
    </>
  );
};

export default CategoryListPosition;
