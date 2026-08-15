import { useState } from "react";
import Cropper from "react-easy-crop";

export default function ImageCropper() {
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
    <div className="p-6">

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

    </div>
  );
}