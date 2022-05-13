import { QueryParamsType, BannersQueryOptionsType } from "@ts-types/custom.types";
import { stringifySearchQuery } from "@utils/data-mappers";
import { useQuery } from "react-query";
import Banner from "@repositories/banner";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { Banner as TTYpe } from "@ts-types/generated";

const fetchBanners = async ({ queryKey }: QueryParamsType) => {
  const [_key, params] = queryKey;
  const {
    text,
    orderBy = "updated_at",
    sortedBy = "DESC",
  } = params as BannersQueryOptionsType;
  const searchString = stringifySearchQuery({
    title: text,
  });
  const url = `${API_ENDPOINTS.BANNERS}?search=${searchString}&orderBy=${orderBy}&sortedBy=${sortedBy}`;
  const { data } = await Banner.all(url);
  return { banners: data as TTYpe[] };
};


type TypeResponse = {
  banners: TTYpe[];
};

const useBannersQuery = (options: BannersQueryOptionsType = {}) => {
  return useQuery<TypeResponse, Error>(
    [API_ENDPOINTS.BANNERS, options],
    fetchBanners,
    {
      keepPreviousData: true,
    }
  );
};

export { useBannersQuery, fetchBanners };
