import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import axios from '@services/axios';
import { Entry } from '@models';
import { USER_KEYS } from '@queries/Users';
export const MUTATION_KEYS = {
  DELETE_USER: 'delete-user',
};

export const useDeleteUser = (id: number): UseMutationResult<number, Error> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_USER],
    mutationFn: async function deleteSingleUser() {
      const response = await axios.delete(`/user/${id}`);
      return response.status;
    },
    onSuccess() {
      queryClient.invalidateQueries([USER_KEYS.ALL_USERS]);
    },
  });
};
