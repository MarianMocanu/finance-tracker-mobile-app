import { QueryClient, QueryClientProvider } from 'react-query';
import { Main } from 'src/Main';
import { store } from 'src/app/store';
import { Provider as ReduxProvider } from 'react-redux';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <Main />
      </ReduxProvider>
    </QueryClientProvider>
  );
}
