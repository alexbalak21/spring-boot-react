import { useState, useRef } from "react";
import type { AxiosInstance } from "axios";

interface UploadProfileImageProps {
  api: AxiosInstance;
}

export default function UploadProfileImage({ api }: UploadProfileImageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null); // 👈 holds Base64 image data

  // Ref to the hidden file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/user/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload response:", response.data);

      if (response.data.imageData) {
        setPreview(response.data.imageData); // 👈 set preview from backend
      }

      setSuccess(true);
      setError(null);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError("Failed to upload image");
      setSuccess(false);
    }
  };

  return (
    <div className="mb-6">
      {/* 👇 Small preview at the top */}
      {preview && (
        <div className="mb-4 flex justify-center">
          <img
            src={`data:image/jpeg;base64,${preview}`}
            alt="Profile preview"
            className="w-16 h-16 rounded-full object-cover border"
          />
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Button to open file picker */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mr-2"
      >
        Select Image
      </button>

      {/* Button to upload */}
      <button
        type="button"
        onClick={handleUpload}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Upload Image
      </button>

      {file && <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">Image uploaded successfully!</p>}
    </div>
  );
}
