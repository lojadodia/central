import Layout from "@components/common/layout";
import { useRouter } from "next/router";
import CreateOrUpdateBannerForm from "@components/banner/banner-form";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useBannerQuery } from "@data/banner/use-banner.query";

export default function UpdateBannerPage() {
  const { query } = useRouter();
  const { data, isLoading: loading, error } = useBannerQuery(query?.id as string);
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading">Editar BANNER</h1>
      </div>
      <CreateOrUpdateBannerForm initialValues={data} />
    </>
  );
}
UpdateBannerPage.Layout = Layout;
