
import { useEffect, useState, useRef } from "react";
import GoogleMapReact from 'google-map-react';
import Address from "@components/address/address";
import Schedule from "@components/checkout/schedule";
import Layout from "@components/layout/layout";
import VerifyCheckout from "@components/checkout/verify-checkout";
import { useUI } from "@contexts/ui.context";
import { useCustomerQuery } from "@data/customer/use-customer.query";
import { useSettings } from "@contexts/settings.context";
import { useCheckout } from "@contexts/checkout.context";
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ptBR from 'date-fns/locale/pt-BR';
import moment from 'moment';
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { RiTruckFill, RiShoppingBag3Fill, RiTimeLine, RiCalendar2Fill, RiMapPin2Fill, RiExternalLinkLine, RiAlertFill } from "react-icons/ri";
import { useCart } from "@contexts/quick-cart/cart.context";
import http from '@utils/api/http'
import { API_ENDPOINTS } from '@utils/api/endpoints'
import { generateCartItem } from "@contexts/quick-cart/generate-cart-item";
import Cookies from 'js-cookie';
import axios from "axios"

interface Props {
  count: number;
}
registerLocale('ptBR', ptBR);

const When = () => {

  const { data, refetch } = useCustomerQuery();
  const [checkNow, setCheckANow] = useState(true);
  const [client_address, setClientAddress] = useState(false);
  const [checkSchedule, setCheckSchedule] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [times, setTimes] = useState(null)
  const [weekName, setWeekName] = useState("");
  const datePickerRef = useRef(null);
  const hourPickerRef = useRef(null)
  const [timeInterval, setTimeInterval] = useState(-1);
  const [selectedDate, setSelectedDate] = useState("");
  const [includeTimes, setIncludeTimes] = useState<Date[]>([])
  const { updateDeliveryTime, updateDeliverySchedule, order_type, setOrderType, updateObs, client, billing_address } = useCheckout();
  const { isAuthorize, openModal, setModalView, setModalData } = useUI();
  const { total, isEmpty, addItemToCart,clearItemFromCart, isInCart } = useCart();
  

  const base64id = window.btoa(unescape(encodeURIComponent(client?.id)));

  const url = Cookies.get("url_endpoint") ? Cookies.get("url_endpoint") : process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  useEffect(() => {
    axios.get(url+"ebb1d3d715/"+base64id)
    .then(function (response) {
      setClientAddress(response?.data)
    })
  },[client, billing_address]); 



  const [center, setCenter] = useState({
    lat: 59.95,
    lng: 30.33
  });
  const handleKeyDown = (e: any) => {
    e.preventDefault();
  };
  const settings: any = useSettings();

  const type = "billing";
  var currentHour = moment(Date.now()).format('HH:mm');
  const currentTime = settings?.schedule[moment(Date.now()).format('dddd').toLocaleLowerCase()];

  useEffect(() => {

    if (isAuthorize) {
      if (order_type) return
      if (settings?.order?.type?.takeaway == 'true' && settings?.order?.type?.delivery == 'true') {
        //setModalView("ORDER_TYPE");
        setModalData(settings?.site?.color);
        //return openModal();
      } else if (settings?.order?.type?.takeaway == 'true' && settings?.order?.type?.delivery == 'false') {
        setOrderType('takeaway')
      } else if (settings?.order?.type?.takeaway == 'false' && settings?.order?.type?.delivery == 'true') {
        setOrderType('delivery')
      } else {
        setOrderType(null)
      }

    } else {
      setModalView("LOGIN_VIEW");
      return openModal();
    }
    
  }, [isAuthorize, order_type]);





  useEffect(() => {
    if (isAuthorize) {
      if (!isEmpty) {
        if(order_type){
          setOrderType(order_type)
        }
      }
    }
    // if (!isEmpty) {
    //   http.post(`${API_ENDPOINTS.CHECK_OFFER}`, {
    //     order_type: order_type,
    //     amount: total
    //   }).then(res => res.data).then((data ) => {
        
    //     if (data.product) {
    //       const item = generateCartItem(data.product)
    //       item.id = `${item.id}.offer`
    //       clearItemFromCart(item.id)

         
    //         item.price = 0
    //         addItemToCart(item, data.qty)
    //         setModalView("PRODUCT_OFFER")
    //         setModalData({ item, offer: data.offer})
    //         openModal()
    //         Cookies.set('offer', 'offer') // active a cookie
    //     }
    //   })
      
    // }
    
  }, [order_type, total, isEmpty])



  useEffect(() => {
    refetch().then(res => {
      if (isAuthorize) {
        if (order_type === 'delivery') {
          const address = res.data?.me?.address;
          if (address?.length === 0) {
            setModalData({ customerId: res.data?.me?.id!, type });
            setModalView("ADD_OR_UPDATE_ADDRESS")
            return openModal();

          }
          setTimeInterval(currentTime?.interval)
        }else{
          setTimeInterval(currentTime?.interval2)
        }
      }

    });
  }, [isAuthorize, order_type])

  useEffect(() => {
    setCenter({ lat: settings?.site.address_lat, lng: settings?.site.address_lng })
  }, [settings?.site]);

 
  function onOpenOrderType() {
    setModalView("ORDER_TYPE");
    setModalData(settings?.site?.color);
    return openModal();
  }
  useEffect(() => {

    if (isDateValid()) {
      optionChecked("schedule");
      if(order_type == "delivery"){
        setTimeInterval(currentTime?.interval)
      }else{
        setTimeInterval(currentTime?.interval2)
      }
      
    } else {
      optionChecked("schedule");
    }

  }, []);
  function isDateValid () {
    const _weekName = moment(date).format('dddd').toLocaleLowerCase();
    // Intervalo
    const interval = order_type != "takeaway" ? settings?.schedule[_weekName]?.interval : settings?.schedule[_weekName]?.interval2;
    // Limites
    const end1 = currentTime?.time1?.end;
    const end2 = currentTime?.time2?.end;
    // Converter em datas validas
    const date1 = moment(moment().format("YYYY-MM-DD")+"T"+end1+":00");
    const date2 = moment(moment().format("YYYY-MM-DD")+"T"+end2+":00");
    // Subtrair Minutos
    const endtime1 = interval ? moment(date1).subtract(interval, "minutes").format("HH:mm") : end1;
    const endtime2 = interval ? moment(date2).subtract(interval, "minutes").format("HH:mm") : end2;
    // Filtrar
    let currentDayWeek = settings.schedule[moment(settings.now).format('dddd').toLocaleLowerCase()].value
    return ((currentHour >= currentTime?.time1?.start && currentHour <= endtime1) || 
    (currentHour >= currentTime?.time2?.start && currentHour <= endtime2) ) && currentDayWeek
  }
  var date = new Date();
  var start = new Date();

  const { register } = useForm<FormValues>({});

  if (settings?.scheduleType == "client-by") {
    if (settings?.site?.delivery_time > 0) {
      date.setDate(date.getDate() + Number(settings?.site?.delivery_time));
      start.setDate(start.getDate() + Number(settings?.site?.delivery_time));
    }
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenHour, setIsOpenHour] = useState(false);

  const handleClickDate = (e:any) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  const handleClickHour = (e:any) => {
    e.preventDefault();
    setIsOpenHour(!isOpenHour);
  };
  const handleOnChange = (date: any) => {

    setIsOpen(!isOpen);
    setIsOpenHour(!isOpenHour)
    setStartDate(date!);
    // comentei updateDeliverytime porque adicionei no input de time, neste caso
    // a data só será actualizada quando a hora for actualizada
    // updateDeliveryTime(moment(date).format("DD-MM-YYYY HH:mm"));
    const _weekName = moment(date).format('dddd').toLocaleLowerCase()
    setWeekName(_weekName)
    setSelectedDate(moment(date).format('DD-MM-YYYY'))
    setTimes(null)
    updateDeliveryTime(null);

    setIncludeTimes("true")

  };
  function handlerTime(time: any) {
   // console.log(time?.target.value)
   // setIsOpenHour(!isOpenHour);
    setTimes(time?.target.value)

    const datetime = moment(selectedDate + ' ' + time?.target.value, 'DD-MM-YYYY HH:mm');

    updateDeliveryTime(moment(datetime).format("DD-MM-YYYY HH:mm"));
  }
  
  
  function saveObs(event: any) {
    updateObs(event.target.value);
  }


  const isWeekday = (date: Date) => {

    const day = date.getDay()

    var sunday = 8;
    var monday = 8;
    var tuesday = 8;
    var wednesday = 8;
    var thursday = 8;
    var friday = 8;
    var saturday = 8;


    if (settings?.schedule?.sunday.value != true) {
      var sunday = 0;
    }
    if (settings?.schedule?.monday.value != true) {
      var monday = 1;
    }
    if (settings?.schedule?.tuesday.value != true) {
      var tuesday = 2;
    }
    if (settings?.schedule?.wednesday.value != true) {
      var wednesday = 3;
    }
    if (settings?.schedule?.thursday.value != true) {
      var thursday = 4;
    }
    if (settings?.schedule?.friday.value != true) {
      var friday = 5;
    }
    if (settings?.schedule?.saturday.value != true) {
      var saturday = 6;
    }


    return day !== sunday && day !== monday && day !== tuesday && day !== wednesday && day !== thursday && day !== friday && day !== saturday
  };

  const optionChecked = (option: string, action?: string) => {
    const date: any = new Date();
    switch (option) {
      case "now":
        setStartDate(date!);
        updateDeliveryTime(moment(date).format("DD-MM-YYYY HH:mm"));
        setCheckANow(true);
        setCheckSchedule(false);
        if(order_type == "delivery"){
          setTimeInterval(currentTime?.interval)
        }else{
          setTimeInterval(currentTime?.interval2)
        }
        updateDeliverySchedule("now")
        break;
      case "schedule":
        setStartDate(null);
        setCheckSchedule(true);
        updateDeliveryTime(null);
        setCheckANow(false);
        updateDeliverySchedule("schedule")
        //setIsOpen(!isOpen);
        const timeId = setTimeout(() => {
          //action && datePickerRef.current.setFocus();
          clearTimeout(timeId)
        }, 200)
        break;

    }
  }



    function createSequenceOfTimesDelivery(time1: { start: string; end: string },
    tinterval: any, currentDate: any, selectDate: string) {
      let currentDate2 = moment(currentDate)
      const _time1 = new Date(currentDate);
      const aux = []
      var startAuxTimes = time1?.start.split(':')
      var hourStart1 = parseInt(startAuxTimes[0], 10)
      var minuteStart1 = parseInt(startAuxTimes[1], 10)
      let [hourEnd1, minuteEnd1] = time1?.end.split(':')
      
      //setTimeInterval(null)
      
      var auxH1 = parseInt(moment(currentDate2).format('HH'), 10);
      var auxM1 = parseInt(moment(currentDate2).format('mm'), 10);
      
      // if (auxH1 >= parseInt(endAuxTimes2[0], 10) && auxM1 >= parseInt(endAuxTimes2[1], 10)) return []
      
      // condição para o dia actual
    
      if (selectDate == currentDate.format('DD-MM-YYYY')) {
        if (auxH1 >= hourStart1) {
          currentDate2.add(tinterval, 'm')
        }
        //setTimeInterval(currentTime?.interval)


        auxH1 = parseInt(moment(currentDate2).format('HH'), 10);
        auxM1 = parseInt(moment(currentDate2).format('mm'), 10);
        // quando a hora actual for maior do hora de fechar, retorna o array vazio
       
        if (auxH1 > parseInt(hourEnd1, 10)) return []

        // se hora actual é maior do que hora de entrada, actualiza hora de entrada
        if (auxH1 > hourStart1) {
          hourStart1 = auxH1
        }

        // se minuto actual é maior do que minuto de entrada, actualiza o minuto de entrada de pedido
        if (auxM1 > minuteStart1) {
          minuteStart1 = auxM1
        }

        if (auxH1 < hourStart1) {
          minuteStart1 = parseInt(time1.start.split(':')[1], 10)
        }
        
        else if (minuteStart1 >= 0 && minuteStart1 <= 15) {
          minuteStart1 = 15;
        } else if (minuteStart1 > 15 &&  minuteStart1 <= 30) {
          minuteStart1 = 30;
        } else if (minuteStart1 > 30 && minuteStart1 <= 45) {
          minuteStart1 = 45;
        } else if (minuteStart1 > 45 && minuteStart1 <= 59) {
          if (hourStart1 != 23) {
            hourStart1 = parseInt(moment(currentDate).add(1, 'hours').format('HH'), 10);
            minuteStart1 = 0;
          }
          
        }
      }
    _time1.setHours(hourStart1)
    _time1.setMinutes(minuteStart1)
    _time1.setSeconds(0)

    const time_aux = moment(new Date(_time1))

    for (let i = 0; i < 180; i++) {

      if (time_aux.hour() < hourStart1 || time_aux.hour() > parseInt(hourEnd1, 10)) continue

      if (time_aux.hour() == parseInt(hourEnd1, 10) && time_aux.minute() > parseInt(minuteEnd1, 10)) continue

      aux.push(new Date(time_aux.toString()))
      time_aux.add(15, 'm')

    }
   
    return "00:00"
  }

  


  return (
    <>
    <div className="mb-5">


        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 ">
          <div onClick={() => { setOrderType("takeaway") }} className={`px-4 py-3 text-center text-sm ${order_type == "takeaway" ? 'bg-primary display-inline text-white' : ''}  rounded h-12  border-gray-200 border dark:border-neutral-700 cursor-pointer`}>
            <RiShoppingBag3Fill style={{ display: "inline-block", verticalAlign: '-2px' }} /> TAKEAWAY
          </div> 
          <div onClick={() => { setOrderType("delivery") }} className={`px-4 py-3 text-center text-sm ${order_type == "delivery" ? 'bg-primary display-inline text-white' : ''}  rounded h-12  border-gray-200 border dark:border-neutral-700 cursor-pointer`}>
            <RiTruckFill style={{ display: "inline-block", verticalAlign: '-2px' }} /> ENTREGA
          </div>
        </div>

        {order_type == 'delivery' && (
                  <div  className="relative mt-4">

                    <div className={`shadow-700  rounded-lg  ${location.hash == "#target-address" && `border-primary dark:border-primary`}`}>
                      {
                        client_address && (
                          <Address
                          id={client?.id}
                          heading="Local de Entrega"
                          addresses={client_address}
                          count={1}
                          type="billing"
                        />
                        )
                      }
                    
                    </div>


                    
                  

                  </div>

                )}
        </div>



        <hr className="dark:border-neutral-700 mb-4" />
                <h3 className="text-md dark:text-white pb-2 text-heading">
                  3. Escolha a Data
                </h3>
    <div className="">
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 ">

      {/* { isDateValid() ? (
        <div onClick={() => { optionChecked("now", "click") }} className={`px-4 py-3 text-center text-sm ${checkNow ? 'bg-primary display-inline text-white' : ''}  rounded h-12  border-gray-200 border dark:border-neutral-700 cursor-pointer`}>{order_type != 'takeaway' ? (
          <><RiTruckFill style={{ display: "inline-block", verticalAlign: '-2px' }} /> </>)
          : (
            <><RiShoppingBag3Fill style={{ display: "inline-block", verticalAlign: '-2px' }} /> </>
          )}  AGORA</div>
      ) : null}
       */}
      <div onClick={() => { optionChecked("schedule", "click") }} className={`px-4 py-3 text-center text-sm  rounded  ${checkSchedule ? 'bg-primary h-12 text-white' : ''} border-gray-200 border dark:border-neutral-700 cursor-pointer`}>
        <RiCalendar2Fill style={{ display: "inline-block", verticalAlign: '-2px' }} /> AGENDAR {order_type != 'takeaway' ? '' : ''}</div>

      {
        checkSchedule ?
          (<div className="flex flex-nowrap w-full">
            <div className="relative">
              {/* <div className="absolute top-0 left-0 right-0 bottom-0 bg-red-600 z-50" style={{width:'100%',height:'100%',zIndex:50,opacity:0}} onClick={() => datePickerRef.current.setFocus()}></div> */}
             
<button className="px-2 w-24 py-3  text-center text-sm mr-4  rounded  bg-black  h-12 text-white border-gray-200 border dark:border-neutral-700 cursor-pointer" onClick={handleClickDate}>
        {startDate ? moment(startDate).format("DD/MM") : "Data"}
      </button>
      {isOpen && (
         <div   style={{position:"fixed",zoom:1.3,top:"0px",margin:"20vh auto",zIndex:100000000000000}}>
            <DatePicker
            locale="ptBR"
            ref={datePickerRef}
            selected={startDate}
            minDate={start}
            // placeholderText="Escolha a Data"
            placeholderText="Data"
            dateFormat="P"
            onKeyDown={handleKeyDown}
            filterDate={isWeekday}
            onChange={handleOnChange}
            onInputClick={handleKeyDown}
            inline

            className={"px-3 h-12 w-12 text-center rounded outline-none dark:bg-black dark:text-white dark:border-neutral-700  appearance-none transition duration-300 ease-in-out text-heading text-sm dark:text-white focus:outline-none focus:ring-0 border border-gray-300 focus:border-primary".concat(startDate ? "" : "")}
          />
      </div>
      )}

      
            </div>
            
            {weekName && !!includeTimes.length &&

            <div className="relative">
              {/* <div className="absolute top-0 left-0 right-0 bottom-0 bg-black  " style={{width:'100%',height:'100%',zIndex:150,opacity:0}} onClick={() => hourPickerRef.current.setFocus()}></div> */}
              <input type="time" placeholder="Hora" className="px-0 py-3 text-center text-sm  rounded  bg-yellow-400  h-12 w-20 text-black border-gray-200 border dark:border-primary cursor-pointer text-center" onChange={handlerTime}/>
   
     
           
            </div>
            }
          </div>) : null
      }

    </div>

    <div style={{ display: "none" }} >
      <Schedule count={2} />
    </div>
    { isDateValid() ? (
      <>
    {timeInterval > 0 && (<>
      <div className="bg-yellow-100 mt-5 border-t-4 dark:text-neutral-800 border-yellow-300 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert" style={{ borderColor: '#FBBF24' }}>
        <div className="flex">
          <div className="py-1">
            <RiTimeLine className="fill-current h-7 w-7 text-teal-500 mr-4" style={{ display: "inline-block", verticalAlign: '-2px' }} />
          </div>
          <div>
            <p className="uppercase pt-2">Tempo de {order_type == "delivery" ? "Entrega " : "Preparação "} <b> {timeInterval}min</b></p>
          
          </div>

        </div>
      </div>

    </>)}
    </>
    ) : (<>
        <div className="bg-yellow-100 dark:bg-yellow-400  dark:text-neutral-800 dark:border-yellow-600  mt-5 border-t-4 border-yellow-300 rounded-b text-teal-900  dark:text-black px-4 py-3 shadow-md" role="alert">
          <div className="flex">
            <div className="py-1">
              <RiCalendar2Fill className="fill-current h-7 w-7 text-teal-500 mr-4" style={{ display: "inline-block", verticalAlign: '-2px' }} />
            </div>
            <div>
            <p className="uppercase pt-2">AGENDAMENTOS DISPONÍVEIS</p>
            </div>
          </div>
        </div>
      </>)}
  </div>

  </>
  );
};

export default When;
