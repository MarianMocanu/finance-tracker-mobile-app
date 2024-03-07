import { UseQueryResult, useQuery } from 'react-query';
import axios from '@services/axios';
import { Category } from '@models';

export const QUERY_KEYS = {
  ALL_CATEGORIES: 'all-categories',
  SINGLE_CATEGORY: 'single-category',
};

export const useCategories = (): UseQueryResult<Category[], Error> => {
  return useQuery({
    queryKey: [QUERY_KEYS.ALL_CATEGORIES],
    queryFn: async function fetchAllCategories() {
      const data = (await axios.get('/category')).data;
      return data as Category[];
    },
  });
};

export const useCategory = (id: number): UseQueryResult<Category, Error> => {
  return useQuery({
    queryKey: [QUERY_KEYS.SINGLE_CATEGORY],
    queryFn: async function fetchSingleCategory() {
      const data = (await axios.get(`/category/${id}`)).data;
      return data as Category;
    },
  });
};
