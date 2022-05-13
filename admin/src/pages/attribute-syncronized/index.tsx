import Card from "@components/common/card";
import Layout from "@components/common/layout";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import AttributeValuesList from "@components/attribute-values/attribute-values-list";
import Toggle from 'react-toggle'
import http from '@utils/api/http'
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useAttributeSyncsQuery } from "@data/attribute-value/use-attribute-syncronized.query";


let columns: any = [];
  columns.push({
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 60,
  })
  columns.push({
    title: "Nome",
    dataIndex: "value",
    key: "value",
    align: "left",
    render: (value: string) => (
      <span className="whitespace-nowrap">{value}</span>
    ),
  })
  columns.push({
    title: "Ações",
    dataIndex: "available",
    key: "actions",
    align: "right",
    render: (available: string, attr: { sync_product: string }) => {
      let status:any = !!parseInt(available)
  
      return <Toggle
      value={status}
      id='available'
      defaultChecked={status}
      onChange={(e:any) => {
        http.post(API_ENDPOINTS.AVAILABILITY_UPDATE, {
          type: 'attributes',
          id: attr.sync_product,
          status: !status
        }).then(({ data }) => {
          status = data.status
         
        })
      }}
      />
    }
    ,
  })
export default function AttributePage() {
  const { data, isLoading: loading, error } = useAttributeSyncsQuery();
  if (loading) return <Loader />;

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <Card className="flex flex-row items-center justify-between mb-8">
        <div className="md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">
          Composições dos Menús
          </h1>
        </div>

        
      </Card>
      
      <AttributeValuesList attributeColumns={columns} attributeValues={data?.attributeValues!} />
    </>
  );
}

AttributePage.Layout = Layout;
