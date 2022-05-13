
import CourierList from "@components/courier/courier-list";
import ErrorMessage from "@components/ui/error-message";
import { Table } from "@components/ui/table";
import Loader from "@components/ui/loader/loader";
import { OrderField } from "@ts-types/index";
import { SortOrder } from "@ts-types/generated";
import { useState } from "react";
import { useCouriersQuery } from "@data/courier/use-couriers.query";
import ActionButtons from "@components/common/action-buttons";
import { Courier } from "@ts-types/generated";
import Button from "@components/ui/button";
import { ROUTES } from "@utils/routes";
import Image from "next/image";
import { useUI } from "@contexts/ui.context";
import { siteSettings } from "@settings/site.settings";
import { toast } from "react-toastify";

const ConfirmationCardCourier = ({ couriers }: IProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading: loading, error } = useCouriersQuery({
    text: searchTerm,
    orderBy: OrderField.UpdatedAt,
    sortedBy: SortOrder.Desc,
  });


  const { closeModal, modalData } = useUI();
  
   function handleSend(id:any) {
      fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}courier/send/order/${modalData}/${id}`)
        .then(res => res.json()).then(res => {
          if(res?.error){
            toast.success(`${res?.error} (${res?.code})`);
          }else{
            toast.success(res?.success);

          }
      })
   
    

    closeModal();
  }


  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  const columns = [
    {
      title: "Estafetas",
      dataIndex: "image",
      key: "image",
      align: "center",
      width: 74,
      render: (image: any) => (
  
        <Image
          src={image ?? siteSettings.avatar.placeholder}
          layout="fixed"
          width={42}
          height={42}
          className="rounded overflow-hidden"
        />
      ),
    },
    {
      title: "",
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (title: any) => <span className="whitespace-nowrap">{title.substring(0, 60)}</span>,
    },

    {
      title: "Ação",
      dataIndex: "id",
      key: "id",
      align: "right",
      render: (id: string, record: Courier) => (

        
        <Button 
        className="py-2 px-2"
        onClick={() => handleSend(id)}
      > 
       Enviar
      </Button>
      ),
    },
  ];
  return (
    <div className="bg-white m-auto">
      <div className="w-full h-full text-center">
        <div className=" h-full flex-col justify-between">
     
          
        <div className="rounded overflow-hidden ">
          {/* @ts-ignore */}
          <div className="rounded overflow-hidden shadow" >
      {/* @ts-ignore */}
      <Table columns={columns} data={data?.couriers}    scroll={{ x: "100%",y: "380px" }}/>
    </div>
        </div>
     </div>
      </div>
    </div>
  );
};

export default ConfirmationCardCourier;
