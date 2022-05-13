import { QueryKey } from "react-query";
import { OrderField } from ".";
import { SortOrder } from "./generated";

export type CategoriesQueryOptionsType = {
  type?: string;
  text?: string;
  page?: number;
  parent?: number | null;
  limit?: number;
  orderBy?: OrderField;
  sortedBy?: SortOrder;
};
export type ProductsQueryOptionsType = {
  page?: number;
  text?: string;
  type?: string;
  category?: string;
  status?: string;
  limit?: number;
  orderBy?: OrderField;
  sortedBy?: SortOrder;
};
export type FaqsQueryOptionsType = {
  page?: number;
  text?: string;
  title?: string;
  description?: string;
  status?: string;
  limit?: number;
  orderBy?: OrderField;
  sortedBy?: SortOrder;
};
export type BannersQueryOptionsType = {
  page?: number;
  text?: string;
  link?: string;
  image?: string;
  status?: string;
  limit?: number;
  orderBy?: OrderField;
  sortedBy?: SortOrder;
};
export type TypesQueryOptionsType = {
  page?: number;
  text?: string;
  limit?: number;
  orderBy?: OrderField;
  sortedBy?: SortOrder;
};

export type QueryOptionsType = {
  page?: number;
  text?: string;
  limit?: number;
  orderBy?: OrderField;
  sortedBy?: SortOrder;
};

export type QueryParamsType = {
  queryKey: QueryKey;
  pageParam?: string;
};
