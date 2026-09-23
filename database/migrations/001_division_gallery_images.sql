-- Phase 4 addition: per-division "Visuals & Products" gallery.
-- Discovered late — src/data/divisionImages.ts (~130 images across 6
-- divisions) wasn't accounted for in the Phase 1 schema. schema.sql stays
-- as the Phase 1 snapshot; incremental changes from here on live in this
-- migrations/ folder, applied in order after it.

CREATE TABLE IF NOT EXISTS division_gallery_images (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  division_id     INT UNSIGNED   NOT NULL,
  image_path      VARCHAR(500)   NOT NULL COMMENT 'server-relative /uploads path, or an external URL for migrated legacy data',
  caption         VARCHAR(255)   NULL,
  sort_order      INT UNSIGNED   NOT NULL DEFAULT 0,
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_division_gallery_images_division (division_id),
  CONSTRAINT fk_division_gallery_images_division
    FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
