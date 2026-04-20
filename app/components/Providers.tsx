'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { VendorProvider } from '@/context/VendorContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { CartItemProvider } from '@/context/CartItemContext';
import { UserProvider } from '@/context/UserContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <VendorProvider>
          <ProductsProvider>
            <CartItemProvider>
              {children}
            </CartItemProvider>
          </ProductsProvider>
        </VendorProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
