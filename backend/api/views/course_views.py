from collections import defaultdict

from django.shortcuts import render
from rest_framework import status

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import *
from api.serializers import *
import jwt
import os


@api_view(["POST"])
def create_course(request):

    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Data inserted successfully"}, status=201)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
def get_all_courses(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "Unauthorized"}, status=401)
    token = auth_header.split(" ")[1]
    next_auth_secret = os.environ.get("NEXTAUTH_SECRET", "mysite.settings")
    decoded = jwt.decode(token, next_auth_secret, algorithms=["HS256"])
    role = decoded.get("role")
    if not role:
        return Response({"error": "Role not found"}, status=402)
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "Unauthorized"}, status=401)
    token = auth_header.split(" ")[1]
    next_auth_secret = os.environ.get("NEXTAUTH_SECRET", "mysite.settings")
    decoded = jwt.decode(token, next_auth_secret, algorithms=["HS256"])
    role = decoded.get("role")
    if not role:
        return Response({"error": "Role not found"}, status=402)
    courses = Course.objects.all()  # Fetch all courses
    serializer = CourseSerializer(courses, many=True)  # Serialize the data
    return Response(serializer.data)  # Return JSON response


@api_view(["POST"])
def give_course_feedback(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "Unauthorized"}, status=401)
    token = auth_header.split(" ")[1]
    next_auth_secret = os.environ.get("NEXTAUTH_SECRET", "mysite.settings")
    decoded = jwt.decode(token, next_auth_secret, algorithms=["HS256"])
    role = decoded.get("role")
    if not role:
        return Response({"error": "Role not found"}, status=402)
    course_id = request.data.get("course")
    contributor_email = request.data.get("contributor")

    if not course_id or not contributor_email:
        return Response(
            {"error": "Course ID and contributor email are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Check if the contributor has already given feedback for this course
    if CourseMetrics.objects.filter(
        course_id=course_id, contributor_id=contributor_email
    ).exists():
        return Response(
            {"error": "You have already given feedback for this course."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = CourseMetricSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Feedback submitted successfully"},
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def get_course_details(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "Unauthorized"}, status=401)
    token = auth_header.split(" ")[1]
    next_auth_secret = os.environ.get("NEXTAUTH_SECRET", "mysite.settings")
    decoded = jwt.decode(token, next_auth_secret, algorithms=["HS256"])
    role = decoded.get("role")
    if not role:
        return Response({"error": "Role not found"}, status=402)
    id = request.data.get("course_id")
    user_email = request.data.get("user_email")
    if not id or not user_email:
        return Response(
            {"error": "course_id and user_email are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        course_obj = Course.objects.get(id=id)  # Fetch course by code
        resources = course_obj.resources.all()  # Foreign key relation related name
        # equivalent to resources = Resource.objects.filter(course=course_obj)  # Fetch resources
        comments = course_obj.comments.all()
        feedbacks = course_obj.ratings.all()

        # Fetch all votes made by this user in a single query
        user_comment_votes = CommentVote.objects.filter(
            student_id=user_email
        ).values_list("comment_id", "vote_type")
        comment_vote_map = dict(
            user_comment_votes
        )  # Create a dictionary {comment_id: vote_type}
        user_resource_votes = ResourceVote.objects.filter(
            student_id=user_email
        ).values_list("resource_id", "vote_type")
        resource_vote_map = dict(
            user_resource_votes
        )  # Create a dictionary {comment_id: vote_type}

        course_serializer = CourseSerializer(course_obj)  # Serialize course details
        resource_serializer = ResourceSerializer(
            resources, many=True
        )  # Serialize resources
        comment_serializer = CommentSerializer(
            comments, many=True
        )  # Serialize resources
        feedback_serializer = CourseMetricSerializer(feedbacks, many=True)

        metric_counter = {
            "content_toughness": [0] * 11,
            "teaching_quality": [0] * 11,
            "workload": [0] * 11,
            "exam_difficulty": [0] * 11,
            "grading_strictness": [0] * 11,
            "resources_provided": [0] * 11,
            "recommendation": [0] * 11,
            "grade_obtained": [0] * 11,
        }

        for feedback in feedback_serializer.data:
            for metric in feedback:
                if metric != "id" and metric != "course" and metric != "contributor":
                    rating = feedback[metric]
                    dist = metric_counter[metric]
                    dist[rating] += 1

        metrics = {
            "content_toughness": {"average": 0, "distribution": []},
            "workload": {"average": 0, "distribution": []},
            "teaching_quality": {"average": 0, "distribution": []},
            "resources_provided": {"average": 0, "distribution": []},
            "exam_difficulty": {"average": 0, "distribution": []},
            "grading_strictness": {"average": 0, "distribution": []},
            "recommendation": {"average": 0, "distribution": []},
            "grade_obtained": {"average": 0, "distribution": []},
        }

        for metric in metric_counter:
            weighted_sum = 0
            dist = metric_counter[metric]
            for i in range(11):
                metrics[metric]["distribution"].append({"value": i, "count": dist[i]})
                weighted_sum += i * dist[i]

            if sum(dist):
                metrics[metric]["average"] = weighted_sum / sum(dist)
            else:
                metrics[metric]["average"] = -1  # indicates no ratings

        resources = resource_serializer.data.copy()

        for resource_item in resources:
            del resource_item["course"]  # remove without return
            id_val = resource_item.pop("resource_id")
            resource_item["id"] = id_val
            resource_item["user_vote"] = resource_vote_map.get(
                id_val, 0
            )  # Default to 0 if no vote exists
            anonymous_value = resource_item.pop("is_anonymous")
            contributor_email = resource_item.pop("contributor")
            # Fetch student's name if available, otherwise keep the email

            student = Student.objects.get(email=contributor_email)
            contributor_name = student.name if student.name else contributor_email

            resource_item["contributor"] = {
                "name": contributor_name,
                "batch": student.batch,
                "degree": student.degree,
                "branch": student.branch,
                "email": contributor_email,
                "isAnonymous": anonymous_value,
            }

        comments = comment_serializer.data.copy()

        for comment_item in comments:
            del comment_item["course"]  # remove without return
            id_val = comment_item.pop("comment_id")
            comment_item["id"] = id_val
            comment_item["user_vote"] = comment_vote_map.get(
                id_val, 0
            )  # Default to 0 if no vote exists
            anonymous_value = comment_item.pop("is_anonymous")
            contributor_email = comment_item.pop("contributor")
            # Fetch student's name if available, otherwise keep the email

            student = Student.objects.get(email=contributor_email)
            author_name = student.name if student.name else contributor_email

            comment_item["author"] = {
                "name": author_name,
                "batch": student.batch,
                "degree": student.degree,
                "branch": student.branch,
                "email": contributor_email,
                "isAnonymous": anonymous_value,
            }

        return Response(
            {
                "course": course_serializer.data,
                "resources": resources,
                "comments": comments,
                "metrics": metrics,
            }
        )  # Return course details along with its resources
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)


@api_view(["POST"])
def get_course_resources(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "Unauthorized"}, status=401)
    token = auth_header.split(" ")[1]
    next_auth_secret = os.environ.get("NEXTAUTH_SECRET", "mysite.settings")
    decoded = jwt.decode(token, next_auth_secret, algorithms=["HS256"])
    role = decoded.get("role")
    if not role:
        return Response({"error": "Role not found"}, status=402)
    id = request.data.get("course_id")
    user_email = request.data.get("user_email")
    if not id or not user_email:
        return Response(
            {"error": "course_id and user_email are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        course_obj = Course.objects.get(id=id)  # Fetch course by code
        resources = course_obj.resources.all()  # Foreign key relation related name

        user_resource_votes = ResourceVote.objects.filter(
            student_id=user_email
        ).values_list("resource_id", "vote_type")
        resource_vote_map = dict(
            user_resource_votes
        )  # Create a dictionary {comment_id: vote_type}

        resource_serializer = ResourceSerializer(
            resources, many=True
        )  # Serialize resources

        resources = resource_serializer.data.copy()

        for resource_item in resources:
            del resource_item["course"]  # remove without return
            id_val = resource_item.pop("resource_id")
            resource_item["id"] = id_val
            resource_item["user_vote"] = resource_vote_map.get(
                id_val, 0
            )  # Default to 0 if no vote exists
            anonymous_value = resource_item.pop("is_anonymous")
            contributor_email = resource_item.pop("contributor")
            # Fetch student's name if available, otherwise keep the email

            student = Student.objects.get(email=contributor_email)
            contributor_name = student.name if student.name else contributor_email

            resource_item["contributor"] = {
                "name": contributor_name,
                "batch": student.batch,
                "degree": student.degree,
                "branch": student.branch,
                "email": contributor_email,
                "isAnonymous": anonymous_value,
            }

        return Response(
            {"resources": resources}
        )  # Return course details along with its resources
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)


@api_view(["POST"])
def get_course_comments(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "Unauthorized"}, status=401)
    token = auth_header.split(" ")[1]
    next_auth_secret = os.environ.get("NEXTAUTH_SECRET", "mysite.settings")
    decoded = jwt.decode(token, next_auth_secret, algorithms=["HS256"])
    role = decoded.get("role")
    if not role:
        return Response({"error": "Role not found"}, status=402)
    id = request.data.get("course_id")
    user_email = request.data.get("user_email")
    if not id or not user_email:
        return Response(
            {"error": "course_id and user_email are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        course_obj = Course.objects.get(id=id)  # Fetch course by code
        comments = course_obj.comments.all()

        # Fetch all votes made by this user in a single query
        user_comment_votes = CommentVote.objects.filter(
            student_id=user_email
        ).values_list("comment_id", "vote_type")
        comment_vote_map = dict(
            user_comment_votes
        )  # Create a dictionary {comment_id: vote_type}
        comment_serializer = CommentSerializer(
            comments, many=True
        )  # Serialize resources

        comments = comment_serializer.data.copy()

        for comment_item in comments:
            del comment_item["course"]  # remove without return
            id_val = comment_item.pop("comment_id")
            comment_item["id"] = id_val
            comment_item["user_vote"] = comment_vote_map.get(
                id_val, 0
            )  # Default to 0 if no vote exists
            anonymous_value = comment_item.pop("is_anonymous")
            contributor_email = comment_item.pop("contributor")
            # Fetch student's name if available, otherwise keep the email

            student = Student.objects.get(email=contributor_email)
            author_name = student.name if student.name else contributor_email

            comment_item["author"] = {
                "name": author_name,
                "batch": student.batch,
                "degree": student.degree,
                "branch": student.branch,
                "email": contributor_email,
                "isAnonymous": anonymous_value,
            }

        return Response(
            {"comments": comments}
        )  # Return course details along with its resources
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)


@api_view(["GET"])
def get_course_feedbacks(request, id):

    try:
        course_obj = Course.objects.get(id=id)  # Fetch course by code
        feedbacks = course_obj.ratings.all()
        feedback_serializer = CourseMetricSerializer(feedbacks, many=True)

        metric_counter = {
            "content_toughness": [0] * 11,
            "teaching_quality": [0] * 11,
            "workload": [0] * 11,
            "exam_difficulty": [0] * 11,
            "grading_strictness": [0] * 11,
            "resources_provided": [0] * 11,
            "recommendation": [0] * 11,
            "grade_obtained": [0] * 11,
        }

        for feedback in feedback_serializer.data:
            for metric in feedback:
                if metric != "id" and metric != "course" and metric != "contributor":
                    rating = feedback[metric]
                    dist = metric_counter[metric]
                    dist[rating] += 1

        metrics = {
            "content_toughness": {"average": 0, "distribution": []},
            "teaching_quality": {"average": 0, "distribution": []},
            "workload": {"average": 0, "distribution": []},
            "exam_difficulty": {"average": 0, "distribution": []},
            "grading_strictness": {"average": 0, "distribution": []},
            "resources_provided": {"average": 0, "distribution": []},
            "recommendation": {"average": 0, "distribution": []},
            "grade_obtained": {"average": 0, "distribution": []},
        }

        for metric in metric_counter:
            weighted_sum = 0
            dist = metric_counter[metric]
            for i in range(11):
                metrics[metric]["distribution"].append({"value": i, "count": dist[i]})
                weighted_sum += i * dist[i]

            if sum(dist):
                metrics[metric]["average"] = weighted_sum / sum(dist)
            else:
                metrics[metric]["average"] = -1  # indicates no ratings

        return Response(
            {"metrics": metrics}
        )  # Return course details along with its resources
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
