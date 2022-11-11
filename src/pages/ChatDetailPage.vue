<script setup lang="ts">
import BaseAttachFileIcon from "@/components/BaseAttachFileIcon.vue";
import type { MessageReponse } from "@/models/chat.model";
import { useBase64 } from "@vueuse/core";
import openSocket from "socket.io-client";
import { ref, type Ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const newMessage = ref("");

const newFile = ref() as Ref<File>;

const { base64: newFileBase64 } = useBase64(newFile);

const messages = ref<MessageReponse[]>([]);

const myName = route.query.name;

const friendUsername = route.query.name2;

const roomName = [myName || "", friendUsername || ""]
  .sort((a, b) => (a > b ? 1 : -1))
  .join("/");

const socket = openSocket("http://192.168.0.119:3000");

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

const mapMessageClass = (value: MessageReponse) =>
  value.username === friendUsername
    ? "bg-white rounded-full px-4 py-1 w-fit"
    : value.username
    ? "bg-primary text-white self-end rounded-full px-4 py-1 w-fit"
    : "text-stone-400 self-center";

const inputFile = ref<HTMLInputElement>();
const onSelectFile = () => {
  inputFile.value?.click();
};

const onInputFileChange = (e: Event) => {
  const target = <HTMLInputElement>e.target;

  if (target.files) {
    newFile.value = target.files[0];
  }
};

const onSendMessage = () => {
  socket.emit("chatMessage", newMessage.value);
  newMessage.value = "";
};
</script>

<template>
  <form class="flex flex-col h-screen" @submit.prevent="onSendMessage">
    <div class="navbar px-8">
      <div class="text-2xl">{{ friendUsername }}</div>
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
          {{ message.text }}
        </div>
        <img v-if="newFileBase64" :src="newFileBase64" alt="new-base-64-file" />
      </div>

      <div class="flex justify-center mt-auto px-4">
        <div class="form-control w-full">
          <div class="input-group">
            <button
              class="btn btn-ghost bg-white !rounded-l-3xl"
              @click="onSelectFile"
            >
              <BaseAttachFileIcon></BaseAttachFileIcon>
            </button>
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type message ..."
              class="input !rounded-r-3xl pl-0 w-full focus:outline-none"
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
</template>
