
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Shield, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface KycVerificationProps {
  userId: string;
  onComplete?: () => void;
}

export const KycVerification = ({ userId, onComplete }: KycVerificationProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    documentType: "passport",
    documentNumber: "",
    frontImageUrl: "",
    backImageUrl: "",
    selfieImageUrl: "",
  });

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back' | 'selfie') => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      // Create a mock upload in this demo - in real implementation this would upload to secure storage
      const fieldMap = {
        front: 'frontImageUrl',
        back: 'backImageUrl',
        selfie: 'selfieImageUrl'
      };
      
      updateFormData(fieldMap[type], URL.createObjectURL(file));
      
      toast({
        title: "File Uploaded",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded successfully`,
        variant: "success",
      });
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      toast({
        title: "Upload Failed",
        description: `Could not upload ${type} image. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would submit to your KYC provider through a secure backend
      const { error } = await supabase.functions.invoke('submit-kyc', {
        body: { 
          userId,
          formData: {
            ...formData,
            // Don't include the data URLs in the actual API call
            frontImageUrl: formData.frontImageUrl ? "UPLOADED" : "",
            backImageUrl: formData.backImageUrl ? "UPLOADED" : "",
            selfieImageUrl: formData.selfieImageUrl ? "UPLOADED" : "",
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Verification Submitted",
        description: "Your KYC verification has been submitted and is under review",
        variant: "success",
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("KYC submission error:", error);
      toast({
        title: "Submission Error",
        description: "Could not submit your verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      setProgress((step / 3) * 100);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(((step - 2) / 3) * 100);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          KYC Verification
        </CardTitle>
        <CardDescription>
          Complete your identity verification to access advanced trading features
        </CardDescription>
        <Progress value={progress} className="h-2 mt-2" />
      </CardHeader>
      
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  placeholder="As it appears on your ID"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  placeholder="Street address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  placeholder="City"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => updateFormData("country", value)}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="eu">European Union</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => updateFormData("postalCode", e.target.value)}
                  placeholder="Postal/ZIP code"
                  required
                />
              </div>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Document Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select
                  value={formData.documentType}
                  onValueChange={(value) => updateFormData("documentType", value)}
                >
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="driverLicense">Driver's License</SelectItem>
                    <SelectItem value="idCard">National ID Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documentNumber">Document Number</Label>
                <Input
                  id="documentNumber"
                  value={formData.documentNumber}
                  onChange={(e) => updateFormData("documentNumber", e.target.value)}
                  placeholder="Document ID number"
                  required
                />
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Document Upload</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please upload clear images of your identification document and a selfie
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border rounded-md p-4 flex flex-col items-center justify-center space-y-2">
                <Label htmlFor="frontImage" className="cursor-pointer w-full">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Document Front</span>
                    <span className="text-xs text-muted-foreground">Click to upload</span>
                    {formData.frontImageUrl && (
                      <div className="mt-2 text-green-600 text-xs">✓ Uploaded</div>
                    )}
                  </div>
                  <Input 
                    id="frontImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'front')}
                  />
                </Label>
              </div>
              
              <div className="border rounded-md p-4 flex flex-col items-center justify-center space-y-2">
                <Label htmlFor="backImage" className="cursor-pointer w-full">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Document Back</span>
                    <span className="text-xs text-muted-foreground">Click to upload</span>
                    {formData.backImageUrl && (
                      <div className="mt-2 text-green-600 text-xs">✓ Uploaded</div>
                    )}
                  </div>
                  <Input 
                    id="backImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'back')}
                  />
                </Label>
              </div>
              
              <div className="border rounded-md p-4 flex flex-col items-center justify-center space-y-2 sm:col-span-2">
                <Label htmlFor="selfieImage" className="cursor-pointer w-full">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Selfie with Document</span>
                    <span className="text-xs text-muted-foreground">Click to upload a photo of yourself holding your ID</span>
                    {formData.selfieImageUrl && (
                      <div className="mt-2 text-green-600 text-xs">✓ Uploaded</div>
                    )}
                  </div>
                  <Input 
                    id="selfieImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'selfie')}
                  />
                </Label>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-400">
                <p className="font-medium">Privacy Notice</p>
                <p className="mt-1">Your document information is securely processed and stored in compliance with data protection regulations. We use this information solely for identity verification purposes.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={step === 1 || isSubmitting}
        >
          Previous
        </Button>
        
        {step < 3 ? (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={isSubmitting || !formData.frontImageUrl || !formData.selfieImageUrl}
          >
            {isSubmitting ? "Submitting..." : "Submit Verification"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
