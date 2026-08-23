import { useState } from "react";
import Cropper from "react-easy-crop";
import { useNavigate } from "react-router-dom";

export default function ImageCropper() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Handle image selection from gallery or camera
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));

      // Reset crop and zoom when a new image is selected
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    }
  };

  // Store crop coordinates
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Crop image and send it to backend
  const handleScan = () => {
    if (!image || !croppedAreaPixels) {
      return;
    }

    const img = new Image();

    img.src = image;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            navigate("/Error");
            return;
          }

          try {
            const response = await fetch(
              "https://logishield-a-packet-tracker-myosa-6-0.onrender.com/Scan",
              {
                method: "POST",
                headers: {
                  "Content-Type": "image/png",
                },
                body: blob,
              }
            );

            if (!response.ok) {
              navigate("/Error");
              return;
            }

            const result = await response.json();

            if (!result.success) {
              navigate("/Error");
              return;
            }

            if (!result.data || result.data.length === 0) {
              navigate("/Error");
              return;
            }

            navigate("/Analysis", {
              state: {
                result: result,
              },
            });
          } catch (error) {
            console.error("Scan error:", error);
            navigate("/Error");
          }
        },
        "image/png"
      );
    };

    img.onerror = () => {
      navigate("/Error");
    };
  };

  return (
    <div
      className="
        min-h-20
        w-full
        flex
        flex-col
        items-center
        px-4
        sm:px-6
        py-6
        text-white
        gap-5
      "
    >
      {/* Title */}
      <label
        className="
          text-3xl
          sm:text-4xl
          text-cyan-500
          font-bold
          text-center
        "
      >
        Upload QR
      </label>

      {/* Gallery and Camera buttons */}
      <div
        className="
          flex
          flex-col
          sm:flex-row
          gap-4
          w-full
          max-w-xl
        "
      >
        {/* Gallery */}
        <label
          className="
            flex-1
            text-center
            bg-slate-900
            border-2
            border-cyan-400
            rounded-2xl
            px-6
            py-3
            cursor-pointer
            hover:bg-cyan-950
            transition
            font-semibold
          "
        >
          📁 Choose from Gallery

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {/* Camera */}
        <label
          className="
            flex-1
            text-center
            bg-slate-900
            border-2
            border-cyan-400
            rounded-2xl
            px-6
            py-3
            cursor-pointer
            hover:bg-cyan-950
            transition
            font-semibold
          "
        >
          📷 Take Photo

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Crop area */}
      {image && (
        <div
          className="
            relative
            w-full
            max-w-xl
            h-[300px]
            sm:h-[400px]
            bg-black
            rounded-xl
            overflow-hidden
          "
        >
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={(value) => setZoom(Number(value))}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      {/* Zoom */}
      {image && (
        <div
          className="
            w-full
            max-w-xl
            mt-2
          "
        >
          <div
            className="
              flex
              justify-between
              mb-2
            "
          >
            <label className="text-white">
              Zoom
            </label>

            <span className="text-cyan-400">
              {zoom.toFixed(1)}x
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* Scan Button */}
      {image && (
        <div className="mt-2">
          <button
            className="
              bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)]
              px-8
              py-3
              border-2
              border-cyan-400
              rounded-3xl
              font-bold
              text-lg
              hover:bg-cyan-950
              transition
              cursor-pointer
            "
            onClick={handleScan}
          >
            Scan
          </button>
        </div>
      )}
    </div>
  );
}