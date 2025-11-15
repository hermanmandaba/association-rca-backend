import { pgTable, uuid, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

// Énumération pour les secteurs d'activité
export const secteurEnum = pgEnum('secteur', [
  'sante',
  'education',
  'environnement',
  'droits_humains',
  'developpement',
  'humanitaire',
  'culture',
  'sport',
  'autre',
]);

// Énumération pour le statut
export const statutEnum = pgEnum('statut', [
  'active',
  'inactive',
  'en_attente',
]);

export const associations = pgTable('associations', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Informations de base
  nom: varchar('nom', { length: 255 }).notNull(),
  sigle: varchar('sigle', { length: 50 }),
  description: text('description').notNull(),
  dateCreation: timestamp('date_creation'),
  
  // Contact
  email: varchar('email', { length: 255 }),
  telephone: varchar('telephone', { length: 20 }),
  siteWeb: varchar('site_web', { length: 255 }),
  
  // Localisation
  adresse: text('adresse'),
  ville: varchar('ville', { length: 100 }),
  prefecture: varchar('prefecture', { length: 100 }),
  pays: varchar('pays', { length: 100 }).notNull().default('République Centrafricaine'),
  
  // Secteur et statut
  secteur: secteurEnum('secteur').notNull(),
  statut: statutEnum('statut').notNull().default('en_attente'),
  
  // Métadonnées
  creePar: uuid('cree_par').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Association = typeof associations.$inferSelect;
export type NewAssociation = typeof associations.$inferInsert;