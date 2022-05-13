import React from 'react'
import { Controller } from "react-hook-form";
import SelectTimeInterval from "@components/select-time-intervals/select-time-interval"
import SelectTimeDelivery from "@components/select-time-intervals/select-time-delivery"
export default function InputTime({ control, start1, end1, start2, end2, interval, interval2, className = "" }: any) {

  return <div className={className.concat('flex flex-wrap')}>
    <Controller
      control={control}
      name={start1}
      rules={{ required: true }}
      render={({ field: { onChange, value } }) => (<>
        <SelectTimeInterval onChange={onChange} value={value} />

      </>)}
    />&nbsp; - &nbsp;

    <Controller
      control={control}
      name={end1}
      rules={{ required: true }}
      render={({ field: { onChange, value } }) => (<>
        <SelectTimeInterval onChange={onChange} value={value} />
      </>)}
    />
    <span className="mx-3"></span>
    <Controller
      control={control}
      name={start2}
      rules={{ required: true }}
      render={({ field: { onChange, value } }) => (<>
        <SelectTimeInterval onChange={onChange} value={value} />
      </>)}
    />
    &nbsp; - &nbsp;
    <Controller
      control={control}
      name={end2}
      rules={{ required: true }}
      render={({ field: { onChange, value } }) => (<>
        <SelectTimeInterval onChange={onChange} value={value} />
      </>)}
    />
    <span className="mx-3"></span>

    <Controller
      control={control}
      name={interval}
      rules={{ required: true }}
      render={({ field: { onChange, value } }) => (<>
      <SelectTimeDelivery onChange={onChange} value={value} />
      </>)}
      
    />
     <span className="mx-3"></span>

  <Controller
  control={control}
  name={interval2}
  rules={{ required: true }}
  render={({ field: { onChange, value } }) => (<>
  <SelectTimeDelivery onChange={onChange} value={value} />
  </>)}
  
/>
  </div>
}