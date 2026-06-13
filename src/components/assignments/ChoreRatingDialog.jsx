import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Star, Volume2 } from "lucide-react";

export default function ChoreRatingDialog({ open, onOpenChange, assignment, chore, member, onRate }) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [pointAdjustment, setPointAdjustment] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onRate({
      assignment_id: assignment.id,
      rating,
      feedback,
      point_adjustment: pointAdjustment
    });
    setRating(5);
    setFeedback("");
    setPointAdjustment(1);
  };

  const speakFeedback = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const ratingOptions = [
    { stars: 5, label: "Excellent!", points: 1, color: "text-green-500" },
    { stars: 4, label: "Good Job", points: 0.75, color: "text-blue-500" },
    { stars: 3, label: "Okay", points: 0.5, color: "text-yellow-500" },
    { stars: 2, label: "Needs Work", points: 0.25, color: "text-orange-500" },
    { stars: 1, label: "Try Again", points: 0, color: "text-red-500" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Rate Chore Completion</DialogTitle>
          <p className="text-sm text-gray-500">
            {member?.emoji} {member?.name} - {chore?.name}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-3">
            <Label>Performance Rating</Label>
            <div className="space-y-2">
              {ratingOptions.map(option => (
                <button
                  key={option.stars}
                  type="button"
                  onClick={() => {
                    setRating(option.stars);
                    setPointAdjustment(option.points);
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    rating === option.stars
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[...Array(option.stars)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 fill-current ${option.color}`} />
                        ))}
                      </div>
                      <span className="font-semibold">{option.label}</span>
                    </div>
                    <span className="text-sm text-gray-500">+{option.points} points</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback for {member?.name}</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Great job! Next time remember to..."
              className="rounded-xl resize-none"
              rows={3}
            />
            {feedback && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => speakFeedback(feedback)}
                className="rounded-lg"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Hear Feedback
              </Button>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-gray-900 hover:bg-gray-800">
              Complete Chore
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}