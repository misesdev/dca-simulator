/*
  Warnings:

  - A unique constraint covering the columns `[day,month,year,codein]` on the table `prices` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."prices_day_month_year_key";

-- CreateIndex
CREATE UNIQUE INDEX "prices_day_month_year_codein_key" ON "public"."prices"("day", "month", "year", "codein");
