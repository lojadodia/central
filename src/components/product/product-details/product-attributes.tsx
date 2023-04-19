import RadioGroup from "@components/ui/radio-group";
import ExtraGroup from "@components/ui/extra-group";
import { getColor } from "@utils/get-color";
import React, { useState, useEffect, useRef } from "react";

interface Props {
  product: any;
  productName: any;
  variations: any;
  attributes: any;
  extras: any;
  selectedExtras: any;
  activeExtra: boolean;
  baseLimitExtra?: number;
  setAttributes: (key: any) => void;
  toggleExtra: (key: any) => void;
  handlerModal?: () => void
}

// Product

const ProductAttributes = ({
  productName,
  product,
  variations,
  attributes,
  // extras,
  // selectedExtras,
  // activeExtra,
  // baseLimitExtra = 50,
  setAttributes,
}: // toggleExtra,
Props) => {
  // const [limitExtra, setLimitExtra] = useState(baseLimitExtra);
  if (!variations) return null;

  // const refExtras = useRef(null)
  const refBgAttr = useRef(null);
  const [cardapioId, setCardapioId] = useState(0);
  for (let name of Object.keys(variations)) {
    const regEx = /Não/i;
    let items = variations[name];
    const index = items.products?.findIndex((item: { name: string }) =>
      regEx.test(item.name)
    );
    if (index > -1) {
      let deleteElement = variations[name]?.products?.splice(index, 1);
      variations[name]?.products.unshift(deleteElement[0]);
      //break;
    }
  }

  const toggleAttr = (
    obj: { name: string; id: number; price: number },
    is_extra: boolean,
    index: number
  ) => {
    // console.log(obj);
    setAttributes((prev: any) => {
      var prop = { ...prev };

      if (prop[index]) {
        // alterna entre variação que não seja extra
        if (!is_extra) {
          // console.log("caiu aqui no inicio");
          prop[index] = [
            {
              name: obj.name,
              id: obj.id,
              price: obj.price,
              selected: true,
            },
          ];

          return prop;
        }

        let elmIndex = prop[index]?.findIndex((value: { name: string }) => {
          if (!value) return false;

          return value.name == obj.name;
        });

        //toogle itens de variação extra
        if (elmIndex != -1) {
          prop[index].splice(elmIndex, 1);
        } else {
          // console.log("caiu aqui no meio", is_extra);
          if (is_extra) {
            prop[index].push({
              name: obj.name,
              id: obj.id,
              price: obj.price,
              selected: false,
            });
          } else {
            prop[index].push({
              name: obj.name,
              id: obj.id,
              price: obj.price,
              selected: true,
            });
          }
        }
      } else {
        // console.log("caiu aqui no ultimo", is_extra);
        if (is_extra) {
          prop[index] = [
            {
              name: obj.name,
              id: obj.id,
              price: obj.price,
              selected: false,
            },
          ];
        } else {
          prop[index] = [
            {
              name: obj.name,
              id: obj.id,
              price: obj.price,
              selected: true,
            },
          ];
        }
      }

      return prop;
    });

    if (is_extra) return;

    window.location.hash = "#" + product + "-option-" + Number(index + 2);
    if (Object.keys(variations).length - 1 === index) {
      setTimeout(() => {
        window.location.hash = "#" + productName + "-extras";
      }, 5);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      window.location.hash = "#" + product + "-option-1";
    }, 500);
  }, []);

  // useEffect(() => {
  // if (!refExtras.current) return
  // if (!activeExtra) {
  //   window.location.hash ="#extras"
  // }
  // }, [activeExtra, refExtras.current])

  return (
    <>
      {variations.map(
        (
          variation: {
            products: any;
            name: string;
            price: number;
            is_extra: boolean;
          },
          index: number
        ) =>
          variation.products.length !== 1 && (
            <div
              style={{
                opacity: index <= cardapioId ? 1 : 1,
                pointerEvents: index <= cardapioId ? "initial" : "initial",
              }}
              className=" pb-2 flex flex-col relative items-start px-3 first:pt-0"
              key={index}
            >
              <div
                id={`${product}-option-${index + 1}`}
                ref={refBgAttr}
                className="absolute"
                style={{
                  marginTop: "-200px",
                  background: "transparent",
                  width: "1px",
                  height: "1px",
                }}
              ></div>
              {index === cardapioId && (
                <div
                  className="absolute bg-attr top-0 left-0 bg-yellow-400 dark:bg-yellow-300 current-choice-item"
                  style={{
                    width: "100%",
                    height: "100%",
                    zIndex: "-10",
                    opacity: 1,
                  }}
                ></div>
              )}

              <span
                className={`text-md  pt-5 text-heading  leading-none uppercase font-bold mb-3 mr-4 min-w-[60px] inline-block  ${
                  index === cardapioId ? " dark:text-black" : " dark:text-white"
                } `}
              >
                {/* {index + 1}.  */}
                {variation.name}
                &nbsp;
                <span>
                  <sup className="text-body dark:text-neutral"></sup>
                </span>
              </span>

              <div className="w-full flex flex-wrap justify-start">
                {variation.products
                  ?.filter((item: { visible: string }) => item.visible == "1")
                  .map(
                    (
                      item: { id: number; name: string; price: number },
                      index2: number
                    ) => {
                      return !variation.is_extra ? (
                        <RadioGroup
                          // className={variation.name.concat(' ').concat(`${!!parseInt(item.available) ? '' : 'invisible pointer-events-none max-w-0 max-h-0 absolute'}`)}
                          /* color={getColor(
                     item.meta ? item.meta : item?.value
                   )}
                   */
                          key={`${index}.${index2}`}
                          label={item.name}
                          active={
                            !!attributes[index]?.find(
                              (value: { name: string }) => {
                                if (!value) return false;
                                return value.name == item.name;
                              }
                            )
                          }
                          onClick={() => {
                            toggleAttr(item, variation.is_extra, index);
                            setCardapioId(() => index + 1);
                          }}
                        />
                      ) : (
                        // <div className="w-full flex flex-wrap justify-start">
                        <>
                          <ExtraGroup
                            //className={variation.name.concat(' ').concat(`${!!parseInt(attribute.available) ? '' : 'invisible pointer-events-none max-w-0 max-h-0 absolute'}`)}
                            key={`${index}.${index2}`}
                            label={item.name}
                            price={item.price}
                            active={
                              !!attributes[index]?.find(
                                (value: { name: string }) => {
                                  if (!value) return false;
                                  return value.name == item.name;
                                }
                              )
                            }
                            onClick={() =>
                              toggleAttr(item, variation.is_extra, index)
                            }
                          />
                        </>
                      );
                    }
                  )}
              </div>
            </div>
          )
      )}
    </>
  );
};

export default ProductAttributes;
