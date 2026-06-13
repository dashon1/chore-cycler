import React, { useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import AssignmentCard from "@/components/assignments/AssignmentCard";

export default function Assignments() {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: () => base44.entities.Assignment.list("-due_date", 100)
  });

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: () => base44.entities.Member.list()
  });

  const { data: chores = [] } = useQuery({
    queryKey: ["chores"],
    queryFn: () => base44.entities.Chore.list()
  });

  const filteredAssignments = useMemo(() => {
    if (statusFilter === "all") return assignments;
    return assignments.filter(a => a.status === statusFilter);
  }, [assignments, statusFilter]);

  const statusTitle = {
    all: "All Assignments",
    pending: "Pending Chores",
    completed: "Completed Chores",
    skipped: "Skipped Chores"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{statusTitle[statusFilter]}</h1>
            <p className="text-gray-500 text-sm">{filteredAssignments.length} total</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              {statusFilter === "completed" ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <Clock className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No {statusFilter} chores</h3>
            <p className="text-gray-500">There are no chores with this status.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAssignments.map(assignment => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                chore={chores.find(c => c.id === assignment.chore_id)}
                member={members.find(m => m.id === assignment.member_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}