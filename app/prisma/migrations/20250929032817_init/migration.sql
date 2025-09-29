-- CreateTable
CREATE TABLE "public"."prices" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "codein" VARCHAR(10) NOT NULL,
    "high" VARCHAR(15) NOT NULL,
    "low" VARCHAR(15) NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "day" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prices_year_idx" ON "public"."prices"("year");

-- CreateIndex
CREATE INDEX "prices_month_idx" ON "public"."prices"("month");

-- CreateIndex
CREATE INDEX "prices_day_idx" ON "public"."prices"("day");

-- CreateIndex
CREATE UNIQUE INDEX "prices_day_month_year_key" ON "public"."prices"("day", "month", "year");
