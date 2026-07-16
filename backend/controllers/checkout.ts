import { Request, Response } from "express";

import { cartTotals, clampQuantity } from "../utils/cart";
import { makeLineKey } from "../utils/lineKey";
import z from "zod";
import Products from "../models/products";
import type { Product } from "../types/domain";

const checkoutRequestSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().nullable(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Cart is empty"),
});

const postCheckout = (req: Request, res: Response) => {
  const parsed = checkoutRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  Products.getAllProduct((products: Product[]) => {
    // Rebuild a quantities map, but only for products/quantities that
    // actually exist and are in-bounds — this is where a tampered or
    // stale request gets caught, not trusted.
    const quantities: Record<string, number> = {};
    for (const item of parsed.data.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product)
        return res
          .status(400)
          .json({ error: `Unknown product: ${item.productId}` });
      quantities[makeLineKey(item.productId, item.variantId)] = clampQuantity(
        product,
        item.quantity,
      );
    }

    const totals = cartTotals(products, quantities);

    const order = {
      orderId: crypto.randomUUID(),
      items: parsed.data.items,
      total: totals.total,
      savings: totals.savings,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json(order);
  });
};

export { postCheckout };
