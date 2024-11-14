ALTER TABLE "todos" ALTER COLUMN "priority" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;