// src/components/FirebaseMessagingTest.jsx
import { useEffect, useState } from "react";
import { requestFirebaseNotificationPermission, onMessageListener } from "../firebase/getToken";
import { suscribirseATopicTodos } from "../firebase/suscribirse";

export default function FirebaseMessagingTest() {
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    requestFirebaseNotificationPermission().then((tok) => {
      if (tok) {
        setToken(tok);
        console.log("Token FCM:", tok);
        suscribirseATopicTodos(tok);
      }
    });

    const unsubscribe = onMessageListener((payload) => {
      setNotification(payload.notification);
      console.log("Mensaje en primer plano:", payload);
    });

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", margin: "1rem 0" }}>
      <h3>Firebase Messaging Test</h3>
      {token ? <p><b>Token:</b> {token}</p> : <p>Solicitando permiso...</p>}
      {notification && (
        <div style={{ marginTop: "1rem" }}>
          <h4>{notification.title}</h4>
          <p>{notification.body}</p>
        </div>
      )}
    </div>
  );
}
