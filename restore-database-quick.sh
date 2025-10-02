#!/bin/bash

# 12Club 数据库快速恢复脚本（无需确认）
# 用法: ./restore-database-quick.sh

set -e

# 数据库配置
export PGPASSWORD=""
DB_HOST="localhost"
DB_USER="postgres"
DB_NAME="12club"
BACKUP_FILE="backup.sql"

echo "正在恢复数据库..."

# 1. 终止所有连接
psql -h $DB_HOST -U $DB_USER -d postgres -c \
    "SELECT pg_terminate_backend(pg_stat_activity.pid) 
     FROM pg_stat_activity 
     WHERE pg_stat_activity.datname = '$DB_NAME' 
     AND pid <> pg_backend_pid();" > /dev/null 2>&1 || true

# 2. 删除并重建数据库
psql -h $DB_HOST -U $DB_USER -c "DROP DATABASE IF EXISTS \"$DB_NAME\";" > /dev/null
psql -h $DB_HOST -U $DB_USER -c "CREATE DATABASE \"$DB_NAME\";" > /dev/null

# 3. 恢复数据
psql -h $DB_HOST -U $DB_USER -d $DB_NAME < $BACKUP_FILE > /dev/null

# 4. 生成 Prisma Client
npm run prisma:generate > /dev/null 2>&1

echo "✓ 数据库恢复完成！"

# 显示用户信息
echo ""
echo "用户列表:"
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c \
    "SELECT id, name, role FROM \"user\";" 