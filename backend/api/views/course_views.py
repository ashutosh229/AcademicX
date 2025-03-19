from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import  Course
from api.serializers import CourseSerializer


@api_view(['POST'])
def create_course(request):

    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Data inserted successfully"}, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def get_all_courses(request):
    courses = Course.objects.all()  # Fetch all courses
    serializer = CourseSerializer(courses, many=True)  # Serialize the data
    return Response(serializer.data)  # Return JSON response
