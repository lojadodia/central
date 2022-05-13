import Courier from "@repositories/courier";
import { useQuery } from "react-query";
import { Courier as TCourier } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchCourier = async (slug: string) => {
  const { data } = await Courier.find(`${API_ENDPOINTS.COURIERS}/${slug}`);
  return data;
};

export const useCourierQuery = (slug: string) => {
  return useQuery<TCourier, Error>([API_ENDPOINTS.COURIERS, slug], () =>
    fetchCourier(slug)
  );
};
