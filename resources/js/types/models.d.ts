export type Timestamp = string;

export interface UserModel {
    id: number;
    first_name: string | null;
    last_name: string | null;
    position: string | null;
    username: string | null;
    name: string;
    email: string;
    phone: string | null;
    avatar_path: string | null;
    is_active: boolean;
    last_password_reset_at: Timestamp | null;
    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface BrandModel {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
    created_by: number | null;
    updated_by: number | null;
    created_at: Timestamp;
    updated_at: Timestamp;
    deleted_at: Timestamp | null;
}

export interface PlannerModel {
    id: number;
    name: string;
    slug: string;
    contact_name: string | null;
    phone: string | null;
    email: string | null;
    line_id: string | null;
    facebook_url: string | null;
    notes: string | null;
    is_active: boolean;
    sort_order: number;
    created_by: number | null;
    updated_by: number | null;
    created_at: Timestamp;
    updated_at: Timestamp;
    deleted_at: Timestamp | null;
}

export interface ProductCategoryModel {
    id: number;
    parent_id: number | null;
    brand_id: number | null;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
    created_by: number | null;
    updated_by: number | null;
    created_at: Timestamp;
    updated_at: Timestamp;
    deleted_at: Timestamp | null;
}

export interface ProductModel {
    id: number;
    sku: string | null;
    name: string;
    slug: string;
    brand_tag: string | null;
    short_description: string | null;
    description: string | null;
    brand_id: number | null;
    product_category_id: number;
    planner_id: number | null;
    price: string | null;
    show_price_on_card: boolean;
    show_price_on_detail: boolean;
    material: string | null;
    turnaround: string | null;
    thumbnail_path: string | null;
    is_active: boolean;
    is_featured: boolean;
    sort_order: number;
    published_at: Timestamp | null;
    created_by: number | null;
    updated_by: number | null;
    created_at: Timestamp;
    updated_at: Timestamp;
    deleted_at: Timestamp | null;
}

export interface ProductImageModel {
    id: number;
    product_id: number;
    image_path: string;
    alt_text: string | null;
    sort_order: number;
    is_primary: boolean;
    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface BannerModel {
    id: number;
    placement: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    cta_label: string | null;
    cta_url: string | null;
    desktop_image_path: string | null;
    mobile_image_path: string | null;
    is_active: boolean;
    sort_order: number;
    starts_at: Timestamp | null;
    ends_at: Timestamp | null;
    created_by: number | null;
    updated_by: number | null;
    created_at: Timestamp;
    updated_at: Timestamp;
    deleted_at: Timestamp | null;
}

export interface CareerBenefitModel {
    id: number;
    title: string;
    detail: string;
    is_active: boolean;
    sort_order: number;
    created_at: Timestamp;
    updated_at: Timestamp;
    deleted_at: Timestamp | null;
}

export interface CareerHiringStepModel {
    id: number;
    step_number: number;
    title: string;
    detail: string;
    is_active: boolean;
    sort_order: number;
    created_at: Timestamp;
    updated_at: Timestamp;
    deleted_at: Timestamp | null;
}

export interface JobPostingModel {
    id: number;
    title: string;
    positions_count: number;
    slug: string;
    team: string | null;
    location: string | null;
    employment_type: string | null;
    workplace_type: string | null;
    summary: string | null;
    description: string | null;
    requirements: string | null;
    benefits: string | null;
    salary_min: string | null;
    salary_max: string | null;
    salary_currency: string;
    is_active: boolean;
    sort_order: number;
    published_at: Timestamp | null;
    expired_at: Timestamp | null;
    created_by: number | null;
    updated_by: number | null;
    created_at: Timestamp;
    updated_at: Timestamp;
    deleted_at: Timestamp | null;
}

export interface JobApplicationModel {
    id: number;
    job_posting_id: number | null;
    full_name: string;
    email: string;
    phone: string | null;
    line_id: string | null;
    portfolio_url: string | null;
    resume_path: string | null;
    message: string | null;
    source: string | null;
    status: string;
    applied_at: Timestamp;
    reviewed_by: number | null;
    reviewed_at: Timestamp | null;
    review_notes: string | null;
    created_at: Timestamp;
    updated_at: Timestamp;
}
