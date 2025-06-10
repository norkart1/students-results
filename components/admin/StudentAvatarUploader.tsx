import React, { useState } from "react";

interface StudentAvatarUploaderProps {
  regNumber: string;
  onUpload?: (url: string) => void;
}

const StudentAvatarUploader: React.FC<StudentAvatarUploaderProps> = ({ regNumber, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("regNumber", regNumber);
    try {
      const res = await fetch("/api/students/upload-photo", {
        method: "POST",
        body: formData,
      });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server error: Invalid JSON response");
      }
      if (!res.ok) throw new Error(data.error || "Upload failed");
      if (onUpload) onUpload(data.url);
      setPreview(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <img
          src={preview}
          alt="Avatar Preview"
          className="w-24 h-24 rounded-full object-cover border"
        />
      )}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={handleUpload}
        disabled={uploading || !file}
      >
        {uploading ? "Uploading..." : "Upload Avatar"}
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};

export default StudentAvatarUploader;
