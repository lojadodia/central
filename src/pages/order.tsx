import Link from "@components/ui/link";
import PaymentForm from "@components/checkout/payment-form";
import Layout from "@components/layout/layout";
import OrderInformation from "@components/order/order-information";
import EmptyCartIcon from "@components/icons/empty-cart";
import { parseContextCookie } from "@utils/parse-cookie";
import { GetServerSideProps } from "next";
import { ROUTES } from "@utils/routes";
import { useCart } from "@contexts/quick-cart/cart.context";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const cookies = parseContextCookie(context?.req?.headers?.cookie);
  if (!cookies?.auth_token) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return {
    props: {},
  };
};

const OrderPage = () => {
  const { isEmpty } = useCart();
  if (isEmpty) {
    return (
      <div
        className="flex flex-col items-center justify-center mb-4"
        style={{ height: "calc(100vh - 85px)" }}
      >
        <EmptyCartIcon width={180} height={236} />
        <h4 className="my-4 text-lg text-heading">
        Seu carrinho está vazio. Vamos para {" "}
          <Link
            href={ROUTES.HOME}
            className="text-primary font-semibold hover:text-primary-2"
          >
            Inicio
          </Link>
        </h4>
      </div>
    );
  }
  return (
    <PaymentForm />
  );
};

OrderPage.Layout = Layout;

export default OrderPage;
