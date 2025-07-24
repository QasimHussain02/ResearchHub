// Create this as src/components/ProfileImageUpload.jsx

import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  X,
  Loader2,
  Check,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { uploadFile, validateFile } from "../services/uploadService";

const ProfileImageUpload = ({
  currentImage,
  onImageUpload,
  onImageRemove,
  type = "profile", // 'profile' or 'cover'
  className = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const isProfile = type === "profile";
  const isCover = type === "cover";

  // Handle file selection
  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      alert(`Error: ${validation.errors.join(", ")}`);
      return;
    }

    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPG, PNG, GIF, WEBP)");
      return;
    }

    // Check file size (max 5MB for profile images)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload to specific folder based on type
      const folder = isProfile
        ? "research-hub/profiles"
        : "research-hub/covers";

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadFile(file, folder);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        const imageData = {
          url: result.url,
          publicId: result.publicId,
          originalName: file.name,
          size: result.size,
          uploadedAt: new Date(),
        };

        // Notify parent component
        if (onImageUpload) {
          onImageUpload(imageData);
        }

        // Small delay to show success state
        setTimeout(() => {
          setUploadProgress(0);
        }, 1000);
      } else {
        alert(`Upload failed: ${result.error}`);
        setUploadProgress(0);
      }
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    if (onImageRemove) {
      onImageRemove();
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={uploading}
      />

      {/* Profile Picture Upload */}
      {isProfile && (
        <div className="relative group w-full h-full">
          <div
            className={`w-full h-full rounded-full overflow-hidden bg-transparent flex items-center justify-center cursor-pointer transition-all duration-200 ${
              dragActive ? "bg-blue-500 bg-opacity-20" : ""
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            {uploading ? (
              <div className="text-white text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-1" />
                <div className="text-xs">{uploadProgress}%</div>
              </div>
            ) : (
              <div className="text-white text-center">
                <Camera className="h-6 w-6 mx-auto mb-1" />
                <div className="text-xs">Change</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cover Photo Upload */}
      {isCover && (
        <div className="relative group w-full h-full">
          <div
            className={`w-full h-full overflow-hidden bg-transparent flex items-center justify-center cursor-pointer transition-all duration-200 ${
              dragActive ? "bg-blue-500 bg-opacity-20" : ""
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            {uploading ? (
              <div className="text-white text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <div className="text-sm font-medium">Uploading...</div>
                <div className="text-xs">{uploadProgress}%</div>
                <div className="w-32 h-2 bg-white bg-opacity-30 rounded-full mt-2">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="text-white text-center">
                <Camera className="h-8 w-8 mx-auto mb-2" />
                <div className="text-sm font-medium">
                  {currentImage ? "Change Cover" : "Add Cover Photo"}
                </div>
                <div className="text-xs opacity-75">
                  Click or drag to upload
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload status messages */}
      {uploading && (
        <div className="mt-2 text-center">
          <div className="text-sm text-gray-600">
            Uploading {isProfile ? "profile picture" : "cover photo"}...
          </div>
        </div>
      )}

      {/* Upload instructions */}
      {!currentImage && !uploading && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            {isProfile
              ? "Click to upload profile picture"
              : "Click to upload cover photo"}
          </p>
          <p className="text-xs text-gray-400">Max 5MB • JPG, PNG, GIF, WEBP</p>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload;
