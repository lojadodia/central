import Layout from "@components/common/layout";
import { useRouter } from "next/router";

import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useInvoiceQuery } from "@data/invoice/use-invoice.query";

function nl2br (str: any, is_xhtml : any) {
  if (typeof str === 'undefined' || str === null) {
      return '';
  }
  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

export default function UpdateInvoicePage() {
  const { query } = useRouter();
  const { data, isLoading: loading, error } = useInvoiceQuery(query.id as string);
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading">
       Detalhes #{data?.code}
        </h1>
      </div>
      <br />

          <img width="190px" src="https://d14qe4hzs125ux.cloudfront.net/wp-content/uploads/2018/09/multibanco.png" alt="" />
          <br /> 
          <div dangerouslySetInnerHTML={{__html: nl2br(data?.content,true)}} />


   
     
    
    </>
  );
}
UpdateInvoicePage.Layout = Layout;
