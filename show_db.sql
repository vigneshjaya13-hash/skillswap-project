USE skillswap;

-- 1. Snapshot of User Accounts
SELECT id, username, email, created_at FROM users;

-- 2. Snapshot of Posted Skills
SELECT id, user_id, name, description, category, type, created_at FROM skills;

-- 3. Snapshot of Swap Exchange Transactions
SELECT * FROM swaps;
