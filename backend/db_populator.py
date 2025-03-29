import os
import django
import random
from faker import Faker
from django.db import transaction
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")  # Update with actual project name
django.setup()

from api.models import Student, Course, CourseMetrics, Resource, Comment, ResourceVote, CommentVote


fake = Faker()

def populate_database():
    students = list(Student.objects.all())
    courses = list(Course.objects.all())

    if not students or not courses:
        print("No students or courses found. Please populate these tables first.")
        return

    with transaction.atomic():  # Ensures all operations are done in one go
        # Activate all students
        for student in students:
            if not student.activated:
                student.activated = True
                student.save()

        for course in courses:
            # Generate 15-20 Course Feedbacks per course
            feedbacks = [
                CourseMetrics(
                    course=course,
                    content_toughness=random.randint(1, 10),
                    teaching_quality=random.randint(1, 10),
                    workload=random.randint(1, 10),
                    exam_difficulty=random.randint(1, 10),
                    grading_strictness=random.randint(1, 10),
                    resources_provided=random.randint(1, 10),
                    recommendation=random.randint(1, 10),
                    grade_obtained=random.randint(1, 10),
                    contributor=random.choice(students),
                )
                for _ in range(random.randint(15, 20))
            ]
            CourseMetrics.objects.bulk_create(feedbacks)

            # Generate 5-10 Comments per course
            comments = [
                Comment(
                    course=course,
                    text=fake.paragraph(nb_sentences=3),
                    contributor=random.choice(students),
                    is_anonymous=random.choice([True, False]),
                    upvotes=random.randint(0, 50),
                    downvotes=random.randint(0, 50),
                )
                for _ in range(random.randint(5, 10))
            ]
            Comment.objects.bulk_create(comments)

            # Generate 3-5 Resources per course
            resources = [
                Resource(
                    course=course,
                    name=f"Resource {_}",
                    remarks=fake.sentence(),
                    url=fake.url(),
                    contributor=random.choice(students),
                    is_anonymous=random.choice([True, False]),
                    upvotes=random.randint(0, 50),
                    downvotes=random.randint(0, 50),
                )
                for _ in range(random.randint(3, 5))
            ]
            Resource.objects.bulk_create(resources)

    print("Database populated successfully!")

if __name__ == "__main__":
    populate_database()

