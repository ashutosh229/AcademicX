from collections import defaultdict

from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import status

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import  *
from api.serializers import *


@api_view(['PATCH'])
def activate_student(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email field is required"}, status=400)
    student = get_object_or_404(Student, email=email)

    if not student.activated:
        student.activated = True
        student.save()
        return Response({"message": "Student activated successfully"}, status=200)

    return Response({"message": "Student is already activated"}, status=200)


@api_view(['GET'])
def get_student_profile(request, email):
    student = get_object_or_404(Student, email=email)  # Fetch the student or return 404
    serializer = StudentSerializer(student)
    return Response(serializer.data, status=200)


@api_view(['PATCH'])
def edit_student_name(request):
    email = request.data.get("email")
    new_name = request.data.get("name")
    # Validate presence and length of the name
    if not new_name or not email:
        return Response({"error": "Email and Name field is required"}, status=400)
    if type(new_name) != str:
        return Response({"error": "Name has to be a string"}, status=400)
    if len(new_name) > 50:
        return Response({"error": "Name cannot exceed 50 characters"}, status=400)



    student = get_object_or_404(Student, email=email)
    student.name = new_name
    student.save()

    return Response({"message": "Name updated successfully", "name": student.name}, status=200)

@api_view(['GET'])
def get_user_course_feedback(request, course_id, email):
    feedback = get_object_or_404(CourseMetrics, course_id=course_id, contributor__email=email)

    serializer = CourseMetricSerializer(feedback)
    return Response(serializer.data, status=200)


@api_view(['POST'])
def delete_user_course_feedback(request):
    email = request.data.get('email')
    course_id = request.data.get('course_id')

    if not email or not course_id:
        return Response({"error": "Email and course_id are required."}, status=status.HTTP_400_BAD_REQUEST)

    student = Student.objects.filter(email=email).first()
    if not student:
        return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

    feedback = CourseMetrics.objects.filter(contributor=student, course_id=course_id).first()
    if not feedback:
        return Response({"error": "No feedback found for this course by the contributor."},
                        status=status.HTTP_404_NOT_FOUND)

    feedback.delete()
    return Response({"message": "Feedback deleted successfully."}, status=status.HTTP_200_OK)

