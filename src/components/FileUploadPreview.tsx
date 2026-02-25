import { X, FileIcon, ImageIcon } from "lucide-react";

interface FileUploadPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
  onAdd: (files: FileList) => void;
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
}

export default function FileUploadPreview({
  files,
  onRemove,
  onAdd,
  label = "Upload Files",
  accept = "image/*,video/*",
  multiple = true,
  maxFiles = 10
}: FileUploadPreviewProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAdd(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  const isImage = (file: File) => file.type.startsWith('image/');
  const isVideo = (file: File) => file.type.startsWith('video/');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {files.length < maxFiles && (
          <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium">
            + Add Files
            <input
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {files.map((file, idx) => (
            <div key={idx} className="relative group">
              <div className="aspect-square rounded-xl border-2 border-border bg-muted/50 overflow-hidden">
                {isImage(file) ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : isVideo(file) ? (
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <button
                onClick={() => onRemove(idx)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-2">No files selected</p>
          <label className="cursor-pointer text-sm text-primary hover:underline">
            Click to upload
            <input
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}
