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
  return comment?.user_vote ?? 0;
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
    // Step 1: Format and protocol check
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return false;

    // Step 2: Regex domain validation
    const domainRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    if (!domainRegex.test(url)) return false;

    // Step 3: Filter out blocked/internal domains
    const hostname = parsed.hostname.toLowerCase();
    const blockedHosts = ["localhost", "127.0.0.1", "example.com", "example.invalid"];
    if (blockedHosts.includes(hostname)) return false;

    // Step 4: Try to reach the URL without checking response (CORS-safe)
    await fetch(parsed.href, {
      method: "HEAD",
      mode: "no-cors",
    });

    // Even if fetch returns an opaque response, assume valid
    return true;
  } catch (err) {
    return false;
  }
};




