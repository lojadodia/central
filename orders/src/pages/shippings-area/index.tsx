import { DrawingManager, GoogleMap, LoadScript } from '@react-google-maps/api'
import Card from "@components/common/card";
import Layout from "@components/common/layout";
import Search from "@components/common/search";
import ShippingList from "@components/shipping/shipping-list";
import LinkButton from "@components/ui/link-button";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useState, useEffect } from "react";
import { useShippingClassesQuery } from "@data/shipping/use-shippingClasses.query";
import { useSettingsQuery } from "@data/settings/use-settings.query";
import { useUI } from "@contexts/ui.context";
import ActionButtons from "@components/common/action-buttons";
import { ROUTES } from "@utils/routes";
import usePrice from "@utils/use-price";
import { useSettings } from "@contexts/settings.context";
import { Shipping } from "@ts-types/generated";

const containerStyle = {
  width: '100%',
  height: '500px'
};

const columns = [
  {
    title: "Area",
    dataIndex: "name",
    key: "name",
    align: "left",
    width: 40,
  },
  {
    title: "Atribuição",
    dataIndex: "via",
    key: "via",
    align: "center",
    width: 5,
    render: (value: any) => {
      return <span className="whitespace-nowrap capitalize">{value}</span>;
    },
  },

  {
    title: "Valor (m³)",
    dataIndex: "amount",
    key: "amount",
    align: "center",
    width: 5,
    render: (value: any, record: Shipping) => {
      const { price } = usePrice({
        amount: (Number(value)),
      });
      return <span className="whitespace-nowrap">{record?.via == "interno" ? price : "---"}</span>;
    },
  },
  
  /*{
    title: "Global",
    dataIndex: "is_global",
    key: "is_global",
    align: "center",
    render: (value: boolean) => (
      <span className="capitalize">{value.toString()}</span>
    ),
  },*/
  /*{
  {
    title: "Tipo",
    dataIndex: "type",
    key: "type",
    align: "center",
  },
  */
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    align: "center",
    width: 5,
    render: (id: string) => (
      <ActionButtons
        id={id}
        deleteButton={true}
        navigationPath={`${ROUTES.SHIPPINGS}/edit/${id}`}
        modalActionType="DELETE_SHIPPING"
      />
    ),
  },
];

export default function ShippingsAreaPage() {
  const [searchTerm, setSearch] = useState("");
  const { data, isLoading: loading, error } = useShippingClassesQuery({
    text: searchTerm,
  });
  const { data: settings, isLoading: loading2 } = useSettingsQuery();
  const { closeModal, openModal, setModalData, setModalView } = useUI()
  const [center, setCenter] = useState({
    lat: 59.95,
    lng: 30.33
  });

  const [polygons, setPolygons] = useState([])


  useEffect(() => {
    if (!settings) return
    const { address_lat, address_lng, color } = settings?.options.site
    setCenter({ lat: address_lat, lng: address_lng })
  }, [settings?.options])

  useEffect(() => {
    if (data?.shippingClasses) {
      let data_transform = data.shippingClasses.filter((d: any) => d.polygon !== null).map((p: any) => p.polygon).map((json) => JSON.parse(json))
      if (data_transform) {
        setPolygons(data_transform)
      }
    }
  }, [data])

  function handleSearch({ searchText }: { searchText: string }) {
    setSearch(searchText);
  }


  function onLoadDrawingManager(dm: any) {
    const { map } = dm
    dm.setMap(map)
    polygons.forEach(poly => {

      const polyline = new google.maps.Polygon({
        paths: poly,
        strokeColor: "#000000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: settings?.options.site?.color,
        fillOpacity: 0.35,
      });
      polyline.setMap(map)
    })

    google.maps.event.addListener(dm, "overlaycomplete", function (event: any) {
      overlayClickListener(event.overlay, google.maps);
    });
  }

  function overlayClickListener(overlay: any, maps: any) {
    let path = overlay.getPath()

    setModalView("ADD_AREA")
    setModalData(path.getArray())
    return openModal()

  }

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <Card className="flex flex-col md:flex-row items-center mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-xl font-semibold text-heading dark:text-white">Areas de Entregas</h1>
        </div>
      </Card>
      <div className='flex flex-row'>

        <LoadScript
          googleMapsApiKey='AIzaSyDLxesZSWwDMbCq7KVWSwQkSmATfWDkyJw'
          libraries={["drawing"]}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={6}
          >
            <DrawingManager
              options={{
                drawingMode: "polygon"
              }}
              onLoad={onLoadDrawingManager}
            >

            </DrawingManager>

          </GoogleMap>
        </LoadScript>


          <ShippingList shippings={data?.shippingClasses} columnHeaders={columns} />


      </div>
    </>
  );
}
ShippingsAreaPage.Layout = Layout;
