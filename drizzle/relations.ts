import { relations } from "drizzle-orm";
import { products, orders, promotions } from "./schema";

export const productsRelations = relations(products, ({ many }) => ({
  orders: many(orders),
  promotions: many(promotions),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
}));

export const promotionsRelations = relations(promotions, ({ one }) => ({
  product: one(products, {
    fields: [promotions.productId],
    references: [products.id],
  }),
}));
