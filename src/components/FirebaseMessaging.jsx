// // src/components/FirebaseMessagingTest.jsx
// import { useEffect, useState } from "react";
// import { requestFirebaseNotificationPermission, onMessageListener } from "../firebase/getToken";
// import { suscribirseATopic } from "../firebase/suscribirse"; // Mejor: suscribirse dinámicamente

// export default function FirebaseMessagingTest() {
//   const [token, setToken] = useState(null);
//   const [notification, setNotification] = useState(null);

//   useEffect(() => {
//     // Supón que tienes datos del usuario (ej: desde auth)
//     const usuario = {
//       intereses: ["tecnología", "programación"],
//       ubicacion: "Madrid",
//       // ... otras condiciones
//     };

//     requestFirebaseNotificationPermission().then((tok) => {
//       if (tok) {
//         setToken(tok);
//         // console.log("Token FCM:", tok);

//         // 👉 Suscribirse a topics basados en condiciones
//         suscribirseATopic(tok, "nuevas_publicaciones"); // Todos los usuarios interesados en novedades
//         if (usuario.intereses.includes("tecnología")) {
//           suscribirseATopic(tok, "tecnologia");
//         }
//         if (usuario.ubicacion === "Madrid") {
//           suscribirseATopic(tok, "madrid_news");
//         }
//       }
//     });

//     // Escucha mensajes en primer plano
//     const unsubscribe = onMessageListener((payload) => {
//       setNotification(payload.notification);
//       console.log("Mensaje recibido en primer plano:", payload);
//     });

//     return () => {
//       if (unsubscribe) unsubscribe();
//     };
//   }, []);

//   return (
//     <div style={{ padding: "1rem", border: "1px solid #ccc", margin: "1rem 0" }}>
//       <h3>Firebase Messaging Test</h3>
//       {token ? <p><b>Token:</b> {token}</p> : <p>Solicitando permiso...</p>}
//       {notification && (
//         <div style={{ marginTop: "1rem", background: "#f0f0f0", padding: "0.5rem" }}>
//           <h4>{notification.title}</h4>
//           <p>{notification.body}</p>
//         </div>
//       )}
//     </div>
//   );
// }