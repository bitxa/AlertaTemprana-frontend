// Assuming you have already installed 'axios' in your Vue app

import type { Task } from "@/types/types";
import axios from "axios";

const apiUrl = "http://localhost:3000";

export async function sendWhatsAppMessageToServer(
  phoneNumber: any,
  task: Task
) {
  try {
    const apiEndpoint = `${apiUrl}/messages`;

    const message = `
      📅 *Nueva asignación* 📚📚
      ✏️ ${task.title} ✏️
      ${task.description}
      \n
      > Fecha límite: ${task.deadline}
    `;

    const response = await axios.post(apiEndpoint, {
      phoneNumber: phoneNumber,
      message: message,
    });

    return response.data;
  } catch (error: any) {
    console.error(error.response);

    throw error;
  }
}
