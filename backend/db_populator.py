import csv
import os
import django
import random
from faker import Faker
from django.db import transaction

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")  # Replace with your project name
django.setup()

from api.models import Student, Course, CourseMetrics, Resource, Comment, ResourceVote, CommentVote

fake = Faker()
OUTPUT_DIR = "Dummy_Data"
os.makedirs(OUTPUT_DIR, exist_ok=True)
def populate_database():
    students = list(Student.objects.all())
    courses = list(Course.objects.all())

    if not students or not courses:
        print("No students or courses found. Please populate these tables first.")
        return

    with transaction.atomic():
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

            # Create 5-10 Comments per course
            comments = []
            for _ in range(random.randint(5, 10)):
                contributor = random.choice(students)
                comment = Comment.objects.create(
                    course=course,
                    text=fake.paragraph(nb_sentences=3),
                    contributor=contributor,
                    is_anonymous=random.choice([True, False]),
                )

                # Generate random votes
                voted_students = random.sample(students, random.randint(5, 15))
                upvote_count = 0
                downvote_count = 0

                for student in voted_students:
                    vote_type = random.choice([1, 2])
                    if vote_type == 1:
                        upvote_count += 1
                    else:
                        downvote_count += 1
                    try:
                        CommentVote.objects.create(student=student, comment=comment, vote_type=vote_type)
                    except:
                        pass  # Unique constraint

                comment.upvotes = upvote_count
                comment.downvotes = downvote_count
                comment.save()
                comments.append(comment)

            # Create 3-5 Resources per course
            resources = []
            for i in range(random.randint(3, 5)):
                contributor = random.choice(students)
                resource = Resource.objects.create(
                    course=course,
                    name=f"Resource {i+1}",
                    remarks=fake.sentence(),
                    url=fake.url(),
                    contributor=contributor,
                    is_anonymous=random.choice([True, False]),
                )

                # Generate random votes
                voted_students = random.sample(students, random.randint(5, 15))
                upvote_count = 0
                downvote_count = 0

                for student in voted_students:
                    vote_type = random.choice([1, 2])
                    if vote_type == 1:
                        upvote_count += 1
                    else:
                        downvote_count += 1
                    try:
                        ResourceVote.objects.create(student=student, resource=resource, vote_type=vote_type)
                    except:
                        pass  # Unique constraint

                resource.upvotes = upvote_count
                resource.downvotes = downvote_count
                resource.save()
                resources.append(resource)

    print("Database populated successfully!")

def populate_to_csv():
    students = list(Student.objects.all())
    courses = list(Course.objects.all())

    if not students or not courses:
        print("No students or courses found. Please populate these tables first.")
        return

    # Activate all students
    for student in students:
        if not student.activated:
            student.activated = True
            student.save()

    course_metrics_rows = []
    comment_rows = []
    comment_vote_rows = []
    resource_rows = []
    resource_vote_rows = []

    for course in courses:
        # CourseMetrics
        for _ in range(random.randint(15, 20)):
            contributor = random.choice(students)
            course_metrics_rows.append({
                "course_id": course.id,
                "content_toughness": random.randint(1, 10),
                "teaching_quality": random.randint(1, 10),
                "workload": random.randint(1, 10),
                "exam_difficulty": random.randint(1, 10),
                "grading_strictness": random.randint(1, 10),
                "resources_provided": random.randint(1, 10),
                "recommendation": random.randint(1, 10),
                "grade_obtained": random.randint(1, 10),
                "contributor_id": contributor.email,
            })

        # Comments + CommentVotes
        for _ in range(random.randint(5, 10)):
            contributor = random.choice(students)
            comment_id = f"{course.id}_{contributor.id}_{random.randint(1000, 9999)}"
            upvotes = 0
            downvotes = 0

            comment_rows.append({
                "id": comment_id,
                "course_id": course.id,
                "text": fake.paragraph(nb_sentences=3),
                "contributor_id": contributor.email,
                "is_anonymous": random.choice([True, False]),
                "upvotes": 0,
                "downvotes": 0
            })

            voters = random.sample(students, random.randint(5, 15))
            for student in voters:
                vote_type = random.choice([1, 2])
                if vote_type == 1:
                    upvotes += 1
                else:
                    downvotes += 1
                comment_vote_rows.append({
                    "student_id": student.email,
                    "comment_id": comment_id,
                    "vote_type": vote_type
                })

            comment_rows[-1]["upvotes"] = upvotes
            comment_rows[-1]["downvotes"] = downvotes

        # Resources + ResourceVotes
        for i in range(random.randint(3, 5)):
            contributor = random.choice(students)
            resource_id = f"{course.id}_{contributor.id}_{i}_{random.randint(1000, 9999)}"
            upvotes = 0
            downvotes = 0

            resource_rows.append({
                "id": resource_id,
                "course_id": course.id,
                "name": f"Resource {i + 1}",
                "remarks": fake.sentence(),
                "url": fake.url(),
                "contributor_id": contributor.email,
                "is_anonymous": random.choice([True, False]),
                "upvotes": 0,
                "downvotes": 0
            })

            voters = random.sample(students, random.randint(5, 15))
            for student in voters:
                vote_type = random.choice([1, 2])
                if vote_type == 1:
                    upvotes += 1
                else:
                    downvotes += 1
                resource_vote_rows.append({
                    "student_id": student.email,
                    "resource_id": resource_id,
                    "vote_type": vote_type
                })

            resource_rows[-1]["upvotes"] = upvotes
            resource_rows[-1]["downvotes"] = downvotes

    def write_csv(filename, rows):
        if rows:
            filepath = os.path.join(OUTPUT_DIR, filename)
            with open(filepath, mode='w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=rows[0].keys())
                writer.writeheader()
                writer.writerows(rows)

    write_csv("course_metrics.csv", course_metrics_rows)
    write_csv("comments.csv", comment_rows)
    write_csv("comment_votes.csv", comment_vote_rows)
    write_csv("resources.csv", resource_rows)
    write_csv("resource_votes.csv", resource_vote_rows)

    print("CSV files generated in Dummy_Data folder.")


def clear_feedback_tables():
    print("Deleting ResourceVotes...")
    ResourceVote.objects.all().delete()

    print("Deleting CommentVotes...")
    CommentVote.objects.all().delete()

    print("Deleting Resources...")
    Resource.objects.all().delete()

    print("Deleting Comments...")
    Comment.objects.all().delete()

    print("Deleting CourseMetrics...")
    CourseMetrics.objects.all().delete()

    print("✅ All feedback-related tables cleared.")

def clear_course_and_student():
    print("Deleting c...")
    Course.objects.all().delete()

    print("Deleting s...")
    Student.objects.all().delete()

if __name__ == "__main__":
    clear_course_and_student()
    #clear_feedback_tables()
    #populate_to_csv()
