import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { Calendar } from "lucide-react";
import { format } from "date-fns";

export default function ManualAssignForm({ open, onOpenChange, members, chores, onAssign }) {
  const [formData, setFormData] = useState({
    chore_id: "",
    member_id: "",
    due_date: format(new Date(), "yyyy-MM-dd")
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(formData);
    setFormData({
      chore_id: "",
      member_id: "",
      due_date: format(new Date(), "yyyy-MM-dd")
    });
  };

  const activeMembers = members.filter(m => m.is_active !== false);
  const activeChores = chores.filter(c => c.is_active !== false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Manually Assign Chore</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label>Select Chore</Label>
            <Select
              value={formData.chore_id}
              onValueChange={(value) => setFormData({ ...formData, chore_id: value })}
              required
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Choose a chore" />
              </SelectTrigger>
              <SelectContent>
                {activeChores.map(chore => (
                  <SelectItem key={chore.id} value={chore.id}>
                    <span className="flex items-center gap-2">
                      <span>{chore.icon || "🧹"}</span>
                      <span>{chore.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assign To</Label>
            <Select
              value={formData.member_id}
              onValueChange={(value) => setFormData({ ...formData, member_id: value })}
              required
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Choose a member" />
              </SelectTrigger>
              <SelectContent>
                {activeMembers.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    <span className="flex items-center gap-2">
                      <span>{member.emoji || "👤"}</span>
                      <span>{member.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="h-12 rounded-xl"
              required
            />
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
            <Button
              type="submit"
              className="rounded-xl bg-gray-900 hover:bg-gray-800"
            >
              Assign Chore
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}