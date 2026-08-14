export type User = {
  id: number;
  name: string;
  avatarInitials: string;
  learningLanguage: string;
  joinedAt: string;
};

export type Course = {
  id: number;
  language: string;
  title: string;
  flag: string;
  totalSkills: number;
};

export type Unit = {
  id: number;
  courseId: number;
  unitIndex: number;
  title: string;
  subtitle: string | null;
  color: string | null;
};

export type Skill = {
  id: number;
  unitId: number;
  title: string;
  icon: string | null;
  description: string | null;
  lessonId: number;
  crowns: number;
  maxCrowns: number;
};

export type ExerciseType =
  | "multiple-choice"
  | "type-answer"
  | "fill-blank"
  | "word-bank";

export type Exercise = {
  id: number;
  type: ExerciseType | string;
  prompt: string | null;
  question: string | null;
  options: string[] | null;
  answer: string | null;
  extraData: Record<string, unknown> | null;
};

export type Lesson = {
  id: number;
  skillId: number;
  title: string;
  xpReward: number;
  exercises: Exercise[] | null;
};

export type Progress = {
  userId: number;
  streak: number;
  xp: number;
  hearts: number;
  maxHearts: number;
  gems: number;
  dailyGoal: number;
  dailyXp: number;
  lessonsCompleted: number;
  completedSkillIds: number[] | null;
  activeSkillId: number | null;
};

export type Mistake = {
  id: number;
  term: string;
  translation: string;
  count: number;
  skillTitle: string | null;
};

export type AnswerResponse = {
  success: boolean;
  lessonId: number;
  correct: boolean;
  correctAnswer: string | null;
};

export type CompleteResponse = {
  success: boolean;
  lessonId: number;
  xpEarned: number;
  mistakes: number;
  totalXp: number;
  gems: number;
};