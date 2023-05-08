import dynamic from "next/dynamic";

const Neon = dynamic(() => import("@components/product/product-card/neon")); // grocery-two

export default function renderProductCard(product: any, className = "") {
  if (product?.product_type == "simple" && product.price === 0) return null;
  
  return <Neon product={product} className={className} />;

}
