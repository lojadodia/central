import React from 'react'

export default function SelectTimeDelivery ({onChange, value, ...rest} : any) {
 
  return (
    <select {...rest} onChange={onChange} defaultValue={value} className='outline-none p-2 border my-1 rounded text-white  dark:bg-neutral-900 dark:border-neutral-700 w-full text-sm' name="end">
      <option value="">Não Definido</option>
      <option value="0">Preparação Imediata</option>
      <option value="15">15 minutos</option>
      <option value="30">30 minutos</option>
      <option value="45">45 minutos</option>
      <option value="60">1 hora</option>
      <option value="75">1 hora 15 minutos</option>
      <option value="90">1 hora 30 minutos</option>
    </select>
  )
}