"use client";

import { getUserVoteForResources } from "@/lib/utils";
import { setError, setLoading } from "@/redux/slices/courseSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useResources = (
  backendDomain: string,
  session: any,
  courseData: any,
  activeCourseId: number | null
) => {
  const dispatch = useDispatch();

  const apiCall = useCallback(
    async (url: string, body: object, errorMessage: string) => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
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

  // 📌 Add Resource
  const addResource = useCallback(
    async (
      name: string,
      remarks: string,
      url: string,
      isAnonymous: boolean
    ) => {
      dispatch(setLoading(true));

      try {
        await apiCall(
          `${backendDomain}/add_resource`,
          {
            course: activeCourseId,
            name,
            remarks,
            url,
            contributor: session?.user.email?.toString(),
            is_anonymous: isAnonymous,
          },
          "Unable to add the resource"
        );

        toast.success("Added the resource successfully");
      } catch (error: any) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [apiCall, backendDomain, dispatch, session, activeCourseId]
  );

  // ❌ Delete Resource
  const deleteResource = useCallback(
    async (id: number) => {
      dispatch(setLoading(true));

      try {
        await apiCall(
          `${backendDomain}/delete_resource`,
          {
            email: session?.user.email?.toString(),
            resource_id: id,
          },
          "Unable to delete the resource"
        );

        toast.success("Deleted the resource successfully");
      } catch (error: any) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [apiCall, backendDomain, dispatch, session]
  );

  // 🔺 Handle Upvote & Downvote
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
            `${backendDomain}/resources/${url}`,
            {
              email: session?.user.email?.toString(),
              resource_id: id,
            },
            errorMessage
          );

          toast.success(successMessage);
        } catch (error: any) {
          dispatch(setError(error.message));
        }
      };

      const userVote = getUserVoteForResources(courseData?.resources, id);

      if (type === "upvote") {
        switch (userVote) {
          case 0:
            await performAction(
              "upvote",
              "Upvoted successfully",
              "Unable to upvote the resource"
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
              "Unable to upvote the resource"
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
              "Unable to downvote the resource"
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
              "Unable to downvote the resource"
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

  const upvoteResource = useCallback(
    (id: number) => handleVote(id, "upvote"),
    [handleVote]
  );
  const downvoteResource = useCallback(
    (id: number) => handleVote(id, "downvote"),
    [handleVote]
  );

  return {
    addResource,
    deleteResource,
    upvoteResource,
    downvoteResource,
  };
};

export default useResources;
