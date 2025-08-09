// suscripcion.js
import { messaging, functions } from './firebaseConfig';
import { getToken, onMessage } from "firebase/messaging";
import { httpsCallable } from 'firebase/functions';

const vapidKey = import.meta.env.VITE_APP_VAPID_KEY; 
export async function suscribirseATopicTodos() {
  try {
    const token = await getToken(messaging, { vapidKey });

    if (!token) {
      console.warn("El usuario no otorgó permiso para notificaciones.");
      return;
    }

    console.log("Token FCM:", token);

    const suscribirATopic = httpsCallable(functions, "suscribirATopic");
    const res = await suscribirATopic({ token, topic: "todos" });

    console.log("✅ Suscripción exitosa:", res.data);
  } catch (err) {
    console.error("❌ Error al suscribirse al topic:", err);
  }
}

// Mostrar notificaciones en primer plano (opcional)
onMessage(messaging, (payload) => {
  console.log("📬 Notificación recibida en primer plano:", payload);

  if (Notification.permission === "granted") {
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: "/logo.png" // opcional
    });
  }
});
