import Image from "next/image";
import BackButton from "@components/ui/back-button";
import { AddToCart } from "@components/product/add-to-cart/add-to-cart";
import usePrice from "@utils/use-price";
import { ThumbsCarousel } from "@components/ui/carousel";
import { getVariations } from "@utils/get-variations";
import { useState } from "react";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import Truncate from "@components/ui/truncate-scroll";
import { scroller, Element } from "react-scroll";
import ProductCategories from "./product-details/product-categories";
import VariationPrice from "./product-details/product-variant-price";
import ProductAttributes from "./product-details/product-attributes";

type Props = {
  product: any;
  variant?: "defaultView" | "modalView";
};

const ProductDetails: React.FC<Props> = ({ product }) => {
  const {
    name,
    image, //could only had image we need to think it also
    description,
    unit,
    categories,
    gallery,
    type,
    quantity,
  } = product ?? {};

  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const { price, basePrice, discount } = usePrice({
    amount: product?.price,
    baseAmount: product?.sale_price,
  });

  const variations = getVariations(product?.variations);

  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
      Object.keys(variations).every((variation) =>
        attributes.hasOwnProperty(variation)
      )
    : true;

  let selectedVariation = {};
  if (isSelected) {
    selectedVariation = product?.variation_options?.find((o: any) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort()
      )
    );
  }

  const scrollDetails = () => {
    scroller.scrollTo("details", {
      smooth: true,
      offset: -80,
    });
  };

  /**
   *
   * {size: "Large", color: "Black", weight: "1kg"}
   */
  return (
    <article className="rounded-lg bg-white">
      <div className="flex flex-col md:flex-row border-b border-gray-200 border-opacity-70">
        <div className="md:w-1/2 p-6 pt-8 lg:p-14 xl:p-16">
          <div className="flex items-center justify-between mb-8 lg:mb-10">
            <BackButton />
            {discount && (
              <div className="rounded-full text-xs leading-6 font-semibold px-3 bg-yellow-500 text-white">
                {discount}
              </div>
            )}
          </div>

          <div className="product-gallery h-full">
            {!!gallery?.length ? (
              <ThumbsCarousel gallery={gallery} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src={image?.original ?? "/product-placeholder.svg"}
                  alt={name}
                  width={450}
                  height={450}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start md:w-1/2 p-5 lg:p-14 xl:p-16">
          <div className="w-full">
            <h1 className="font-semibold text-lg md:text-xl xl:text-2xl tracking-tight text-heading">
              {name}
            </h1>

            {unit && isEmpty(variations) && (
              <span className="text-sm font-normal text-body mt-2 md:mt-3 block">
                {unit}
              </span>
            )}

            {description && (
              <div className="mt-3 md:mt-4 text-body text-sm leading-7">
                <Truncate character={450} onClick={scrollDetails}>
                  {description}
                </Truncate>
              </div>
            )}

            <div className="my-5 md:my-10 flex items-center">
              {!isEmpty(variations) ? (
                <VariationPrice
                  selectedVariation={selectedVariation}
                  minPrice={product.min_price}
                  maxPrice={product.max_price}
                />
              ) : (
                <span className="flex items-center">
                  <ins className="text-2xl md:text-3xl font-semibold text-primary no-underline">
                    {basePrice ? basePrice : price}
                  </ins>
                  {discount && (
                    <del className="text-sm md:text-base font-normal text-gray-400 ml-2">
                      {price}
                    </del>
                  )}
                </span>
              )}
            </div>
            {/* end of del price markup  */}

            <div>
              <ProductAttributes
                variations={variations}
                attributes={attributes}
                setAttributes={setAttributes}
              />
            </div>

            <div className="mt-4 md:mt-6 flex flex-col lg:flex-row items-center">
              <div className="mb-3 lg:mb-0 w-full lg:max-w-[400px]">
                <AddToCart
                  data={product}
                  variant="big"
                  variation={selectedVariation}
                  disabled={selectedVariation?.is_disable || !isSelected}
                />
              </div>

              {quantity > 0 ? (
                <>
                  {isEmpty(variations) && (
                    <span className="text-base text-body whitespace-nowrap lg:ml-7">
                      {quantity} disponíveis
                    </span>
                  )}
                  {!isEmpty(selectedVariation) && (
                    <span className="text-base text-body whitespace-nowrap lg:ml-7">
                      {selectedVariation?.is_disable ||
                      selectedVariation.quantity === 0
                        ? "Esgotado"
                        : `${selectedVariation.quantity} disponíveis`}
                    </span>
                  )}
                </>
              ) : (
                <div className="text-base text-red-500 whitespace-nowrap lg:ml-7">
                 Esgotado
                </div>
              )}
            </div>
          </div>

          {!!categories?.length && (
            <ProductCategories
              categories={categories}
              basePath={`/${type?.slug}`}
            />
          )}
        </div>
      </div>

      <Element
        name="details"
        className="py-4 px-5 lg:px-16 lg:py-14 border-b border-gray-200 border-opacity-70"
      >
        <h2 className="text-lg text-heading tracking-tight font-semibold mb-4 md:mb-6">
          Detalhes
        </h2>

        <p className="text-sm text-body">{description}</p>
      </Element>
    </article>
  );
};

export default ProductDetails;
