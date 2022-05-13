import Modal from "@components/ui/modal";
import { useUI } from "@contexts/ui.context";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import dynamic from "next/dynamic";
const TaxDeleteView = dynamic(() => import("@components/tax/tax-delete-view"));
const BanCustomerView = dynamic(
  () => import("@components/customer/customer-ban-view")
);
const ShippingDeleteView = dynamic(
  () => import("@components/shipping/shipping-delete-view")
);
const AttributeDeleteView = dynamic(
  () => import("@components/attribute/attribute-delete-view")
);
const AttributeValueDeleteView = dynamic(
  () => import("@components/attribute-values/attribute-values-delete-view")
);
const CategoryDeleteView = dynamic(
  () => import("@components/category/category-delete-view")
);
const CouponDeleteView = dynamic(
  () => import("@components/coupon/coupon-delete-view")
);

const ProductDeleteView = dynamic(
  () => import("@components/product/product-delete-view")
);
const TypeDeleteView = dynamic(
  () => import("@components/type/type-delete-view")
);

const FaqDeleteView = dynamic(
  () => import("@components/faq/faq-delete-view")
);

const BannerDeleteView = dynamic(
  () => import("@components/banner/banner-delete-view")
);

const CourierDeleteView = dynamic(
  () => import("@components/courier/courier-delete-view")
);

const CallGlovoView = dynamic(
  () => import("@components/order/call-glovo-view")
);
const AddAreaView = dynamic(
  () => import("@components/shipping/add-area-view")
);
const CancelOrderView = dynamic(
  () => import("@components/order/cancel-order-view")
);


const CallCourierView = dynamic(
  () => import("@components/order/call-courier-view")
);
const Layout: React.FC = ({ children }) => {
  const { displayModal, closeModal, modalView } = useUI();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col transition-colors duration-150">
      <Navbar />
      <div className="flex flex-1 pt-10 mt-4">
        <Sidebar />
        <main className="w-full lg:pl-72 xl:pl-76">
          <div className="p-5 md:p-8 overflow-y-auto h-full">{children}</div>
        </main>
      </div>
      {/* render modal */}
      <Modal
        open={displayModal}
        onClose={closeModal}
        containerClassName="max-w-xs"
        // useBlurBackdrop={true}
      >
        {modalView === "DELETE_PRODUCT" && <ProductDeleteView />}
        {modalView === "DELETE_TYPE" && <TypeDeleteView />}
        {modalView === "DELETE_FAQ" && <FaqDeleteView />}
        {modalView === "DELETE_BANNER" && <BannerDeleteView />}
        {modalView === "DELETE_CATEGORY" && <CategoryDeleteView />}
        {modalView === "DELETE_ATTRIBUTE" && <AttributeDeleteView />}
        {modalView === "DELETE_ATTRIBUTE_VALUE" && <AttributeValueDeleteView />}
        {modalView === "DELETE_COUPON" && <CouponDeleteView />}
        {modalView === "DELETE_TAX" && <TaxDeleteView />}
        {modalView === "DELETE_SHIPPING" && <ShippingDeleteView />}
        {modalView === "DELETE_COURIER" && <CourierDeleteView />}
        {modalView === "BAN_CUSTOMER" && <BanCustomerView />}
        {modalView === "CALL_GLOVO" && <CallGlovoView />}
        {modalView === "ADD_AREA" && <AddAreaView />}
        {modalView === "CALL_COURIER" && <CallCourierView />}
        {modalView === "CANCEL_ORDER" && <CancelOrderView />}
      </Modal>
    </div>
  );
};
export default Layout;
