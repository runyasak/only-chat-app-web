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

const messages = ref<MessageReponse[]>([]);

const inputText = ref<HTMLInputElement>();

const inputFile = ref<HTMLInputElement>();

const { base64: newFileBase64 } = useBase64(newFile);

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

const isDataImage = (base64Value: string) =>
  base64Value.startsWith("data:image");

const mapMessageClass = (value: MessageReponse) => {
  if (!value.username) {
    return "text-stone-400 self-center";
  }

  const result =
    value.username === friendUsername
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
</template>
