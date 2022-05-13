import { QueryParamsType, QueryOptionsType } from "@ts-types/custom.types";
import { stringifySearchQuery } from "@utils/data-mappers";
import { useQuery } from "react-query";
import AttributeValue from "@repositories/attribute-value";
import { API_ENDPOINTS } from "@utils/api/endpoints";

const fetchAttributeValues = async ({ queryKey }: QueryParamsType) => {
  const [_key, params] = queryKey;
  const {
    text,
    orderBy = "updated_at",
    sortedBy = "DESC",
  } = params as QueryOptionsType;
  const searchString = stringifySearchQuery({
    name: text,
  });
  const url = `${API_ENDPOINTS.ATTRIBUTE_SYNC}?search=${searchString}&orderBy=${orderBy}&sortedBy=${sortedBy}`;
  const { data } = await AttributeValue.all(url);
  return { attributeValues: data };
};

const useAttributeSyncsQuery = (options: QueryOptionsType = {}) => {
  return useQuery<any, Error>(
    [API_ENDPOINTS.ATTRIBUTE_SYNC, options],
    fetchAttributeValues,
    {
      keepPreviousData: true,
    }
  );
};

export { useAttributeSyncsQuery, fetchAttributeValues };