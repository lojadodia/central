import React from 'react'

export default function SelecctTimeDelivery ({onChange, value} : any) {
 
  return (
    <select onChange={onChange} value={value} className='outline-none p-2 border my-1 rounded text-body text-sm' name="">
      <option value="0">0min</option>
      <option value="15">15min</option>
      <option value="30">30min</option>
      <option value="45">45min</option>
      <option value="60">60min</option>
      <option value="75">75min</option>
    </select>
  )
}