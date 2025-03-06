
export const LoadingState = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-lg font-medium">Initializing 3D visualization...</p>
        <p className="text-sm text-muted-foreground">This may take a moment...</p>
      </div>
    </div>
  );
};
