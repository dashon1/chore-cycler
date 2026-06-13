import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

const CHORE_EMOJIS = ["🧹", "🍽️", "🧺", "🚿", "🛒", "🗑️", "🧽", "🌿", "🐕", "🚗", "📦", "🔧"];

export default function ChoreForm({ open, onOpenChange, chore, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    frequency: "weekly",
    difficulty: "medium",
    icon: "🧹",
    is_active: true
  });

  useEffect(() => {
    if (chore) {
      setFormData({
        name: chore.name || "",
        description: chore.description || "",
        frequency: chore.frequency || "weekly",
        difficulty: chore.difficulty || "medium",
        icon: chore.icon || "🧹",
        is_active: chore.is_active !== false
      });
    } else {
      setFormData({
        name: "",
        description: "",
        frequency: "weekly",
        difficulty: "medium",
        icon: "🧹",
        is_active: true
      });
    }
  }, [chore, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, chore?.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {chore ? "Edit Chore" : "Add New Chore"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Chore Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Wash dishes"
              className="h-12 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="How should this chore be done?"
              className="rounded-xl resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {CHORE_EMOJIS.map((emoji) => {
                const iconLabels = {
                  "🧹": "Broom - Sweeping",
                  "🍽️": "Dishes - Washing dishes",
                  "🧺": "Laundry - Washing clothes",
                  "🚿": "Shower - Cleaning bathroom",
                  "🛒": "Shopping - Grocery shopping",
                  "🗑️": "Trash - Taking out trash",
                  "🧽": "Sponge - Scrubbing/Cleaning",
                  "🌿": "Plant - Watering plants",
                  "🐕": "Dog - Walking pet",
                  "🚗": "Car - Washing car",
                  "📦": "Box - Organizing/Packing",
                  "🔧": "Wrench - Fixing things"
                };
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    title={iconLabels[emoji] || emoji}
                    className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                      formData.icon === emoji
                        ? "bg-gray-900 scale-110 shadow-lg"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              {chore ? "Save Changes" : "Add Chore"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}