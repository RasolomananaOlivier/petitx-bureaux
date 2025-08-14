ALTER TABLE "leads" ADD COLUMN "email_verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "email_verification_token" varchar(255);