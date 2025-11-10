import { useEffect, useRef } from "react";
import { Download, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModelViewerProps {
  modelUrl: string;
  onDownload: () => void;
}

export const ModelViewer = ({ modelUrl, onDownload }: ModelViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load model-viewer script
    if (!customElements.get('model-viewer')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-muted/50 to-muted border border-border shadow-soft">
        <div ref={viewerRef} className="w-full h-[500px]">
          <model-viewer
            src={modelUrl}
            alt="3D Model"
            auto-rotate
            camera-controls
            shadow-intensity="1"
            style={{ width: '100%', height: '100%' }}
            className="w-full h-full"
          />
        </div>
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-foreground border border-border">
          <Maximize2 className="w-3 h-3 inline mr-1" />
          Rotate & Zoom
        </div>
      </div>
      
      <Button 
        onClick={onDownload}
        className="w-full bg-gradient-accent hover:shadow-hover transition-all duration-300"
        size="lg"
      >
        <Download className="w-5 h-5 mr-2" />
        Download 3D Model (.glb)
      </Button>
    </div>
  );
};

// Type declaration for model-viewer custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}
