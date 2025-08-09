import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebaseConfig"; // tu inicialización firebase

const vapidKey = import.meta.env.VITE_APP_VAPID_KEY;

const messaging = getMessaging(app);

export const requestFirebaseNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const currentToken = await getToken(messaging, { vapidKey });
      return currentToken;
    } else {
      console.log("Permiso de notificaciones denegado");
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo token FCM:", error);
    return null;
  }
};

export const onMessageListener = (callback) => {
  onMessage(messaging, (payload) => {
    callback(payload);
  });
};
