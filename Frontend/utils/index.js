import { Platform } from "react-native";
import { io } from "socket.io-client";

export const BaseUrl =
    Platform.OS === "android" ? "http://192.168.29.123:8081" : "http://localhost:3000";

export const socket = io("http://192.168.29.123:8080");