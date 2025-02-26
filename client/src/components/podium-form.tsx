import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { podiumFormSchema, type PodiumForm } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { generatePodiumImage } from "@/lib/canvas";
import { useToast } from "@/hooks/use-toast";

export function PodiumForm() {
  const { toast } = useToast();
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const form = useForm<PodiumForm>({
    resolver: zodResolver(podiumFormSchema),
    defaultValues: {
      tournament: {
        name: "",
        date: "",
        websiteUrl: "",
      },
      players: Array(3).fill({
        name: "",
        score: 0,
        imageUrl: "",
      }),
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const res = await apiRequest("POST", "/api/upload", formData);
      return await res.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: PodiumForm) => {
      const res = await apiRequest("POST", "/api/tournament", data);
      const tournament = await res.json();
      const imageUrl = await generatePodiumImage(data);
      setGeneratedImage(imageUrl);
      return tournament;
    },
  });

  const onSubmit = async (data: PodiumForm) => {
    try {
      await submitMutation.mutateAsync(data);
      toast({
        title: "Success!",
        description: "Podium image has been generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate podium image.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadMutation.mutateAsync(file);
      form.setValue(`players.${index}.imageUrl`, result.url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Tournament Details</h2>
          
          <FormField
            control={form.control}
            name="tournament.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tournament Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tournament.date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tournament.websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Podium Placements</h2>
          
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold">
                {index === 0 ? "1st Place 🥇" : index === 1 ? "2nd Place 🥈" : "3rd Place 🥉"}
              </h3>

              <FormField
                control={form.control}
                name={`players.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`players.${index}.score`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`players.${index}.imageUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={submitMutation.isPending}
        >
          {submitMutation.isPending ? "Generating..." : "Generate Podium Image"}
        </Button>
      </form>
    </Form>
  );
}
