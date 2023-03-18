import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { Toaster } from 'react-hot-toast';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme/index';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import {QueryClient, QueryClientProvider} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// ----------------------------------------------------------------------

export default function App() {
  const queryClient = new QueryClient();

  return (
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider>
            <ScrollToTop />
            <StyledChart />
            <Toaster />
            <Router />
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
      </QueryClientProvider> 
  );
}
