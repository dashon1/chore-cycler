import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowLeft, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

import ChoreCard from "@/components/chores/ChoreCard";
import ChoreForm from "@/components/chores/ChoreForm";

export default function Chores() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingChore, setEditingChore] = useState(null);
  const [deleteChore, setDeleteChore] = useState(null);
  const queryClient = useQueryClient();

  const { data: chores = [], isLoading } = useQuery({
    queryKey: ["chores"],
    queryFn: () => base44.entities.Chore.list()
  });

  const createChoreMutation = useMutation({
    mutationFn: (data) => base44.entities.Chore.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chores"] });
      setFormOpen(false);
    }
  });

  const updateChoreMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Chore.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chores"] });
      setFormOpen(false);
      setEditingChore(null);
    }
  });

  const deleteChoreMutation = useMutation({
    mutationFn: (id) => base44.entities.Chore.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chores"] });
      setDeleteChore(null);
    }
  });

  const handleSave = (data, id) => {
    if (id) {
      updateChoreMutation.mutate({ id, data });
    } else {
      createChoreMutation.mutate(data);
    }
  };

  const handleEdit = (chore) => {
    setEditingChore(chore);
    setFormOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteChore) {
      deleteChoreMutation.mutate(deleteChore.id);
    }
  };

  const activeChores = chores.filter((c) => c.is_active !== false);
  const inactiveChores = chores.filter((c) => c.is_active === false);

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
            <h1 className="text-2xl font-bold text-gray-900">Household Chores</h1>
            <p className="text-gray-500 text-sm">Define and manage your chores</p>
          </div>
          <Button
            onClick={() => {
              setEditingChore(null);
              setFormOpen(true);
            }}
            className="bg-gray-900 hover:bg-gray-800 rounded-xl h-11 px-5"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Chore
          </Button>
        </div>

        {/* Chores List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : chores.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No chores yet</h3>
            <p className="text-gray-500 mb-6">Add chores that need to be done around the house.</p>
            <Button
              onClick={() => setFormOpen(true)}
              className="bg-gray-900 hover:bg-gray-800 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Chore
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {activeChores.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Active Chores ({activeChores.length})
                </h2>
                <div className="grid gap-4">
                  <AnimatePresence>
                    {activeChores.map((chore) => (
                      <ChoreCard
                        key={chore.id}
                        chore={chore}
                        onEdit={handleEdit}
                        onDelete={setDeleteChore}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {inactiveChores.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Inactive Chores ({inactiveChores.length})
                </h2>
                <div className="grid gap-4">
                  <AnimatePresence>
                    {inactiveChores.map((chore) => (
                      <ChoreCard
                        key={chore.id}
                        chore={chore}
                        onEdit={handleEdit}
                        onDelete={setDeleteChore}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        )}

        <ChoreForm
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) setEditingChore(null);
          }}
          chore={editingChore}
          onSave={handleSave}
        />

        <AlertDialog open={!!deleteChore} onOpenChange={(open) => !open && setDeleteChore(null)}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Chore</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deleteChore?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 rounded-xl"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}