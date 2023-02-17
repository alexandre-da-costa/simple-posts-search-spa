import {defineStore} from "pinia";
import {Post} from "../models/post.model";
import {Auth} from "../models/auth.model";
import axios from "axios";

export type RootState = {
    auth: Auth | null,
    posts: Post[]
};

export const useMainStore = defineStore({
    id: "mainStore",
    state: () => ({
        auth: null,
        posts: []
    } as RootState),

    actions: {
        async fetchPosts(query: string) {
            const response = await axios.get<Post[]>(
                import.meta.env.VITE_API_BASE_URL + `/posts` + `?search=${query}`
            );
            this.posts = response.data;
        },
    },

    getters: {
        getPosts: (state) => state.posts,
    }

});