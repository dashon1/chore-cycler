import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, CheckCircle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";

const colorClasses = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
  purple: "bg-purple-100 text-purple-700",
  orange: "bg-orange-100 text-orange-700",
  pink: "bg-pink-100 text-pink-700",
  yellow: "bg-amber-100 text-amber-700",
  teal: "bg-teal-100 text-teal-700",
  red: "bg-red-100 text-red-700"
};

export default function RewardHistory() {
  const { data: rewardWins = [], isLoading } = useQuery({
    queryKey: ["rewardWins"],
    queryFn: () => base44.entities.RewardWin.list("-created_date", 100)
  });

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: () => base44.entities.Member.list()
  });

  const { data: rewards = [] } = useQuery({
    queryKey: ["rewards"],
    queryFn: () => base44.entities.Reward.list()
  });

  const speakReward = (rewardTitle) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`You won: ${rewardTitle}`);
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Reward History</h1>
            <p className="text-gray-500 text-sm">All prizes won by family members</p>
          </div>
        </div>

        {/* Reward Wins List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : rewardWins.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No rewards won yet</h3>
            <p className="text-gray-500">Complete chores to fill the responsibility jar and win prizes!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rewardWins.map(win => {
              const member = members.find(m => m.id === win.member_id);
              const reward = rewards.find(r => r.id === win.reward_id);
              const colorClass = colorClasses[member?.avatar_color] || colorClasses.blue;

              return (
                <motion.div
                  key={win.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center text-3xl shrink-0">
                      {reward?.icon || "🎁"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                          <span>{member?.emoji || "👤"}</span>
                          {member?.name || "Unknown"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {format(parseISO(win.created_date), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{reward?.title || "Unknown Reward"}</h3>
                      {reward?.description && (
                        <p className="text-sm text-gray-500 mt-1">{reward.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      {member?.age_group === "preschool" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => speakReward(reward?.title)}
                          className="h-8 w-8 rounded-lg"
                          title="Hear this reward"
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      )}
                      {win.claimed && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Claimed
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}