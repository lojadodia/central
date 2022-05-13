import ConfirmationCard from "@components/common/confirmation-card";
import { useState, useRef } from 'react';
import { useUI } from "@contexts/ui.context";

import http from '@utils/api/http'
import TextArea from "@components/ui/text-area";
import { toast } from 'react-toastify'

const CancelOrderView = () => {


  const { closeModal, modalData } = useUI();
  const [reason, setReason] = useState('')
  const select = useRef(null)
  async function handleDelete() {


    if (reason.length < 10) {

      return toast.error('Escolha o motivo do cancelamento')
    }
    http.post(`api/ldd/rrf`, {
      order: modalData?.tracking_number,
      reason: reason
    },
    {
      headers: {
        'x-customer-id': Date.now()
      }
    }).then((data) => {
      console.log(data.data)
      if(data.data == "Success"){
        toast.info('O seu pedido foi cancelado com sucesso!')
      }else{
        toast.error('Erro ao cancelar o pedido. Contacte o Suporte Técnico.')
      }
      setReason('')
    }).finally(() => {
      closeModal();
    });
  }

 

  return (
    <ConfirmationCard
      onCancel={closeModal}
      order={modalData}
      onDelete={handleDelete}
      title="ATENÇÃO!"
      description="Tem a certeza de que pretende cancelar o pedido? Esta ação é irreversível."
      deleteBtnText="Confirmar"
      
      isIcon={false}
    >

      <ul>
        <br />
        <li>




          <select ref={select} name="reason"  onChange={e => setReason(e.target.value)} className='w-full px-4 h-12 flex items-center mr-3 dark:text-gray rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-gray-300 focus:border-primary dark:border-neutral-500' >
                <option value="" >Escolha o Motivo do Cancelamento</option>
                <option value="M01: Produto em falta" >M01: Produto em falta</option>
                <option value="M02: O estabelecimento encontra-se fechado" >M02: O estabelecimento encontra-se fechado</option>
                <option value="M03: Excesso de Encomendas" >M03: Excesso de Encomendas</option>
                <option value="M04: Obstrução da Encomenda" >M04: Obstrução da Encomenda</option>
                <option value="M05: Destinatário não Encontrado" >M05: Destinatário não Encontrado</option>
                <option value="M06: Pedido de Cancelamento pelo Cliente" >M06: Pedido de Cancelamento pelo Cliente</option>
                
              </select>

        </li>
      </ul>
    </ConfirmationCard>
  );
};

export default CancelOrderView;
