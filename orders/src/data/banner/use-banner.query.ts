import Banner from "@repositories/banner";
import { useQuery } from "react-query";
import { Banner as TBanner } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchBanner = async (slug: string) => {
  const { data } = await Banner.find(`${API_ENDPOINTS.BANNERS}/${slug}`);
  return data;
};

export const useBannerQuery = (slug: string) => {
  return useQuery<TBanner, Error>([API_ENDPOINTS.BANNERS, slug], () =>
    fetchBanner(slug)
  );
};
