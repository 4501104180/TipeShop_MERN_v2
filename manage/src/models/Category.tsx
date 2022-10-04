export interface Category {
    _id: string;
    name: string;
    image: string | null;
    banners: [],
    parent_id: string | null;
    status: string;
    children: Category[]
    slug: string;
}

export interface Category {}