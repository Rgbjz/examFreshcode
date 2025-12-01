UPDATE "Users" u
SET balance = u.balance + cashback.amount
FROM (
    SELECT c."userId", SUM(c.prize) * 0.1 AS amount
    FROM "Contests" c
    JOIN "Users" u ON u.id = c."userId"
    WHERE u.role = 'customer'
      AND (
        (c."createdAt"::date >= '2024-12-25' AND c."createdAt"::date <= '2024-12-31')
        OR (c."createdAt"::date >= '2025-01-01' AND c."createdAt"::date <= '2025-01-14')
      )
    GROUP BY c."userId"
) AS cashback
WHERE u.id = cashback."userId";