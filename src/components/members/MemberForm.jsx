import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const COLORS = ["blue", "green", "purple", "orange", "pink", "yellow", "teal", "red"];
const EMOJIS = ["👨", "👩", "🧑", "👦", "👧", "🧔", "👱", "🧓", "👶", "🐱", "🐶", "🦊"];
const AGE_GROUPS = [
  { value: "preschool", label: "Preschool/Early Elementary", icon: "🎨" },
  { value: "middle_school", label: "Middle/High School", icon: "🎓" },
  { value: "adult", label: "Adult", icon: "👔" }
];

const colorStyles = {
  blue: "bg-blue-400",
  green: "bg-emerald-400",
  purple: "bg-purple-400",
  orange: "bg-orange-400",
  pink: "bg-pink-400",
  yellow: "bg-amber-400",
  teal: "bg-teal-400",
  red: "bg-red-400"
};

export default function MemberForm({ open, onOpenChange, member, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    avatar_color: "blue",
    emoji: "👤",
    age_group: "adult",
    jar_capacity: 5,
    is_active: true
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || "",
        avatar_color: member.avatar_color || "blue",
        emoji: member.emoji || "👤",
        age_group: member.age_group || "adult",
        jar_capacity: member.jar_capacity || 5,
        is_active: member.is_active !== false
      });
    } else {
      setFormData({
        name: "",
        avatar_color: "blue",
        emoji: "👤",
        age_group: "adult",
        jar_capacity: 5,
        is_active: true
      });
    }
  }, [member, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, member?.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {member ? "Edit Member" : "Add New Member"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              className="h-12 rounded-xl"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Avatar</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, emoji })}
                  className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                    formData.emoji === emoji
                      ? "bg-gray-900 scale-110 shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar_color: color })}
                  className={`w-10 h-10 rounded-xl transition-all ${colorStyles[color]} ${
                    formData.avatar_color === color
                      ? "ring-2 ring-offset-2 ring-gray-900 scale-110"
                      : "hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Age Group & Reward System</Label>
            <Select
              value={formData.age_group}
              onValueChange={(value) => setFormData({ ...formData, age_group: value })}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AGE_GROUPS.map((group) => (
                  <SelectItem key={group.value} value={group.value}>
                    <span className="flex items-center gap-2">
                      <span>{group.icon}</span>
                      <span>{group.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.age_group === "preschool" && (
            <div className="space-y-2">
              <Label htmlFor="jar_capacity">Jar Capacity (chores to fill)</Label>
              <Input
                id="jar_capacity"
                type="number"
                min="3"
                max="20"
                value={formData.jar_capacity}
                onChange={(e) => setFormData({ ...formData, jar_capacity: parseInt(e.target.value) })}
                className="h-12 rounded-xl"
              />
              <p className="text-xs text-gray-500">
                How many chores needed before prize wheel spin
              </p>
            </div>
          )}

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
              {member ? "Save Changes" : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}