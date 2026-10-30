-- User terhapus (soft delete) boleh kehilangan role bila role tersebut dihapus; user aktif tetap wajib ber-role (dijaga aplikasi).
ALTER TABLE "User" ALTER COLUMN "roleId" DROP NOT NULL;
