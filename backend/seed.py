from database import Base, engine, SessionLocal
from models import (
    User,
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    UserProgress,
)
import json

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ---------------------------------------------------------
# CLEAR EXISTING DATA
# ---------------------------------------------------------

db.query(Exercise).delete()
db.query(Lesson).delete()
db.query(Skill).delete()
db.query(Unit).delete()
db.query(Course).delete()
db.query(UserProgress).delete()
db.query(User).delete()

# ---------------------------------------------------------
# USER
# ---------------------------------------------------------

user = User(
    id=1,
    name="Learner",
    avatar_initials="LR",
    learning_language="Spanish",
    joined_at="2026-08-13",
)

db.add(user)

# ---------------------------------------------------------
# COURSE
# ---------------------------------------------------------

course = Course(
    id=1,
    language="Spanish",
    title="Spanish for Beginners",
    flag="🇪🇸",
    total_skills=8,
)

db.add(course)

# ---------------------------------------------------------
# UNITS
# ---------------------------------------------------------

units_data = [
    ("Basics", "Learn your first Spanish words", "#58CC02"),
    ("Greetings", "Introduce yourself and others", "#1CB0F6"),
    ("Food", "Talk about food and drinks", "#FF9600"),
    ("Family", "Learn family vocabulary", "#CE82FF"),
]

for index, (title, subtitle, color) in enumerate(units_data, start=1):
    db.add(
        Unit(
            id=index,
            course_id=1,
            unit_index=index,
            title=title,
            subtitle=subtitle,
            color=color,
        )
    )

# ---------------------------------------------------------
# SKILLS + LESSON CONTENT
# ---------------------------------------------------------

skills_data = [
    {
        "unit": 1,
        "title": "Basics",
        "icon": "👋",
        "description": "Simple Spanish words",
        "exercises": [
            ("multiple-choice", "Choose the Spanish word", "Hello",
             ["Hola", "Adiós", "Gracias", "Casa"], "Hola", None),

            ("type-answer", "Type the Spanish word", "Goodbye",
             None, "Adiós", None),

            ("fill-blank", "Complete the sentence", "___ días",
             ["Buenos", "Hola", "Gracias", "Adiós"], "Buenos",
             {"translation": "Good morning"}),

            ("word-bank", "Build the sentence", "I am a student",
             ["Yo", "soy", "estudiante", "un"], "Yo soy un estudiante", None),
        ],
    },

    {
        "unit": 1,
        "title": "Greetings",
        "icon": "💬",
        "description": "Say hello and goodbye",
        "exercises": [
            ("multiple-choice", "Choose the correct translation", "Good morning",
             ["Buenos días", "Buenas noches", "Gracias", "Por favor"],
             "Buenos días", None),

            ("type-answer", "Type the Spanish word", "Please",
             None, "Por favor", None),

            ("fill-blank", "Complete the sentence", "Buenas ___",
             ["noches", "días", "gracias", "hola"], "noches",
             {"translation": "Good night"}),

            ("word-bank", "Build the sentence", "Nice to meet you",
             ["Mucho", "gusto", "en", "conocerte"],
             "Mucho gusto en conocerte", None),
        ],
    },

    {
        "unit": 2,
        "title": "Introductions",
        "icon": "🙋",
        "description": "Introduce yourself",
        "exercises": [
            ("multiple-choice", "Choose the correct translation", "My name is",
             ["Me llamo", "Gracias", "Adiós", "Hasta luego"],
             "Me llamo", None),

            ("type-answer", "Type the Spanish phrase", "I am a student",
             None, "Soy estudiante", None),

            ("fill-blank", "Complete the sentence", "Me ___ Carlos",
             ["llamo", "gusta", "soy", "tengo"], "llamo",
             {"translation": "My name is Carlos"}),

            ("word-bank", "Build the sentence", "I am from India",
             ["Soy", "de", "India"],
             "Soy de India", None),
        ],
    },

    {
        "unit": 2,
        "title": "People",
        "icon": "👥",
        "description": "Talk about people",
        "exercises": [
            ("multiple-choice", "Choose the correct translation", "Friend",
             ["Amigo", "Familia", "Casa", "Comida"],
             "Amigo", None),

            ("type-answer", "Type the Spanish word", "Woman",
             None, "Mujer", None),

            ("fill-blank", "Complete the sentence", "Mi ___ es alto",
             ["amigo", "casa", "comida", "agua"], "amigo",
             {"translation": "My friend is tall"}),

            ("word-bank", "Build the sentence", "She is my friend",
             ["Ella", "es", "mi", "amiga"],
             "Ella es mi amiga", None),
        ],
    },

    {
        "unit": 3,
        "title": "Food",
        "icon": "🍎",
        "description": "Food vocabulary",
        "exercises": [
            ("multiple-choice", "Choose the Spanish word", "Apple",
             ["Manzana", "Pan", "Leche", "Agua"],
             "Manzana", None),

            ("type-answer", "Type the Spanish word", "Bread",
             None, "Pan", None),

            ("fill-blank", "Complete the sentence", "Me gusta la ___",
             ["manzana", "casa", "familia", "noche"], "manzana",
             {"translation": "I like the apple"}),

            ("word-bank", "Build the sentence", "I eat bread",
             ["Yo", "como", "pan"],
             "Yo como pan", None),
        ],
    },

    {
        "unit": 3,
        "title": "Drinks",
        "icon": "🥤",
        "description": "Drinks vocabulary",
        "exercises": [
            ("multiple-choice", "Choose the Spanish word", "Water",
             ["Agua", "Pan", "Arroz", "Carne"],
             "Agua", None),

            ("type-answer", "Type the Spanish word", "Milk",
             None, "Leche", None),

            ("fill-blank", "Complete the sentence", "Quiero ___",
             ["agua", "amigo", "casa", "familia"], "agua",
             {"translation": "I want water"}),

            ("word-bank", "Build the sentence", "I drink coffee",
             ["Yo", "bebo", "café"],
             "Yo bebo café", None),
        ],
    },

    {
        "unit": 4,
        "title": "Family",
        "icon": "👨‍👩‍👧",
        "description": "Family members",
        "exercises": [
            ("multiple-choice", "Choose the Spanish word", "Mother",
             ["Madre", "Padre", "Hermano", "Amigo"],
             "Madre", None),

            ("type-answer", "Type the Spanish word", "Father",
             None, "Padre", None),

            ("fill-blank", "Complete the sentence", "Mi ___ es amable",
             ["madre", "pan", "agua", "casa"], "madre",
             {"translation": "My mother is kind"}),

            ("word-bank", "Build the sentence", "My family is big",
             ["Mi", "familia", "es", "grande"],
             "Mi familia es grande", None),
        ],
    },

    {
        "unit": 4,
        "title": "Relationships",
        "icon": "❤️",
        "description": "Talk about relationships",
        "exercises": [
            ("multiple-choice", "Choose the Spanish word", "Love",
             ["Amor", "Agua", "Pan", "Casa"],
             "Amor", None),

            ("type-answer", "Type the Spanish word", "Friendship",
             None, "Amistad", None),

            ("fill-blank", "Complete the sentence", "Te ___ mucho",
             ["quiero", "como", "bebo", "llamo"], "quiero",
             {"translation": "I love you very much"}),

            ("word-bank", "Build the sentence", "You are my friend",
             ["Tú", "eres", "mi", "amigo"],
             "Tú eres mi amigo", None),
        ],
    },
]

# ---------------------------------------------------------
# CREATE SKILLS, LESSONS AND EXERCISES
# ---------------------------------------------------------

skill_id = 1
lesson_id = 1
exercise_id = 1

for skill_data in skills_data:

    skill = Skill(
        id=skill_id,
        unit_id=skill_data["unit"],
        title=skill_data["title"],
        icon=skill_data["icon"],
        description=skill_data["description"],
        lesson_id=lesson_id,
        crowns=0,
        max_crowns=3,
    )

    db.add(skill)

    lesson = Lesson(
        id=lesson_id,
        skill_id=skill_id,
        title=f"{skill_data['title']} Lesson",
        xp_reward=20,
    )

    db.add(lesson)

    for (
        exercise_type,
        prompt,
        question,
        options,
        answer,
        extra_data,
    ) in skill_data["exercises"]:

        db.add(
            Exercise(
                id=exercise_id,
                lesson_id=lesson_id,
                exercise_type=exercise_type,
                prompt=prompt,
                question=question,
                options=json.dumps(options) if options else None,
                answer=answer,
                extra_data=json.dumps(extra_data) if extra_data else None,
            )
        )

        exercise_id += 1

    skill_id += 1
    lesson_id += 1

# ---------------------------------------------------------
# INITIAL PROGRESS
# ---------------------------------------------------------

progress = UserProgress(
    user_id=1,
    streak=0,
    xp=0,
    hearts=5,
    max_hearts=5,
    gems=100,
    daily_goal=50,
    daily_xp=0,
    lessons_completed=0,
    completed_skill_ids=json.dumps([]),
    active_skill_id=1,
)

db.add(progress)

# ---------------------------------------------------------
# SAVE
# ---------------------------------------------------------

db.commit()
db.close()

print("✅ Database seeded successfully!")
print("👤 User ID: 1")
print("📚 Course: Spanish")
print("🎯 8 skills")
print("📝 8 lessons")
print("💚 Initial hearts: 5")
print("💎 Initial gems: 100")