CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text
);
--> statement-breakpoint
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Enable users to view their own data only" ON "profile" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("profile"."id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "Enable users to insert their own data only" ON "profile" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("profile"."id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "Enable users to update their own data only, not changing ID" ON "profile" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("profile"."id" = (select auth.uid())) WITH CHECK ("profile"."id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "Enable users to delete their own data only" ON "profile" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("profile"."id" = (select auth.uid()));