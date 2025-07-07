"use client";
import { CircleXIcon } from "@/assets/icons";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { validateFiles } from "@/utils/fileValidation";

interface ImageUploadProps {
  label?: string;
  required?: boolean;
  images?: (File | string)[] | null;
  setImages: (files: File[] | null) => void;
  multiple?: boolean;
  showPrevimg?: boolean;
  col?: string;
  error?: boolean;
  errorMessage?: string;
  maxSizeMB?: number; // Maximum file size in MB
}

export default function ImageUpload({
  label,
  required,
  images = null,
  setImages,
  multiple = false,
  error,
  errorMessage,
  showPrevimg = true,
  col = "grid-cols-1",
  maxSizeMB = 3, // Default 3MB limit
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(() => {
    if (!images) return [];
    return images.map((file) => {
      if (typeof file === "string") return file;
      if (file instanceof File) return URL.createObjectURL(file);
      return "";
    });
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup on unmount
  useEffect(() => {
    const fileInput = fileInputRef.current;
    return () => {
      if (fileInput) fileInput.value = "";
    };
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];

    // Validate all files before processing
    const validation = validateFiles(files, {
      maxSizeMB,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
      maxFiles: multiple ? undefined : 1,
    });

    if (!validation.isValid) {
      toast.error(validation.error || 'File validation failed');
      // Clear the input if there are invalid files
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (multiple) {
      setImages(files);
      // Revoke previous URLs before setting new ones
      previews.forEach((url) => URL.revokeObjectURL(url));
      setPreviews(files.map((file) => URL.createObjectURL(file)));
    } else {
      const file = files.length > 0 ? files[0] : null;

      // Revoke previous preview URL if any
      if (previews.length > 0) {
        URL.revokeObjectURL(previews[0]);
      }
      setImages(file ? [file] : null);
      setPreviews(file ? [URL.createObjectURL(file)] : []);
    }
  };

  return (
    <div>
      <div className={`grid gap-5 ${col}`}>
        <div>
          <label className="block text-sm font-normal mb-1.5">
            {label ?? "Image Upload"}{" "}
            {required && <span className="text-red">*</span>}
          </label>

          <div
            className={`relative flex items-center w-full rounded-lg h-11 border ${
              error ? "border-red" : "border-gray-3"
            }  overflow-hidden h-[46px]`}
          >
            <span className="flex items-center justify-center h-full px-4 text-sm font-medium bg-blue/10 text-blue whitespace-nowrap">
              Choose File
            </span>
            <span className="flex-1 px-4 text-sm truncate text-dark-5">
              {fileInputRef.current?.files?.length
                ? Array.from(fileInputRef.current.files)
                    .map((f) => f.name)
                    .join(", ")
                : "No file chosen"}
            </span>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {/* File size info */}
          <p className="text-xs text-gray-500 mt-1">
            Maximum file size: {maxSizeMB}MB. Supported formats: JPEG, PNG, WebP, GIF
          </p>

          {error && errorMessage && (
            <p className="text-sm text-red mt-1.5">{errorMessage}</p>
          )}

          {/* Previews */}
          {showPrevimg && previews.length > 0 && (
            <div
              className={`grid gap-3 my-3 ${
                multiple ? "grid-cols-3" : "grid-cols-1"
              }`}
            >
              {previews.map((src, index) => {
                const isCloudinaryImage = src.startsWith(
                  "https://res.cloudinary.com"
                );

                return (
                  <div key={index} className="relative">
                    <div className="w-16 h-16">
                      <Image
                        src={src}
                        alt={`Preview ${index}`}
                        className="border rounded-full size-16"
                        width={64}
                        height={64}
                      />
                    </div>
                    {!isCloudinaryImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setPreviews((prevPreviews) => {
                            if (!isCloudinaryImage) {
                              URL.revokeObjectURL(prevPreviews[index]);
                            }
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                            return prevPreviews.filter((_, i) => i !== index);
                          });
                          setImages(null);
                        }}
                        className="absolute top-0 right-0 inline-flex items-center justify-center duration-200 ease-out border rounded-lg size-8 bg-gray-2 border-gray-3 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
                      >
                        <span className="sr-only">Remove image</span>
                        <CircleXIcon />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
