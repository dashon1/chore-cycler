import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import MemberCard from "@/components/members/MemberCard";
import MemberForm from "@/components/members/MemberForm";

export default function Members() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: () => base44.entities.Member.list()
  });

  const createMemberMutation = useMutation({
    mutationFn: (data) => base44.entities.Member.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setFormOpen(false);
    }
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Member.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setFormOpen(false);
      setEditingMember(null);
    }
  });

  const handleSave = (data, id) => {
    if (id) {
      updateMemberMutation.mutate({ id, data });
    } else {
      createMemberMutation.mutate(data);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormOpen(true);
  };

  const handleToggleActive = (member) => {
    updateMemberMutation.mutate({
      id: member.id,
      data: { is_active: !member.is_active }
    });
  };

  const activeMembers = members.filter((m) => m.is_active !== false);
  const inactiveMembers = members.filter((m) => m.is_active === false);

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
            <h1 className="text-2xl font-bold text-gray-900">Household Members</h1>
            <p className="text-gray-500 text-sm">Manage who does the chores</p>
          </div>
          <Button
            onClick={() => {
              setEditingMember(null);
              setFormOpen(true);
            }}
            className="bg-gray-900 hover:bg-gray-800 rounded-xl h-11 px-5"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Members List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No members yet</h3>
            <p className="text-gray-500 mb-6">Add your household members to start scheduling chores.</p>
            <Button
              onClick={() => setFormOpen(true)}
              className="bg-gray-900 hover:bg-gray-800 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Member
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {activeMembers.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Active Members ({activeMembers.length})
                </h2>
                <div className="grid gap-4">
                  <AnimatePresence>
                    {activeMembers.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        onEdit={handleEdit}
                        onToggleActive={handleToggleActive}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {inactiveMembers.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Inactive Members ({inactiveMembers.length})
                </h2>
                <div className="grid gap-4">
                  <AnimatePresence>
                    {inactiveMembers.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        onEdit={handleEdit}
                        onToggleActive={handleToggleActive}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        )}

        <MemberForm
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) setEditingMember(null);
          }}
          member={editingMember}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}