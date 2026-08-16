import { useState } from "react";
import Cropper from "react-easy-crop";
import { Navigate, useNavigate } from "react-router-dom";

export default function ImageCropper() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <div className="flex p-6 text-white gap-6">
      <label className="inline-block text-4xl text-cyan-500 font-bold">Upload QR</label>
      {/* Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-5"
      /> 

      {/* Crop area */}
      {image && (
        <div className="relative w-full max-w-xl h-[400px] bg-black">

          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />

        </div>
      )}

      {/* Zoom */}
      {image && (
        <div className="mt-5">
          <label>Zoom</label>

          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-full max-w-xl"
          />
        </div>
      )}

      {/*Scan Button*/}
      {image && (
        <div>
          <button className= "bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl" onClick={() => navigate("/Analysis")}>Scan</button>
        </div>
      )}

    </div>
  );
}