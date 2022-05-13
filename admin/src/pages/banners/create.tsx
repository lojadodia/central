import Layout from "@components/common/layout";
import CreateOrUpdateBannerForm from "@components/banner/banner-form";

export default function CreateBannerPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading">Criar Nova BANNER</h1>
      </div>
      <CreateOrUpdateBannerForm />
    </>
  );
}
CreateBannerPage.Layout = Layout;
