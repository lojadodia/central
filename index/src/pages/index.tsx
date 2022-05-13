
import CookieConsent from "react-cookie-consent";
import { useEffect, useState } from 'react';
import Layout from "@components/layout/layout-simple";
import { useSettings } from "@contexts/settings.context";

export default function HelpPage() {
const settings = useSettings();

   const [chain, setChain] = useState({})

   useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}chain`, {
         headers: {
            "content-type":"application/json"
         }
      }).then(res => res.json()).then(res =>{
         console.log(res);
         setChain(res)
      })

   }, [])

   useEffect(() => {      
      document.title = chain?.name;
   }, [chain?.name])
  
return (
<div>
   <section className="max-w-7xl  w-full mx-auto 0 px-5 xl:px-8 2xl:px-14">
      <div className="text-center mt-10 ">
        <a href="">
          <img  className="mx-auto" src={chain?.logo} alt="" style={{width:'200px'}} />
        </a>
         <p className="mt-6 mb-10">{chain?.subtitle}</p>
      </div>
      <div className=" w-full mx-auto">
         <div className="bg-gray-100 min-h-full  pb-8 px-0 lg:p-0">
            <div className="grid grid-cols-1 mt-10 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3 gap-3 ">
               
               {
                  chain.location && chain?.location.map(location => (
                     <div>
                        <a href={location?.url}>
                           <article className="product-card cart-type-neon rounded h-full bg-white overflow-hidden shadow-sm transition-all duration-200 hover:shadow transform hover:-translate-y-0.5">
                              <img className="mx-auto" src={`https://maps.googleapis.com/maps/api/staticmap?center=${location?.map.replace(/\s/g, '+')}&zoom=18&scale=false&size=400x200&maptype=roadmap&key=AIzaSyDLxesZSWwDMbCq7KVWSwQkSmATfWDkyJw&format=png&visual_refresh=true`} alt="" style={{width:'100%'}} />
                              <div className="p-5">
                                 <h1 style={{fontSize:'17pt'}}>{location?.name}</h1>
                                 <h3 style={{opacity:'0.7'}}>{location?.address}</h3>
                              </div>
                           </article>
                        </a>
                     </div>
                  ))
               }
               



           
            </div>
         </div>
      </div>
      <hr className="mt-10" />
   </section>
   <div>
      <div className="flex-grow pt-4">
         <div className="flex flex-col md:flex-row max-w-7xl w-full mx-auto 0 px-5 xl:px-8 2xl:px-14">
            <div className=" flex-col py-3  w-full ">
               <ul>
                  <li className="py-3"><a target="_blank" href={settings?.site?.complaints} className="text-gray-600"><img src="/logo-footer.png?_" style={{width:'100%'}} alt="" /></a></li>
               </ul>
            </div>
            <div className="flex-col  w-full">
            </div>
            
            <div className="flex-col py-3 w-full">
               <ul>
                  <li className="py-4">
                     <div className="flex text-center justify-center">
                        <a target="_blank" href={chain?.social?.instagram} className="text-gray-600 focus:outline-none mr-8 last:mr-0 transition-colors duration-300 hover:text-social-instagram">
                           <svg data-name="Group 96" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 12 12">
                              <path data-name="Path 1" d="M8.5 1A2.507 2.507 0 0111 3.5v5A2.507 2.507 0 018.5 11h-5A2.507 2.507 0 011 8.5v-5A2.507 2.507 0 013.5 1h5m0-1h-5A3.51 3.51 0 000 3.5v5A3.51 3.51 0 003.5 12h5A3.51 3.51 0 0012 8.5v-5A3.51 3.51 0 008.5 0z" fill="currentColor"></path>
                              <path data-name="Path 2" d="M9.25 3.5a.75.75 0 11.75-.75.748.748 0 01-.75.75zM6 4a2 2 0 11-2 2 2 2 0 012-2m0-1a3 3 0 103 3 3 3 0 00-3-3z" fill="currentColor"></path>
                           </svg>
                        </a>
                        <a target="_blank" href={chain?.social?.facebook} className="text-gray-600 focus:outline-none mr-8 last:mr-0 transition-colors duration-300 hover:text-social-facebook">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 12 12">
                              <path data-name="_ionicons_svg_logo-facebook (6)" d="M11.338 0H.662A.663.663 0 000 .663v10.674a.663.663 0 00.662.662H6V7.25H4.566V5.5H6V4.206a2.28 2.28 0 012.459-2.394c.662 0 1.375.05 1.541.072V3.5H8.9c-.753 0-.9.356-.9.881V5.5h1.794L9.56 7.25H8V12h3.338a.663.663 0 00.662-.663V.662A.663.663 0 0011.338 0z" fill="currentColor"></path>
                           </svg>
                        </a>
                        <a target="_blank" href={chain?.social?.twitter} className="text-gray-600 focus:outline-none mr-8 last:mr-0 transition-colors duration-300 hover:text-social-twitter">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 14.747 12">
                              <path data-name="_ionicons_svg_logo-twitter (5)" d="M14.747 1.422a6.117 6.117 0 01-1.737.478A3.036 3.036 0 0014.341.225a6.012 6.012 0 01-1.922.734 3.025 3.025 0 00-5.234 2.069 2.962 2.962 0 00.078.691A8.574 8.574 0 011.026.553a3.032 3.032 0 00.941 4.044 2.955 2.955 0 01-1.375-.378v.037A3.028 3.028 0 003.02 7.225a3.046 3.046 0 01-.8.106 2.854 2.854 0 01-.569-.056 3.03 3.03 0 002.828 2.1 6.066 6.066 0 01-3.759 1.3 6.135 6.135 0 01-.722-.044A8.457 8.457 0 004.631 12a8.557 8.557 0 008.616-8.619c0-.131 0-.262-.009-.391a6.159 6.159 0 001.509-1.568z" fill="currentColor"></path>
                           </svg>
                        </a>
                        <a target="_blank" href={chain?.social?.youtube} className="text-gray-600 focus:outline-none mr-8 last:mr-0 transition-colors duration-300 hover:text-social-youtube">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 15.997 12">
                              <path d="M15.893 2.65A2.429 2.429 0 0013.581.113c-1.731-.081-3.5-.112-5.3-.112h-.563c-1.8 0-3.569.031-5.3.112A2.434 2.434 0 00.106 2.656C.028 3.768-.006 4.881-.003 5.993s.031 2.225.106 3.34a2.437 2.437 0 002.309 2.547c1.822.085 3.688.12 5.584.12s3.759-.031 5.581-.119a2.438 2.438 0 002.312-2.547c.075-1.116.109-2.228.106-3.344s-.027-2.225-.102-3.34zM6.468 9.059v-6.14l4.531 3.069z" fill="currentColor"></path>
                           </svg>
                        </a>
                     </div>
                  </li>
               </ul>
            </div>
            
         </div>
         <div className="flex flex-col max-w-7xl w-full mx-auto py-5 px-5  xl:px-8 2xl:px-14">
            <hr />
         </div>
         <div className="flex flex-col md:flex-row max-w-7xl w-full mx-auto 0 px-5 xl:px-8 2xl:px-14">
            <div className=" flex-col py-4  w-full ">
               <ul>
                  <li className="py-0 text-sm-center text-lg-left text-md-left">
                     <a target="_blank" href="https://lojadodia.com" className="text-gray-600">
                     <small>
                     Todos os Direitos reservados a <img style={{display:'inline'}} width="20px" src="https://srv.nd-t.pt/storage/uploads/DZVNAHDIF5j8uVRB2mbTdTIDGtI5qc3izgNBKsz0.png"/> Loja do Dia, &copy; {chain?.name} Copyright 2021.
                     </small>
                     </a>
                  </li>
               </ul>
            </div>
            <div className="flex-col pt-4 pb-10 mb-10 w-full text-center text-lg-right text-md-right">
               <a href={chain?.docs?.terms} target="_blank" className="text-gray-600 px-5"> <small>Termos e Condições </small></a>
               <a href={chain?.docs?.policy} target="_blank" className="text-gray-600 px-5"> <small>Política de Privacidade & Cookies </small></a>
               <a href={settings?.site?.complaints} target="_blank" className="text-gray-600 px-5"> <small>Livro de Reclamações </small></a>
            </div>
         </div>
         <div className="lg:hidden md:hidden py-4"></div>
      </div>
      <CookieConsent
      location="bottom"
      buttonText="Eu aceito"
      cookieName="myAwesomeCookieName2"
      style={{ background: `rgba(0,0,0,.900)` }}
      buttonStyle={{ color: '#fff',background: '#165df5', fontSize: "13px",borderRadius:'5px' }}
      expires={150}
      >
      {/* (settings?.site?.color) 
      <div className="flex-grow">
         <div className="flex flex-col md:flex-row max-w-7xl w-full mx-auto 0 px-5 xl:px-8 2xl:px-14">
            <div className=" flex-col py-5  w-full "> */}
               🍪 Cookies de navegação {" "} <br />
               <span style={{ fontSize: "10px" }}>Este website utiliza cookies que visam melhorar o desempenho e a experiência de navegação dos nossos clientes/utilizadores. Pode consultar mais informações na nossa <a href=""><u>Politica de Privacidade</u></a>. </span>
               {/* 
            </div>
         </div>
      </div>
      */}
      </CookieConsent>
   </div>
</div>
);
}
HelpPage.Layout = Layout;