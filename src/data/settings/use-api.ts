import axios, { AxiosRequestConfig } from "axios"
import Cookies from "js-cookie";

export const getApiKeys = ()=>{
  return new Promise(async(resolve, reject)=>{
    try {
      const url = Cookies.get("url_endpoint") ? Cookies.get("url_endpoint") : process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
     const config:AxiosRequestConfig = {
         method: 'get',
         url: `${url}api/store/info?token=LDDEUu`,
         headers: { 'content-type': 'application/x-www-form-urlencoded' }
     }
     const response =  await axios(config);
     return resolve(response.data)

    } catch (error) {
    }

  })
}



