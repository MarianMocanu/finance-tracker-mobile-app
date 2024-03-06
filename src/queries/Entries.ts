import { UseQueryResult, useQuery } from 'react-query';
import axios from '@services/axios';
import { Entry } from '@models';

export const QUERY_KEYS = {
  ALL_ENTRIES: 'all-entries',
  SINGLE_ENTRY: 'single-entry',
  ENTRIES_FOR_CATEGORY: 'entries-for-category',
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

export const useEntriesForCategory = (id: number): UseQueryResult<Entry[], Error> => {
  return useQuery({
    queryKey: [QUERY_KEYS.ENTRIES_FOR_CATEGORY],
    queryFn: async function fetchAllEntries() {
      const data = (await axios.get(`/entry/category/${id}`)).data;
      return data as Entry[];
    },
  });
};

export const useEntry = (id: number): UseQueryResult<Entry, Error> => {
  return useQuery({
    queryKey: [QUERY_KEYS.SINGLE_ENTRY],
    queryFn: async function fetchSingleEntry() {
      const data = (await axios.get(`/entry/${id}`)).data;
      return data as Entry;
    },
  });
};
