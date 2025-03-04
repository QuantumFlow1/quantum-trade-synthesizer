
interface ApiUnavailableWarningProps {
  apiAvailable: boolean;
}

export const ApiUnavailableWarning = ({ apiAvailable }: ApiUnavailableWarningProps) => {
  if (apiAvailable) return null;
  
  return (
    <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg mt-2 text-xs text-muted-foreground">
      AI trading signaal service is momenteel niet beschikbaar. 
      Controleer of uw API sleutel correct is ingesteld in het instellingenmenu.
    </div>
  );
};
