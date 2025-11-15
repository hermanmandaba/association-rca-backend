CREATE TYPE "public"."secteur" AS ENUM('sante', 'education', 'environnement', 'droits_humains', 'developpement', 'humanitaire', 'culture', 'sport', 'autre');--> statement-breakpoint
CREATE TYPE "public"."statut" AS ENUM('active', 'inactive', 'en_attente');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "associations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nom" varchar(255) NOT NULL,
	"sigle" varchar(50),
	"description" text NOT NULL,
	"date_creation" timestamp,
	"email" varchar(255),
	"telephone" varchar(20),
	"site_web" varchar(255),
	"adresse" text,
	"ville" varchar(100),
	"prefecture" varchar(100),
	"pays" varchar(100) DEFAULT 'République Centrafricaine' NOT NULL,
	"secteur" "secteur" NOT NULL,
	"statut" "statut" DEFAULT 'en_attente' NOT NULL,
	"cree_par" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favoris" (
	"user_id" uuid NOT NULL,
	"association_id" uuid NOT NULL,
	"ajoute_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "favoris_user_id_association_id_pk" PRIMARY KEY("user_id","association_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"nom" varchar(100) NOT NULL,
	"prenom" varchar(100) NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "associations" ADD CONSTRAINT "associations_cree_par_users_id_fk" FOREIGN KEY ("cree_par") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favoris" ADD CONSTRAINT "favoris_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favoris" ADD CONSTRAINT "favoris_association_id_associations_id_fk" FOREIGN KEY ("association_id") REFERENCES "public"."associations"("id") ON DELETE cascade ON UPDATE no action;