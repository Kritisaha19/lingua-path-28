from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import json

from database import Base, engine, SessionLocal
from models import (
    User,
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    UserProgress,
    Mistake,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Duolingo Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://lingua-path-28-delta.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================================================
# BASIC
# =========================================================

@app.get("/")
def root():
    return {
        "message": "Duolingo Clone API is running",
        "status": "ok",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


# =========================================================
# USER
# =========================================================

@app.get("/api/users/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return {
        "id": user.id,
        "name": user.name,
        "avatarInitials": user.avatar_initials,
        "learningLanguage": user.learning_language,
        "joinedAt": user.joined_at,
    }


# =========================================================
# COURSES
# =========================================================

@app.get("/api/courses")
def get_courses(
    db: Session = Depends(get_db),
):
    courses = db.query(Course).all()

    return [
        {
            "id": course.id,
            "language": course.language,
            "title": course.title,
            "flag": course.flag,
            "totalSkills": course.total_skills,
        }
        for course in courses
    ]


# =========================================================
# UNITS
# =========================================================

@app.get("/api/courses/{course_id}/units")
def get_units(
    course_id: int,
    db: Session = Depends(get_db),
):
    units = (
        db.query(Unit)
        .filter(Unit.course_id == course_id)
        .order_by(Unit.unit_index)
        .all()
    )

    return [
        {
            "id": unit.id,
            "courseId": unit.course_id,
            "unitIndex": unit.unit_index,
            "title": unit.title,
            "subtitle": unit.subtitle,
            "color": unit.color,
        }
        for unit in units
    ]


# =========================================================
# SKILLS
# =========================================================

@app.get("/api/units/{unit_id}/skills")
def get_skills(
    unit_id: int,
    db: Session = Depends(get_db),
):
    skills = (
        db.query(Skill)
        .filter(Skill.unit_id == unit_id)
        .order_by(Skill.id)
        .all()
    )

    return [
        {
            "id": skill.id,
            "unitId": skill.unit_id,
            "title": skill.title,
            "icon": skill.icon,
            "description": skill.description,
            "lessonId": skill.lesson_id,
            "crowns": skill.crowns,
            "maxCrowns": skill.max_crowns,
        }
        for skill in skills
    ]


# =========================================================
# LESSON
# =========================================================

@app.get("/api/lessons/{lesson_id}")
def get_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
):
    lesson = (
        db.query(Lesson)
        .filter(Lesson.id == lesson_id)
        .first()
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found",
        )

    exercises = (
        db.query(Exercise)
        .filter(Exercise.lesson_id == lesson_id)
        .order_by(Exercise.id)
        .all()
    )

    formatted_exercises = []

    for exercise in exercises:

        options = None
        extra_data = None

        if exercise.options:
            try:
                options = json.loads(exercise.options)
            except Exception:
                options = exercise.options

        if exercise.extra_data:
            try:
                extra_data = json.loads(exercise.extra_data)
            except Exception:
                extra_data = exercise.extra_data

        formatted_exercises.append(
            {
                "id": exercise.id,
                "type": exercise.exercise_type,
                "prompt": exercise.prompt,
                "question": exercise.question,
                "options": options,
                "answer": exercise.answer,
                "extraData": extra_data,
            }
        )

    return {
        "id": lesson.id,
        "skillId": lesson.skill_id,
        "title": lesson.title,
        "xpReward": lesson.xp_reward,
        "exercises": formatted_exercises,
    }


# =========================================================
# USER PROGRESS
# =========================================================

@app.get("/api/users/{user_id}/progress")
def get_progress(
    user_id: int,
    db: Session = Depends(get_db),
):
    progress = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == user_id)
        .first()
    )

    if not progress:
        raise HTTPException(
            status_code=404,
            detail="User progress not found",
        )

    try:
        completed = json.loads(
            progress.completed_skill_ids or "[]"
        )
    except Exception:
        completed = []

    return {
        "userId": progress.user_id,
        "streak": progress.streak,
        "xp": progress.xp,
        "hearts": progress.hearts,
        "maxHearts": progress.max_hearts,
        "gems": progress.gems,
        "dailyGoal": progress.daily_goal,
        "dailyXp": progress.daily_xp,
        "lessonsCompleted": progress.lessons_completed,
        "completedSkillIds": completed,
        "activeSkillId": progress.active_skill_id,
    }


# =========================================================
# MISTAKES
# =========================================================

@app.get("/api/users/{user_id}/mistakes")
def get_mistakes(
    user_id: int,
    db: Session = Depends(get_db),
):
    mistakes = (
        db.query(Mistake)
        .filter(Mistake.user_id == user_id)
        .order_by(Mistake.id.desc())
        .all()
    )

    return [
        {
            "id": mistake.id,
            "term": mistake.term,
            "translation": mistake.translation,
            "count": mistake.count,
            "skillTitle": mistake.skill_title,
        }
        for mistake in mistakes
    ]


# =========================================================
# ANSWER SUBMISSION
# =========================================================

class AnswerSubmission(BaseModel):
    correct: bool
    correctAnswer: Optional[str] = None


@app.post("/api/lessons/{lesson_id}/answer")
def submit_answer(
    lesson_id: int,
    answer: AnswerSubmission,
    db: Session = Depends(get_db),
):
    lesson = (
        db.query(Lesson)
        .filter(Lesson.id == lesson_id)
        .first()
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found",
        )

    return {
        "success": True,
        "lessonId": lesson_id,
        "correct": answer.correct,
        "correctAnswer": answer.correctAnswer,
    }


# =========================================================
# LESSON COMPLETION
# =========================================================

class LessonCompletion(BaseModel):
    xpEarned: int
    mistakes: int = 0
    userId: int = 1
    heartsRemaining: Optional[int] = None


@app.post("/api/lessons/{lesson_id}/complete")
def complete_lesson(
    lesson_id: int,
    data: LessonCompletion,
    db: Session = Depends(get_db),
):
    # -----------------------------------------------------
    # Find lesson
    # -----------------------------------------------------

    lesson = (
        db.query(Lesson)
        .filter(Lesson.id == lesson_id)
        .first()
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found",
        )

    # -----------------------------------------------------
    # Find progress
    # -----------------------------------------------------

    progress = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == data.userId
        )
        .first()
    )

    if not progress:
        raise HTTPException(
            status_code=404,
            detail="User progress not found",
        )

    # -----------------------------------------------------
    # XP
    # -----------------------------------------------------

    progress.xp += data.xpEarned

    progress.daily_xp += data.xpEarned

    # -----------------------------------------------------
    # Lessons completed
    # -----------------------------------------------------

    progress.lessons_completed += 1

    # -----------------------------------------------------
    # Gems
    # -----------------------------------------------------

    progress.gems += 5

    # -----------------------------------------------------
    # Hearts
    # -----------------------------------------------------

    if data.heartsRemaining is not None:
        progress.hearts = max(
            0,
            min(
                data.heartsRemaining,
                progress.max_hearts,
            ),
        )

    # -----------------------------------------------------
    # Complete skill
    # -----------------------------------------------------

    skill = (
        db.query(Skill)
        .filter(Skill.id == lesson.skill_id)
        .first()
    )

    completed_ids = []

    try:
        completed_ids = json.loads(
            progress.completed_skill_ids or "[]"
        )
    except Exception:
        completed_ids = []

    if skill:

        if skill.id not in completed_ids:
            completed_ids.append(skill.id)

        progress.completed_skill_ids = json.dumps(
            completed_ids
        )

        # -------------------------------------------------
        # Find next skill
        # -------------------------------------------------

        next_skill = (
            db.query(Skill)
            .filter(Skill.id > skill.id)
            .order_by(Skill.id)
            .first()
        )

        if next_skill:
            progress.active_skill_id = next_skill.id
        else:
            progress.active_skill_id = skill.id

    # -----------------------------------------------------
    # Save
    # -----------------------------------------------------

    db.commit()

    db.refresh(progress)

    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {
        "success": True,
        "lessonId": lesson_id,
        "xpEarned": data.xpEarned,
        "mistakes": data.mistakes,
        "totalXp": progress.xp,
        "gems": progress.gems,
        "hearts": progress.hearts,
        "maxHearts": progress.max_hearts,
        "lessonsCompleted": progress.lessons_completed,
        "completedSkillIds": json.loads(
            progress.completed_skill_ids or "[]"
        ),
        "activeSkillId": progress.active_skill_id,
    }
