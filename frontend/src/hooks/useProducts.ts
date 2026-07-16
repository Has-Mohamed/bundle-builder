import { useEffect } from "react";
import { productCatalogSchema } from "../data/schema";
import { hydrateBuilderStore, useBuilderStore } from "../store/builderStore";

async function fetchProducts() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
  if (!res.ok) throw new Error("Failed to load products");
  return productCatalogSchema.parse(await res.json());
}

const useProducts = () => {
  const setProducts = useBuilderStore((s) => s.setProducts);

  useEffect(() => {
    fetchProducts().then((products) => {
      setProducts(products, true);
      // Restore a saved system (if any) once, on first mount.
      hydrateBuilderStore();
    });
  }, []);
};

export default useProducts;
