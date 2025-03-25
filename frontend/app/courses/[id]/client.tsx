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
import { CourseDetails } from "@/lib/types";
import { setError, setLoading } from "@/redux/slices/courseSlice";
import { RootState } from "@/redux/store";
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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const CoursePageClient = () => {
  const { data: session } = useSession();
  const { activeCourseId, error, loading, courses } = useSelector(
    (state: RootState) => state.course
  );
  const dispatch = useDispatch();

  const [courseData, setCourseData] = useState<CourseDetails | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<number | null>(null);

  const activeCourse = courses.filter((course) => {
    return course.id === activeCourseId;
  });

  const backendDomain = "http://localhost:8080";

  useEffect(() => {
    const fetchDetails = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch(
          `${backendDomain}/get_course_details/${activeCourse[0].id}`
        );
        if (!response.ok) {
          throw new Error("Course details could not be fetched properly");
        }
        const data = await response.json();
        setCourseData(data);
        dispatch(setLoading(false));
      } catch (error: any) {
        console.log(error);
        dispatch(setError(error.message));
      }
    };
    fetchDetails();
  }, [activeCourse]);

  const handleAddComment = async (
    commentText: string,
    isAnonymous: boolean
  ) => {
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
          contributor: session?.user.email?.toString(),
          is_anonymous: isAnonymous,
        }),
      });
      if (!response.ok) {
        throw new Error("Unable to add the comment");
        toast.error("Unable to add comment");
      }
      toast.success("Added comment successfully");
      dispatch(setLoading(false));
      setIsOpen(false);
    } catch (error: any) {
      console.log(error);
      dispatch(setError(error.message));
    }
  };

  const handleDeleteComment = async (id: number) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch(`${backendDomain}/delete_comment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user.email?.toString(),
          comment_id: id,
        }),
      });
      if (!response.ok) {
        throw new Error("Unable to delete the comment");
        toast.error("Unable to delete the comment");
      }
      toast.success("Deleted the comment successfully");
      dispatch(setLoading(false));
      setDeleteDialogOpen(null);
    } catch (error: any) {
      console.log(error);
      dispatch(setError(error.message));
    }
  };

  const handleUpdateUpvotesComment = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateDownvotesComment = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddResource = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateUpvotesResource = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateDownvotesResource = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

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
              {Object.entries(courseData?.metrics ?? {}).map(
                ([metricName, metricData]) => {
                  return (
                    <ChartCard
                      key={metricName}
                      metricName={metricName}
                      metricData={metricData}
                    ></ChartCard>
                  );
                }
              )}
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Comments</h2>
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
                      onClick={() => handleAddComment(commentText, isAnonymous)}
                    >
                      Add Comment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-6">
              {courseData?.comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium">
                      {comment.author.isAnonymous
                        ? "Anonymous"
                        : comment.author.name}
                    </p>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-sm text-gray-600">
                        <ArrowUpCircle className="h-4 w-4 mr-1" />
                        {comment.upvotes}
                      </button>
                      <button className="flex items-center text-sm text-gray-600">
                        <ArrowDownCircle className="h-4 w-4 mr-1" />
                        {comment.downvotes}
                      </button>
                      {/* Delete Button */}
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
                              Are you sure you want to delete this comment? This
                              action cannot be undone.
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
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted on{" "}
                    {new Date(comment.datePosted).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Resources Section */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Resources</h2>
              <Button onClick={() => handleAddResource()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>

            <div className="space-y-4">
              {courseData?.resources.map((resource) => (
                <div
                  key={resource.id}
                  className="border-b pb-4 last:border-b-0"
                >
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
                          : resource.contributor.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      onClick={() => handleUpdateUpvotesResource()}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {resource.upvotes}
                    </button>
                    <button
                      onClick={() => handleUpdateDownvotesResource()}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      {resource.downvotes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoursePageClient;
