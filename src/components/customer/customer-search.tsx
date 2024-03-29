
import { useCheckout } from "@contexts/checkout.context";
import { useUI } from "@contexts/ui.context";
import React, { useRef, useState, useLayoutEffect } from "react";
import Input from "@components/ui/input";
import { UserSearch } from '@data/customer/search'

const CustomerSearch = () => {
  const { closeModal, openModal, setModalView, setModalData } = useUI();
  const { client, updateClient } = useCheckout();
  const [users, setDataUsers] = useState<any>({});
  const [user, setDataUser] = useState<any>({});
  const inputFocus = useRef(null)
  const onPuttingDataInput = async (e: any) => {
    const res: any = await UserSearch(e.target.value);
    const result = res?.data;
    const users: any = []
    if(e.target.value.length > 2){
      for (let i in result) {
        if(result[i]){
          users.push(result[i]);
        }
    }
    }
    setDataUser(e.target.value);
    setDataUsers(users);
  }

  const haldeChooseClient = (user:any) => {
    updateClient(user)
    setDataUsers(null)
    closeModal()
  };

  useLayoutEffect(()=>{
    inputFocus.current && setTimeout(() => inputFocus.current.focus(), 0)
  }, [inputFocus.current])

  const handleAddUser = () => {
    closeModal()
    setModalData(user);
    setModalView("REGISTER");
    return openModal();
  };

  return (
    <div className="p-5 sm:p-8 bg-white border-gray-200 rounded-lg dark:bg-neutral-800 border dark:border-neutral-700">
    <h1 className="text-heading dark:text-white font-semibold text-lg text-center mb-1 mt-2 ">
      Procurar Cliente
    </h1>
    <button
            className=" items-center w-full mb-0  text-left text-md font-semibold text-yellow transition-colors duration-200 focus:outline-none "
             style={{color:"#fbbe24"}}
             onClick={handleAddUser}
          >
           + NOVO
          </button>
    <h1 className="mt-0">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</h1>
    <div>
   
    <div className="relative">
      
                <Input
                  name="name"
                  placeholder="POR NOME, CONTATO OU E-MAIL"
                  variant="outline"
                  ref={inputFocus}
                  onChange={onPuttingDataInput}
                  />
                  {users?.length >0 && (
                      <div className={users?.length >0?"list-outside md:list-inside absolute top-120 bg-white dark:bg-black w-full w-88 border border-primary mt-1 z-50":""} >
                      {
                        users?.map((item: any, index: number) => {
                          //if(index <=5){
                          return (
                              <>
                                {
                                  item ? (
                                    <ul onClick={()=>haldeChooseClient(item)} key={item?.id}>
                                      <li className="px-5 py-2 border-b hover:bg-gray-100 dark:md:hover:bg-neutral-700 dark:text-gray  dark:border-neutral-700 cursor-pointer">
                                        <span  className='dark:text-white'><b>{item?.name}</b> - {item?.profile?.contact} <br/> 
                                       {item?.address[0]?.address?.street_address && ( <small> <i>{item?.address[0]?.address?.street_address} {item?.address[0]?.address?.door}, {item?.address[0]?.address?.details}, {item?.address[0]?.address?.zip} - {item?.address[0]?.address?.city}</i></small>)}
                                        </span>
                                      </li>
                                    </ul>
                                  ) : null
                                }
                              </>
                            )
                            //}
                        })
                      }
                      </div>  
                  )}
                 
                </div>
       
     </div>
    </div>
  );
};

export default CustomerSearch;
