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