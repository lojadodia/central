



import Button from "@components/ui/button";

import { useUI } from "@contexts/ui.context";
import { toast } from "react-toastify";
import Input from "@components/ui/input";
import Card from "@components/common/card";
import { useForm } from 'react-hook-form'
import api from '@utils/api/http'
import { API_ENDPOINTS } from '@utils/api/endpoints'

const ConfirmationCardArea = () => {
  
  const { register, handleSubmit, watch } = useForm()

  const { closeModal, modalData } = useUI();

  function submit(form: any) {
    const data = {
      ...form,
      polygon: JSON.parse(form.polygon)
    }

    api.post(API_ENDPOINTS.ADD_AREA, {
      ...data
    }).then(() => {
      closeModal()
      toast.success("Marcador efectuado!", {autoClose: 8000})
    }).catch(e => {
      toast.error(e?.response?.message, {autoClose: 8000})
    })
  }

  const via = watch("via")


  return (
    <div className="bg-white m-auto">
      <div className="w-full h-full text-center">
        <div className=" h-full flex-col justify-between">

          <form onSubmit={handleSubmit(submit)}>
            <div className="rounded overflow-hidden ">
              {/* @ts-ignore */}
              <div className="rounded overflow-hidden shadow" >
                <Card>
                  <Input {...register('name', { required: true })} label="Nome" />
                  <div className="flex flex-col items-start">
                    <h1>Encarregados</h1>

                    <label htmlFor="input-interno">
                      <input defaultChecked={true} {...register('via')} id="input-interno" type="radio" value="interno" className="mr-3" />
                      Interno
                    </label>
                    <label htmlFor="input-correios">
                      <input {...register('via')} type="radio" id="input-correios" value="correios" className="mr-3" />
                      Correios
                    </label>

                    <input type="hidden" {...register('polygon', { required: true })} value={JSON.stringify(modalData)} />


                  </div>
                  {via !== 'correios' && <Input {...register('amount', { required: via !== 'correios' })} label="Valor" />}
                  <div className="mt-5"></div>
                  <Button type="submit">Submeter</Button>
                </Card>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ConfirmationCardArea;
