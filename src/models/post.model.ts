import {User} from "./user.model";

export interface Post {
    id: bigint,
    title: string,
    slug: string,
    body_excerpt: string,
    is_public: boolean,
    created_at: string,
    user: User
}