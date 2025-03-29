
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Star, Send } from 'lucide-react';

interface UserFeedbackFormProps {
  onSubmit?: (feedbackData: FeedbackData) => void;
  onClose?: () => void;
  compact?: boolean;
}

export interface FeedbackData {
  category: string;
  rating: number;
  title: string;
  details: string;
  email?: string;
}

export const UserFeedbackForm: React.FC<UserFeedbackFormProps> = ({
  onSubmit,
  onClose,
  compact = false
}) => {
  const { toast } = useToast();
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    category: 'feature_request',
    rating: 0,
    title: '',
    details: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof FeedbackData, value: string | number) => {
    setFeedbackData(prev => ({ ...prev, [field]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFeedbackData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real implementation, this would send data to your backend
      console.log('Submitting feedback:', feedbackData);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(feedbackData);
      }
      
      // Show success message
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback! We appreciate your input.",
      });
      
      // Reset form
      setFeedbackData({
        category: 'feature_request',
        rating: 0,
        title: '',
        details: '',
        email: ''
      });
      
      // Close the form if onClose is provided
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Submission failed",
        description: "We couldn't submit your feedback. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'feature_request', label: 'Feature Request' },
    { value: 'bug_report', label: 'Bug Report' },
    { value: 'user_experience', label: 'User Experience' },
    { value: 'performance', label: 'Performance Issue' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Card className={compact ? "w-full" : "w-full max-w-md mx-auto"}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-primary" />
          {compact ? "Quick Feedback" : "Share Your Feedback"}
        </CardTitle>
        <CardDescription>
          Help us improve your trading experience
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Feedback Category</Label>
            <Select
              value={feedbackData.category}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!compact && (
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => handleRatingChange(star)}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        feedbackData.rating >= star
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Summary</Label>
            <Input
              id="title"
              placeholder="Brief summary of your feedback"
              value={feedbackData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              placeholder="Please provide more details..."
              className="min-h-24"
              value={feedbackData.details}
              onChange={(e) => handleChange('details', e.target.value)}
              required
            />
          </div>

          {!compact && (
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email for follow-up"
                value={feedbackData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We'll only use your email to follow up on your feedback if needed.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {onClose && (
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className={compact ? "w-full" : ""}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Submitting...
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
