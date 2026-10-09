-- Custom roles: UserRole enum -> Role table (permission keys per role).
-- 1) Tabel Role
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Role_key_key" ON "Role"("key");
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
CREATE INDEX "Role_isSystem_idx" ON "Role"("isSystem");

-- 2) Role bawaan = padanan enum lama (izin sama persis dengan permissions.ts sebelumnya)
INSERT INTO "Role" ("id", "key", "name", "description", "color", "permissions", "isSystem", "createdAt", "updatedAt") VALUES
  ('role_super_admin', 'super_admin', 'Super Admin', 'Full access to every module, including users and roles.', 'emerald', ARRAY['*'], true, NOW(), NOW()),
  ('role_admin', 'admin', 'Admin', 'All content modules with permanent deletes; activity log and cookie consent.', 'blue',
    ARRAY['dashboard.view','cms.view','cms.write','cms.delete','supercharge.view','supercharge.write','supercharge.delete','leads.view','leads.write','leads.delete','activity.view','consent.view'], false, NOW(), NOW()),
  ('role_editor', 'editor', 'Editor', 'Write and edit content; no permanent deletes.', 'violet',
    ARRAY['dashboard.view','cms.view','cms.write','supercharge.view','supercharge.write','leads.view','leads.write'], false, NOW(), NOW()),
  ('role_marketing', 'marketing', 'Marketing Team', 'Dashboard, CMS (articles, press, social, media, SEO) and Leads, including deletes.', 'pink',
    ARRAY['dashboard.view','cms.view','cms.write','cms.delete','leads.view','leads.write','leads.delete'], false, NOW(), NOW()),
  ('role_supercharge', 'supercharge', 'SuperCharge Team', 'SuperCharge stations only: add, edit, bulk update and delete stations.', 'amber',
    ARRAY['supercharge.view','supercharge.write','supercharge.delete'], false, NOW(), NOW()),
  ('role_hr_manager', 'hr_manager', 'HR Manager', 'HR module only: publish and close jobs, delete, HR contact settings, divisions and locations.', 'teal',
    ARRAY['hr.view','hr.jobs.write','hr.jobs.publish','hr.jobs.delete','hr.settings.write','hr.taxonomy.write'], false, NOW(), NOW()),
  ('role_hr_staff', 'hr_staff', 'HR Staff', 'HR module only: write and edit draft jobs, submit them for review.', 'cyan',
    ARRAY['hr.view','hr.jobs.write'], false, NOW(), NOW())
ON CONFLICT ("key") DO NOTHING;

-- 3) Pindahkan user ke roleId
ALTER TABLE "User" ADD COLUMN "roleId" TEXT;
UPDATE "User" SET "roleId" = CASE "role"
  WHEN 'SUPER_ADMIN' THEN 'role_super_admin'
  WHEN 'ADMIN' THEN 'role_admin'
  WHEN 'EDITOR' THEN 'role_editor'
  WHEN 'MARKETING' THEN 'role_marketing'
  WHEN 'SUPERCHARGE' THEN 'role_supercharge'
  WHEN 'HR_MANAGER' THEN 'role_hr_manager'
  WHEN 'HR_STAFF' THEN 'role_hr_staff'
  ELSE 'role_editor' END;
ALTER TABLE "User" ALTER COLUMN "roleId" SET NOT NULL;
DROP INDEX IF EXISTS "User_role_idx";
ALTER TABLE "User" DROP COLUMN "role";
DROP TYPE "UserRole";
CREATE INDEX "User_roleId_idx" ON "User"("roleId");
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
