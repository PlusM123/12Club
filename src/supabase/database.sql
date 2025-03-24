-- User 表
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(17) UNIQUE NOT NULL,
    email VARCHAR(1007) UNIQUE NOT NULL,
    password VARCHAR(1007) NOT NULL,
    ip VARCHAR(233) DEFAULT '',
    avatar VARCHAR(233) DEFAULT '',
    role INTEGER DEFAULT 1,
    status INTEGER DEFAULT 0,
    register_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bio VARCHAR(107) DEFAULT '',
    enable_email_notice BOOLEAN DEFAULT true,
    daily_image_count INTEGER DEFAULT 0,
    daily_check_in INTEGER DEFAULT 0,
    daily_upload_size REAL DEFAULT 0,
    last_login_time VARCHAR(255) DEFAULT '',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP
);

-- 主资源表
CREATE TABLE resource (
    id SERIAL PRIMARY KEY,
    name VARCHAR(1007) NOT NULL,
    db_id VARCHAR(107) UNIQUE NOT NULL,
    accordion INTEGER DEFAULT 0,
    accordion_total INTEGER DEFAULT 0,
    image_url VARCHAR(1007) DEFAULT '',
    introduction VARCHAR(100007) DEFAULT '',
    released VARCHAR(107) DEFAULT '',
    status INTEGER DEFAULT 0,
    download INTEGER DEFAULT 0,
    view INTEGER DEFAULT 0,
    comment INTEGER DEFAULT 0,
    type TEXT[],
    language TEXT[],
    user_id INTEGER NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- 资源别名表
CREATE TABLE resource_alias (
    id SERIAL PRIMARY KEY,
    name VARCHAR(1007) NOT NULL,
    resource_id INTEGER NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resource(id) ON DELETE CASCADE
);
CREATE INDEX ON resource_alias (resource_id);
CREATE INDEX ON resource_alias (name);

-- 资源文件表
CREATE TABLE resource_patch (
    id SERIAL PRIMARY KEY,
    storage VARCHAR(107) NOT NULL,
    section VARCHAR(107) NOT NULL,
    name VARCHAR(300) DEFAULT '',
    size VARCHAR(107) DEFAULT '',
    code VARCHAR(1007) DEFAULT '',
    password VARCHAR(1007) DEFAULT '',
    note VARCHAR(10007) DEFAULT '',
    hash VARCHAR(255) DEFAULT '',
    content TEXT DEFAULT '',
    type TEXT[],
    language TEXT[],
    platform TEXT[],
    download INTEGER DEFAULT 0,
    status INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL,
    resource_id INTEGER NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resource(id) ON DELETE CASCADE
);

-- 资源评论表
CREATE TABLE resource_comment (
    id SERIAL PRIMARY KEY,
    content VARCHAR(10007) DEFAULT '',
    edit VARCHAR(255) DEFAULT '',
    parent_id INTEGER,
    user_id INTEGER NOT NULL,
    resource_id INTEGER NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES resource_comment(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resource(id) ON DELETE CASCADE
);

-- 用户关注关系表
CREATE TABLE user_follow_relation (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL,
    following_id INTEGER NOT NULL,
    FOREIGN KEY (follower_id) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES "user"(id) ON DELETE CASCADE,
    UNIQUE (follower_id, following_id)
);

-- 用户消息表
CREATE TABLE user_message (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255),
    content VARCHAR(10007),
    status INTEGER DEFAULT 0,
    link VARCHAR(1007) DEFAULT '',
    sender_id INTEGER,
    recipient_id INTEGER,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- 资源收藏关系表
CREATE TABLE user_resource_favorite_relation (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    resource_id INTEGER NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resource(id) ON DELETE CASCADE,
    UNIQUE (user_id, resource_id)
);

-- 资源评论点赞表
CREATE TABLE user_resource_comment_like_relation (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    comment_id INTEGER NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES resource_comment(id) ON DELETE CASCADE,
    UNIQUE (user_id, comment_id)
);

-- 创建 resource_play_link 表
CREATE TABLE resource_play_link (
    id SERIAL PRIMARY KEY,
    accordion INTEGER NOT NULL,
    resource_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    link TEXT NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resource(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- 评论总数的触发器和函数
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    -- 统计当前 resource_id 的评论总数
    UPDATE resource 
    SET comment = (
        SELECT COUNT(*) 
        FROM resource_comment 
        WHERE resource_id = COALESCE(NEW.resource_id, OLD.resource_id)
    )
    WHERE id = COALESCE(NEW.resource_id, OLD.resource_id);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_comment_count
AFTER INSERT OR DELETE OR UPDATE ON resource_comment
FOR EACH ROW
EXECUTE FUNCTION update_comment_count();

-- 资源accordion的触发器和函数
CREATE OR REPLACE FUNCTION update_resource_accordion()
RETURNS TRIGGER AS $$
DECLARE
    resource_ids INTEGER[];
    rid INTEGER;
BEGIN
    -- 收集受影响的 resource_id
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        resource_ids := array_append(resource_ids, NEW.resource_id);
    END IF;
    IF TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        resource_ids := array_append(resource_ids, OLD.resource_id);
    END IF;

    -- 去重处理
    resource_ids := ARRAY(SELECT DISTINCT UNNEST(resource_ids));

    -- 更新每个关联的 resource 记录的 accordion
    FOREACH rid IN ARRAY resource_ids
    LOOP
        UPDATE resource
        SET accordion = (SELECT COUNT(*) FROM resource_play_link WHERE resource_id = rid)
        WHERE id = rid;
    END LOOP;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_resource_accordion
AFTER INSERT OR UPDATE OR DELETE ON resource_play_link
FOR EACH ROW
EXECUTE FUNCTION update_resource_accordion();