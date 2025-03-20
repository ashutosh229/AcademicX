from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import  *
from api.serializers import *


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


@api_view(['POST'])
def give_feedback(request):

    serializer = CourseMetricSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Data inserted successfully"}, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def add_comment(request):

    serializer = AddCommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Data inserted successfully"}, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def add_resource(request):

    serializer = AddResourceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Data inserted successfully"}, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def get_course_details(request, course_code):
    try:
        course_obj = Course.objects.get(code=course_code)  # Fetch course by code
        course_serializer = CourseSerializer(course_obj)  # Serialize course details
        resources = Resource.objects.filter(course=course_obj)  # Fetch resources
        resource_serializer = ResourceSerializer(resources, many=True)  # Serialize resources
        comments = Comment.objects.filter(course=course_obj)  # Fetch resources
        comment_serializer = CommentSerializer(resources, many=True)  # Serialize resources

        return Response({
            "course": course_serializer.data,
            "resources": resource_serializer.data,
            "comments": comment_serializer.data
        })  # Return course details along with its resources
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
