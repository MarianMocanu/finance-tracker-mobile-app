import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import axios from '@services/axios';
import { Entry } from '@models';
import { QUERY_KEYS } from '@queries/Entries';

export const MUTATION_KEYS = {
  DELETE_ENTRY: 'delete-entry',
  ADD_ENTRY: 'add-entry',
};

export const useDeleteEntry = (id: number): UseMutationResult<number, Error> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_ENTRY],
    mutationFn: async function deleteSingleEntry() {
      const response = await axios.delete(`/entry/${id}`);
      return response.status;
    },
    onSuccess() {
      queryClient.invalidateQueries([QUERY_KEYS.ALL_ENTRIES]);
    },
  });
};

export const useAddEntry = (entry: Omit<Entry, 'id'>): UseMutationResult<number, Error> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATION_KEYS.ADD_ENTRY],
    mutationFn: async function addEntry() {
      const response = await axios.post(`/entry/`, entry);
      return response.data;
    },
    onSuccess() {
      queryClient.invalidateQueries([QUERY_KEYS.ALL_ENTRIES]);
    },
  });
};
