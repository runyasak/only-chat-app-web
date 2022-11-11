<script setup lang="ts">
import openSocket from "socket.io-client";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const message = ref("");

const socket = openSocket("http://192.168.0.119:3000");

socket.emit("joinRoom", {
  username: "Bob",
  room: ["Bob", route.query.name || ""]
    .sort((a, b) => (a > b ? 1 : -1))
    .join("/"),
});

socket.on("roomUsers", ({ room, users }) => {
  console.log(room, users);
});

socket.on("message", (message) => {
  console.log("------- message -------");
  console.log(message);
  console.log("XXXXXXX message XXXXXXX");
});

const onSendMessage = (newMessage: string) =>
  socket.emit("chatMessage", newMessage);
</script>

<template>
  hello chat
  <input class="input input-bordered" type="text" v-model="message" />
  <button class="btn btn-primary" @click="onSendMessage(message)">
    Submit
  </button>
</template>
