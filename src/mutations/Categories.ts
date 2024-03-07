import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import axios from '@services/axios';
import { Category } from '@models';
import { QUERY_KEYS } from '@queries/Categories';

export const MUTATION_KEYS = {
  DELETE_ENTRY: 'delete-category',
  ADD_ENTRY: 'add-category',
};

export const useDeleteCategory = (id: number): UseMutationResult<number, Error> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_ENTRY],
    mutationFn: async function deleteSingleCategory() {
      const response = await axios.delete(`/category/${id}`);
      return response.status;
    },
    onSuccess() {
      queryClient.invalidateQueries([QUERY_KEYS.ALL_CATEGORIES]);
    },
  });
};

export const useAddCategory = (
  category: Omit<Category, 'id'>,
): UseMutationResult<number, Error> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATION_KEYS.ADD_ENTRY],
    mutationFn: async function addCategory() {
      const response = await axios.post(`/category/`, category);
      return response.data;
    },
    onSuccess() {
      queryClient.invalidateQueries([QUERY_KEYS.ALL_CATEGORIES]);
    },
  });
};
