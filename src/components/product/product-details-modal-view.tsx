import { useProductQuery } from "@data/product/use-product.query";
import { useRouter } from "next/router";
import Image from "next/image";
import cn from "classnames";
import { AddToCart } from "@components/product/add-to-cart/add-to-cart";
import { useUI } from "@contexts/ui.context";
import usePrice from "@utils/use-price";
import { ThumbsCarousel } from "@components/ui/carousel";
import { getVariations } from "@utils/get-variations";
import { useEffect, useState, useRef, useCallback } from "react";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import Spinner from "@components/ui/loaders/spinner/spinner";
import { Waypoint } from "react-waypoint";
import Truncate from "@components/ui/truncate-scroll";
import dynamic from "next/dynamic";
import ProductAttributes from "./product-details/product-attributes";
import ProductCategories from "./product-details/product-categories";
import VariationPrice from "./product-details/product-variant-price";
import { useSettings } from "@contexts/settings.context";
import Input from "@components/ui/input";
import { Dialog, Transition } from "@headlessui/react";
import Cookies from "js-cookie";
import SimpleModal from "./question-modal";
import Scrollbar from "@components/ui/scrollbar";


const RelatedProducts = dynamic(
  () => import("./product-details/related-products")
);

const ProductDetailsModalView = ({ productSlug }: { productSlug: string }) => {
  const router = useRouter();

  const {
    showModalStickyBar,
    hideModalStickyBar,
    displayModalStickyBar,
    closeModal,
  } = useUI();

  const { data, isLoading: loading } = useProductQuery(productSlug);
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [extras, setAttributeExtras] = useState<{ [key: string]: any }>({});
  const [obs, setObs] = useState<string>("");
  const [totalExtras, setTotalExtras] = useState<number>(0);
  const variations = getVariations(data?.variations!);
  const variationsExtra = getVariations(data?.variations!);
  const [modaL, setModal] = useState(false);

  const {
    id,
    name,
    slug,
    image,
    description,
    unit,
    categories,
    gallery,
    type,
    options,
    quantity,
    min_price,
    max_price,
    related_products,
  } = data ?? {};
  let itemVariationSelected = null;
  const handleTitleClick = (path: string) => {
    router.push(path);
    closeModal();
  };

  useEffect(() => {
    for (let key in variations) {
      let length = variations[key].length;

      if (length === 1) {
        setAttributes((prev) => ({
          ...prev,
          [key]: variations[key][0].value,
        }));
      }
    }
  }, [data?.variations]);

  useEffect(() => {
    let total = 0;
    for (let prop in extras) {
      total += Number(extras[prop].sync_price);
    }
    setTotalExtras(total);
  }, [extras]);

  useEffect(() => {
    let posy = 0;
    const handler = (e) => {
      let y = e.target.scrollTop;
      if (y < 60) {
        hideModalStickyBar();
      } else if (y > 140) {
        showModalStickyBar();
        posy = y;
      }
    };
    document
      .querySelector("[id^='headlessui-dialog-']")
      ?.addEventListener("scroll", handler);
    return () => {
      document
        .querySelector("[id^='headlessui-dialog-']")
        ?.removeEventListener("scroll", handler);
      hideModalStickyBar();
      posy = 0;
    };
  }, []);

  const toggleExtra = (prop: { id: number }) => {
    // Remove Long Elements

    // delete prop?.pivot;
    // delete prop?.meta;
    // delete prop?.attribute_id;
    // delete prop?.attribute?.created_at;
    // delete prop?.attribute?.updated_at;
    // delete prop?.attribute?.sync_date;
    // delete prop?.attribute?.values;
    // delete prop?.created_at;
    // delete prop?.updated_at;

    let selected = Object.assign({}, extras);
    if (extras[prop.id]) {
      for (let atr in extras) {
        if (extras[atr].id === prop.id) {
          delete selected[atr];
          break;
        }
      }
    } else {
      selected = {
        ...selected,
        [prop.id]: prop,
      };
    }

    data.extras = selected;
    setAttributeExtras(selected);
  };
  const [totalPriceExtra, setPriceExtra] = useState<number>(10);

  const { price, basePrice, discount } = usePrice({
    amount: data?.price!,
    baseAmount: data?.sale_price!,
  });

  //-----------------------

  Object.keys(variations).map(
    (variationName) =>
      variations[variationName][0].attribute?.name == "Extras" &&
      delete variations[variationName]
  );

  Object.keys(variationsExtra).map(
    (extraName) =>
      variationsExtra[extraName][0].attribute?.name != "Extras" &&
      delete variationsExtra[extraName]
  );

  //-----------------------

  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
      Object.keys(variations).every((variation) =>
        attributes.hasOwnProperty(variation)
      )
    : true;

  let selectedVariation = {};
  if (isSelected) {
    selectedVariation = data?.variation_options?.find((o) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort()
      )
    );
  } else {
    // console.log(attributes)
    itemVariationSelected = Object.keys(attributes).map((key) => {
      let v: { sync_price: number; value: string } | undefined = variations[
        key
      ].find((item) => item.value.localeCompare(attributes[key]) === 0);
      return (
        v && {
          sync_price: Number(v?.sync_price),
          value: v?.value,
        }
      );
    });
  }

  const settings = useSettings();

  useEffect(() => {
    let total = 0;
    for (let prop in extras) {
      total = parseFloat(extras[prop].sync_price) + total;
    }
    setPriceExtra(total);
  }, [extras]);

  

  if (loading)
    return (
      <div className="w-96 flex justify-center items-center h-96 bg-white dark:bg-black relative">
        <Spinner />
      </div>
    );
  return (
    <article className="bg-white dark:bg-neutral-900 w-full h-full  dark:border dark:border-neutral-700 relative lg:rounded-lg z-[59] overflow-y-auto">
      <div>
        {modaL &&
            <div style={Cookies.get('alcohol') !== 'true' ? { position: "absolute", top: -20, left: -470, zIndex:999} : {display: 'none'} }>
              
              <SimpleModal />
             
            </div>
        }
      </div>
      {/* Sticky bar  |||   max-w-6xl */}

      <div
        className={cn(
          "h-auto  md:block bg-white dark:bg-neutral-900 fixed top-0 left-1/2 transform mx-auto -translate-x-1/2 z-50 md:px-10 px-4 py-4 dark:border-neutral-700 border-b transition-all duration-300",
          {
            "visible opacity-100 translate-y-0": !displayModalStickyBar,
            "visible opacity-100 translate-y-0 transition-all":
              displayModalStickyBar,
          }
        )}
        //style={{ width: "calc(100% - 40px)" }}
        style={
          { width: "calc(100%)" }
        }
      >





        <div className="flex items-center ">
        
          <div
            className={cn(
              "hidden md:block border border-gray-200 dark:border-neutral-700 border-opacity-70 rounded relative flex items-center justify-center overflow-hidden flex-shrink-0",
              {
                "w-24 h-24": isEmpty(variations),
                "w-16 lg:w-24 h-16 lg:h-24": !isEmpty(variations),
              }
            )}
          >
            <Image
              src={image?.original! ?? "/product-placeholder.svg"}
              alt={name}
              layout="fill"
              objectFit="contain"
              className=""
            />
          </div>

          <div className="md:px-8 px-4 flex flex-col justify-center overflow-hidden">
            <h3
              className="font-semibold text-lg lg:text-xl tracking-tight text-heading dark:text-white truncate cursor-pointer"
              onClick={() => handleTitleClick(`/products/${slug}`)}
              title={name}
            >
              {name}
            </h3>
            {description}
            {unit && isEmpty(variations) ? (
              <span className="text-sm font-normal text-body dark:text-neutral mt-2 block">
                {unit}
              </span>
            ) : (
              <span className="flex items-center mt-0">
                {!isEmpty(variations) && (
                  <VariationPrice
                    selectedVariation={selectedVariation}
                    minPrice={min_price}
                    maxPrice={max_price}
                    items={itemVariationSelected}
                    totalExtras={totalExtras}
                  />
                )}
              </span>
            )}
          </div>

          <div
            className={cn("w-full flex flex-shrink-0", {
              "max-w-max": isEmpty(variations),
              "max-w-[40%]": !isEmpty(variations),
            })}
          >
            {isEmpty(variations) && (
              <span className="mr-2 md:mr-2 flex items-center ">
                <ins className="text-xl lg:text-2xl font-semibold text-primary no-underline">
                  {basePrice ? basePrice : price}
                </ins>
                {discount && (
                  <del className="text-sm lg:text-base font-normal text-gray-400 dark:text-neutral ml-2">
                    {price}
                  </del>
                )}
              </span>
            )}

            <div className="w-full">
              <div
                className={cn("flex flex-col overflow-y-auto hidden", {
                  "h-[140px]": !isEmpty(variations),
                })}
              ></div>

              <div
                className={cn({ "mt-0 pr-5 ": !isEmpty(variations) })}
              >
                 <div
                className=""
              >
              {quantity! > 0 ? (
                  <AddToCart
                    data={data}
                    obs={obs}
                    variant="big"
                    
                    variation={selectedVariation}
                    disabled={selectedVariation?.is_disable || !isSelected}  />
            
                ) : (
                  <div className="bg-red-500 rounded text-sm text-white px-3 py-2">
                    Fora de estoque
                  </div>
                )}  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* End of sticky bar */}
      <Scrollbar
                className="w-full "
                style={{ height:"calc(100vh - 0px)" }}>

      {/* Main content */}

      <div className=" border-gray-200 dark:border-neutral-700 border-opacity-70  md:pt-5 mt-5 md:mt-10 product-card cart-type-neon">
        {/* <div className="lg:w-1/2 p-6 pt-8 lg:p-12 2xl:p-16 lg:border-r lg:border-gray-200 dark:border-neutral-700 lg:border-opacity-60"> */}

       
        {/* End of product image / gallery */}

        <div className="w-full md:pt-5 px-0 md:px-10">
          <div className="flex flex-col  overflow-hidden">
            <div className="w-full">
              <div className="px-3">
                {/* <h1
                  className="font-bold mb-1 mt-3 text-2xl md:text-xl xl:text-2xl tracking-tight text-heading dark:text-white absolute-capitalize"
                  title={name}
                >
                  {name}
                </h1>

                <div className="mb-2 md:mb-2 flex items-center">
                  {data?.price == 0 ? (
                    <ins className="text-2lg md:text-3lg text-primary no-underline">
                      <i>Sob Orçamento</i>
                    </ins>
                  ) : !isEmpty(variations) ? (
                    <VariationPrice
                      selectedVariation={selectedVariation}
                      minPrice={min_price}
                      maxPrice={max_price}
                      items={itemVariationSelected}
                      totalExtras={totalExtras}
                    />
                  ) : (
                    <span className="flex items-center">
                      <ins className="text-2xl md:text-3xl font-semibold text-primary no-underline">
                        {basePrice ? basePrice : price}
                      </ins>

                      {discount && (
                        <del className="text-sm md:text-base  text-gray-400 dark:text-neutral ml-2">
                          {price}
                        </del>
                      )}
                    </span>
                  )}
                </div> 
*/}
     <h1 className="mt-5">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
     &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
   </h1>
                {unit && isEmpty(variations) && (
                  <span className="text-sm font-normal text-body dark:text-neutral mt-2 md:mt-3 block hidden">
                    {unit}
                  </span>
                )}


              </div>

        
              <div>
                <ProductAttributes
                  product={slug}
                  variations={variations}
                  extras={variationsExtra}
                  selectedExtras={extras}
                  attributes={attributes}
                  setAttributes={setAttributes}
                  toggleExtra={toggleExtra}
                  activeExtra={selectedVariation?.is_disable || !isSelected}
                />

                <div className="px-3 pt-2">
                  {(!settings?.site?.obs || settings?.site?.obs == "block") && (
                    <Input
                      name="obs"
                      value={obs}
                      maxLength={25}
                      onInput={(e) => setObs(e.target.value)}
                      label="OBSERVAÇÕES"
                      variant="outline"
                      placeholder="Obs: Ex: sem alho, mal passado..."
                      className="w-full col-span-4 mt-3"
                    />
                  )}
                </div>
                <div className="mt-4 md:mt-6 flex flex-col lg:flex-row items-center">
                  {data?.price == 0 ? (
                    <a
                      href="/contact"
                      className="bg-primary w-full rounded text-center text-white px-2 py-4 "
                    >
                      Contacte-nos →
                    </a>
                  ) : (
                    <>
                      <div className="mb-3 lg:mb-0 w-full">
                        {/* <AddToCart
                          data={data}
                          obs={obs}
                          variant="big"
                          variation={selectedVariation}
                          disabled={
                            selectedVariation?.is_disable || !isSelected
                          } 
                        />*/}
                      </div>
                      {/* {settings?.site?.stock == "on" ? (
                        <>
                          {quantity! > 0 ? (
                            <>
                              {isEmpty(variations) && (
                                <span className="text-base text-body dark:text-neutral whitespace-nowrap ml-7">
                                  {quantity} disponíveis
                                </span>
                              )}
                              {!isEmpty(selectedVariation) && (
                                <span className="text-base text-body dark:text-neutral whitespace-nowrap ml-7">
                                  {selectedVariation?.is_disable ||
                                  selectedVariation.quantity === 0
                                    ? "Esgotado"
                                    : `${selectedVariation.quantity} disponíveis`}
                                </span>
                              )}
                            </>
                          ) : (
                            <div className="text-base text-red-500 whitespace-nowrap ml-7">
                              Esgotado
                            </div>
                          )}
                        </>
                      ) : (
                        ""
                      )} */}
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="px-2 mb-4">
              {!!categories?.length && (
                <ProductCategories
                  categories={categories}
                  basePath={`/${type?.slug}`}
                  onClose={closeModal}
                />
              )}
            </div> */}
          </div>
        </div>
      </div>
      {related_products?.length! > 1 && (
        <div className="py-8 md:px-10">
        <div className="px-4">
          <RelatedProducts products={related_products} currentProductId={id} />
        </div>
        </div>
      )}
</Scrollbar>
    </article>
  );
};

export default ProductDetailsModalView;
