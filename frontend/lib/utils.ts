import { Comment, Course, Resource } from '@/types/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatString(str: string) {
  return str.includes("_")
    ? str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : str.charAt(0).toUpperCase() + str.slice(1);
}

export function getUserVote(comments: Comment[] | undefined, commentId: number) {
  const comment = comments?.find(comment => comment.id === commentId);
  return comment ? comment.user_vote : null;
}

export function getUserVoteForResources(resources: Resource[] | undefined, resourceId: number) {
  const resource = resources?.find(resource => resource.id === resourceId);
  return resource ? resource.user_vote : null;
}

export function getCourseNameFromId(courses: Course[], id: number | undefined) {
  const course = courses.find((course) => {
    return (
      course.id === id
    )
  })
  return course?.name
}

export const isValidUrl = async (url: string): Promise<boolean> => {
  try {
    // 1. Format validation
    const parsed = new URL(url);
    const isHttp = parsed.protocol === "http:" || parsed.protocol === "https:";
    if (!isHttp) return false;

    // 2. Check reachability (CORS restrictions may block this for some domains)
    const response = await fetch(url, {
      method: "HEAD", // Try to avoid loading entire page
      mode: "no-cors", // Prevents CORS errors from throwing, but we can't read response
    });

    // If mode is "no-cors", we can't reliably read status, so we assume it's fine
    return true;
  } catch (err) {
    return false;
  }
};



