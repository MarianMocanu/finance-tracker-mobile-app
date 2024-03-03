import { UseQueryResult, useQuery } from 'react-query';
import axios from '@services/axios';
import { Entry } from '@models';

export const QUERY_KEYS = {
  ALL_ENTRIES: 'all-entries',
};

export const useEntries = (): UseQueryResult<Entry[], Error> => {
  return useQuery({
    queryKey: [QUERY_KEYS.ALL_ENTRIES],
    queryFn: async function fetchAllEntries() {
      const data = (await axios.get('/entry')).data;
      return data as Entry[];
    },
  });
};
