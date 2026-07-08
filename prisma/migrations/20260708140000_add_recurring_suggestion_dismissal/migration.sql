-- CreateTable
CREATE TABLE "monmon_whethertie"."RecurringSuggestionDismissal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecurringSuggestionDismissal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecurringSuggestionDismissal_userId_keyword_key" ON "monmon_whethertie"."RecurringSuggestionDismissal"("userId", "keyword");

-- AddForeignKey
ALTER TABLE "monmon_whethertie"."RecurringSuggestionDismissal" ADD CONSTRAINT "RecurringSuggestionDismissal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "monmon_whethertie"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
