#!/bin/bash

# 12Club 数据库恢复脚本
# 此脚本用于从 backup.sql 恢复 PostgreSQL 数据库

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 数据库配置
DB_HOST="localhost"
DB_USER="postgres"
DB_PASSWORD=""
DB_NAME="12club"
BACKUP_FILE="backup.sql"

echo -e "${YELLOW}===========================================${NC}"
echo -e "${YELLOW}    12Club 数据库恢复工具${NC}"
echo -e "${YELLOW}===========================================${NC}"
echo ""

# 检查备份文件是否存在
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}错误: 备份文件 $BACKUP_FILE 不存在！${NC}"
    exit 1
fi

# 确认操作
echo -e "${YELLOW}警告: 此操作将删除现有数据库并从备份恢复！${NC}"
echo -e "${YELLOW}数据库名称: $DB_NAME${NC}"
echo -e "${YELLOW}备份文件: $BACKUP_FILE${NC}"
echo ""
read -p "确认继续？(yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${RED}操作已取消${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}[1/5] 终止数据库连接...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d postgres -c \
    "SELECT pg_terminate_backend(pg_stat_activity.pid) 
     FROM pg_stat_activity 
     WHERE pg_stat_activity.datname = '$DB_NAME' 
     AND pid <> pg_backend_pid();" > /dev/null 2>&1 || true

echo -e "${GREEN}[2/5] 删除现有数据库...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -c \
    "DROP DATABASE IF EXISTS \"$DB_NAME\";" > /dev/null

echo -e "${GREEN}[3/5] 创建新数据库...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -c \
    "CREATE DATABASE \"$DB_NAME\";" > /dev/null

echo -e "${GREEN}[4/5] 恢复数据...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME \
    < $BACKUP_FILE > /dev/null

echo -e "${GREEN}[5/5] 生成 Prisma Client...${NC}"
npm run prisma:generate > /dev/null

echo ""
echo -e "${GREEN}===========================================${NC}"
echo -e "${GREEN}    数据库恢复完成！${NC}"
echo -e "${GREEN}===========================================${NC}"
echo ""

# 验证恢复
echo -e "${YELLOW}验证恢复结果:${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c \
    "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';"

echo ""
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c \
    "SELECT id, name, email, role FROM \"user\";"

echo ""
echo -e "${GREEN}✓ 数据库已成功恢复到备份状态${NC}" 