import { useState } from "react";
import Cropper from "react-easy-crop";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

export default function ImageCropper() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // Image selection
  // -----------------------------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(URL.createObjectURL(file));

    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError("");
  };

  // -----------------------------
  // Store crop coordinates
  // -----------------------------
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // -----------------------------
  // Create cropped image
  // -----------------------------
  const createCroppedImage = () => {
    return new Promise((resolve, reject) => {
      if (!image || !croppedAreaPixels) {
        reject("No image or crop selected");
        return;
      }

      const img = new Image();

      img.src = image;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Could not create canvas");
          return;
        }

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
          (blob) => {
            if (!blob) {
              reject("Could not create cropped image");
              return;
            }

            const file = new File(
              [blob],
              "cropped-qr.png",
              {
                type: "image/png",
              }
            );

            resolve(file);
          },
          "image/png",
          1.0
        );
      };

      img.onerror = () => {
        reject("Could not load image");
      };
    });
  };

  // -----------------------------
  // Scan QR using html5-qrcode
  // -----------------------------
  const handleScan = async () => {
    if (!image || !croppedAreaPixels) {
      setError("Please select and crop the QR first.");
      return;
    }

    setScanning(true);
    setError("");

    let scanner = null;

    try {
      // Create cropped image
      const croppedFile = await createCroppedImage();

      // Temporary hidden container
      const scannerId = "qr-scanner";

      let container = document.getElementById(scannerId);

      if (!container) {
        container = document.createElement("div");
        container.id = scannerId;

        container.style.position = "fixed";
        container.style.left = "-10000px";
        container.style.top = "-10000px";

        document.body.appendChild(container);
      }

      // Create scanner
      scanner = new Html5Qrcode(scannerId);

      // Scan the cropped image
      const decodedText = await scanner.scanFile(
        croppedFile,
        true
      );

      console.log("QR Code:", decodedText);

      // Cleanup
      try {
        await scanner.clear();
      } catch (cleanupError) {
        console.log("Scanner cleanup:", cleanupError);
      }

      // --------------------------------
      // QR successfully decoded
      // --------------------------------

      navigate("/Analysis", {
        state: {
          qrText: decodedText,
        },
      });

    } catch (err) {
      console.error("QR scan failed:", err);

      setError(
        "Couldn't detect the QR code. Make sure the QR is clear and completely inside the crop area."
      );
    } finally {
      setScanning(false);
    }
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
      <h1
        className="
          text-3xl
          sm:text-4xl
          text-cyan-500
          font-bold
          text-center
        "
      >
        Upload QR
      </h1>

      {/* Gallery + Camera */}
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

      {/* Error */}
      {error && (
        <div
          className="
            w-full
            max-w-xl
            bg-red-950
            border
            border-red-500
            text-red-300
            rounded-xl
            px-4
            py-3
            text-center
          "
        >
          {error}
        </div>
      )}

      {/* Cropper */}
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
            <span>Zoom</span>

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
            onChange={(e) =>
              setZoom(Number(e.target.value))
            }
            className="w-full"
          />
        </div>
      )}

      {/* Scan */}
      {image && (
        <button
          onClick={handleScan}
          disabled={scanning}
          className={`
            px-8
            py-3
            border-2
            border-cyan-400
            rounded-3xl
            font-bold
            text-lg
            transition
            ${
              scanning
                ? "bg-slate-700 cursor-not-allowed opacity-70"
                : "bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] hover:bg-cyan-950 cursor-pointer"
            }
          `}
        >
          {scanning ? "Scanning..." : "Scan"}
        </button>
      )}

    </div>
  );
}