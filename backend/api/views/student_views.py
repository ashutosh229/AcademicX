from collections import defaultdict

from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import status

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import  *
from api.serializers import *

@api_view(['GET'])
def get_student_profile(request, email):
    student = get_object_or_404(Student, email=email)  # Fetch the student or return 404
    serializer = StudentSerializer(student)
    return Response(serializer.data, status=200)


@api_view(['PATCH'])
def edit_student_name(request, email):
    student = get_object_or_404(Student, email=email)

    new_name = request.data.get("name")

    # Validate presence and length of the name
    if not new_name:
        return Response({"error": "Name field is required"}, status=400)

    if len(new_name) > 50:
        return Response({"error": "Name cannot exceed 50 characters"}, status=400)

    student.name = new_name
    student.save()

    return Response({"message": "Name updated successfully", "name": student.name}, status=200)