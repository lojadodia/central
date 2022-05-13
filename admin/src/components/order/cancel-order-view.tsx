import ConfirmationCard from "@components/common/confirmation-card";
import { useState, useRef } from 'react';
import { useUI } from "@contexts/ui.context";

import http from '@utils/api/http'
import TextArea from "@components/ui/text-area";
import { toast } from 'react-toastify'

const CancelOrderView = () => {


  const { closeModal, modalData } = useUI();
  const [reason, setReason] = useState('')
  const textArea = useRef(null)
  async function handleDelete() {

    if (reason.length < 10) {
      textArea.current.focus()
      return toast.error('Descreva o motivo do cancelamento')
    }
    http.post(`api/ldd/rrf`, {
      order: modalData,
      reason: reason
    },
    {
      headers: {
        'x-customer-id': Date.now()
      }
    }).then((data) => {
      if(data.data == "Success"){
        toast.info('O seu pedido foi cancelado com sucesso!')
      }else{
        toast.error('Erro ao cancelar o pedido. Contacte o Suporte Técnico.')
      }
      setReason('')
    }).finally(() => {
      closeModal();
      window.location.reload()
    });
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      title="Cancelar Pedido"
      description="Tem a certeza de que pretende cancelar o pedido? Esta ação é irreversível."
      deleteBtnText="Confirmar"
      isIcon={false}
    >

      <ul>
        <br />
        <li>
          <TextArea
          ref={textArea}
            placeholder="Digite o Motivo do Cancelamento (Min: 10 carácteres)"
            name="reason"
            variant="outline"
            className="mb-5"
            minLength={10}
            required 
            onInput={e => setReason(e.target.value)}
          />
        </li>
      </ul>
    </ConfirmationCard>
  );
};

export default CancelOrderView;
