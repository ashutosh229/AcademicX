"use client";

import { getUserVote } from "@/lib/utils";
import { setError, setLoading } from "@/redux/slices/courseSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useComments = (backendDomain: string, session: any, courseData: any) => {
  const dispatch = useDispatch();

  const apiCall = useCallback(
    async (url: string, body: object, errorMessage: string) => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error(errorMessage);

        return response.json();
      } catch (error: any) {
        console.error(error);
        toast.error(error.message);
        throw error; // Re-throw for handling in calling function
      }
    },
    []
  );

  // 📝 Add Comment
  const addComment = useCallback(
    async (
      activeCourseId: number,
      commentText: string,
      isAnonymous: boolean,
      setIsOpen: (state: boolean) => void
    ) => {
      dispatch(setLoading(true));

      try {
        await apiCall(
          `${backendDomain}/add_comment/`,
          {
            course: activeCourseId,
            text: commentText,
            contributor: session?.user.email?.toString(),
            is_anonymous: isAnonymous,
          },
          "Unable to add comment"
        );

        toast.success("Added comment successfully");
        setIsOpen(false);
      } catch (error: any) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [apiCall, backendDomain, dispatch, session]
  );

  // ❌ Delete Comment
  const deleteComment = useCallback(
    async (id: number, setDeleteDialogOpen: (state: number | null) => void) => {
      dispatch(setLoading(true));

      try {
        await apiCall(
          `${backendDomain}/delete_comment/`,
          {
            email: session?.user.email?.toString(),
            comment_id: id,
          },
          "Unable to delete the comment"
        );

        toast.success("Deleted the comment successfully");
        setDeleteDialogOpen(null);
      } catch (error: any) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [apiCall, backendDomain, dispatch, session]
  );

  // ✅ Handle Upvote & Downvote
  const handleVote = useCallback(
    async (id: number, type: "upvote" | "downvote") => {
      dispatch(setLoading(true));

      const performAction = async (
        url: string,
        successMessage: string,
        errorMessage: string
      ) => {
        try {
          await apiCall(
            `${backendDomain}/comments/${url}/`,
            {
              email: session?.user.email?.toString(),
              comment_id: id,
            },
            errorMessage
          );

          toast.success(successMessage);
        } catch (error: any) {
          dispatch(setError(error.message));
        }
      };

      const userVote = getUserVote(courseData?.comments, id);

      if (type === "upvote") {
        switch (userVote) {
          case 0:
            await performAction(
              "upvote",
              "Upvoted successfully",
              "Unable to upvote"
            );
            break;
          case 1:
            await performAction(
              "remove_upvote",
              "Upvote removed",
              "Unable to remove the upvote"
            );
            break;
          case 2:
            await performAction(
              "remove_downvote",
              "Removed downvote",
              "Unable to remove the downvote"
            );
            await performAction(
              "upvote",
              "Upvoted successfully",
              "Unable to upvote"
            );
            break;
          default:
            console.warn("Unexpected vote state");
        }
      } else if (type === "downvote") {
        switch (userVote) {
          case 0:
            await performAction(
              "downvote",
              "Downvoted successfully",
              "Unable to downvote"
            );
            break;
          case 2:
            await performAction(
              "remove_downvote",
              "Downvote removed",
              "Unable to remove the downvote"
            );
            break;
          case 1:
            await performAction(
              "remove_upvote",
              "Removed upvote",
              "Unable to remove the upvote"
            );
            await performAction(
              "downvote",
              "Downvoted successfully",
              "Unable to downvote"
            );
            break;
          default:
            console.warn("Unexpected vote state");
        }
      }

      dispatch(setLoading(false));
    },
    [apiCall, backendDomain, dispatch, session, courseData]
  );

  const upvoteComment = useCallback(
    (id: number) => handleVote(id, "upvote"),
    [handleVote]
  );
  const downvoteComment = useCallback(
    (id: number) => handleVote(id, "downvote"),
    [handleVote]
  );

  return {
    addComment,
    deleteComment,
    upvoteComment,
    downvoteComment,
  };
};

export default useComments;
