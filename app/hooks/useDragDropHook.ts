import { useCallback, useState } from "react";
import { PreviewDataType } from "../types";

export function useDragDropHook() {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewDataType | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const url = URL.createObjectURL(file);
    const type = file.type;
    const name = file.name;
    setFile(file);
    setPreview({ url, type, name });
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    setIsDragging,
    file,
    setFile,
    preview,
    setPreview,
    handleDragOver,
    onDragLeave,
    handleDrop,
  };
}
