"use client"; 
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getProductApi } from '../api-endpoints/products';
import { useQuery } from '@tanstack/react-query';
import { useVendor } from './VendorContext';
interface ProductsContextType {
  products: any[] | null;  // fixed here
  isAuthenticated: boolean;
  isLoading:any
}


const ProductsContext = createContext<any>(undefined);

export function ProductsProvider({ children }: any) {
      const { vendorId } = useVendor();
  const { data, isLoading }: any = useQuery({
    queryKey: ['getProductData', vendorId],
    queryFn: async () => {
      const response = await getProductApi(`?vendor_id=${vendorId}`);
      return response.data;
    },
    enabled: !!vendorId
  });

  const [products, setProducts] = useState<any[]>([]);

  React.useEffect(() => {
    if (data) {
      // Check if data is an array or has a results/products field
      const productList = Array.isArray(data) ? data : (data.products || data.results || []);
      setProducts(productList);
    }
  }, [data]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        isAuthenticated: !!products.length,
        isLoading,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
