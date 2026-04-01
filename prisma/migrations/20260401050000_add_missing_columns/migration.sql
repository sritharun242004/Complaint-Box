-- AlterTable: add missing columns
ALTER TABLE "complaints"
ADD COLUMN IF NOT EXISTS "location" TEXT,
ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "admin_reply" TEXT,
ADD COLUMN IF NOT EXISTS "replied_at" TIMESTAMP(3);

-- Add unique constraint on mobile if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'complaints_mobile_key'
  ) THEN
    ALTER TABLE "complaints" ADD CONSTRAINT "complaints_mobile_key" UNIQUE ("mobile");
  END IF;
END $$;
