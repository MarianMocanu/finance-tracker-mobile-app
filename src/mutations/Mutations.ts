import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import axios from '@services/axios';
import { Entry } from '@models';
import { QUERY_KEYS } from '@queries/Entries';

export const MUTATION_KEYS = {
  DELETE_ENTRY: 'delete-entry',
};

export const useDeleteEntry = (id: number): UseMutationResult<number, Error> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_ENTRY],
    mutationFn: async function deleteSingleEntry() {
      const data = await axios.delete(`/entry/${id}`);
      return data.status;
    },
    onSuccess() {
      queryClient.invalidateQueries([QUERY_KEYS.ALL_ENTRIES]);
    },
  });
};
