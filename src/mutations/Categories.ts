import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import axios from '@services/axios';
import { Category } from '@models';
import { QUERY_KEYS } from '@queries/Categories';

export const MUTATION_KEYS = {
  DELETE_CATEGORY: 'delete-category',
  ADD_CATEGORY: 'add-category',
  UPDATE_CATEGORY: 'update-category',
};

export const useDeleteCategory = (id: number): UseMutationResult<number, Error> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_CATEGORY],
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
    mutationKey: [MUTATION_KEYS.ADD_CATEGORY],
    mutationFn: async function addCategory() {
      const response = await axios.post(`/category/`, category);
      return response.data;
    },
    onSuccess() {
      queryClient.invalidateQueries([QUERY_KEYS.ALL_CATEGORIES]);
    },
  });
};

export const useUpdateCategory = (category: Category): UseMutationResult<number, Error> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_CATEGORY],
    mutationFn: async function updateCategory() {
      const response = await axios.patch(`/category/${category.id}`, category);
      return response.status;
    },
    onSuccess() {
      queryClient.invalidateQueries([QUERY_KEYS.ALL_CATEGORIES]);
      queryClient.invalidateQueries([QUERY_KEYS.SINGLE_CATEGORY]);
    },
  });
};
