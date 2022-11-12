<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("");

const onLogin = () => router.push({ name: "chat-room" });
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
          type="submit"
          class="btn btn-outline w-32 rounded-3xl !border-stone-400"
        >
          Login
        </button>
      </div>
    </div>
  </form>
</template>
