import { useState, useCallback, useEffect } from "react";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Button } from "react-bootstrap";
import Slider from "@mui/material/Slider";
import Cropper from "react-easy-crop";

export function SubirFoto() {
  const { autenticado, usuario } = useAuth();
  const [imageSrc, setImageSrc] = useState(null);
  const [preview, setPreview] = useState(autenticado?.photoURL || "/img/no-photo.png");
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

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
    });
  };

  const handleUpload = async () => {
    if (!autenticado) return;

    const blob = await getCroppedImage();

    const storage = getStorage();
    const storageRef = ref(storage, `fotosPerfil/${autenticado.uid}.jpg`);
    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);

    // Actualizar Auth
    await updateProfile(autenticado, { photoURL: downloadURL });    
    setPreview(downloadURL);

    // Actualizar Firestore
    const userDocRef = doc(db, "USUARIOS", autenticado.uid);
    await updateDoc(userDocRef, { photoURL: downloadURL });

    // Reset crop
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const handleEliminarFoto = async () => {
    if (!autenticado) return;

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `fotosPerfil/${autenticado.uid}.jpg`);
      await deleteObject(storageRef).catch(() => {}); // ignorar si no existe

      // Auth
      await updateProfile(autenticado, { photoURL: null });
      // Firestore
      const userDocRef = doc(db, "USUARIOS", autenticado.uid);
      await updateDoc(userDocRef, { photoURL: null }); 
      // Estado local
      setPreview("/img/no-photo.png");

      console.log("Foto eliminada correctamente");
    } catch (err) {
      console.error("Error al eliminar foto:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <img
          src={preview || "/img/no-photo.png"}          
          width={256}
          height={256}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
      </div>

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

      {imageSrc && (
        <div style={{ position: "relative", width: "100%", height: 400, background: "#333" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, zoom) => setZoom(zoom)}
            style={{ position: "absolute", bottom: 60, width: "80%", left: "10%" }}
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
            <button onClick={handleUpload}>Subir foto</button>
            <button onClick={() => setImageSrc(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
