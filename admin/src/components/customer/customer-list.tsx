import Pagination from "@components/ui/pagination";
import Image from "next/image";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { siteSettings } from "@settings/site.settings";
import { UserPaginator } from "@ts-types/generated";
import { useMeQuery } from "@data/user/use-me.query";


function realign(temp:any) {
  return temp.filter(function (item:any) { 
    return !item.permission;    
  }).map(function (item:any, index:any) {
    item.id = index;
    return item;
  });

}

const columns = [
  {
    title: "Avatar",
    dataIndex: "profile",
    key: "profile",
    align: "center",
    width: 74,
    render: (profile: any, record: any) => (
      <Image
        src={profile?.avatar?.thumbnail ?? siteSettings.avatar.placeholder}
        alt={record?.name}
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
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    align: "left",
  },
  {
    title: "Contato",
    dataIndex: "profile",
    key: "profile",
    align: "left",
    render: (profile: any) => (profile?.contact),
  },
  {
    title: "Estado",
    dataIndex: "is_active",
    key: "is_active",
    align: "center",
    render: (is_active: boolean) => (is_active ? "Activo" : "Inativo"),
  },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    align: "center",
    render: (id: string, item: any) => {
      const { data } = useMeQuery();
      
      return (
        <>
          {data?.id != id && (
            <ActionButtons
              id={id}
              deleteButton={false}
              //editButton={false}
              banButton={item.is_active ? true : false}
              //navigationPath={`${ROUTES.CUSTOMERS}/edit/${id}`}
              activeButton={item.is_active ? false : true}
              modalActionType="BAN_CUSTOMER"
            />
          )}
        </>
      );
    },
  },
];

type IProps = {
  customers: UserPaginator | null | undefined;
  onPagination: (current: number) => void;
};
const CustomerList = ({ customers, onPagination }: IProps) => {
  const { data, paginatorInfo } = customers!;
  const user : any  = useMeQuery();
  if(user['data']?.permission == "super_admin"){
    var users:any = data
  }else{
    var users:any = realign(data)
  }
  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6">
        {/* @ts-ignore */}
        <Table columns={columns} data={users} rowKey="id" scroll={{ x: 800 }} />
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

export default CustomerList;
