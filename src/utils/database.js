import { db } from "./firebase";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { Assistant } from "../models/models"; // 导入助手模型
// const assistantsRef = collection(db, "assistants");

export const deleteAssistant = async (userId, assistantId) => {
  const userRef = doc(db, `users/assistants/${userId}/${assistantId}`);
  await deleteDoc(userRef);
};

export const saveAssistant = async (userId, assistant) => {
  const userRef = doc(db, `users/assistants/${userId}/${assistant.id}`);
  await setDoc(userRef, {
    id: assistant.id,
    name: assistant.name,
    description: assistant.description,
    defaultPrompt: assistant.defaultPrompt,
    maxMessages: assistant.maxMessages,
    selected: assistant.selected,
  }); // 确保传递的是普通对象
};

export const loadAssistants = async (userId) => {
  const userRef = collection(db, `users/assistants/${userId}/`);
  const snapshot = await getDocs(userRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // 返回助手数据
};

export const createDefaultAssistant = async (userId) => {
  const defaultAssistant = new Assistant(
    `${userId}_default`,
    "默认助手",
    "这是默认助手的描述",
    "",
    10
  );
  await saveAssistant(userId, defaultAssistant);
  return defaultAssistant;
};

export const loadChatHistory = async (userId, assistantId) => {
  const chatRef = collection(db, `users_chats/${userId}/${assistantId}/`);
  const snapshot = await getDocs(chatRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) || []; // 返回对话记录
};

export const saveChatHistory = async (userId, assistantId, chatHistory) => {
  const chatRef = doc(
    db,
    `users_chats/${userId}/${assistantId}/${chatHistory.id}`
  );
  await setDoc(chatRef, chatHistory);
};
