import axios, { AxiosRequestConfig } from "axios"
import { API_ENDPOINTS } from '@utils/api/endpoints'
import Cookies from "js-cookie";

export const UserSearch = (key:string)=>{

     return new Promise(async(resolve, reject)=>{
       try {
        const url = Cookies.get("url_endpoint");
        const config:AxiosRequestConfig = {
            method: 'get',
            url: `${url}${API_ENDPOINTS.USER_SEARCH}?key=${key}`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        }
        const response =  await axios(config);
        resolve(response)

       } catch (error) {
       }

     })
}





