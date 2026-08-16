# Dynamic Backoffice Database Design

This document defines the new dynamic database structure for the requested backoffice features.

## Goals

- Replace frontend mock/static content with database-driven content.
- Support CRUD for master data, products, banners, job postings, and job applicants.
- Keep relations explicit and safe for long-term maintainability.

## Implemented Migration Files

- database/migrations/2026_08_05_000001_add_member_management_columns_to_users_table.php
- database/migrations/2026_08_05_000002_create_master_data_tables.php
- database/migrations/2026_08_05_000003_create_product_catalog_tables.php
- database/migrations/2026_08_05_000004_create_career_recruitment_tables.php
- database/migrations/2026_08_05_000005_create_banners_table.php

## Feature-to-Table Mapping

### 1) Member Management (add, edit, delete, reset password)

- users (existing + new columns)
- Added columns:
  - phone
  - avatar_path
  - is_active
  - last_password_reset_at

Notes:
- Logical disable is done by is_active.
- Password reset workflow can update last_password_reset_at for audit trace.

### 2) Banner Management (add, edit, delete, open/close)

- banners

Main fields:
- placement, title, subtitle, description
- cta_label, cta_url
- desktop_image_path, mobile_image_path
- is_active, sort_order, starts_at, ends_at

### 3) Product Category Management

- product_categories

Main fields:
- parent_id (for nested categories)
- brand_id
- name, slug, description
- is_active, sort_order

### 4) Planner Management (add, edit, delete)

- planners

Main fields:
- name, slug
- contact_name, phone, email, line_id, facebook_url
- notes, is_active, sort_order

### 5) Add Product Data

- products
- product_images
- brands

Main product fields (based on current frontend fields):
- sku, name, slug, brand_tag
- short_description, description
- brand_id, product_category_id, planner_id
- price
- show_price_on_card, show_price_on_detail
- material, turnaround
- thumbnail_path
- is_active, is_featured, sort_order, published_at

Product images:
- image_path, alt_text, sort_order, is_primary

### 6) Job Announcements and Applicants

- job_postings
- job_applications
- career_benefits
- career_hiring_steps

Main posting fields:
- title, slug, team, location
- employment_type, workplace_type
- summary, description, requirements, benefits
- salary_min, salary_max, salary_currency
- is_active, published_at, expired_at

Main applicant fields:
- job_posting_id
- full_name, email, phone, line_id
- portfolio_url, resume_path, message
- source, status, applied_at
- reviewed_by, reviewed_at, review_notes

## Relations Summary

- product_categories.parent_id -> product_categories.id (null on delete)
- product_categories.brand_id -> brands.id (null on delete)
- products.brand_id -> brands.id (null on delete)
- products.product_category_id -> product_categories.id (restrict on delete)
- products.planner_id -> planners.id (null on delete)
- product_images.product_id -> products.id (cascade on delete)
- job_applications.job_posting_id -> job_postings.id (null on delete)
- reviewed_by / created_by / updated_by -> users.id (null on delete)

## Frontend Data That Can Move from Mock to DB First

Priority data from resources/js/mock/menu-data.ts:
- productsMock -> products + product_images
- productDetailCatalogMock -> products + product_images
- careerBenefitsMock -> career_benefits
- hiringStepsMock -> career_hiring_steps
- openPositionsMock -> job_postings

## Recommended Next Implementation Steps

1. Build Eloquent models for new tables with explicit casts and fillable.
2. Add admin FormRequests + Actions for each CRUD module.
3. Replace Inertia page mock data with database queries via dedicated Actions.
4. Add seeders to bootstrap default brands/categories/positions.
5. Add policy/permission checks for backoffice routes.
