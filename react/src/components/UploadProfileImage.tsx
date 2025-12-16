import { useState, useRef } from "react";
import type { AxiosInstance } from "axios";

interface UploadProfileImageProps {
  api: AxiosInstance;
}

export default function UploadProfileImage({ api }: UploadProfileImageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

      await api.post("/user/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setError(null);
    } catch (err: any) {
      setError("Failed to upload image");
      setSuccess(false);
    }
  };

  return (
    <div className="mb-6">
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
