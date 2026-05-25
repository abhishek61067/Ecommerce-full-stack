import { AxiosInstance } from "../AxiosInstance";
import { useQuery } from "@tanstack/react-query";


export const useGetProductList = (
    search="",
    sortBy = 'title',
    order = 'asc',
    limit = 100,
    page = 1
) => {
  return useQuery({
    queryKey: ["products", search, sortBy, order, limit, page],
    queryFn: async () => {
      const response = await AxiosInstance.get(`/products/search?q=${search}&sortBy=${sortBy}&order=${order}&limit=${limit}&page=${page}`);
      return response.data;
    },
  });
};

export const useGetProductDetail = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await AxiosInstance.get(`/products/${id}`);
      return response.data;
    },
  });
}