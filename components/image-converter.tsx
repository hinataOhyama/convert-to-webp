import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Download } from "lucide-react";

export function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "image/png") {
      setSelectedFile(file);
      setConvertedImage(null);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please select a PNG file.",
      });
    }
  };

  const convertToWebP = async () => {
    if (!selectedFile) return;

    try {
      const image = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        image.src = reader.result as string;
        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.drawImage(image, 0, 0);
          const webpData = canvas.toDataURL("image/webp");
          setConvertedImage(webpData);
        };
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Conversion failed",
        description: "Failed to convert the image. Please try again.",
      });
    }
  };

  const downloadWebP = () => {
    if (!convertedImage) return;

    const link = document.createElement("a");
    link.href = convertedImage;
    link.download = `${selectedFile?.name.replace(".png", "")}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-center">
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-slate-100 p-4">
                <Upload className="h-6 w-6 text-slate-600" />
              </div>
              <span className="text-sm text-slate-600">Select PNG file</span>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/png"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {selectedFile && (
          <div className="text-center text-sm text-slate-600">
            Selected: {selectedFile.name}
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <Button
            onClick={convertToWebP}
            disabled={!selectedFile}
            className="w-32"
          >
            Convert
          </Button>
          <Button
            onClick={downloadWebP}
            disabled={!convertedImage}
            variant="outline"
            className="w-32"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {convertedImage && (
        <div className="mt-6">
          <p className="mb-2 text-center text-sm text-slate-600">Preview:</p>
          <div className="flex justify-center">
            <img
              src={convertedImage}
              alt="Converted WebP"
              className="max-h-64 rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}