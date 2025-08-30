// components/SubirFoto.jsx
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Button } from "react-bootstrap";
import Slider from "@mui/material/Slider";
import Cropper from "react-easy-crop";
import { useToast } from "../../context/ToastContext";
import { db } from "@/firebase/firebaseConfig";

export function SubirFoto({ onUpload }) {
  const { autenticado, usuario } = useAuth();
  const { triggerToast } = useToast(); 
  const [imageSrc, setImageSrc] = useState(null);
  const [preview, setPreview] = useState(usuario?.photoURL || "/img/no-photo.png");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (usuario?.photoURL) setPreview(usuario.photoURL);
  }, [usuario]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImageSrc(reader.result);
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) throw new Error("No hay imagen para procesar");

    const image = new Image();
    image.src = imageSrc;
    await new Promise((res) => (image.onload = res));

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x * scaleX,
      croppedAreaPixels.y * scaleY,
      croppedAreaPixels.width * scaleX,
      croppedAreaPixels.height * scaleY,
      0,
      0,
      512,
      512
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("No se pudo procesar la imagen"));
          return;
        }
        resolve(blob);
      }, "image/jpeg", 0.75);
    });
  };

  const handleUpload = async () => {
    if (!autenticado) return;

    try {
      const blob = await getCroppedImage();
      const storage = getStorage();
      const storageRef = ref(storage, `fotosPerfil/${autenticado.uid}.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(autenticado, { photoURL: downloadURL });
      const userDocRef = doc(db, "USUARIOS", autenticado.uid);
      await updateDoc(userDocRef, { photoURL: downloadURL });

      setPreview(downloadURL);
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);

      onUpload?.(downloadURL);
      triggerToast("Foto actualizada", { severity: "success", autoHideDuration: 2500 });
    } catch (err) {
      console.error("Error subiendo foto:", err);
      triggerToast(err.message || "Error al subir la foto", { severity: "error", autoHideDuration: 2500 });
    }
  };

  const handleEliminarFoto = async () => {
    if (!autenticado) return;

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `fotosPerfil/${autenticado.uid}.jpg`);
      await deleteObject(storageRef).catch(() => {});

      await updateProfile(autenticado, { photoURL: null });
      const userDocRef = doc(db, "USUARIOS", autenticado.uid);
      await updateDoc(userDocRef, { photoURL: null });

      setPreview("/img/no-photo.png");
      onUpload?.("/img/no-photo.png");
      triggerToast("Foto eliminada", { severity: "success", autoHideDuration: 2500 });
    } catch (err) {
      console.error("Error al eliminar foto:", err);
      triggerToast(err.message || "Error al eliminar la foto", { severity: "error", autoHideDuration: 2500 });
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      {/* Foto de perfil */}
      {!imageSrc && (
        <div style={{ marginBottom: 20 }}>
          <img
            src={preview || "/img/no-photo.png"}
            width={256}
            height={256}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Inputs y botones de subir/eliminar */}
      {!imageSrc && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileInput"
          />
          <Button
            size="sm"
            variant="outline-secondary"
            className="mb-3 me-3"
            onClick={() => document.getElementById("fileInput").click()}
          >
            Cambiar Foto
          </Button>
          <Button
            size="sm"
            variant="outline-danger"
            className="mb-3"
            onClick={handleEliminarFoto}
          >
            Eliminar Foto
          </Button>
        </>
      )}

      {/* Cropper */}
      {imageSrc && (
  <div
    style={{
      position: "relative",
      width: 300,
      height: 300,
      margin: "0 auto",
      background: "#333",
    }}
  >
    <Cropper
      image={imageSrc}
      crop={crop}
      zoom={zoom}
      aspect={1}
      onCropChange={setCrop}
      onZoomChange={setZoom}
      onCropComplete={onCropComplete}
      cropShape="round" // 🔹 esto dibuja un recorte circular en la UI
      showGrid={false}  // opcional, quita la cuadrícula
    />
    <Slider
      value={zoom}
      min={1}
      max={3}
      step={0.1}
      onChange={(e, zoom) => setZoom(zoom)}
      style={{
        position: "absolute",
        bottom: 40,
        width: "80%",
        left: "10%",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 10,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "10px",
      }}
    >
      <Button size="sm" variant="success" onClick={handleUpload}>
        Procesar
      </Button>
      <Button size="sm" variant="secondary" onClick={() => setImageSrc(null)}>
        Cancelar
      </Button>
    </div>
  </div>
)}

    </div>
  );
}
