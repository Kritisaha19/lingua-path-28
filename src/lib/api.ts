import type {
  AnswerResponse,
  CompleteResponse,
  Course,
  Lesson,
  Mistake,
  Progress,
  Skill,
  Unit,
  User,
} from "./types";

/**
 * Base URL of the existing FastAPI backend.
 *
 * For local development this uses localhost:8000.
 * For deployment, set VITE_API_URL.
 */
export const API_URL: string =
  (import.meta.env["VITE_API_URL"] as string | undefined) ??
  "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: {
    method?: string;
    body?: unknown;
  },
): Promise<T> {
  const url = `${API_URL.replace(/\/$/, "")}${path}`;

  let res: Response;

  try {
    res = await fetch(url, {
      method: init?.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body:
        init?.body === undefined
          ? undefined
          : JSON.stringify(init.body),
    });
  } catch {
    throw new ApiError(
      `Could not reach the API at ${API_URL}. Is the backend running?`,
      0,
    );
  }

  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;

    try {
      const text = await res.text();

      if (text) {
        try {
          const parsed = JSON.parse(text) as {
            detail?: string;
            message?: string;
          };

          detail =
            parsed.detail ??
            parsed.message ??
            text;
        } catch {
          detail = text;
        }
      }
    } catch {
      // Keep status text.
    }

    throw new ApiError(
      `Request to ${path} failed: ${detail}`,
      res.status,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const DEFAULT_USER_ID = 1;

export const api = {
  // -------------------------------------------------------
  // USER
  // -------------------------------------------------------

  getUser: (userId: number) =>
    apiFetch<User>(
      `/api/users/${userId}`,
    ),

  // -------------------------------------------------------
  // COURSES
  // -------------------------------------------------------

  getCourses: () =>
    apiFetch<Course[]>(
      `/api/courses`,
    ),

  // -------------------------------------------------------
  // UNITS
  // -------------------------------------------------------

  getUnits: (courseId: number) =>
    apiFetch<Unit[]>(
      `/api/courses/${courseId}/units`,
    ),

  // -------------------------------------------------------
  // SKILLS
  // -------------------------------------------------------

  getSkills: (unitId: number) =>
    apiFetch<Skill[]>(
      `/api/units/${unitId}/skills`,
    ),

  // -------------------------------------------------------
  // LESSON
  // -------------------------------------------------------

  getLesson: (lessonId: number) =>
    apiFetch<Lesson>(
      `/api/lessons/${lessonId}`,
    ),

  // -------------------------------------------------------
  // PROGRESS
  // -------------------------------------------------------

  getProgress: (userId: number) =>
    apiFetch<Progress>(
      `/api/users/${userId}/progress`,
    ),

  // -------------------------------------------------------
  // MISTAKES
  // -------------------------------------------------------

  getMistakes: (userId: number) =>
    apiFetch<Mistake[]>(
      `/api/users/${userId}/mistakes`,
    ),

  // -------------------------------------------------------
  // ANSWER
  // -------------------------------------------------------

  submitAnswer: (
    lessonId: number,
    payload: {
      correct: boolean;
      correctAnswer: string | null;
    },
  ) =>
    apiFetch<AnswerResponse>(
      `/api/lessons/${lessonId}/answer`,
      {
        method: "POST",
        body: payload,
      },
    ),

  // -------------------------------------------------------
  // COMPLETE LESSON
  // -------------------------------------------------------

  completeLesson: (
    lessonId: number,
    payload: {
      xpEarned: number;
      mistakes: number;
      userId: number;
      heartsRemaining: number;
    },
  ) =>
    apiFetch<CompleteResponse>(
      `/api/lessons/${lessonId}/complete`,
      {
        method: "POST",
        body: payload,
      },
    ),
};