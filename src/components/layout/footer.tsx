import { useSettings } from "@contexts/settings.context";
import { useUI } from "@contexts/ui.context";

import { useEffect } from "react";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { FaMoneyBillWave } from "react-icons/fa";

const Footer = () => {
  const settings = useSettings();
  let dark = "";
  let separator = "";
  if(settings?.env?.THEME == "dark"){
    dark = "dark";
    separator = "-";
  }
  const { openModal, setModalView } = useUI();

  function handleJoin() {
    setModalView("LOGIN_VIEW");
    return openModal();
  }
  function handleSign() {
    setModalView("REGISTER");
    return openModal();
  }

  
  return (
    <div>  
    <div className="flex-grow dark:bg-neutral-900 lg:pt-5 hidden border-t dark:border-neutral-700">
      <div className="flex pb-4 pt-4 flex-col md:flex-row  w-full mx-auto 0 px-8" >
        
        <div className=" flex-col  w-full ">
          <ul>

            <li className="py-4 text-sm-center text-lg-left text-md-center" style={{fontSize:"11pt"}}>
              <a target="_blank" href="https://lojadodia.com" className="text-gray-700 dark:text-neutral">
              <small className="flex">
                <i>Desenvolvido por</i>  <img style={{width:"100px"}} src={`/${dark+separator}logo-lojadodia.png`} alt="" /> │  www.lojadodia.com
              </small>
              </a>
            </li>
          </ul>
        </div>
        <div className="flex-col  pb-10 w-full text-center text-lg-right text-md-right" style={{opacity:"0.7"}}>
          <a href="/terms" className="text-gray-700 dark:text-neutral px-5"> <small>Termos e Condições </small></a> <small>│</small>
          <a href="/privacy" className="text-gray-700 dark:text-neutral px-5"> <small>Privacidade </small></a> <small>│</small>
          <a href="/refund" className="text-gray-700 dark:text-neutral px-5"> <small>Reembolsos </small></a> <small>│</small>
          <a href={settings?.site?.complaints} target="_blank" className="text-gray-700 dark:text-neutral px-5"> <small>Reclamações </small></a>
        </div>

      </div>
      <div className="lg:hidden md:hidden py-8"></div>
    </div>
    </div>
  );
};

export default Footer;
