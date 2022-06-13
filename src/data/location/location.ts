import axios, { AxiosRequestConfig } from "axios"
import Cookies from 'js-cookie';
import { resolve } from "path";

export const addressInfo = (address:string,settings:any)=>{

     return new Promise(async(resolve, reject)=>{
       try {
        const config:AxiosRequestConfig = {
            method: 'get',
            url: `https://api.tomtom.com/search/2/search/${address}.json?countrySet=${settings?.env?.SHIPPING_COUNTRY ? settings?.env?.SHIPPING_COUNTRY : "PT"}&key=${settings?.env?.TOMTOM_MAP}`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        }
        const response =  await axios(config);
        resolve(response)

       } catch (error) {
       }
     })
}

export const addressInfoByCoords = (lat: any, lon:any)=>{
  return new Promise(async(resolve, reject)=>{
    try {
     const config:AxiosRequestConfig = {
         method: 'get',
         url: `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lon}.json?key=Kn09fHvoCZdGKtl7qqR94cM5Ylbuu8OE`,
         headers: { 'content-type': 'application/x-www-form-urlencoded' }
     }
     const response =  await axios(config);
     return resolve(response.data.addresses[0])

    } catch (error) {
    }

  })
}

// Google Maps
export const GoogleAddressInfo = (address:string,settings:any)=>{
  const url = Cookies.get("url_endpoint") ? Cookies.get("url_endpoint") : process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  return new Promise(async(resolve, reject)=>{
    try {
     const config:AxiosRequestConfig = {
         method: 'get',
         url: url+`external/googlemaps?value=${address}&type=search`,
         headers: {  }
     }
     const response =  await axios(config);
     resolve(response)

    } catch (error) {
    }
  })
}

export const GoogleAddressInfoById = (place_id: string)=>{
  const url = Cookies.get("url_endpoint") ? Cookies.get("url_endpoint") : process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const  axiosTest = async () =>{
    try {
      const {data:response} = await axios.get(url+`external/googlemaps?value=${place_id}&type=place_id`) //use data destructuring to get data from the promise object
      console.log(response) 
    }
      
    catch (error) {
      console.log(error);
    }
  };



}



