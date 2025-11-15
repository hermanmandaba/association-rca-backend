import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users';
import { associations } from './associations';

export const favoris = pgTable(
  'favoris',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    associationId: uuid('association_id')
      .notNull()
      .references(() => associations.id, { onDelete: 'cascade' }),
    ajouteAt: timestamp('ajoute_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      // Clé primaire composite
      pk: primaryKey({ columns: [table.userId, table.associationId] }),
    };
  }
);

export type Favori = typeof favoris.$inferSelect;
export type NewFavori = typeof favoris.$inferInsert;