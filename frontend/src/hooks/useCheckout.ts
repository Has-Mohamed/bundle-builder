import { z } from "zod";
import { useBuilderStore } from "../store/builderStore";
import { getLineItems, lineItemsSchema } from "../store/selectors";
import { toast } from "sonner";
import { useState } from "react";

const checkoutRequestSchema = z.object({
  items: lineItemsSchema.min(1, "Cart is empty"),
});

export async function postCheckout(
  items: z.infer<typeof checkoutRequestSchema>,
) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  });
  const response = await res.json();
  return response;
}

const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const products = useBuilderStore((s) => s.products);
  const quantities = useBuilderStore((s) => s.quantities);
  const startOver = useBuilderStore((s) => s.startOver);

  const checkout = async () => {
    const items = getLineItems(products, quantities);
    try {
      setIsLoading(true);
      await postCheckout({ items });
      toast.success("Cart checked out successfully", {
        position: "top-center",
        duration: 5000,
        style: {
          backgroundColor: "#ecfdf5",
          color: "#166534",
          border: "1px solid #4ade80",
        },
        icon: "✅",
      });
      startOver();
    } catch (error) {
      console.error(error);
      toast.error("Failed to checkout", {
        position: "top-center",
        duration: 5000,
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fecaca",
        },
        icon: "❌",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { checkout, isLoading };
};

export default useCheckout;
