import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export function PodiumPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold">Preview</h2>
      </div>

      <Card className="aspect-video bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">
          Fill out the form to generate a podium image
        </p>
      </Card>
    </div>
  );
}
