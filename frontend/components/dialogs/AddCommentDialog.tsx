"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

interface AddCommentDialogProps {
  onAddComment: (commentText: string, isAnonymous: boolean) => void;
}

const AddCommentDialog: React.FC<AddCommentDialogProps> = ({
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (commentText.trim() === "") return;
    onAddComment(commentText, isAnonymous);
    setCommentText(""); // Clear input
    setIsAnonymous(false); // Reset checkbox
    setOpen(false); // Close dialog
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Comment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Comment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <label>Post as Anonymous</label>
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Add Comment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCommentDialog;
