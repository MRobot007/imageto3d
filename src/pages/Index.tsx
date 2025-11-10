import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ModelViewer } from "@/components/ModelViewer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2, Boxes, Download } from "lucide-react";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [modelBlob, setModelBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const handleConvert = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setModelUrl(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/convert-to-3d`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Conversion failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      setModelBlob(blob);
      setModelUrl(url);

      toast({
        title: "Success!",
        description: "Your 3D model is ready",
      });
    } catch (error) {
      console.error("Conversion error:", error);
      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!modelBlob) return;

    const url = URL.createObjectURL(modelBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "model.glb";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Your 3D model has been downloaded",
    });
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setModelUrl(null);
    setModelBlob(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-soft">
            <Boxes className="w-4 h-4" />
            AI-Powered 3D Generation
          </div>
          <h1 className="text-5xl font-bold text-foreground tracking-tight">
            Image to 3D Converter
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform any image into a stunning 3D model with AI.
            Upload, convert, and download in seconds.
          </p>
        </div>

        {/* Upload Section */}
        <div className="space-y-6">
          <ImageUpload
            onImageSelect={setSelectedImage}
            selectedImage={selectedImage}
            onClear={handleClearImage}
          />

          {/* Convert Button */}
          {selectedImage && !modelUrl && (
            <div className="flex justify-center">
              <Button
                onClick={handleConvert}
                disabled={isConverting}
                size="lg"
                className="bg-gradient-primary hover:shadow-hover transition-all duration-300 px-8"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Converting to 3D...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Convert to 3D Model
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Model Viewer */}
          {modelUrl && (
            <div className="pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ModelViewer modelUrl={modelUrl} onDownload={handleDownload} />
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Uses advanced TripoSR model for high-quality conversions
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                <Boxes className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Interactive 3D</h3>
              <p className="text-sm text-muted-foreground">
                View and interact with your model before downloading
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">GLB Export</h3>
              <p className="text-sm text-muted-foreground">
                Download in industry-standard GLB format
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
