<template>
  <div class="m-10 flex justify-center">
    <div class="text-gray-500 w-full max-w-3xl">
      <div class="relative">
        <input
            type="text"
            class="w-full p-2 pl-8 rounded border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
            placeholder="Search posts..."
            v-model="query.string"/>

        <svg class="w-4 h-4 absolute left-2.5 top-3.5"
             xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor">
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>

      </div>
      <h3
          class="mt-2 text-sm"
          v-if="posts.results.length > 0 && !fetching">
        Results:
      </h3>
      <h3
          class="mt-2 text-sm"
          v-if="fetching">
        Searching...
      </h3>
      <ul
          class="bg-white border border-gray-100 w-full mt-2 "
          v-if="posts.results.length > 0">
        <li
            class="pl-8 pr-2 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-yellow-50 hover:text-gray-900"
            v-for="post in posts.results"
            :key="post.id">

          <div class="flex justify-between">
            <div class="flex flex-col">
              <span
                  class="text-sm font-bold"
                  v-html="post.title">
              </span>
              <span
                  class="text-xs text-gray-500"
                  v-html="'...'+post.body_excerpt+'...'">
              </span>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-xs text-gray-500">
                {{ new Date(post.created_at).toDateString() }}
              </span>
              <span class="text-xs text-gray-500">
                {{ post.user.name }}
              </span>
            </div>
          </div>

        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useMainStore} from "./store";
import {reactive, watch} from "vue";
import {Post} from "./models/post.model";

const query = reactive({string: <string>''});
const posts = reactive({results: <Post[]>[]});
const mainStore = useMainStore();
let fetching = false;
let timeout: ReturnType<typeof setTimeout> = setTimeout(() => {}, 0);

async function getPosts(query: string) {
  fetching = true;
  await mainStore.fetchPosts(query);
  const regex: RegExp = new RegExp(query, "gi");
  posts.results = mainStore.posts.map((post: Post) => {
    return {
      ...post,
      title: post.title.replace(regex, `<i>${query}</i>`),
      body_excerpt: post.body_excerpt.replace(regex, `<b>${query}</b>`),
    }
  });
  fetching = false;
}


watch(query, () => {
  if (query.string.length > 2) {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      await getPosts(query.string.trim());
    }, 400);
  } else posts.results = [];
});

</script>

<style scoped>
*::-webkit-scrollbar {
  display: block;
  background: #f4f6f7;
  width: 0.7rem;
  -webkit-border-radius: 0.35rem;
  -moz-border-radius: 0.35rem;
  border-radius: 0.35rem;
  margin-right: 10px;
}

*::-webkit-scrollbar-button {
  display: none;
}

*::-webkit-scrollbar-thumb {
  background-color: #566a8320;
  -webkit-border-radius: 3rem;
  -moz-border-radius: 3rem;
  border-radius: 3rem;
  border: 0.2rem solid #f4f6f7;
}

*::-webkit-scrollbar-thumb:hover {
  background-color: #566a8360;
  -webkit-border-radius: 3rem;
  -moz-border-radius: 3rem;
  border-radius: 3rem;
  border: 0.2rem solid #f4f6f7;
}
</style>
