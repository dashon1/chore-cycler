import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowLeft, Gift, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";

const REWARD_EMOJIS = ["🎁", "🍦", "📺", "🎮", "🎨", "🚴", "🎬", "🍕", "📚", "🎵", "🧸", "🏆"];

const AGE_GROUP_LABELS = {
  preschool: { label: "Preschool", icon: "🎨", color: "bg-pink-100 text-pink-700" },
  middle_school: { label: "Middle School", icon: "🎓", color: "bg-blue-100 text-blue-700" },
  adult: { label: "Adult", icon: "👔", color: "bg-gray-100 text-gray-700" }
};

export default function Rewards() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [activeTab, setActiveTab] = useState("preschool");
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    age_group: "preschool",
    icon: "🎁",
    is_active: true
  });

  const { data: rewards = [], isLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: () => base44.entities.Reward.list()
  });

  const createRewardMutation = useMutation({
    mutationFn: (data) => base44.entities.Reward.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      setFormOpen(false);
      resetForm();
    }
  });

  const updateRewardMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Reward.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      setFormOpen(false);
      setEditingReward(null);
      resetForm();
    }
  });

  const deleteRewardMutation = useMutation({
    mutationFn: (id) => base44.entities.Reward.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rewards"] })
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      age_group: activeTab,
      icon: "🎁",
      is_active: true
    });
  };

  const handleOpenForm = (reward = null) => {
    if (reward) {
      setEditingReward(reward);
      setFormData({
        title: reward.title || "",
        description: reward.description || "",
        age_group: reward.age_group || activeTab,
        icon: reward.icon || "🎁",
        is_active: reward.is_active !== false
      });
    } else {
      setEditingReward(null);
      resetForm();
    }
    setFormOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingReward) {
      updateRewardMutation.mutate({ id: editingReward.id, data: formData });
    } else {
      createRewardMutation.mutate(formData);
    }
  };

  const rewardsByAgeGroup = {
    preschool: rewards.filter(r => r.age_group === "preschool"),
    middle_school: rewards.filter(r => r.age_group === "middle_school"),
    adult: rewards.filter(r => r.age_group === "adult")
  };

  const RewardCard = ({ reward }) => {
    const ageGroupInfo = AGE_GROUP_LABELS[reward.age_group] || AGE_GROUP_LABELS.preschool;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-2xl shrink-0">
            {reward.icon || "🎁"}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{reward.title}</h3>
            {reward.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{reward.description}</p>
            )}
          </div>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenForm(reward)}
              className="h-8 w-8 rounded-lg"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteRewardMutation.mutate(reward.id)}
              className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Reward Management</h1>
            <p className="text-gray-500 text-sm">Set up prizes for each age group</p>
          </div>
          <Button
            onClick={() => handleOpenForm()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl h-11 px-5"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Reward
          </Button>
        </div>

        {/* Age Group Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-white rounded-xl border border-gray-200">
            {Object.entries(AGE_GROUP_LABELS).map(([key, { label, icon }]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="rounded-lg py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                <span className="mr-2">{icon}</span>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(AGE_GROUP_LABELS).map(([key, { label, icon, color }]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className={`p-4 rounded-xl ${color} border`}>
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  {label} Rewards
                </h3>
                <p className="text-sm mt-1 opacity-80">
                  {key === "preschool" && "Simple rewards that appear on the Prize Wheel"}
                  {key === "middle_school" && "Privileges that can be purchased with points"}
                  {key === "adult" && "Shared bonuses for household efficiency"}
                </p>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : rewardsByAgeGroup[key].length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No rewards yet</h3>
                  <p className="text-gray-500 mb-6">Add rewards for {label.toLowerCase()} members</p>
                  <Button
                    onClick={() => handleOpenForm()}
                    className="bg-gray-900 hover:bg-gray-800 rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Reward
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3">
                  <AnimatePresence>
                    {rewardsByAgeGroup[key].map(reward => (
                      <RewardCard key={reward.id} reward={reward} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Reward Form Dialog */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>{editingReward ? "Edit Reward" : "Add New Reward"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Reward Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Extra bedtime story"
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
                  placeholder="Details about the reward"
                  className="rounded-xl resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Age Group</Label>
                <Select
                  value={formData.age_group}
                  onValueChange={(value) => setFormData({ ...formData, age_group: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(AGE_GROUP_LABELS).map(([key, { label, icon }]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <span>{icon}</span>
                          {label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2">
                  {REWARD_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                        formData.icon === emoji
                          ? "bg-gray-900 scale-110 shadow-lg"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormOpen(false);
                    setEditingReward(null);
                    resetForm();
                  }}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl bg-gray-900 hover:bg-gray-800">
                  {editingReward ? "Save Changes" : "Add Reward"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}