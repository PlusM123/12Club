#!/bin/bash

# 从 12club 数据库同步数据到 12club-test 数据库
# 两个数据库位于同一 PostgreSQL 实例 (localhost:5432)

set -e

SOURCE_DB="12club"
TARGET_DB="12club-test"
PG_USER="postgres"
PG_PASSWORD="12clubbulc21"
PG_HOST="localhost"
PG_PORT="5432"

export PGPASSWORD="$PG_PASSWORD"

echo "=========================================="
echo "  同步 $SOURCE_DB -> $TARGET_DB"
echo "=========================================="

# 1. 断开目标数据库的所有连接
echo "[1/4] 断开 $TARGET_DB 的现有连接..."
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d postgres -c "
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE datname = '$TARGET_DB' AND pid <> pg_backend_pid();
" > /dev/null 2>&1 || true

# 2. 删除并重建目标数据库
echo "[2/4] 重建 $TARGET_DB 数据库..."
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$TARGET_DB\";"
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d postgres -c "CREATE DATABASE \"$TARGET_DB\";"

# 3. 导出源数据库并导入目标数据库
echo "[3/4] 导出 $SOURCE_DB 并导入 $TARGET_DB (这可能需要几分钟)..."
pg_dump -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" --no-owner --no-acl "$SOURCE_DB" \
  | psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$TARGET_DB" -q

# 4. 验证
echo "[4/4] 验证同步结果..."
echo ""
echo "--- $SOURCE_DB 表行数 ---"
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$SOURCE_DB" -c "
  SELECT schemaname || '.' || relname AS table_name, n_live_tup AS row_count
  FROM pg_stat_user_tables
  ORDER BY relname;
"
echo "--- $TARGET_DB 表行数 ---"
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$TARGET_DB" -c "
  SELECT schemaname || '.' || relname AS table_name, n_live_tup AS row_count
  FROM pg_stat_user_tables
  ORDER BY relname;
"

unset PGPASSWORD

echo "=========================================="
echo "  同步完成！"
echo "=========================================="
