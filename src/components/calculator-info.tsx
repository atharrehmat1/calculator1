"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Star,
  Vote,
  MessageSquare,
  Heart,
  Bookmark,
  Share2,
  DollarSign,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, type Calculator } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import { cn } from '@/lib/utils';

interface CalculatorInfoProps {
  calculator: Calculator | null;
}

interface Comment {
  id: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
  isAuthenticated?: boolean;
}

export function CalculatorInfo({ calculator }: CalculatorInfoProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [relatedCalculators, setRelatedCalculators] = useState<Calculator[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loadingLikes, setLoadingLikes] = useState(true);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Fetch related calculators from the same subcategory
  useEffect(() => {
    async function fetchRelatedCalculators() {
      if (!calculator) return;

      try {
        setLoadingRelated(true);
        const calculators = await api.calculators.getAll({
          subcategory_id: calculator.subcategory_id,
          is_active: true,
        });

        // Filter out the current calculator and limit to 4
        const related = calculators
          .filter((calc: Calculator) => calc.id !== calculator.id)
          .slice(0, 4);

        setRelatedCalculators(related);
      } catch (error) {
        // Error handled silently
      } finally {
        setLoadingRelated(false);
      }
    }

    fetchRelatedCalculators();
  }, [calculator]);

  // Fetch likes
  useEffect(() => {
    async function fetchLikes() {
      if (!calculator) return;

      try {
        setLoadingLikes(true);
        const data = await api.calculatorInteractions.getLikes(calculator.id);
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount);
      } catch (error) {
        // Error handled silently
      } finally {
        setLoadingLikes(false);
      }
    }

    fetchLikes();
  }, [calculator]);

  // Fetch ratings
  useEffect(() => {
    async function fetchRatings() {
      if (!calculator) return;

      try {
        setLoadingRatings(true);
        const data = await api.calculatorInteractions.getRatings(calculator.id);
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
        setUserRating(data.userRating);
        if (data.userRating) {
          setRating(data.userRating);
        }
      } catch (error) {
        // Error handled silently
      } finally {
        setLoadingRatings(false);
      }
    }

    fetchRatings();
  }, [calculator]);

  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      if (!calculator) return;

      try {
        setLoadingComments(true);
        const data = await api.calculatorInteractions.getComments(calculator.id);
        setComments(data);
      } catch (error) {
        // Error handled silently
      } finally {
        setLoadingComments(false);
      }
    }

    fetchComments();
  }, [calculator]);

  const handleLike = async () => {
    if (!calculator) return;

    // Check authentication
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like calculators.",
        variant: "destructive",
      });
      router.push('/auth');
      return;
    }

    try {
      const data = await api.calculatorInteractions.toggleLike(calculator.id);
      setIsLiked(data.liked);
      
      // Refresh like count
      const likesData = await api.calculatorInteractions.getLikes(calculator.id);
      setLikeCount(likesData.likeCount);

      toast({
        title: data.liked ? "Added to favorites!" : "Removed from favorites",
        description: data.liked ? "You can find it in your profile." : "",
      });
    } catch (error: any) {
      if (error.message && error.message.includes('Authentication required')) {
        toast({
          title: "Authentication Required",
          description: "Please log in to like calculators.",
          variant: "destructive",
        });
        router.push('/auth');
      } else {
        toast({
          title: "Error",
          description: "Failed to update like. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRatingClick = async (star: number) => {
    if (!calculator) return;

    // Check authentication
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to rate calculators.",
        variant: "destructive",
      });
      router.push('/auth');
      return;
    }

    try {
      await api.calculatorInteractions.submitRating(calculator.id, star);
      setRating(star);
      setUserRating(star);
      
      // Refresh rating stats
      const data = await api.calculatorInteractions.getRatings(calculator.id);
      setAverageRating(data.averageRating);
      setTotalRatings(data.totalRatings);

      toast({
        title: "Rating submitted!",
        description: "Thank you for your feedback.",
      });
    } catch (error: any) {
      if (error.message && error.message.includes('Authentication required')) {
        toast({
          title: "Authentication Required",
          description: "Please log in to rate calculators.",
          variant: "destructive",
        });
        router.push('/auth');
      } else {
        toast({
          title: "Error",
          description: "Failed to submit rating. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    if (!calculator) return;

    // Build the calculator URL
    const calculatorUrl = `${window.location.origin}/calculators/${calculator.category_slug}/${calculator.slug}`;
    const shareText = `Check out this ${calculator.name} calculator: ${calculatorUrl}`;
    const shareTitle = calculator.name;

    // Check if Web Share API is available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: calculatorUrl,
        });
        toast({
          title: "Shared successfully!",
          description: "The calculator link has been shared.",
        });
      } catch (error: any) {
        // User cancelled or error occurred
        if (error.name !== 'AbortError') {
          // Fall back to clipboard
          await copyToClipboard(calculatorUrl);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      await copyToClipboard(calculatorUrl);
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The calculator link has been copied to your clipboard.",
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast({
          title: "Link copied!",
          description: "The calculator link has been copied to your clipboard.",
        });
      } catch (err) {
        toast({
          title: "Failed to copy",
          description: "Please copy the link manually.",
          variant: "destructive",
        });
      }
      document.body.removeChild(textArea);
    }
  };

  const handleSubmitComment = async () => {
    if (!calculator || !comment.trim()) return;

    // Check authentication
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to comment on calculators.",
        variant: "destructive",
      });
      router.push('/auth');
      return;
    }

    try {
      setSubmittingComment(true);
      const newComment = await api.calculatorInteractions.submitComment(calculator.id, comment);
      setComments([newComment, ...comments]);
      setComment("");
      
      toast({
        title: "Comment submitted!",
        description: "Thank you for your feedback.",
      });
    } catch (error: any) {
      if (error.message && error.message.includes('Authentication required')) {
        toast({
          title: "Authentication Required",
          description: "Please log in to comment on calculators.",
          variant: "destructive",
        });
        router.push('/auth');
      } else {
        toast({
          title: "Error",
          description: "Failed to submit comment. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setSubmittingComment(false);
    }
  };

  // Check if calculator is valid (not null, undefined, or empty object)
  // A valid calculator should have at least an id or name
  const isValidCalculator = calculator && (
    (calculator.id !== undefined && calculator.id !== null) ||
    (calculator.name !== undefined && calculator.name !== null && calculator.name !== '')
  );

  if (!isValidCalculator) {
    // Return null during initial load to avoid showing error message prematurely
    if (calculator === null || calculator === undefined) {
      return null;
    }
    // Show error message if calculator exists but is invalid
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center text-muted-foreground">
          No calculator data available.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="w-full">
        <CardContent className="p-6">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 h-auto p-1">
              <TabsTrigger value="about" className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 whitespace-nowrap min-w-0">
                About
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 whitespace-nowrap min-w-0">
                <span className="hidden sm:inline">Reviews & Comments</span>
                <span className="sm:hidden">Reviews</span>
              </TabsTrigger>
              <button
                type="button"
                onClick={handleShare}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-2 sm:py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-background/50 min-w-0"
                )}
              >
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <TabsTrigger value="donate" disabled className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 whitespace-nowrap min-w-0">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Donate</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-0">
              <RichTextRenderer content={calculator?.description || null} />
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-0">
              <div className="space-y-6">
                {/* Rating Section */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">How would you rate this calculator?</p>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 cursor-pointer transition-colors ${
                            rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                          onClick={() => handleRatingClick(star)}
                        />
                      ))}
                      {loadingRatings ? (
                        <span className="text-sm text-muted-foreground ml-2">Loading...</span>
                      ) : (
                        <span className="text-sm text-muted-foreground ml-2">
                          {averageRating > 0 ? `${averageRating.toFixed(1)}` : 'No ratings yet'} 
                          {totalRatings > 0 && ` (${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'})`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Leave a comment</p>
                    <Textarea 
                      placeholder="Share your thoughts about this calculator..." 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                    />
                    <Button 
                      onClick={handleSubmitComment}
                      disabled={!comment.trim() || submittingComment}
                    >
                      {submittingComment ? "Submitting..." : "Submit Comment"}
                    </Button>
                  </div>
                </div>

                {/* Comments Display */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
                  {loadingComments ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse space-y-2">
                          <div className="h-4 bg-muted rounded w-1/4"></div>
                          <div className="h-20 bg-muted rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : comments.length > 0 ? (
                    <div className="space-y-4">
                      {comments.map((commentItem) => (
                        <Card key={commentItem.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-xs text-muted-foreground">
                                <span className={commentItem.isAuthenticated ? "font-medium text-foreground" : ""}>
                                  {commentItem.userName}
                                </span>
                                {' • '}
                                {new Date(commentItem.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{commentItem.comment}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="donate" className="mt-0">
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  disabled
                  size="lg"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Donate (Coming Soon)
                </Button>
                <p className="text-sm text-muted-foreground">
                  Donation functionality will be available soon. Thank you for your interest in supporting us!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Related Calculators</h2>
        {loadingRelated ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardFooter>
                  <div className="h-10 bg-muted rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : relatedCalculators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedCalculators.map(calc => (
              <Card key={calc.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{calc.name}</CardTitle>
                </CardHeader>
                <CardFooter>
                  <Button asChild variant="secondary" className="w-full">
                    <Link href={`/calculators/${calc.category_slug}/${calc.slug}`}>
                      Launch
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No related calculators found.</p>
        )}
      </div>
    </div>
  );
}
