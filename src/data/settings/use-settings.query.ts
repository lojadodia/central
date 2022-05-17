import { CoreApi } from "@utils/api/core.api";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useQuery } from "react-query";
import { Category, SettingsType } from "@ts-types/custom.types";
import axios from "axios";
import { settings } from "cluster";
import Cookies from "js-cookie";

const SettingsService = new CoreApi(API_ENDPOINTS.SETTINGS);

export const fetchSettings = async () => {
  const { data } = await SettingsService.findAll();
  return { settings: data };
};
type SettingsResponse = {
  settings: SettingsType;
};
export const useSettingsQuery = () => {
  return useQuery<SettingsResponse, Error>(
    API_ENDPOINTS.SETTINGS,
    fetchSettings
  );
};

export const listCategory = async()=>{
  const url = Cookies.get("url_endpoint") ? Cookies.get("url_endpoint") : process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  return new Promise ((resolve, rejeita )  =>  {
    console.log(url, API_ENDPOINTS.PRODUCTS)
    axios.get(  `${url}${API_ENDPOINTS.PRODUCTS}?search=type.slug:home`).then((resp)=>{
      const data:Category[] = resp.data?.data;
      resolve(data);
    }).catch((error)=>{
        console.log(error)
    })

  } )
}