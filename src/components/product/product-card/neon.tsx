import Image from "next/image";
import cn from "classnames";
import { siteSettings } from "@settings/site.settings";
import usePrice from "@utils/use-price";
import { AddToCart } from "@components/product/add-to-cart/add-to-cart";
import { useUI } from "@contexts/ui.context";
import { useSettings } from "@contexts/settings.context";
import { RiListCheck2 } from "react-icons/ri";
import { formmatPrice } from "@utils/formmat-price";

type NeonProps = {
  product: any;
  className?: string;
};

const Neon: React.FC<NeonProps> = ({ product, className }) => {
  const { name, attributes, custom_variation, image, quantity, product_type, options } = product ?? {};

  let _customVariation

  if (custom_variation){
     _customVariation = JSON.parse(custom_variation);
  } else{
     _customVariation = [];
  }
  
  const { price, basePrice, discount } = usePrice({
    amount: product.price,
    baseAmount: product.sale_price,
  });
  const { price: min_price } = usePrice({
    amount: +product.min_price,
  });
  const { openModal, setModalView, setModalData } = useUI();


  const handleVerifyOptions = () => {
    const checks = [];

    if (typeof _customVariation == "object") return true;
    const notExtras = _customVariation?.filter!((item: {is_extra: boolean}) => !item.is_extra) ?? [];

    if (notExtras?.length === 0) return true

    if (Object.keys(attributes).length === 0) return false;

    Object.values(attributes).forEach((item) =>
      item.forEach((subitem) => {
        subitem.selected ? checks.push("ok") : null;
      })
    );

    if (checks.length === notExtras.length) {
      return true;
    }

    return false;
  };


  function handleProductQuickView() {
    const url: URL = new URL(window.location);
    url.pathname = `/a/${product.slug}`;
    window.history.pushState({}, product.slug, url);
    setModalData(product.slug);
    setModalView("PRODUCT_DETAILS");
    return openModal();
  }
  const settings = useSettings();

  return (
    <article
      className={cn(
        "product-card cart-type-neon rounded h-full bg-white dark:bg-neutral-900 border dark:border-neutral-700 overflow-hidden shadow-sm transition-all duration-200 hover:shadow transform hover:-translate-y-0.5",
        className
      )}
    >
      <div
        className="relative flex items-center justify-center cursor-pointer w-auto h-32"
        onClick={handleProductQuickView}
      >
        <Image
          src={image?.original ?? "/dark/product-placeholder.svg"}
          alt={name}
          layout="fill"
          objectFit="contain"
          className="product-image"
        />
        {discount && (
          <div className="absolute top-3 right-3 md:top-4 md:right-4 rounded text-xs leading-6 font-semibold px-1.5 sm:px-2 md:px-2.5 bg-primary text-white">
            {discount}
          </div>
        )}
      </div>
      {/* End of product image */}

      <header className="p-3">
        <h3
          className=" md:text-sm text-heading font-semibold dark:text-white   mb-2 cursor-pointer uppercase"
          onClick={handleProductQuickView}
        >
          {name}
        </h3>
        <div className="flex items-center mb-2">
          <span className=" md:text-base text-heading dark:text-white ">
            {product_type == "simple" ? (
              basePrice ? (
                basePrice
              ) : (
                price
              )
            ) : (
             <>
             {product?.menu_price ? (
                  <>
                    {!product?.max_price && (  <span className="text-primary text-xs menu-choose-price-span"><sup>DESDE</sup></span>)} {formmatPrice(product?.menu_price)}
                  </>
                  ): (
                    <>
                    <span className="text-primary text-xs menu-choose-price-span">

                    {" "}
                      <RiListCheck2
                        style={{ display: "inline-block", verticalAlign: "-2px" }}
                      />{" "}
                      Opções de Escolha
                    </span>
                    
                    </>
                )}
                </>
            )}
          </span>
          {discount && (
            <del className="text-xs md:text-sm text-gray-400 dark:text-neutral  ml-2">
              {price}
            </del>
          )}
        </div>
        {/* End of product price */}

        {/* End of product title */}
        {product?.price == 0 ? (
          product?.product_type != "variable" ? (
            <div
              className="bg-primary hidden rounded text-xs text-center text-white px-2 py-1.5 sm:py-2.5"
              onClick={handleProductQuickView}
            >
              Saber mais
            </div>
          ) : (
            <div>
              {/* <AddToCart
                variant="neon"
                data={product}
                isOpen={product_type !== "simple" || options}
               // handleVerifyOptions={handleVerifyOptions}
                handlerModal={handleProductQuickView}
              /> */}
            </div>
          )
        ) : quantity > 0 ? (
          <div>
            <AddToCart
              variant="neon"
              data={product}
              isOpen={product_type !== "simple"}
              handleVerifyOptions={handleVerifyOptions}
              handlerModal={handleProductQuickView}
            />
          </div>
        ) : (
          <div className="bg-red-500 rounded text-xs text-center text-white px-2 py-1.5 sm:py-2.5">
            Fora de estoque
          </div>
        )}



        {/* End of add to cart */}
      </header>
    </article>
  );
};

export default Neon;
