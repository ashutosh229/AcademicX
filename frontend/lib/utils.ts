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



