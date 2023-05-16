import { isNumber } from "lodash";
import isEmpty from "lodash/isEmpty";
interface AttributeExtra {
  id: string | number;
  sync_id: string | number;
  name: string;
}
interface Extra {
  id: string | number;
  name: string;
  price: string;
  attribute: AttributeExtra;
  sync_id: string;
  sync_price: string;
  sync_tax_rate: string;
  value: string;
  is_extra: boolean;
}
interface Item {
  id?: string | number;
  name: string;
  slug: string;
  unit: string;
  image: {
    thumbnail: string;
    [key: string]: unknown;
  };
  custom_variation: any[];
  price: number;
  sale_price?: number;
  quantity?: number;
  extras: Extra[];
  obs: string | null;
  //[key: string]: unknown;
}
interface Variation {
  id: string | number;
  title: string;
  price: number;
  sale_price?: number;
  quantity: number;
  [key: string]: unknown;
}

export function generateCartItem(item: Item, variation: Variation) {
  const {
    id,
    name,
    slug,
    image,
    price,
    sale_price,
    quantity,
    unit,
    extras,
    custom_variation,
    obs = "",
  } = item;

  let totalExtras = 0;
  let options_variation: Extra[] = [];
  let customId: string = "";
  let total_price = 0;

  if (custom_variation) {
    variation &&
      Object.keys(variation).forEach((key) => {
        let products: any[] = variation[key];

        if (!Array.isArray(products)) {
          customId = `.${products.id.toString()}`;

          options_variation.push({
            menuId: id,
            group_id: custom_variation[key].id,
            group_name: custom_variation[key].name,
            group_is_extra: custom_variation[key].is_extra,
            id: products.id,
            name: products.name,
            price: products.price,
          });

          total_price = products.price;

          return;
        }

        if (products.length) {
          customId += `-${key}`;
        }
        products.forEach((item) => {
          customId += `.${item.id.toString()}`;
        });

        // codigo em analise, calcular o preço total
        total_price += products.reduce(
          (first, second) => first + Number(second.price),
          0
        );

        products
          .map((product: Extra) => ({
            menuId: id,
            group_id: custom_variation[key].id,
            group_name: custom_variation[key].name,
            group_is_extra: custom_variation[key].is_extra,
            id: product.id,
            name: product.name,
            price: product.price,
          }))
          .forEach((item: any) => {
            options_variation.push({ ...item });
          });

        if (!custom_variation[key].is_extra) return;
        totalExtras += products.reduce(
          (acc, product) => Number(product.price) + Number(acc),
          0
        );
      });
  }

  if (!isEmpty(variation)) {
    return {
      id: `${id}${customId}`,
      productId: id,
      name: `${name}`,
      slug,
      extras: options_variation,
      obs,
      unit,
      stock: variation.quantity,
      price_extra: totalExtras,
      price: Number(item.price),
      price_total: Number(item.price) + Number(total_price),
      image: image?.thumbnail,
      variationId: variation.id,
    };
  }

  return {
    id: `${id}`,
    productId: id,
    name,
    slug,
    unit,
    extras: options_variation,
    obs,
    image: image?.thumbnail,
    stock: quantity,
    price: Number(price) + total_price,
    price_total: Number(price) + Number(total_price),
  };
}
