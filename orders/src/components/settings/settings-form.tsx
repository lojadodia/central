import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import { SettingsOptions, Shipping, Tax } from "@ts-types/generated";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import Label from "@components/ui/label";
import { CURRENCY } from "./currency";
import ColorPicker from "@components/ui/color-picker/color-picker";
import { siteSettings } from "@settings/site.settings";
import ValidationError from "@components/ui/form-validation-error";
import { useUpdateSettingsMutation } from "@data/settings/use-settings-update.mutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { settingsValidationSchema } from "./settings-validation-schema";
import FileInput from "@components/ui/file-input";
import SelectInput from "@components/ui/select-input";
import Radio from "@components/ui/radio/radio";
import Checkbox from "@components/ui/checkbox/checkbox";
// import SwitchInput from "@components/ui/switch-input";
import InputTime from '@components/select-time-intervals/input-time'
import TextArea from "@components/ui/text-area";
import { getFormattedImage } from "@utils/get-formatted-image";
import { addressInfo } from '@data/location/location'
import { useState } from 'react';
type FormValues = {
  siteTitle: string;
  siteSubtitle: string;
  currency: any;
  logo: any;
  taxClass: Tax;
  shippingClass: Shipping;
  scheduleType: string;
  minAmount: string;
  menuTitle: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: any;
    twitterHandle: string;
    twitterCardType: string;
    metaTags: string;
    canonicalUrl: string;
  };

  site: {
    image: any;
    title: string;
    opacity: string;
    delivery_time: string;
    banner: string;
    subtitle: string;
    fiscal: string;
    address: string;
    address_details: string;
    address_instructions: string;
    address_lat: string;
    address_lng: string;
    address_city: string;
    address_country: string;
    address_state: string;
    address_zip: string;
    address_door: string;
    phone: string;
    email: string;
    instagram: string;
    facebook: string;
    complaints: string;
    twitter: string;
    youtube: string;
    color: string;
    bg_color: string;
    free_shipping: string;
    stock: string;
  };

  order: {
    type: {
      takeaway?: string | boolean;
      delivery?: string | boolean;
    };
  };

  api: {
    pos: string;
  };


  weekly: {
    sunday: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
  };



  google: {
    isEnable: boolean;
    tagManagerId: string;
  };
  facebook: {
    isEnable: boolean;
    appId: string;
    pageId: string;
  };
};

type IProps = {
  settings?: SettingsOptions | undefined | null;
  taxClasses: Tax[] | undefined | null;
  shippingClasses: Shipping[] | undefined | null;
};

export default function SettingsForm({
  settings,
  taxClasses,
  shippingClasses,
}: IProps) {
  const {
    mutate: updateSettingsMutation,
    isLoading: loading,
  } = useUpdateSettingsMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,
    resolver: yupResolver(settingsValidationSchema),
    defaultValues: {
      
      schedule: {
        sunday: {
          value: '',
          state: false,
          time1: { start: '08:00', end: '12:00' },
          time2: { start: '14:00', end: '18:00' },
          interval: 0,
          interval2: 0
        },
        monday: {
          value: '',
          time1: { start: '08:00', end: '12:00' },
          time2: { start: '14:00', end: '18:00' },
          interval: 0,
          interval2: 0
        },
        tuesday: {
          value: '',
          time1: { start: '08:00', end: '12:00' },
          time2: { start: '14:00', end: '18:00' },
          interval: 0,
          interval2: 0
        },
        wednesday: {
          value: '',
          time1: { start: '08:00', end: '12:00' },
          time2: { start: '14:00', end: '18:00' },
          interval: 0,
          interval2: 0
        },
        thursday: {
          value: '',
          time1: { start: '08:00', end: '12:00' },
          time2: { start: '14:00', end: '18:00' },
          interval: 0,
          interval2: 0
        },
        friday: {
          value: '',
          time1: { start: '08:00', end: '12:00' },
          time2: { start: '14:00', end: '18:00' },
          interval: 0,
          interval2: 0
        },
        saturday: {
          value: '',
          time1: { start: '08:00', end: '12:00' },
          time2: { start: '14:00', end: '18:00' },
          interval: 0,
          interval2: 0
        }
      },
      ...settings,
      api: {
        pos: settings?.api?.pos ?? ""
      },
     
      weekly: settings?.weekly ?? {},
      logo: settings?.logo ?? "",
      currency: settings?.currency
        ? CURRENCY.find((item) => item.code == settings?.currency)
        : "",
      // @ts-ignore
      taxClass: !!taxClasses?.length
        ? taxClasses?.find((tax: Tax) => tax.id == settings?.taxClass)
        : "",
      // @ts-ignore
      shippingClass: !!shippingClasses?.length
        ? shippingClasses?.find(
          (shipping: Shipping) => shipping.id == settings?.shippingClass
        )
        : "",

    },
  });

  const [dataAddress, setDataAddess] = useState<any>();

  type DataAddressInfo = {
    id: string,
    address: {
      streetName: string,
      municipality: string
      countrySecondarySubdivision: string,
      extendedPostalCode: string,
      country: string,
      postalCode: number,
      streetNumber: string,
      id: number,
    },
    position: {
      lat: number,
      lon: number
    }
  }


  const onPuttingDataInput = async (e: any) => {
    const res: any = await addressInfo(e.target.value,settings);
    const result = res?.data?.results;
    const address: Array<Address> = []


    for (let i in result) {
      if (result[i].address.streetName) {
        address.push(result[i]);
      }
    }
    setDataAddess(address);
  }
  const getAddress = (data: DataAddressInfo) => {
    setValue("site.address_lat", data.position?.lat);
    setValue("site.address_lng", data.position?.lon);
    setValue("site.address_zip", data.address?.extendedPostalCode?.split(",").splice(0, 1).join(""));
    setValue("site.address_city", data.address?.municipality);
    setValue("site.address_state", data.address.countrySecondarySubdivision);
    setValue("site.address_country", data.address?.country);
    setValue("site.address_door", data.address?.streetNumber);
    //sname door, zip, city, state
    setValue("site.address", data.address?.streetName)

    setDataAddess(null);
  }


  async function onSubmit(values: FormValues) {

    updateSettingsMutation({
      variables: {
        input: {
          options: {
            ...values,
            currency: values.currency?.code,
            taxClass: values?.taxClass?.id,
            shippingClass: values?.shippingClass?.id,
            logo: values?.logo,
            //@ts-ignore
            seo: {
              ...values?.seo,
              ogImage: getFormattedImage(values?.seo?.ogImage),
            },
            site: {
              ...values?.site,
              image: getFormattedImage(values?.site?.image),
            },
            license: {
              ...values?.license,
            },
            notification: {
              ...values?.notification,
            },
            schedule: {
              ...values?.schedule,
            },
            weekly: {
              ...settings?.weekly
            },
            api: {
              ...settings?.api
            }
          },
        },
      },
    });
  }
  const schedule_type = watch("scheduleType") ?? settings?.scheduleType;
  const _schedule = watch("schedule") ?? settings?.schedule;

  const logoInformation = (
    <span>
      Carregue o logotipo do seu site a partir daqui. <br />
      A dimensão do logotipo deve ser &nbsp;
      <span className="font-bold">
        {siteSettings.logo.width} x {siteSettings.logo.height}px
      </span>
    </span>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 dark:border-neutral-500 my-5 sm:my-8">
        <Description
          title="Logotipo"
          details={logoInformation}
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="logo" control={control} multiple={false} />
          <div className="mb-5 mt-5">
            <Label>OG Image</Label>
            <FileInput name="seo.ogImage" control={control} multiple={false} />
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Informações"
          details="Altere as informações do seu site aqui"
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Titulo da Loja"
            {...register("siteTitle")}
            error={errors.siteTitle?.message}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="Subtítulo da Loja"
            {...register("siteSubtitle")}
            error={errors.siteSubtitle?.message}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="NIPC / NIF (Contribuinte)"
            {...register("site.fiscal")}
            variant="outline"
            className="mb-5"
          />
          <div className="mb-5">
            <Label>Moéda</Label>
            <SelectInput
              name="currency"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.code}
              options={CURRENCY}
            />
            <ValidationError message={errors.currency?.message} />
          </div>

          <div className="mb-5">
            <Label>Classe de Taxa</Label>
            <SelectInput
              name="taxClass"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={taxClasses!}
            />
          </div>

          <div>
            <Label>Classe de Envio</Label>
            <SelectInput
              name="shippingClass"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={shippingClasses!}
            />
          </div>
        </Card>
      </div>
      <div className="flex flex-wrap my-5 sm:my-8" style={{ display: 'none' }}>
        <Description
          title="SEO"
          details="Mude o SEO do seu site a partir daqui"
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Meta Title"
            {...register("seo.metaTitle")}
            variant="outline"
            className="mb-5"
          />
          <TextArea
            label="Meta Description"
            {...register("seo.metaDescription")}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="Meta Tags"
            {...register("seo.metaTags")}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="Canonical URL"
            {...register("seo.canonicalUrl")}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="OG Title"
            {...register("seo.ogTitle")}
            variant="outline"
            className="mb-5"
          />
          <TextArea
            label="OG Description"
            {...register("seo.ogDescription")}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="Twitter Handle"
            {...register("seo.twitterHandle")}
            variant="outline"
            className="mb-5"
            placeholder="your twitter username (exp: @username)"
          />
          <Input
            label="Tipo de cartão do Twitter"
            {...register("seo.twitterCardType")}
            variant="outline"
            className="mb-5"
            placeholder="one of summary, summary_large_image, app, or player"
          />
        </Card>
      </div>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="WEBSITE"
          details="Configure as Informações do seu site aqui"
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>Imagem Principal</Label>
            <FileInput name="site.image" control={control} multiple={false} />
          </div>


          <Input
            type="range"
            step="0.01"
            min="0"
            max="1"
            className="note mb-5"
            label="Opacidade da Imagem"
            {...register("site.opacity")}
            variant="outline"

          />

          <Input
            label="Título Principal"
            {...register("site.title")}
            variant="outline"
            className="mb-5"
          />
          <TextArea
            label="Subtítulo Principal"
            {...register("site.subtitle")}
            variant="outline"
            className="mb-5"
          />

          <div className="mb-5">
            <Label>Banners</Label>
            <Radio
              label="Invisível"
              {...register("site.banner")}
              id="NONE"
              value="none"
              className="mb-2"
            />
            <Radio
              label="Visível"
              {...register("site.banner")}
              id="BLOCK"
              value="block"
              className="mb-2"
            />
            <ColorPicker
              label="Cor"
              {...register("site.color")}

              className="mt-5"
            />
            <ColorPicker
              label="Cor de Fundo"
              {...register("site.bg_color")}

              className="mt-5"
            />
          </div>


        </Card>
      </div>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Funcionamento"
          details="Configure aqui os dias funcionamento e quem escolhe o dia de entrega dos pedidos"
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">

          <div className="mb-5">
            <Label>Tempo de Entrega a definir pelo:</Label>
            <Radio
              label="Comerciante apartir de:"
              {...register("scheduleType")}
              id="STORE"
              value="store"
              className="mb-2"
            />
            <Radio
              label="Cliente"
              {...register("scheduleType")}
              id="CLIENT"
              value="client"
              className="mb-2"
            />
            <Radio
              label="Cliente a partir de:"
              {...register("scheduleType")}
              id="CLIENT_BY"
              value="client-by"
              className="mb-2"
            />
          </div>
          {(schedule_type === "store" || schedule_type === "client-by") && (
            <Input
              label="... Apartir de (Dias)"
              {...register("site.delivery_time")}
              variant="outline"
              className="mb-5"
            />

          )}

          <div className="mb-5">
            <Label>Horário de Funcionamento:</Label>

            <div className="mt-8">
              <div className="flex items-center my-1">
                <span>
                  <input id="sunday" {...register("schedule.sunday.value")} type="checkbox" className="checkbox_checkbox__3Pae_" />
                  <label htmlFor="sunday" className="text-body text-sm w-36">Domingo</label> &nbsp;&nbsp;
                </span>
                <InputTime
                  control={control}
                  className={_schedule.sunday.value ? '' : 'opacity-0 pointer-events-none absolute w-0 h-0'}
                  start1="schedule.sunday.time1.start"
                  end1="schedule.sunday.time1.end"
                  start2="schedule.sunday.time2.start"
                  end2="schedule.sunday.time2.end"
                  interval="schedule.sunday.interval"
                  interval2="schedule.sunday.interval2"
                />
              </div>
              <div className="flex">
              </div>
            </div>
            <hr />
            <div className="">
              <div className="flex items-center my-1">
                <span>
                  <input id="monday" {...register("schedule.monday.value")} type="checkbox" className="checkbox_checkbox__3Pae_" />
                  <label htmlFor="monday" className="text-body text-sm w-36">Segunda</label> &nbsp;&nbsp;
                </span>
                <InputTime
                  control={control}
                  className={_schedule.monday.value ? '' : 'opacity-0 pointer-events-none absolute w-0 h-0'}
                  start1="schedule.monday.time1.start"
                  end1="schedule.monday.time1.end"
                  start2="schedule.monday.time2.start"
                  end2="schedule.monday.time2.end"
                  interval="schedule.monday.interval"
                  interval2="schedule.monday.interval2"
                />
              </div>
            </div>
            <hr />
            <div>
              <div className="flex items-center my-1">
                <span>
                  <input id="tuesday"
                    {...register("schedule.tuesday.value")}
                    style={{ minWidth: '20px', minHeight: '20px' }}
                    type="checkbox" className="checkbox_checkbox__3Pae_" />
                  <label htmlFor="tuesday" className="text-body text-sm w-36">Terça</label> &nbsp;&nbsp;
                </span>
                <InputTime
                  control={control}
                  className={_schedule.tuesday.value ? '' : 'opacity-0 pointer-events-none absolute w-0 h-0'}
                  start1="schedule.tuesday.time1.start"
                  end1="schedule.tuesday.time1.end"
                  start2="schedule.tuesday.time2.start"
                  end2="schedule.tuesday.time2.end"
                  interval="schedule.tuesday.interval"
                  interval2="schedule.tuesday.interval2"
                />
              </div>
            </div>
            <hr />
            <div>
              <div className="flex items-center my-1">
                <span>
                  <input id="wednesday" {...register("schedule.wednesday.value")} type="checkbox" className="checkbox_checkbox__3Pae_" />
                  <label htmlFor="wednesday" className="text-body text-sm w-36">Quarta</label> &nbsp;&nbsp;

                </span>
                <InputTime
                  control={control}
                  className={_schedule.wednesday.value ? '' : 'opacity-0 pointer-events-none absolute w-0 h-0'}
                  start1="schedule.wednesday.time1.start"
                  end1="schedule.wednesday.time1.end"
                  start2="schedule.wednesday.time2.start"
                  end2="schedule.wednesday.time2.end"
                  interval="schedule.wednesday.interval"
                  interval2="schedule.wednesday.interval2"
                />
              </div>
            </div>
            <hr />
            <div>
              <div className="flex items-center my-1">
                <span>
                  <input id="thursday" {...register("schedule.thursday.value")} type="checkbox" className="checkbox_checkbox__3Pae_" />
                  <label htmlFor="thursday" className="text-body text-sm w-36">Quinta</label> &nbsp;&nbsp;

                </span>
                <InputTime
                  control={control}
                  className={_schedule.thursday.value ? '' : 'opacity-0 pointer-events-none absolute w-0 h-0'}
                  start1="schedule.thursday.time1.start"
                  end1="schedule.thursday.time1.end"
                  start2="schedule.thursday.time2.start"
                  end2="schedule.thursday.time2.end"
                  interval="schedule.thursday.interval"
                  interval2="schedule.thursday.interval2"
                />
              </div>
            </div>
            <hr />
            <div>
              <div className="flex items-center my-1">
                <span>
                  <input id="friday" {...register("schedule.friday.value")} type="checkbox" className="checkbox_checkbox__3Pae_" />
                  <label htmlFor="friday" className="text-body text-sm w-36">Sexta</label> &nbsp;&nbsp;

                </span>
                <InputTime
                  control={control}
                  className={_schedule.friday.value ? '' : 'opacity-0 pointer-events-none absolute w-0 h-0'}
                  start1="schedule.friday.time1.start"
                  end1="schedule.friday.time1.end"
                  start2="schedule.friday.time2.start"
                  end2="schedule.friday.time2.end"
                  interval="schedule.friday.interval"
                  interval2="schedule.friday.interval2"
                />
              </div>
            </div>
            <hr />
            <div>
              <div className="flex items-center my-1">
                <span>
                  <input id="saturday" {...register("schedule.saturday.value")} type="checkbox" className="checkbox_checkbox__3Pae_" />
                  <label htmlFor="saturday" className="text-body text-sm w-36">Sábado</label> &nbsp;&nbsp;

                </span>
                <InputTime
                  control={control}
                  className={_schedule.saturday.value ? '' : 'opacity-0 pointer-events-none absolute w-0 h-0'}
                  start1="schedule.saturday.time1.start"
                  end1="schedule.saturday.time1.end"
                  start2="schedule.saturday.time2.start"
                  end2="schedule.saturday.time2.end"
                  interval="schedule.saturday.interval"
                  interval2="schedule.saturday.interval2"
                />
              </div>
            </div>


            <div style={{ display: 'none' }}>
              <Checkbox
                label="Domingo"
                {...register("schedule.setting")}
                id="setting_sunday"
                className="mb-2"
              />

            </div>


          </div>

          <Input
            label="Montante Mínimo para Compra"
            {...register("minAmount")}
            variant="outline"
            className="mb-5"
          />

          <Input
            label="Montante Mínimo para Entrega Gratuíta"
            {...register("site.free_shipping")}
            variant="outline"
            className="mb-5"
          />

          <Input
            label="Função Menus da Semana"
            {...register("menuTitle")}
            variant="outline"
            className="mb-5"
          />

          <Label className="pt-5">Venda com Stock</Label>

          <Radio
            label="Ativo"
            {...register("site.stock")}
            id="STOCKS_ACTIVE"
            value="on"
            className="mb-2"
          />
          <Radio
            label="Inativo"
            {...register("site.stock")}
            id="STOCKS_INACTIVE"
            value="off"
            className="mb-4"
          />

          <Label className="pt-5">Recolha na Loja</Label>

          <Radio
            label="Ativo"
            id="TakeawayOn"
            key="takeawayOn"
            {...register("order.type.takeaway")}
            value="true"
            className="mb-2"
          />
          <Radio
            label="Inativo"
            key="takeawayOff"
            id="TakeawayOff"
            {...register("order.type.takeaway")}
            value="false"
          
            className="mb-2"
          />

          <Label className="pt-5">Entrega</Label>

          <Radio
            label="Ativo"
            id="DeliveryOn"
            key="deliveryOn"
            {...register("order.type.delivery")}
            value="true"
            className="mb-2"
          />
          <Radio
            label="Inativo"
            key="deliveryOff"
            {...register("order.type.delivery")}
            id="DeliveryOff"
            value="false"
            className="mb-2"
          />



        </Card>
      </div>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Endereço, Contatos & Links"
          details="Introduza nestes campos as suas informações de contato e links úteis"
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="relative col-span-4 w-full">
            <Input
              label="Endereço"
              {...register("site.address")}
              variant="outline"
              className="mb-5"
              onChange={onPuttingDataInput}
            />

            <div className={dataAddress?.length > 0 ? "list-outside md:list-inside absolute top-20 bg-white dark:bg-neutral-900  w-full w-88 border border-primary mt-1 z-50" : ""} >
              {
                dataAddress?.map((item: DataAddressInfo, index: number) => {
                  //{const addressText =  item.streetName.length+" "+ item.municipality + " " + " " + item.countrySecondarySubdivision + " " +  item.country);
                  if (index <= 5) {
                    return (
                      <>
                        {
                          item ? (
                            <ul key={item?.id}>
                              <li onClick={() => getAddress(item)} className="px-5 py-2 border-b hover:bg-gray-100 dark:bg-black  cursor-pointer">
                                <span style={{ overflow: 'hidden', display: '-webkit-box', '-webkit-line-clamp': '1', textOverflow: 'ellipsis', '-webkit-box-orient': 'vertical' }}><b>{item?.address?.streetName}</b> {item?.address?.streetNumber} {item?.address?.municipality}, {item?.address?.countrySecondarySubdivision}, {item?.address?.country}</span>
                              </li>
                            </ul>
                          ) : null
                        }
                      </>
                    )
                  }
                })
              }
            </div>
          </div>
          <div className="md:flex">
            <Input
              label="Porta"
              {...register("site.address_door")}
              variant="outline"
              className="mb-5  md:mr-5 md:flex-1"
            />
            <Input
              label="Detalhes"
              {...register("site.address_details")}
              variant="outline"
              className="mb-5 md:flex-1"
            />
          </div>

          <Input
            label="Instruções"
            {...register("site.address_instructions")}
            variant="outline"
            className="mb-5 flex-1"
          />
          <div className="md:flex">
            <Input
              label="Código Postal"
              {...register("site.address_zip")}
              variant="outline"
              className="mb-5  md:mr-5 md:flex-1"
            />

            <Input
              label="Cidade"
              {...register("site.address_city")}
              variant="outline"
              className="mb-5 md:flex-1"
            />
          </div>


          <div style={{ display: 'none' }}>
            <Input
              label="State"
              {...register("site.address_state")}
              variant="outline"
              className="mb-5"
            />
            <Input
              label="Country"
              {...register("site.address_country")}
              variant="outline"
              className="mb-5"
            />
            <Input
              label="Lat"
              {...register("site.address_lat")}
              variant="outline"
              className="mb-5"
            />
            <Input
              label="Lng"
              {...register("site.address_lng")}
              variant="outline"
              className="mb-5"
            />
          </div>

          <Input
            label="E-mail"
            {...register("site.email")}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="Telefone"
            {...register("site.phone")}
            variant="outline"
            className="mb-5"
          />


          <Input
            label="Instagram"
            {...register("site.instagram")}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="Facebook"
            {...register("site.facebook")}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="Twitter"
            {...register("site.twitter")}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="Youtube"
            {...register("site.youtube")}
            variant="outline"
            className="mb-5"
          />





        </Card>
      </div>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Notificações de Vendas"
          details="O sistema notificará os contatos disponíveis nestes campos sempre que houver um pedido."
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>Notificações</Label>
          </div>
          <Radio
            label="Ativas"
            {...register("notification.status")}
            id="NOTIFICATION_ACTIVE"
            value="on"
            className="mb-2"
          />
          <Radio
            label="Inativas"
            {...register("notification.status")}
            id="NOTIFICATION_INACTIVE"
            value="off"
            className="mb-4"
          />
          <p className="mb-4"><small>Utilizaremos estes contatos apenas para os fins descritos na nossa <a href="https://www.nd-t.pt/docs?doc=privacy" target="_blank"><u>Política de Privacidade</u></a>.</small></p>
          <Input
            label="E-mail"
            {...register("notification.email")}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="Telefone"
            {...register("notification.phone")}
            variant="outline"
            className="mb-5"
          />

        </Card>
      </div>

      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Regulamentações & Licenças"
          details="As suas licenças, termos e políticas"
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <TextArea
            label="Termos e Condições"
            {...register("license.terms")}
            variant="outline"
            className="mb-5"
          />
          <TextArea
            label="Política de Privacidade"
            {...register("license.privacy")}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="Link Livro de Reclamações"
            {...register("site.complaints")}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>
      <div className="mb-4 text-right">
        <Button loading={loading} disabled={loading}>
          Aplicar & Guardar Definições
        </Button>
      </div>
    </form>
  );
}
