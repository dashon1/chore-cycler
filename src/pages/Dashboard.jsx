import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, startOfWeek, endOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RefreshCw, Sparkles, CalendarDays, Users, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import WeeklyView from "@/components/schedule/WeeklyView";
import AssignmentCard from "@/components/assignments/AssignmentCard";
import ResponsibilityJar from "@/components/rewards/ResponsibilityJar";
import PrizeWheel from "@/components/rewards/PrizeWheel";
import ManualAssignForm from "@/components/assignments/ManualAssignForm";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [wheelMember, setWheelMember] = useState(null);
  const [manualAssignOpen, setManualAssignOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: () => base44.entities.Member.list()
  });

  const { data: chores = [] } = useQuery({
    queryKey: ["chores"],
    queryFn: () => base44.entities.Chore.list()
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ["assignments"],
    queryFn: () => base44.entities.Assignment.list("-due_date", 100)
  });

  const { data: rewards = [] } = useQuery({
    queryKey: ["rewards"],
    queryFn: () => base44.entities.Reward.list()
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Assignment.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assignments"] })
  });

  const createAssignmentsMutation = useMutation({
    mutationFn: (data) => base44.entities.Assignment.bulkCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    }
  });

  const createSingleAssignmentMutation = useMutation({
    mutationFn: (data) => base44.entities.Assignment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      setManualAssignOpen(false);
    }
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Member.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] })
  });

  const createRewardWinMutation = useMutation({
    mutationFn: (data) => base44.entities.RewardWin.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rewardWins"] })
  });

  const activeMembers = members.filter((m) => m.is_active !== false);
  const activeChores = chores.filter((c) => c.is_active !== false);

  const todayAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const dueDate = a.due_date ? parseISO(a.due_date) : null;
      return dueDate && isSameDay(dueDate, selectedDate);
    });
  }, [assignments, selectedDate]);

  const handleComplete = async (assignment, ratingData) => {
    // Update assignment status
    const updateData = { 
      status: "completed", 
      completed_date: format(new Date(), "yyyy-MM-dd")
    };
    
    if (ratingData) {
      updateData.rating = ratingData.rating;
      updateData.feedback = ratingData.feedback;
    }
    
    updateAssignmentMutation.mutate({
      id: assignment.id,
      data: updateData
    });

    // Add points to member if preschool age group
    const member = members.find(m => m.id === assignment.member_id);
    if (member && member.age_group === "preschool") {
      const pointsToAdd = ratingData?.point_adjustment ?? 1;
      const newPoints = (member.responsibility_points || 0) + pointsToAdd;
      updateMemberMutation.mutate({
        id: member.id,
        data: { responsibility_points: newPoints }
      });
    }
  };

  const handleSkip = (assignment) => {
    updateAssignmentMutation.mutate({
      id: assignment.id,
      data: { status: "skipped" }
    });
  };

  const generateWeeklySchedule = () => {
    if (activeMembers.length === 0 || activeChores.length === 0) return;

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const newAssignments = [];
    let memberIndex = 0;

    activeChores.forEach((chore) => {
      const daysToAssign = chore.frequency === "daily" 
        ? 7 
        : chore.frequency === "weekly" 
        ? 1 
        : chore.frequency === "biweekly"
        ? 1
        : 1;

      for (let i = 0; i < daysToAssign; i++) {
        const dayOffset = chore.frequency === "daily" ? i : Math.floor(Math.random() * 7);
        const dueDate = addDays(weekStart, dayOffset);

        newAssignments.push({
          chore_id: chore.id,
          member_id: activeMembers[memberIndex % activeMembers.length].id,
          due_date: format(dueDate, "yyyy-MM-dd"),
          status: "pending"
        });

        memberIndex++;
      }
    });

    createAssignmentsMutation.mutate(newAssignments);
  };

  const completedCount = todayAssignments.filter((a) => a.status === "completed").length;
  const pendingCount = todayAssignments.filter((a) => a.status === "pending").length;

  const preschoolMembers = activeMembers.filter(m => m.age_group === "preschool");
  const preschoolRewards = rewards.filter(r => r.age_group === "preschool" && r.is_active !== false);

  const handleWinReward = (member, reward) => {
    // Record the win
    createRewardWinMutation.mutate({
      member_id: member.id,
      reward_id: reward.id
    });

    // Reset member's jar
    updateMemberMutation.mutate({
      id: member.id,
      data: { responsibility_points: 0 }
    });
  };

  const handleManualAssign = (data) => {
    createSingleAssignmentMutation.mutate({
      ...data,
      status: "pending"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Chore Scheduler</h1>
            <p className="text-gray-500 mt-1">Keep your household running smoothly</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setManualAssignOpen(true)}
              disabled={activeMembers.length === 0 || activeChores.length === 0}
              variant="outline"
              className="rounded-xl h-12 px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Assign Manually
            </Button>
            <Button
              onClick={generateWeeklySchedule}
              disabled={activeMembers.length === 0 || activeChores.length === 0}
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl h-12 px-6 shadow-lg shadow-purple-200"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Schedule
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Link to={createPageUrl("Assignments") + "?status=completed"} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </Link>
          <Link to={createPageUrl("Assignments") + "?status=pending"} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </Link>
          <Link to={createPageUrl("Members")} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeMembers.length}</p>
                <p className="text-xs text-gray-500">Members</p>
              </div>
            </div>
          </Link>
          <Link to={createPageUrl("Chores")} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeChores.length}</p>
                <p className="text-xs text-gray-500">Chores</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Preschool Responsibility Jars */}
        {preschoolMembers.length > 0 && (
          <div className="grid gap-4 mb-8">
            {preschoolMembers.map(member => (
              <ResponsibilityJar
                key={member.id}
                member={member}
                onSpinWheel={() => setWheelMember(member)}
              />
            ))}
          </div>
        )}

        {/* Weekly Calendar */}
        <WeeklyView
          assignments={assignments}
          chores={chores}
          members={members}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Today's Tasks */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {isSameDay(selectedDate, new Date())
                ? "Today's Tasks"
                : format(selectedDate, "EEEE, MMMM d")}
            </h2>
          </div>

          {activeMembers.length === 0 || activeChores.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Started</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Add some members and chores first, then generate your schedule.
              </p>
              <div className="flex gap-3 justify-center">
                <Link to={createPageUrl("Members")}>
                  <Button variant="outline" className="rounded-xl">
                    <Users className="w-4 h-4 mr-2" />
                    Add Members
                  </Button>
                </Link>
                <Link to={createPageUrl("Chores")}>
                  <Button variant="outline" className="rounded-xl">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Add Chores
                  </Button>
                </Link>
              </div>
            </div>
          ) : todayAssignments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks for this day</h3>
              <p className="text-gray-500">Click "Generate Schedule" to create assignments.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {todayAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    chore={chores.find((c) => c.id === assignment.chore_id)}
                    member={members.find((m) => m.id === assignment.member_id)}
                    onComplete={handleComplete}
                    onSkip={handleSkip}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Prize Wheel Modal */}
        {wheelMember && (
          <PrizeWheel
            open={!!wheelMember}
            onOpenChange={(open) => !open && setWheelMember(null)}
            rewards={preschoolRewards}
            onWinReward={(reward) => handleWinReward(wheelMember, reward)}
            memberName={wheelMember.name}
          />
        )}

        {/* Manual Assignment Modal */}
        <ManualAssignForm
          open={manualAssignOpen}
          onOpenChange={setManualAssignOpen}
          members={activeMembers}
          chores={activeChores}
          onAssign={handleManualAssign}
        />
      </div>
    </div>
  );
}