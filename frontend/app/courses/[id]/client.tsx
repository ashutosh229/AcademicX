"use client";

import ChartCard from "@/components/charts/chartCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  formatString,
  getUserVote,
  getUserVoteForResources,
} from "@/lib/utils";
import { setError, setLoading } from "@/redux/slices/courseSlice";
import { RootState } from "@/redux/store";
import { backendDomain, Comment, CourseDetails, Resource } from "@/types/types";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ExternalLink,
  Plus,
  ThumbsDown,
  ThumbsUp,
  Trash,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CoursePageClient = () => {
  const { data: session } = useSession();
  const { activeCourseId, error, loading, courses } = useSelector(
    (state: RootState) => state.course
  );
  const dispatch = useDispatch();
  const [courseData, setCourseData] = useState<CourseDetails | null>(null);

  //comments states
  const [isOpen, setIsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<"By Date" | "By Upvotes">(
    "By Upvotes"
  );

  //resources states
  const [isOpenForResources, setIsOpenForResources] = useState(false);
  const [resourceName, setResourceName] = useState("");
  const [resourceRemarks, setResourceRemarks] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [isAnonymousForResources, setIsAnonymousForResources] = useState(false);
  const [deleteDialogOpenForResource, setDeleteDialogOpenForResource] =
    useState<number | null>(null);
  const [sortOptionForResources, setSortOptionForResources] = useState<
    "By Date" | "By Upvotes"
  >("By Upvotes");

  // Performance improvement: Only filter once as a memoized value
  const activeCourse = useMemo(() => {
    return courses.find((course) => course.id === activeCourseId) || null;
  }, [courses, activeCourseId]);

  // Performance improvement: Use useCallback for fetch functions
  const fetchDetails = useCallback(async () => {
    if (!activeCourseId || !session?.user.email) return; // Guard clause to prevent unnecessary fetches

    dispatch(setLoading(true));
    try {
      const response = await fetch(`${backendDomain}/get_course_details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: session.user.email.toString(),
          course_id: activeCourseId,
        }),
      });
      if (!response.ok) {
        throw new Error("Course details could not be fetched properly");
      }
      const data = await response.json();
      setCourseData(data);
    } catch (error: any) {
      console.log(error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false)); // Always set loading to false, even on error
    }
  }, [activeCourseId, session?.user.email, dispatch]);

  // Performance improvement: Better dependency array and condition
  useEffect(() => {
    if (activeCourseId && session?.user.email) {
      fetchDetails();
    }
  }, [activeCourseId, session?.user.email, fetchDetails]);

  // Performance improvement: Memoize handlers with useCallback
  const handleAddComment = useCallback(
    async (commentText: string, isAnonymous: boolean) => {
      if (!commentText.trim() || !activeCourseId || !session?.user.email)
        return; // Validation

      dispatch(setLoading(true));
      try {
        const response = await fetch(`${backendDomain}/add_comment/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            course: activeCourseId,
            text: commentText,
            contributor: session.user.email.toString(),
            is_anonymous: isAnonymous,
          }),
        });
        if (!response.ok) {
          throw new Error("Unable to add the comment");
        }
        // Close dialog and reset form
        setIsOpen(false);
        setCommentText(""); // Reset form field after submission
        fetchDetails(); // Refresh data
      } catch (error: any) {
        console.log(error);
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [activeCourseId, session?.user.email, dispatch, fetchDetails]
  );

  const handleDeleteComment = useCallback(
    async (id: number) => {
      if (!id || !session?.user.email) return;

      dispatch(setLoading(true));
      try {
        const response = await fetch(`${backendDomain}/delete_comment/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session.user.email.toString(),
            comment_id: id,
          }),
        });
        if (!response.ok) {
          throw new Error("Unable to delete the comment");
        }
        setDeleteDialogOpen(null);
        // Performance improvement: Optimistic UI update
        if (courseData) {
          setCourseData({
            ...courseData,
            comments: courseData.comments.filter(
              (comment) => comment.id !== id
            ),
          });
        }
        fetchDetails(); // Optional: Refetch to ensure data consistency
      } catch (error: any) {
        console.log(error);
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [session?.user.email, dispatch, courseData, fetchDetails]
  );

  // Performance improvement: Refactored vote handling for better reuse
  const handleCommentVote = useCallback(
    async (id: number, action: "upvote" | "downvote") => {
      if (!id || !session?.user.email) return;

      dispatch(setLoading(true));

      const performAction = async (
        url: string,
        successMessage: string,
        errorMessage: string
      ) => {
        try {
          const response = await fetch(`${backendDomain}/comments/${url}/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: session.user.email?.toString(),
              comment_id: id,
            }),
          });

          if (!response.ok) throw new Error(errorMessage);
          return true;
        } catch (error: any) {
          console.log(error);
          dispatch(setError(error.message));
          return false;
        }
      };

      if (!courseData?.comments) {
        dispatch(setLoading(false));
        return;
      }

      const userVote = getUserVote(courseData.comments, id);

      // Performance improvement: Optimistic UI update
      const commentIndex = courseData.comments.findIndex((c) => c.id === id);
      if (commentIndex === -1) {
        dispatch(setLoading(false));
        return;
      }

      // Create a copy for optimistic updates
      const updatedComments = [...courseData.comments];
      const comment = { ...updatedComments[commentIndex] };

      if (action === "upvote") {
        switch (userVote) {
          case 0: // No vote -> Upvote
            comment.upvotes += 1;
            comment.user_vote = 1;
            await performAction(
              "upvote",
              "Upvoted successfully",
              "Unable to upvote"
            );
            break;
          case 1: // Upvoted -> Remove upvote
            comment.upvotes -= 1;
            comment.user_vote = 0;
            await performAction(
              "remove_upvote",
              "Upvote removed",
              "Unable to remove the upvote"
            );
            break;
          case 2: // Downvoted -> Switch to upvote
            comment.downvotes -= 1;
            comment.upvotes += 1;
            comment.user_vote = 1;
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
        }
      } else {
        // downvote
        switch (userVote) {
          case 0: // No vote -> Downvote
            comment.downvotes += 1;
            comment.user_vote = 2;
            await performAction(
              "downvote",
              "Downvoted successfully",
              "Unable to downvote"
            );
            break;
          case 2: // Downvoted -> Remove downvote
            comment.downvotes -= 1;
            comment.user_vote = 0;
            await performAction(
              "remove_downvote",
              "Downvote removed",
              "Unable to remove the downvote"
            );
            break;
          case 1: // Upvoted -> Switch to downvote
            comment.upvotes -= 1;
            comment.downvotes += 1;
            comment.user_vote = 2;
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
        }
      }

      // Update the comment in our array
      updatedComments[commentIndex] = comment;

      // Update state with optimistic changes
      setCourseData({
        ...courseData,
        comments: updatedComments,
      });

      dispatch(setLoading(false));

      // Optional: Fetch updated data to ensure consistency
      // setTimeout(fetchDetails, 500);
    },
    [courseData, session?.user.email, dispatch]
  );

  // Create handler functions using the core vote handler
  const handleUpdateUpvotesComment = useCallback(
    (id: number) => {
      handleCommentVote(id, "upvote");
    },
    [handleCommentVote]
  );

  const handleUpdateDownvotesComment = useCallback(
    (id: number) => {
      handleCommentVote(id, "downvote");
    },
    [handleCommentVote]
  );

  // Resource handlers - similar optimizations as comment handlers
  const handleAddResource = useCallback(
    async (
      name: string,
      remarks: string,
      url: string,
      isAnonymous: boolean
    ) => {
      if (
        !name.trim() ||
        !url.trim() ||
        !activeCourseId ||
        !session?.user.email
      )
        return;

      dispatch(setLoading(true));
      try {
        const response = await fetch(`${backendDomain}/add_resource/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            course: activeCourseId,
            name: name,
            remarks: remarks,
            url: url,
            contributor: session.user.email.toString(),
            is_anonymous: isAnonymous,
          }),
        });
        if (!response.ok) {
          throw new Error("Unable to add the resource");
        }

        // Reset form and close dialog
        setResourceName("");
        setResourceRemarks("");
        setResourceUrl("");
        setIsOpenForResources(false);

        fetchDetails(); // Refresh data
      } catch (error: any) {
        console.log(error);
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [activeCourseId, session?.user.email, dispatch, fetchDetails]
  );

  // Performance improvement: Similar optimistic update pattern for resource votes
  const handleResourceVote = useCallback(
    async (id: number, action: "upvote" | "downvote") => {
      if (!id || !session?.user.email) return;

      dispatch(setLoading(true));

      const performAction = async (
        url: string,
        successMessage: string,
        errorMessage: string
      ) => {
        try {
          const response = await fetch(`${backendDomain}/resources/${url}/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: session.user.email?.toString(),
              resource_id: id,
            }),
          });

          if (!response.ok) throw new Error(errorMessage);
          return true;
        } catch (error: any) {
          console.log(error);
          dispatch(setError(error.message));
          return false;
        }
      };

      if (!courseData?.resources) {
        dispatch(setLoading(false));
        return;
      }

      const userVote = getUserVoteForResources(courseData.resources, id);

      // Optimistic UI update
      const resourceIndex = courseData.resources.findIndex((r) => r.id === id);
      if (resourceIndex === -1) {
        dispatch(setLoading(false));
        return;
      }

      // Create a copy for optimistic updates
      const updatedResources = [...courseData.resources];
      const resource = { ...updatedResources[resourceIndex] };

      if (action === "upvote") {
        switch (userVote) {
          case 0: // No vote -> Upvote
            resource.upvotes += 1;
            resource.user_vote = 1;
            await performAction(
              "upvote",
              "Upvoted successfully",
              "Unable to upvote"
            );
            break;
          case 1: // Upvoted -> Remove upvote
            resource.upvotes -= 1;
            resource.user_vote = 0;
            await performAction(
              "remove_upvote",
              "Upvote removed",
              "Unable to remove the upvote"
            );
            break;
          case 2: // Downvoted -> Switch to upvote
            resource.downvotes -= 1;
            resource.upvotes += 1;
            resource.user_vote = 1;
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
        }
      } else {
        // downvote
        switch (userVote) {
          case 0: // No vote -> Downvote
            resource.downvotes += 1;
            resource.user_vote = 2;
            await performAction(
              "downvote",
              "Downvoted successfully",
              "Unable to downvote"
            );
            break;
          case 2: // Downvoted -> Remove downvote
            resource.downvotes -= 1;
            resource.user_vote = 0;
            await performAction(
              "remove_downvote",
              "Downvote removed",
              "Unable to remove the downvote"
            );
            break;
          case 1: // Upvoted -> Switch to downvote
            resource.upvotes -= 1;
            resource.downvotes += 1;
            resource.user_vote = 2;
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
        }
      }

      // Update the resource in our array
      updatedResources[resourceIndex] = resource;

      // Update state with optimistic changes
      setCourseData({
        ...courseData,
        resources: updatedResources,
      });

      dispatch(setLoading(false));
    },
    [courseData, session?.user.email, dispatch]
  );

  const handleUpdateUpvotesResource = useCallback(
    (id: number) => {
      handleResourceVote(id, "upvote");
    },
    [handleResourceVote]
  );

  const handleUpdateDownvotesResource = useCallback(
    (id: number) => {
      handleResourceVote(id, "downvote");
    },
    [handleResourceVote]
  );

  const handleDeleteResource = useCallback(
    async (id: number) => {
      if (!id || !session?.user.email) return;

      dispatch(setLoading(true));
      try {
        const response = await fetch(`${backendDomain}/delete_resource`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session.user.email.toString(),
            resource_id: id,
          }),
        });
        if (!response.ok) {
          throw new Error("Unable to delete the resource");
        }

        setDeleteDialogOpenForResource(null);

        // Optimistic UI update
        if (courseData) {
          setCourseData({
            ...courseData,
            resources: courseData.resources.filter(
              (resource) => resource.id !== id
            ),
          });
        }

        fetchDetails(); // Optional: Refetch to ensure data consistency
      } catch (error: any) {
        console.log(error);
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [session?.user.email, dispatch, courseData, fetchDetails]
  );

  // Performance improvement: Memoize sorted comments to prevent unnecessary recalculations
  const sortedComments = useMemo(() => {
    if (!courseData?.comments) return [];

    return [...courseData.comments].sort((a, b) => {
      if (sortOption === "By Date") {
        return (
          new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime()
        );
      } else if (sortOption === "By Upvotes") {
        return b.upvotes - a.upvotes;
      }
      return 0;
    });
  }, [courseData?.comments, sortOption]);

  const sortedResources = useMemo(() => {
    if (!courseData?.resources) return [];
    return [...courseData.resources].sort((a, b) => {
      if (sortOptionForResources === "By Date") {
        return (
          new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
        );
      } else if (sortOptionForResources === "By Upvotes") {
        return b.upvotes - a.upvotes;
      }
      return 0;
    });
  }, [courseData?.resources, sortOptionForResources]);

  // Performance improvement: Memoize metrics rendering
  const renderMetrics = useMemo(() => {
    if (!courseData?.metrics) return null;

    return Object.entries(courseData.metrics).map(
      ([metricName, metricData]) => {
        const formattedMetricName = formatString(metricName);
        return (
          <ChartCard
            key={metricName}
            metricName={formattedMetricName}
            metricData={metricData}
          />
        );
      }
    );
  }, [courseData?.metrics]);

  // Performance improvement: Extract comment component to reduce render complexity
  const CommentItem = useCallback(
    ({ comment }: { comment: Comment }) => (
      <div key={comment.id} className="border-b pb-4 last:border-b-0">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm font-medium">
            {comment.author.isAnonymous
              ? "Anonymous"
              : `${comment.author.name}, ${comment.author.degree} ${comment.author.batch}, ${comment.author.branch}`}
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleUpdateUpvotesComment(comment.id)}
              className={`flex items-center text-sm transition-colors duration-200 ${
                comment.user_vote === 1 ? "text-green-500" : "text-gray-600"
              }`}
            >
              <ArrowUpCircle className="h-4 w-4 mr-1" />
              {comment.upvotes}
            </button>
            <button
              onClick={() => handleUpdateDownvotesComment(comment.id)}
              className={`flex items-center text-sm transition-colors duration-200 ${
                comment.user_vote === 2 ? "text-red-500" : "text-gray-600"
              }`}
            >
              <ArrowDownCircle className="h-4 w-4 mr-1" />
              {comment.downvotes}
            </button>

            {/* Delete Comment Dialog */}
            {session?.user.email === comment.author.email && (
              <Dialog
                open={deleteDialogOpen === comment.id}
                onOpenChange={() => setDeleteDialogOpen(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(comment.id)}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this comment? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete Comment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        <p className="text-gray-700">{comment.text}</p>
        <p className="text-sm text-gray-500 mt-2">
          Posted on {new Date(comment.date_posted).toLocaleDateString()}
        </p>
      </div>
    ),
    [
      handleUpdateUpvotesComment,
      handleUpdateDownvotesComment,
      handleDeleteComment,
      session?.user.email,
      deleteDialogOpen,
      setDeleteDialogOpen,
    ]
  );

  // Performance improvement: Extract resource component to reduce render complexity
  const ResourceItem = useCallback(
    ({ resource }: { resource: Resource }) => (
      <div key={resource.id} className="border-b pb-4 last:border-b-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center"
            >
              {resource.name}
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
            <p className="text-sm text-gray-600">
              {resource.remarks} • By{" "}
              {resource.contributor.isAnonymous
                ? "Anonymous"
                : `${resource.contributor.name}, ${resource.contributor.degree} ${resource.contributor.batch}, ${resource.contributor.branch}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Posted on {new Date(resource.date_added).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-2">
          <button
            onClick={() => handleUpdateUpvotesResource(resource.id)}
            className={`flex items-center text-sm transition-colors duration-200 ${
              resource.user_vote === 1 ? "text-green-500" : "text-gray-600"
            }`}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            {resource.upvotes}
          </button>
          <button
            onClick={() => handleUpdateDownvotesResource(resource.id)}
            className={`flex items-center text-sm transition-colors duration-200 ${
              resource.user_vote === 2 ? "text-red-500" : "text-gray-600"
            }`}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
            {resource.downvotes}
          </button>

          {/* Delete Button */}
          {session?.user.email === resource.contributor.email && (
            <Dialog
              open={deleteDialogOpenForResource === resource.id}
              onOpenChange={() => setDeleteDialogOpenForResource(null)}
            >
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpenForResource(resource.id)}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this resource? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpenForResource(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteResource(resource.id)}
                  >
                    Delete Resource
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    ),
    [
      handleUpdateUpvotesResource,
      handleUpdateDownvotesResource,
      handleDeleteResource,
      session?.user.email,
      deleteDialogOpenForResource,
      setDeleteDialogOpenForResource,
    ]
  );

  // Performance improvement: Add loading state visual feedback
  // if (!courseData && loading) {
  //   return (
  //     <div className="container mx-auto px-4 py-8 text-center">
  //       Loading course data...
  //     </div>
  //   );
  // }

  // Performance improvement: Add error state
  // if (error) {
  //   return (
  //     <div className="container mx-auto px-4 py-8 text-center">
  //       <p className="text-red-500">Error: {error}</p>
  //       <Button onClick={fetchDetails} className="mt-4">
  //         Retry
  //       </Button>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {courseData?.course.name}{" "}
          <span className="text-2xl text-gray-600">
            ({courseData?.course.code})
          </span>
        </h1>
        <p className="text-xl text-gray-600">
          Professor: {courseData?.course.professor}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Metrics Section */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Course Metrics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {renderMetrics}
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Comments</h2>
              <div className="flex items-center space-x-4">
                {/* Sorting Dropdown */}
                <Select
                  onValueChange={(value) =>
                    setSortOption(value as "By Date" | "By Upvotes")
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="By Date">By Date</SelectItem>
                    <SelectItem value="By Upvotes">By Upvotes</SelectItem>
                  </SelectContent>
                </Select>

                {/* Add Comment Button */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add a Comment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Label>Your Comment</Label>
                      <Input
                        type="text"
                        placeholder="Write your comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="anonymous"
                          checked={isAnonymous}
                          onCheckedChange={(checked) =>
                            setIsAnonymous(checked === true)
                          }
                        />
                        <Label htmlFor="anonymous">Post as Anonymous</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() =>
                          handleAddComment(commentText, isAnonymous)
                        }
                        disabled={!commentText.trim()}
                      >
                        Add Comment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              {sortedComments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No comments yet. Be the first to add one!
                </p>
              ) : (
                sortedComments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment}></CommentItem>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Resources Section */}
        <div className="lg:col-span-1">
          <Card className="p-6 overflow-hidden">
            {/* Section Heading */}
            <h2 className="text-2xl font-semibold mb-4">Resources</h2>

            {/* Sort & Add Resource Controls */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              {/* Sorting Dropdown */}
              <Select
                onValueChange={(value) =>
                  setSortOptionForResources(value as "By Date" | "By Upvotes")
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="By Date">By Date</SelectItem>
                  <SelectItem value="By Upvotes">By Upvotes</SelectItem>
                </SelectContent>
              </Select>

              {/* Add Resource Button & Dialog */}
              <Dialog
                open={isOpenForResources}
                onOpenChange={setIsOpenForResources}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setIsOpenForResources(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg w-full mx-auto p-6">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-medium">
                      Add a Resource
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label>Resource Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter resource name..."
                        value={resourceName}
                        onChange={(e) => setResourceName(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Remarks</Label>
                      <Textarea
                        placeholder="Add remarks about this resource..."
                        value={resourceRemarks}
                        onChange={(e) => setResourceRemarks(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Resource URL</Label>
                      <Input
                        type="url"
                        placeholder="Enter URL..."
                        value={resourceUrl}
                        onChange={(e) => setResourceUrl(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="anonymous"
                        checked={isAnonymousForResources}
                        onCheckedChange={(checked) =>
                          setIsAnonymousForResources(checked === true)
                        }
                      />
                      <Label htmlFor="anonymous">Contribute Anonymously</Label>
                    </div>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button
                      onClick={() =>
                        handleAddResource(
                          resourceName,
                          resourceRemarks,
                          resourceUrl,
                          isAnonymousForResources
                        )
                      }
                    >
                      Add Resource
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Resources List */}
            <div className="space-y-4">
              {sortedResources.length === 0 ? (
                <p className="text-gray-500 text-center py-6">
                  No resources yet. Be the first to add one!
                </p>
              ) : (
                sortedResources.map((resource) => (
                  <ResourceItem key={resource.id} resource={resource} />
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoursePageClient;
