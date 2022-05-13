import Layout from "@components/common/layout";
import SettingsForm from "@components/settings/settings-form";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useSettingsQuery } from "@data/settings/use-settings.query";
import { useShippingClassesQuery } from "@data/shipping/use-shippingClasses.query";
import { useTaxesQuery } from "@data/tax/use-taxes.query";
import LinkButton from "@components/ui/link-button";

export default function Settings() {
  const { data: taxData, isLoading: taxLoading } = useTaxesQuery();
  const {
    data: ShippingData,
    isLoading: shippingLoading,
  } = useShippingClassesQuery();

  const { data, isLoading: loading, error } = useSettingsQuery();

  if (loading || shippingLoading || taxLoading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <div className="md:w-1/4">
          <h1 className="text-lg font-semibold text-heading">Definições</h1>
        </div>


      </div>
      <SettingsForm
        settings={data?.options}
        taxClasses={taxData?.taxes}
        shippingClasses={ShippingData?.shippingClasses}
      />
    </>
  );
}
Settings.Layout = Layout;
