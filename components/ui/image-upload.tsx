import { useState, useEffect } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (files: FileList | null) => {
    try {
      setLoading(true);

      if (!files) return;

      const downloadURLs: string[] = [];

      for (const file of Array.from(files)) {
        const storageRef = ref(storage, "product/" + file.name);

        await uploadBytes(storageRef, file);

        const downloadURL = await getDownloadURL(storageRef);
        downloadURLs.push(downloadURL);
      }

      console.log(downloadURLs);
      console.log(value);
      onChange(downloadURLs);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col items-start ">
        <div className="flex gap-3  items-center">
          {value.map((url) => {
            console.log(value);
            return (
              <div
                key={url}
                className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
              >
                <div className="z-10 absolute top-2 right-2">
                  <Button
                    type="button"
                    onClick={() => onRemove(url)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                {url && (
                  <Image
                    fill
                    className="object-cover"
                    src={`${url}`}
                    alt="Image"
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="relative mt-5">
          <label htmlFor="custom-image">
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={() => {}}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
          </label>
          <input
            type="file"
            id="custom-image"
            name=""
            accept="image/png"
            placeholder="Select file to upload"
            className="z-10 absolute w-full h-full left-0 opacity-0"
            onChange={(e) => onUpload(e.target.files)}
            multiple
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
