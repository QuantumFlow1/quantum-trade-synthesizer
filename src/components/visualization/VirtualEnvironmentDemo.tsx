
import React, { useState } from 'react';
import { VirtualEnvironment } from './environment/VirtualEnvironment';
import { EnvironmentProvider } from '@/contexts/EnvironmentContext';
import { UserProgressDisplay } from './user-progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileVideo, UploadCloud } from 'lucide-react';

export const VirtualEnvironmentDemo: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);
  const [videoUrl, setVideoUrl] = useState<string>('');
  
  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Create URL for the selected file
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      
      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };
  
  // Handle URL input
  const handleUrlSubmit = () => {
    if (videoUrl) {
      setVideoSrc(videoUrl);
    }
  };

  return (
    <EnvironmentProvider>
      <div className="grid grid-cols-4 gap-6 col-span-full">
        <Card className="col-span-3 backdrop-blur-xl bg-secondary/10 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
          <CardHeader>
            <CardTitle>Virtual Trading Environment</CardTitle>
            <CardDescription>
              Choose from different environments to interact with AI trading agents and complete learning paths
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VirtualEnvironment videoSrc={videoSrc} />
            
            <div className="mt-4 space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Select an environment using the settings button in the top-right corner of the visualization.</p>
                <p className="mt-2">Switch between "Explore" and "Learn" modes to interact with the environment or complete educational modules.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <label className="text-sm font-medium mb-2 block">Upload Video for Garden Environment</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    <Button size="icon" variant="outline">
                      <FileVideo className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Video URL</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/video.mp4"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleUrlSubmit}>
                      <UploadCloud className="h-4 w-4 mr-2" />
                      Load
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="col-span-1">
          <UserProgressDisplay />
        </div>
      </div>
    </EnvironmentProvider>
  );
};
