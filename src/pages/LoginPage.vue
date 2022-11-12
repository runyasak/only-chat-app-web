<script setup lang="ts">
import { useFetch, useStorage } from "@vueuse/core";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const storage = useStorage("myName", "");

const username = ref("");

const { data: userListResponse, isFetching } = useFetch(
  `${import.meta.env.VITE_API_ENDPOINT}/user-list`
).json<{
  users: string[];
  rooms: string[];
}>();

const onLogin = async () => {
  const { data } = await useFetch(
    `${import.meta.env.VITE_API_ENDPOINT}/create-user?name=${username.value}`
  ).text();

  storage.value = data.value;

  router.push({
    name: "chat-room",
    query: {
      name: userListResponse.value?.users.filter(
        (user) => user !== data.value
      )[0],
    },
  });
};
</script>

<template>
  <form
    class="flex flex-col h-screen justify-center items-center p-8"
    @submit.prevent="onLogin"
  >
    <div class="flex flex-col gap-12 justify-center items-center w-full">
      <span class="text-6xl font-bold">
        Only <span class="text-primary">Chat</span>
      </span>
      <div class="flex flex-col gap-6 items-center w-full">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="input input-bordered w-full max-w-xs rounded-3xl"
        />
        <button
          :disabled="isFetching"
          type="submit"
          class="btn btn-outline w-32 rounded-3xl !border-stone-400"
        >
          Login
        </button>
      </div>
    </div>
  </form>
</template>
