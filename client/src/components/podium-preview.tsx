import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface PodiumPreviewProps {
  generatedImage: string | null;
}

export function PodiumPreview({ generatedImage }: PodiumPreviewProps) {

  const openImageInNewTab = () => {
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(`<img src="${generatedImage}" alt="Full size image" />`);
      newTab.document.title = "Image Preview";
      newTab.document.close();
    }
  };

  const downloadImage = () => {
    // Create an anchor element
    const downloadLink = document.createElement('a');

    // Set download attribute with a filename
    downloadLink.download = 'generated-image.png';

    // Set href to the image source
    downloadLink.href = generatedImage;

    // Append to the body, click it, and then remove it
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold">Preview</h2>
      </div>

      <Card className="aspect-video bg-muted overflow-hidden">
        {generatedImage ? (<>
          <img
            src={generatedImage}
            alt="Generated podium"
            className="w-full h-full object-contain"
          />

          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground">
              Fill out the form to generate a podium image
            </p>
          </div>
        )}

      </Card>
      <div className={"flex gap-4"}>
      {generatedImage && <button className={'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'} onClick={openImageInNewTab}>Open generated image in new window</button>}
      {generatedImage && <button className={'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'} onClick={downloadImage}>Download generated image</button>}
      </div>
    </div>
  );
}
