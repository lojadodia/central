import { Visitor } from "@ts-types/custom.types";
import { sendVisitor } from "@data/visitor/visitor"; 
import Cookies from "js-cookie";

  const getVisitorDetails = () => {

  }
  export function pushVisitorDetails () {
    const geo = sessionStorage.getItem('session_storage_merchant') || null

   
    !geo && getVisitorDetails().then(data => {
      const details = data[0]
      const visitor: Visitor = {
        ip: details?.IPv4,
        address: details?.city,
        country: details?.country_name,
        latitude: details?.latitude,
        longitude: details?.longitude,
        merchant: data[1]
      }
      
      sendVisitor(visitor)
      sessionStorage.setItem('session_storage_merchant', data[1])
    })
    
  };
  