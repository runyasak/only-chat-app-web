<script setup lang="ts">
import openSocket from "socket.io-client";
import { ref } from "vue";

const user1 = ref("Bob");

const user2 = ref("Alice");

const message = ref("");

const roomUsersResponse = ref(null);

const messageResponse = ref(null);

const socket = openSocket("http://192.168.0.119:3000");

const onEmitJoinRoom = (newUser1: string, newUser2: string) =>
  socket.emit("joinRoom", {
    username: newUser1,
    room: [newUser1, newUser2].sort((a, b) => (a > b ? 1 : -1)).join("/"),
  });

socket.on("roomUsers", (response) => {
  roomUsersResponse.value = response;
});

socket.on("message", (response) => {
  console.log("------- message -------");
  console.log(message);
  console.log("XXXXXXX message XXXXXXX");
  messageResponse.value = response;
});

const onSendMessage = (newMessage: string) =>
  socket.emit("chatMessage", newMessage);
</script>

<template>
  <div class="max-w-4xl mx-auto grid grid-cols-2 gap-4">
    <div class="flex flex-1 flex-col gap-2">
      <div class="flex flex-col gap-2">
        <span class="text-4xl font-bold">joinRoom</span>
        <input
          type="text"
          class="input input-bordered"
          v-model="user1"
          placeholder="user1"
        />
        <input
          type="text"
          class="input input-bordered"
          v-model="user2"
          placeholder="user2"
        />
        <button
          class="btn btn-primary w-20"
          @click="onEmitJoinRoom(user1, user2)"
        >
          Emit
        </button>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-4xl font-bold">sendMessage</span>
        <input
          type="text"
          class="input input-bordered"
          v-model="message"
          placeholder="message"
        />
        <button class="btn btn-primary w-20" @click="onSendMessage(message)">
          Emit
        </button>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-2">
      <div class="flex flex-col gap-2">
        <span class="text-4xl font-bold">roomUsers</span>
        <pre>
        <code>
{{ roomUsersResponse || '-' }}
        </code>
      </pre>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-4xl font-bold">message</span>
        <pre>
        <code>
{{ messageResponse || '-' }}
        </code>
      </pre>
      </div>
    </div>
  </div>
</template>
