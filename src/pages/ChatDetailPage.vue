<script setup lang="ts">
import BaseAttachFileIcon from "@/components/BaseAttachFileIcon.vue";
import type { MessageReponse } from "@/models/chat.model";
import { useBase64, useFetch, useStorage } from "@vueuse/core";
import openSocket from "socket.io-client";
import { computed, ref, type Ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const storage = useStorage("myName", "");

const { data: userListResponse } = useFetch(
  `${import.meta.env.VITE_API_ENDPOINT}/user-list`
).json<{
  users: string[];
  rooms: string[];
}>();

const newMessage = ref("");

const newFile = ref() as Ref<File>;

const messages = ref<MessageReponse[]>([]);

const inputText = ref<HTMLInputElement>();

const inputFile = ref<HTMLInputElement>();

const { base64: newFileBase64 } = useBase64(newFile);

const myName = storage.value;

const filterFriends = computed(() =>
  Array.from(new Set(userListResponse.value?.users)).filter(
    (user) => user !== myName
  )
);

const currentFriendUsername = route.query.name?.toString();

const roomName = [myName || "", currentFriendUsername || ""]
  .sort((a, b) => (a > b ? 1 : -1))
  .join("/");

const socket = openSocket(import.meta.env.VITE_API_ENDPOINT);

socket.emit("joinRoom", {
  username: myName,
  room: roomName,
});

socket.on("roomUsers", ({ room, users }) => {
  console.log(room, users);
});

socket.on("message", (response: MessageReponse) => {
  console.log("response", response);
  messages.value.push(response);
});

const isDataImage = (base64Value: string) =>
  base64Value.startsWith("data:image");

const mapMessageClass = (value: MessageReponse) => {
  if (!value.username) {
    return "text-stone-400 self-center";
  }

  const result =
    value.username === currentFriendUsername
      ? "bg-white"
      : "bg-primary text-white self-end";

  return isDataImage(value.text)
    ? `${result} rounded-3xl p-4 w-[75%] max-w-sm`
    : `${result} w-fit rounded-full px-4 py-1`;
};

const onSelectFile = () => {
  inputFile.value?.click();
};

const onInputFileChange = (e: Event) => {
  const target = <HTMLInputElement>e.target;

  if (target.files) {
    newFile.value = target.files[0];
    target.files = null;
  }

  inputText.value?.focus();
};

const onSendMessage = () => {
  if (newMessage.value) {
    console.log(newMessage.value);
    socket.emit("chatMessage", newMessage.value);
    newMessage.value = "";
  }

  if (newFileBase64.value) {
    socket.emit("chatImage", newFileBase64.value);
    newFileBase64.value = "";
  }
};
</script>

<template>
  <div class="drawer drawer-mobile">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center justify-center">
      <form
        class="flex flex-col h-screen w-full"
        @submit.prevent="onSendMessage"
      >
        <div class="navbar px-8 flex gap-4">
          <label for="my-drawer-2" class="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-6 h-6 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
          <div class="text-2xl">{{ currentFriendUsername }}</div>
        </div>
        <div class="bg-[#e5e5e5] px-4 py-8 flex flex-col gap-8 flex-1">
          <div
            class="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-14rem)] px-4"
          >
            <div
              v-for="message of messages"
              :key="message.text + message.time + message.username"
              :class="[mapMessageClass(message)]"
            >
              <img
                v-if="isDataImage(message.text)"
                class="max-h-48 w-full object-contain"
                :src="message.text"
                :alt="message.text + message.time"
              />
              <template v-else>{{ message.text }}</template>
            </div>
          </div>

          <div class="flex justify-center mt-auto px-4">
            <div class="form-control w-full relative">
              <div
                v-if="newFileBase64"
                class="absolute bg-white p-4 bottom-11 w-full rounded-t-3xl"
              >
                <img
                  :src="newFileBase64"
                  class="max-h-48 object-contain"
                  alt="new-base-64-file"
                />
              </div>
              <div class="input-group">
                <button
                  type="button"
                  class="btn btn-ghost bg-white"
                  :class="newFileBase64 ? '!rounded-bl-3xl' : '!rounded-l-3xl'"
                  @click="onSelectFile"
                >
                  <BaseAttachFileIcon></BaseAttachFileIcon>
                </button>
                <input
                  v-model="newMessage"
                  ref="inputText"
                  type="text"
                  placeholder="Type message ..."
                  class="input pl-0 w-full focus:outline-none"
                  :class="newFileBase64 ? '!rounded-br-3xl' : '!rounded-r-3xl'"
                />
              </div>
            </div>
          </div>
        </div>
        <input
          ref="inputFile"
          accept="image/*"
          class="hidden"
          type="file"
          @change="onInputFileChange"
        />
      </form>
    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 bg-base-100 text-base-content gap-2">
        <!-- Sidebar content here -->
        <li v-for="(friend, index) of filterFriends" :key="friend + index">
          <RouterLink
            :class="{ 'bg-stone-300': currentFriendUsername === friend }"
            :to="{ name: 'chat-room', query: { name: friend } }"
          >
            {{ friend }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
