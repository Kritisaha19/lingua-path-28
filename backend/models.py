from sqlalchemy import Column, Integer, String

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    avatar_initials = Column(String(10), nullable=False)
    learning_language = Column(String(50), nullable=False)
    joined_at = Column(String(20), nullable=False)


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    language = Column(String(50), nullable=False)
    title = Column(String(100), nullable=False)
    flag = Column(String(10), nullable=False)
    total_skills = Column(Integer, nullable=False, default=0)


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, nullable=False)
    unit_index = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    subtitle = Column(String(200), nullable=False)
    color = Column(String(30), nullable=False)


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    icon = Column(String(10), nullable=False)
    description = Column(String(200), nullable=False)
    lesson_id = Column(Integer, nullable=True)
    crowns = Column(Integer, nullable=False, default=0)
    max_crowns = Column(Integer, nullable=False, default=3)


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    xp_reward = Column(Integer, nullable=False, default=20)


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, nullable=False)
    exercise_type = Column(String(30), nullable=False)
    prompt = Column(String(200), nullable=False)
    question = Column(String(500), nullable=True)
    options = Column(String(1000), nullable=True)
    answer = Column(String(500), nullable=True)
    extra_data = Column(String(2000), nullable=True)


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, unique=True)

    streak = Column(Integer, nullable=False, default=0)
    xp = Column(Integer, nullable=False, default=0)

    hearts = Column(Integer, nullable=False, default=5)
    max_hearts = Column(Integer, nullable=False, default=5)

    gems = Column(Integer, nullable=False, default=0)

    daily_goal = Column(Integer, nullable=False, default=50)
    daily_xp = Column(Integer, nullable=False, default=0)

    lessons_completed = Column(Integer, nullable=False, default=0)

    completed_skill_ids = Column(String(2000), nullable=False, default="[]")
    active_skill_id = Column(Integer, nullable=True)


class Mistake(Base):
    __tablename__ = "mistakes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)

    term = Column(String(200), nullable=False)
    translation = Column(String(200), nullable=False)
    count = Column(Integer, nullable=False, default=1)

    skill_title = Column(String(100), nullable=False)