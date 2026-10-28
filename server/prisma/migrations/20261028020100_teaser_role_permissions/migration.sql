-- Izin modul Showroom Teasers untuk role bawaan (role kustom diatur sendiri di admin).
-- admin: semua · marketing: lihat, tulis, publish · editor: lihat, tulis.
UPDATE "Role" SET "permissions" = array_cat("permissions", ARRAY['teasers.view','teasers.write','teasers.publish','teasers.delete'])
  WHERE "key" = 'admin' AND NOT ('teasers.view' = ANY("permissions"));
UPDATE "Role" SET "permissions" = array_cat("permissions", ARRAY['teasers.view','teasers.write','teasers.publish'])
  WHERE "key" = 'marketing' AND NOT ('teasers.view' = ANY("permissions"));
UPDATE "Role" SET "permissions" = array_cat("permissions", ARRAY['teasers.view','teasers.write'])
  WHERE "key" = 'editor' AND NOT ('teasers.view' = ANY("permissions"));
