import { useState } from "react";
import { PodiumForm } from "@/components/podium-form";
import { PodiumPreview } from "@/components/podium-preview";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[100em] mx-auto space-y-6">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Trophy className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Disc Golf Tournament Podium Generator
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <PodiumForm onImageGenerated={setGeneratedImage} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <PodiumPreview generatedImage={generatedImage} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
