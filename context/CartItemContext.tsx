"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCartitemsApi, postCartitemApi, deleteCartitemsApi, putCartitemApi } from "../api-endpoints/CartsApi";

const CartItemContext = createContext<any | undefined>(undefined);

export function CartItemProvider({ children }: { children: ReactNode }) {
    const [cartId, setCartId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        // Initializing cartId from localStorage or default to vendor 159
        const storedCartId = localStorage.getItem('cartId') || '159';
        setCartId(storedCartId);
        if (!localStorage.getItem('cartId')) {
            localStorage.getItem('cartId');
        }
    }, []);

    // Get Cart Items Query
    const { data: cartItems = [], isLoading, refetch } = useQuery({
        queryKey: ["getCartitemsData", cartId],
        queryFn: async () => {
            if (!cartId) return [];
            const response = await getCartitemsApi(`/${cartId}`);
            console.log('Fetched Cart Items:', response.data);
            return response.data;
        },
        enabled: !!cartId,
    });

    // Add to Cart Mutation
    const addMutation = useMutation({
        mutationFn: (payload: any) => postCartitemApi('', payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getCartitemsData", cartId] });
        },
    });

    // Update Quantity Mutation (using PUT endpoint)
    const updateMutation = useMutation({
        mutationFn: (payload: any) => putCartitemApi(`${payload.cartItemId}/`, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getCartitemsData", cartId] });
        },
    });

    // Remove Mutation
    const removeMutation = useMutation({
        mutationFn: (cartItemId: number) => deleteCartitemsApi(`${cartItemId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getCartitemsData", cartId] });
        },
    });

    const addToCart = async (productId: number, quantity: number = 1) => {
        try {
            await addMutation.mutateAsync({
                product: productId,
                cart: Number(cartId),
                quantity,
                vendor: 159,
                user: 334,
                created_by: 'Guest'
            });
            return true;
        } catch (err) {
            console.error('Add to cart error:', err);
            return false;
        }
    };

    const removeFromCart = async (cartItemId: number) => {
        try {
            await removeMutation.mutateAsync(cartItemId);
            return true;
        } catch (err) {
            console.error('Remove from cart error:', err);
            return false;
        }
    };

    const updateQuantity = async (productId: number, quantity: number) => {
        try {
            const existingItem = cartItems.find((i: any) => i.product === productId);
            if (!existingItem) return false;

            await updateMutation.mutateAsync({
                cartItemId: existingItem.id,
                product: productId,
                cart: Number(cartId),
                quantity,
                vendor: 159,
                user: 334,
                updated_by: 'Guest'
            });
            return true;
        } catch (err) {
            console.error('Update quantity error:', err);
            return false;
        }
    };

    return (
        <CartItemContext.Provider
            value={{
                cartItems, // Always defaults to []
                isLoading,
                isUpdating: addMutation.isPending || updateMutation.isPending || removeMutation.isPending,
                refetchCart: refetch,
                addToCart,
                removeFromCart,
                updateQuantity,
            }}
        >
            {children}
        </CartItemContext.Provider>
    );
}

export function useCartItem() {
    const context = useContext(CartItemContext);
    if (!context) {
        throw new Error("useCartItem must be used within a CartItemProvider");
    }
    return context;
}
