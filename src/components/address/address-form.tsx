import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Button from "@components/ui/button";
import Input from "@components/ui/input";
import Label from "@components/ui/label";
import Radio from "@components/ui/radio/radio";
import { useUI } from "@contexts/ui.context";
import { useUpdateCustomerMutation } from "@data/customer/use-update-customer.mutation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  addressInfo,
  addressInfoByCoords,
  GoogleAddressInfo,
  GoogleAddressInfoById,
} from "@data/location/location";
import { Address } from "@ts-types/generated";
import { useSettings } from "@contexts/settings.context";
import { useCheckout } from "@contexts/checkout.context";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import axios from "axios";
import Cookies from "js-cookie";
import { RiShoppingBag3Fill, RiTruckFill } from "react-icons/ri";

//import './address-form.css
type FormValues = {
  title: string;
  type: string;
  delivery_fee: string;
  address: {
    country: string;
    city: string;
    state: string;
    instructions: string;
    zip: string;
    street_address: string;
    lat: string;
    lng: string;
    details: string;
    door: string;
  };
};

type DataAddressInfo = {
  id: string;
  address: {
    streetName: string;
    municipality: string;
    countrySecondarySubdivision?: string;
    countrySubdivision?: string;
    extendedPostalCode: string;
    country: string;
    postalCode: number;
    streetNumber: string;
    id: number;
  };
  position: {
    lat: number;
    lon: number;
  };
};

const addressSchema = yup.object().shape({
  type: yup.string().required("Tipo de Morada é obrigatório"),
  title: yup.string().required("Título é obrigatório"),
  delivery_fee: yup.string().optional(),
  address: yup.object().shape({
    country: yup.string().required("País é obrigatório"),
    city: yup.string().required("Cidade é obrigatória"),
    state: yup.string().required("Detalhes para entrega"),
    zip: yup.string().required("Código Postal é obrigatório"),
    street_address: yup.string().required("O endereço da rua é obrigatório"),
    details: yup.string().required("Detalhes para entrega"),
    door: yup.string().required("O número da porta é obrigatório"),
  }),
});

const addressManualSchema = yup.object().shape({
  type: yup.string().required("Tipo de Morada é obrigatório"),
  title: yup.string().required("Título é obrigatório"),
  delivery_fee: yup.string().optional(),
  address: yup.object().shape({
    country: yup.string().required("País é obrigatório"),
    city: yup.string().required("Cidade é obrigatória"),
    state: yup.string().required("Detalhes para entrega"),
    zip: yup.string().optional(),
    street_address: yup.string().required("O endereço da rua é obrigatório"),
    details: yup.string().required("Detalhes para entrega"),
    door: yup.string().required("O número da porta é obrigatório"),
  }),
});

const CreateOrUpdateAddressForm = () => {
  const [showImg, setShowImg] = useState(false);
  const [searchMode, setSearchMode] = useState<"automatic" | "manual">(
    "automatic"
  );
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [google_address, setGoogleAddress] = useState(null);
  const [showInformLog, setShowInformLoc] = useState(false);
  const [dataAddress, setDataAddess] = useState<any>();
  const settings: any = useSettings();
  const inputFocus = useRef(null);

  useLayoutEffect(() => {
    inputFocus.current && setTimeout(() => inputFocus.current.focus(), 0);
  }, [inputFocus.current]);

  const { checkoutData, setCheckoutData, updateBillingAddress } = useCheckout();
  const {
    modalData: { customerId, address, type },
    closeModal,
  } = useUI();
  const { mutate: updateProfile } = useUpdateCustomerMutation();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(searchMode === 'automatic' ? addressSchema : addressManualSchema),
    defaultValues: {
      // title: address?.title ?? "Endereço",
      // country: address?.country ?? "Portugal",
      // state: address?.state ?? "Portugal",
      title: "Endereço",
      country: "Portugal",
      state: "Portugal",
      lat: 0,
      lng: 0,
      type: address?.type ?? type,
      ...(address?.address && address),
      
    },
  });

  function onSubmit(values: FormValues) {
    const formattedInput = {
      id: address?.id,
      customer_id: customerId,
      title: values.title,
      type: values.type,
      address: {
        ...(address?.id ? { id: address.id } : {}),
        ...values.address,
      },
    };

    updateProfile({
      id: customerId,
      address: [formattedInput],
    });

    setTimeout(() => {
      updateBillingAddress(values);
    }, 600);

    if (searchMode === "manual" && checkoutData) {
      checkoutData.shipping_charge = +deliveryFee;
      checkoutData.manual = true;
      setCheckoutData(checkoutData);
      return closeModal();
    } else {
      if (!checkoutData) return closeModal();
      checkoutData.manual = false;
      setCheckoutData(checkoutData);
    }

    return closeModal();
  }
  // tomtom | google
  const default_map: string = settings?.env?.DEFAULT_MAP_SEARCH;

  const onPuttingDataInput = async (e: any) => {
    const res: any =
      default_map == "tomtom"
        ? await addressInfo(e.target.value, settings)
        : await GoogleAddressInfo(e.target.value, settings);
    const result = res?.data?.results;
    const address: Array<Address> = [];

    if (default_map == "tomtom") {
      for (let i in result) {
        if (result[i].address.streetName) {
          address.push(result[i]);
        }
      }
    } else {
      for (let i in result) {
        if (result[i]) {
          address.push(result[i]);
        }
      }
    }
    setDataAddess(address);
  };

  const validateDataInput = async (e: any) => {
    e.currentTarget.maxLength = 9;
    let value = e.currentTarget.value;
    value = value.replace(/\D/g, "");
    value =
      settings?.env?.SHIPPING_COUNTRY == "PT"
        ? value.replace(/^(\d{4})(\d)/, "$1-$2")
        : value.replace(/^(\d{5})(\d)/, "$1-$2");
    e.currentTarget.value = value;
  };

  const getAddress = (data: DataAddressInfo) => {
    if (default_map == "tomtom") {
      if (!data.position?.lat) {
        const data_position = data.position.split(",");
        setValue("address.lat", data_position[0]);
        setValue("address.lng", data_position[1]);
      } else {
        setValue("address.lat", data.position?.lat);
        setValue("address.lng", data.position?.lon);
      }
      setValue(
        "address.zip",
        data.address?.extendedPostalCode?.split(",").splice(0, 1).join("")
      );
      setValue("address.city", data.address?.municipality);
      setValue(
        "address.state",
        settings?.env?.SHIPPING_COUNTRY == "PT"
          ? data.address?.countrySecondarySubdivision
          : data?.address?.countrySubdivision
      );
      setValue("address.country", data.address?.country);
      setValue("address.door", data.address?.streetNumber);
      setValue("address.street_address", data.address?.streetName);
      setShowInformLoc(true);
      setDataAddess(null);
    } else {
      if (data?.place_id) {
        const url = Cookies.get("url_endpoint")
          ? Cookies.get("url_endpoint")
          : process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
        axios
          .get(
            url + `external/googlemaps?value=${data?.place_id}&type=place_id`
          )
          .then(function (response) {
            setGoogleAddress(response?.data?.result);
          });
      }
    }
  };
  useEffect(() => {
    if (address) {
      setShowInformLoc(true);
    } else {
      setShowImg(true);
    }
    translate();
  }, []);

  useEffect(() => {
    if (google_address) {
      const address: any = google_address;
      console.log(google_address);
      let i = 0;

      if (isNaN(address?.address_components[0].long_name)) {
        i = 0;
      } else {
        i = 1;
        setValue("address.door", address?.address_components[0].long_name);
      }
      setValue("address.lat", address?.geometry?.location?.lat);
      setValue("address.lng", address?.geometry?.location?.lng);

      setValue(
        "address.street_address",
        address?.address_components[i]?.long_name
      );

      setValue("address.city", address?.address_components[i + 1]?.long_name);
      setValue("address.state", address?.address_components[i + 2]?.long_name);
      setValue(
        "address.country",
        address?.address_components[i + 3]?.long_name
      );
      setValue("address.zip", address?.address_components[i + 4]?.long_name);

      setShowInformLoc(true);
      setGoogleAddress(null);
      setDataAddess(null);
    }
  }, [google_address]);

  // Tradução
  useEffect(() => {
    translate();
  }, []);
  const { t } = useTranslation();
  const translate = () => {
    i18next.changeLanguage(settings?.env?.SHIPPING_COUNTRY);
  };
  // Fim da Tradução

  function handlerGetGeoLocation() {
    // seria melhor fazer isso do backend? devido o key

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { coords } = position;
        addressInfoByCoords(coords.latitude, coords.longitude).then(
          (address) => {
            getAddress(address); // esta certo podes testar
          }
        );

        // setValue("address.lat", coords.latitude);
        // setValue("address.lng", coords.longitude);
      });
    } else {
      console.error("browser not support gelocation");
    }
  }

  const handleAutomaticSearch = () => {
    setSearchMode("automatic");
    setShowInformLoc(false);
  }

  const handleSelectManualSearch = () => {
    setSearchMode("manual");
    setShowInformLoc(true);
    setValue("address.state", "Portugal");
    setValue('address.city', settings?.site?.address_city)
  }

  return (
    <div className="p-5 sm:p-8 bg-white dark:bg-neutral-800 border dark:border-neutral-700 border-gray-200 rounded-lg">
      <h1 className="text-heading dark:text-white font-semibold text-lg text-center mb-0 ">
        {address ? "Atualizar" : "Adicionar Novo"} Endereço
      </h1>

      <div className="grid mt-5 gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 ">
        <div
          onClick={handleAutomaticSearch}
          className={`px-4 py-3 text-center text-sm ${
            searchMode == "automatic"
              ? "bg-primary display-inline text-white"
              : ""
          }  rounded h-12  border-gray-200 border dark:border-neutral-700 cursor-pointer uppercase`}
        >
          BUSCA AUTOMÁTICA
        </div>
        <div
          onClick={handleSelectManualSearch}
          className={`px-4 py-3 text-center text-sm ${
            searchMode == "manual" ? "bg-primary display-inline text-white" : ""
          }  rounded h-12  border-gray-200 border dark:border-neutral-700 cursor-pointer uppercase`}
        >
          MANUAL
        </div>
      </div>

      {searchMode === "manual" && (
        <Input
          label="Taxa de Entrega"
          key="delivery-fee"
          {...register("delivery_fee")}
          variant="outline"
          placeholder="0"
          onChange={(e) =>
            setDeliveryFee(+e.target.value < 0 ? 0 : +e.target.value)
          }
          required
          value={deliveryFee}
          type="number"
          className="col-span-2 mt-5 bg-primary p-2 rounded"
        />
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid grid-cols-2 gap-5 h-full"
      >
        <div style={{ display: "none" }}>
          <Label>Tipo de Morada</Label>

          <div className="space-x-4 flex items-center">
            <Radio
              key="billing"
              id="billing"
              {...register("type", { required: "Type is required" })}
              type="radio"
              value="billing"
              label="Cobrança"
            />

            <Radio
              id="shipping"
              key="shipping"
              {...register("type", { required: "Type is required" })}
              type="radio"
              value="shipping"
              label="Envio"
            />
          </div>

          <Input
            label="Título"
            {...register("title", { required: "Title is required" })}
            error={errors.title?.message}
            variant="outline"
            className="col-span-2"
            value="Endereço"
          />
        </div>

        <Input
          key="span-1"
          {...register("span-1")}
          className="col-span-2"
          style={{ opacity: 0, height: 0 }}
        />
        <Input
          key="span-2"
          {...register("span-2")}
          className="col-span-2"
          style={{ opacity: 0, height: 0 }}
        />

        <div className="relative col-span-4 w-full">
          <Input
            label={t("seu_codigo_postal")}
            {...register("address.street_address")}
            error={errors?.address?.street_address?.message}
            variant="outline"
            placeholder={t("digite_codigo_postal")}
            className="w-full col-span-4"
            onChange={onPuttingDataInput}
            //ref={inputFocus}
          />

          {searchMode === "automatic" && (
            <div
              className={
                dataAddress?.length > 0
                  ? "list-outside md:list-inside absolute top-120 bg-white dark:bg-black w-full w-88 border border-primary mt-1 z-50"
                  : ""
              }
            >
              {dataAddress?.map((item: DataAddressInfo, index: number) => {
                //{const addressText =  item.streetName.length+" "+ item.municipality + " " + " " + item.countrySecondarySubdivision + " " +  item.country);
                //if(index <=5){
                return (
                  <>
                    {item ? (
                      <ul key={item?.id}>
                        <li
                          onClick={() => getAddress(item)}
                          className="px-5 py-2 border-b hover:bg-gray-100 dark:hover:bg-primary dark:text-gray  dark:border-neutral-700 cursor-pointer text-sm py-5 z-100"
                        >
                          <span
                            style={{
                              overflow: "hidden",
                              display: "-webkit-box",
                              "-webkit-line-clamp": "1",
                              textOverflow: "ellipsis",
                              "-webkit-box-orient": "vertical",
                            }}
                          >
                            {default_map == "tomtom" ? (
                              <>
                                <b className="dark:text-white">
                                  {" "}
                                  {item?.address?.streetName}
                                </b>{" "}
                                {item?.address?.streetNumber}{" "}
                                {item?.address?.municipality},{" "}
                                {settings?.env?.SHIPPING_COUNTRY == "PT"
                                  ? item?.address?.countrySecondarySubdivision
                                  : item?.address?.countrySubdivision}
                                , {item?.address?.country}
                              </>
                            ) : (
                              <>
                                <span className="dark:text-white">
                                  {" "}
                                  {item?.formatted_address}
                                </span>
                              </>
                            )}
                          </span>
                        </li>
                      </ul>
                    ) : null}
                  </>
                );
                //}
              })}
            </div>
          )}
        </div>
        {showInformLog ? (
          <>
            <Input
              label="Porta"
              key="porta"
              {...register("address.door")}
              error={errors.address?.door?.message}
              variant="outline"
              required
              placeholder="Número da Porta"
              className="col-span-2"
            />
            <Input
              key="detalhe"
              label="Detalhes"
              {...register("address.details")}
              error={errors?.address?.details?.message}
              variant="outline"
              required
              placeholder="Ex: 1Dto., 5A, B"
              className="col-span-2"
            />

            <Input
              key="instrucoes"
              label="Instruções"
              {...register("address.instructions")}
              error={errors?.address?.instructions?.message}
              variant="outline"
              required
              placeholder="Exemplo: Bata a porta, Campainha avariada"
              className="col-span-4"
            />

            <div style={{ display: "none" }}>
              <Input
                label="Lat"
                key="lat"
                {...register("address.lat")}
                error={errors?.address?.lat?.message}
                variant="outline"
                placeholder=""
                className="col-span-2"
              />
              <Input
                label="Lng"
                key="lng"
                {...register("address.lng")}
                error={errors?.address?.lng?.message}
                variant="outline"
                placeholder=""
                className="col-span-2"
              />
              <Input
                label="Cidade"
                key="cidade"
                {...register("address.state")}
                error={errors?.address?.state?.message}
                variant="outline"
                placeholder="Sua Cidade"
                className="col-span-2"
                type=""
              />
            </div>

            <Input
              label={t("codigo_postal")}
              key="cod-postal"
              {...register("address.zip")}
              error={errors?.address?.zip?.message}
              variant="outline"
              required
              placeholder={t("placeholder_codigo_postal")}
              className="col-span-2"
              type=""
              onChange={(e) => validateDataInput(e)}
            />
            <Input
              label="Cidade"
              key="cidade"
              {...register("address.city")}
              error={errors?.address?.city?.message}
              variant="outline"
              required
              placeholder="Sua Cidade"
              className="col-span-2"
              type=""
            />

            {/* <TextArea
          label="Endereço"
          {...register("address.street_address")}
          error={errors?.address?.street_address?.message}
          variant="outline"
          placeholder="Introduza: Rua, Apt, Porta"
          className="col-span-2"
        /> */}

            <div style={{ display: "none" }}>
              <Input
                label="País"
                {...register("address.country")}
                error={errors?.address?.country?.message}
                variant="outline"
                value="Portugal"
              />

              {/* <Input
          label="Estado"
          {...register("address.state")}
          error={errors?.address?.state?.message}
          variant="outline"
          value="Portugal"
        /> */}
            </div>
            <Button className="w-full add-cart-button col-span-4 z-2">
              {address ? "Atualizar" : "Guardar"} Endereço
            </Button>
          </>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
};

export default CreateOrUpdateAddressForm;
