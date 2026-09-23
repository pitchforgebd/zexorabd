-- ============================================================================
-- Zexora Corporation — CMS Database Schema
-- Phase 1 deliverable (see phases.md)
--
-- Engine: InnoDB, utf8mb4 throughout.
-- Design notes:
--   - Product catalog (divisions -> categories -> subcategories -> items) is
--     fully relational because it needs real CRUD + drag-reorder in the admin.
--   - Simpler bullet-list content on a division (industries, reasons,
--     commitment, strengths, markets, philosophy, sourcing steps) is stored
--     as JSON columns on `divisions` rather than one table per list type —
--     it's page-copy, not queryable catalog data, and the admin UI just needs
--     a repeatable text-list editor bound to each JSON field.
--   - `page_sections` and `seo_meta` are designed now (used starting Phase 7
--     and Phase 9 respectively) so later phases don't require schema changes.
--   - Session storage for admin login (Phase 3) is left to the
--     `express-mysql-session` package, which creates/owns its own `sessions`
--     table automatically — not hand-defined here.
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- admin_users
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(120)        NOT NULL,
  email           VARCHAR(190)        NOT NULL,
  password_hash   VARCHAR(255)        NOT NULL,
  role            ENUM('superadmin','editor') NOT NULL DEFAULT 'editor',
  is_active       TINYINT(1)          NOT NULL DEFAULT 1,
  last_login_at   DATETIME            NULL,
  created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admin_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- divisions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS divisions (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug                VARCHAR(100)   NOT NULL,
  name                VARCHAR(200)   NOT NULL,
  industry            VARCHAR(255)   NULL,
  tagline             VARCHAR(255)   NULL,
  overview            TEXT           NULL,
  brand_positioning   TEXT           NULL,
  icon                VARCHAR(60)    NULL COMMENT 'lucide-react icon name',
  cover_image         VARCHAR(255)   NULL,

  -- Bullet-list / semi-structured content blocks (see design notes above)
  philosophy          JSON           NULL COMMENT '{ intro, beliefs: string[], closing }',
  industries          JSON           NULL COMMENT 'string[]',
  reasons             JSON           NULL COMMENT 'string[] — "why choose us" for this division',
  commitment          JSON           NULL COMMENT 'string[] or single paragraph list',
  strengths           JSON           NULL COMMENT 'string[]',
  markets             JSON           NULL COMMENT 'string[]',
  sourcing_steps      JSON           NULL COMMENT '{ title, description }[] — e.g. apparel sourcing process',

  is_active           TINYINT(1)     NOT NULL DEFAULT 1,
  sort_order          INT UNSIGNED   NOT NULL DEFAULT 0,
  created_at          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_divisions_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- product_categories  (divisionData.products[])
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_categories (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  division_id     INT UNSIGNED   NOT NULL,
  category_name   VARCHAR(200)   NOT NULL,
  description     TEXT           NULL,
  sort_order      INT UNSIGNED   NOT NULL DEFAULT 0,
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_product_categories_division (division_id),
  CONSTRAINT fk_product_categories_division
    FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- product_subcategories  (products[].subcategories[])
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_subcategories (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id     INT UNSIGNED   NOT NULL,
  sub_name        VARCHAR(200)   NULL,
  description     TEXT           NULL,
  sort_order      INT UNSIGNED   NOT NULL DEFAULT 0,
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_product_subcategories_category (category_id),
  CONSTRAINT fk_product_subcategories_category
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- product_items  (subcategories[].items[])
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_items (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subcategory_id  INT UNSIGNED   NOT NULL,
  item_text       VARCHAR(255)   NOT NULL,
  sort_order      INT UNSIGNED   NOT NULL DEFAULT 0,
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_product_items_subcategory (subcategory_id),
  CONSTRAINT fk_product_items_subcategory
    FOREIGN KEY (subcategory_id) REFERENCES product_subcategories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- suppliers  (supplier / partner logo strip)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suppliers (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  image_path      VARCHAR(255)   NOT NULL COMMENT 'server-relative path under /uploads',
  alt_text        VARCHAR(200)   NULL,
  is_active       TINYINT(1)     NOT NULL DEFAULT 1,
  sort_order      INT UNSIGNED   NOT NULL DEFAULT 0,
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- news_posts  (Media Centre > News)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS news_posts (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug            VARCHAR(200)   NOT NULL,
  title           VARCHAR(255)   NOT NULL,
  excerpt         VARCHAR(500)   NULL,
  body            LONGTEXT       NULL,
  cover_image     VARCHAR(255)   NULL,
  is_published    TINYINT(1)     NOT NULL DEFAULT 0,
  published_at    DATETIME       NULL,
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_news_posts_slug (slug),
  KEY idx_news_posts_published (is_published, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- photo_gallery  (Media Centre > Photo Gallery — flat grid, matches current UI)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS photo_gallery (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  image_path      VARCHAR(255)   NOT NULL,
  caption         VARCHAR(255)   NULL,
  is_published    TINYINT(1)     NOT NULL DEFAULT 1,
  sort_order      INT UNSIGNED   NOT NULL DEFAULT 0,
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- video_gallery  (Media Centre > Video Gallery)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS video_gallery (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(255)   NOT NULL,
  video_url       VARCHAR(500)   NOT NULL COMMENT 'YouTube/Vimeo URL or embed link',
  thumbnail       VARCHAR(255)   NULL,
  is_published    TINYINT(1)     NOT NULL DEFAULT 1,
  sort_order      INT UNSIGNED   NOT NULL DEFAULT 0,
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- career_applications
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS career_applications (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name       VARCHAR(150)   NOT NULL,
  email           VARCHAR(190)   NOT NULL,
  phone           VARCHAR(40)    NOT NULL,
  position        VARCHAR(100)   NULL,
  education       VARCHAR(255)   NULL,
  experience_years DECIMAL(4,1)  NULL,
  cover_letter    TEXT           NULL,
  message         TEXT           NULL,
  cv_file_path    VARCHAR(255)   NOT NULL COMMENT 'server-relative path under /uploads/cv',
  consent         TINYINT(1)     NOT NULL DEFAULT 0,
  status          ENUM('new','reviewed','shortlisted','rejected') NOT NULL DEFAULT 'new',
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_career_applications_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- contact_messages
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(150)   NOT NULL,
  company         VARCHAR(150)   NULL,
  email           VARCHAR(190)   NOT NULL,
  phone           VARCHAR(40)    NULL,
  subject         VARCHAR(255)   NULL,
  message         TEXT           NOT NULL,
  status          ENUM('unread','read','archived') NOT NULL DEFAULT 'unread',
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_contact_messages_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- seo_meta  (per-page SEO overrides — polymorphic via page_key)
-- e.g. page_key = 'home' | 'about' | 'division:chemicals' | 'news:some-slug'
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seo_meta (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_key        VARCHAR(150)   NOT NULL,
  title           VARCHAR(255)   NULL,
  meta_description VARCHAR(500) NULL,
  og_image        VARCHAR(255)   NULL,
  canonical_url   VARCHAR(255)   NULL,
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_seo_meta_page_key (page_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- site_settings  (homepage hero/stats/misc single-value content — simple KV)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  setting_key     VARCHAR(150)   NOT NULL,
  setting_value   JSON           NULL,
  updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_site_settings_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- page_sections  (Phase 7 — section visibility / order / layout variant)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS page_sections (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_key        VARCHAR(100)   NOT NULL COMMENT 'e.g. home, about, division-detail',
  section_key     VARCHAR(100)   NOT NULL COMMENT 'e.g. hero, stats, why-choose-us',
  is_visible      TINYINT(1)     NOT NULL DEFAULT 1,
  sort_order      INT UNSIGNED   NOT NULL DEFAULT 0,
  layout_variant  VARCHAR(60)    NOT NULL DEFAULT 'default',
  config          JSON           NULL COMMENT 'variant-specific settings (colors, CTA text, etc.)',
  updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_page_sections_page_section (page_key, section_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
