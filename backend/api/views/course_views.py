from collections import defaultdict

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
        resources = course_obj.resources.all() # Foreign key relation related name
        # equivalent to resources = Resource.objects.filter(course=course_obj)  # Fetch resources
        comments = course_obj.comments.all()
        feedbacks = course_obj.ratings.all()


        course_serializer = CourseSerializer(course_obj)  # Serialize course details
        resource_serializer = ResourceSerializer(resources, many=True)  # Serialize resources
        comment_serializer = CommentSerializer(comments, many=True)  # Serialize resources
        feedback_serializer = CourseMetricSerializer(feedbacks,many=True)

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
                if metric != "id" and metric !="course" and metric !="contributor":
                    rating = feedback[metric]
                    dist = metric_counter[metric]
                    dist[rating]+=1

        metrics = {
            "content_toughness": {"average":0, "distribution":[]},
            "teaching_quality": {"average":0, "distribution":[]},
            "workload": {"average":0, "distribution":[]},
            "exam_difficulty": {"average":0, "distribution":[]},
            "grading_strictness": {"average":0, "distribution":[]},
            "resources_provided": {"average":0, "distribution":[]},
            "recommendation": {"average":0, "distribution":[]},
            "grade_obtained": {"average":0, "distribution":[]},
        }

        for metric in metric_counter:
            weighted_sum =0
            dist = metric_counter[metric]
            for i in range(11):
                metrics[metric]["distribution"].append({"value":i, "count": dist[i]})
                weighted_sum+= (i*dist[i])

            metrics[metric]["average"] = weighted_sum / sum(dist)



        resources = resource_serializer.data.copy()

        for resource_item in resources:
            del resource_item["course"] # remove without return
            id_val = resource_item.pop("resource_id")
            resource_item["id"] = id_val
            anonymous_value = resource_item.pop("is_anonymous")
            contributor_email = resource_item.pop("contributor")
            resource_item["contributor"] = {"name":contributor_email, "isAnonymous":anonymous_value}

        comments= comment_serializer.data.copy()

        for comment_item in comments:
            del comment_item["course"]  # remove without return
            id_val = comment_item.pop("comment_id")
            comment_item["id"] = id_val
            anonymous_value = comment_item.pop("is_anonymous")
            contributor_email = comment_item.pop("contributor")
            comment_item["author"] = {"name": contributor_email, "isAnonymous": anonymous_value}




        return Response({
            "course": course_serializer.data,
            "resources": resources,
            "comments": comments,
            "metrics":metrics
        })  # Return course details along with its resources
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)


@api_view(['GET'])
def get_course_details_2(request, course_code):
    try:
        course_obj = Course.objects.get(code=course_code)  # Fetch course by code
        course_serializer = CourseSerializer(course_obj)  # Serialize course details
        resources = Resource.objects.filter(course=course_obj)  # Fetch resources
        resource_serializer = ResourceSerializer(resources, many=True)  # Serialize resources
        comments = Comment.objects.filter(course=course_obj)  # Fetch comments
        comment_serializer = CommentSerializer(comments, many=True)  # Serialize comments

        # Fetch course metrics
        metrics = CourseMetrics.objects.filter(course=course_obj)

        # Process metrics into required format
        content_toughness_distribution = {}
        workload_distribution = {}
        recommended_count = 0
        not_recommended_count = 0
        total_content_toughness = 0
        total_workload = 0
        total_entries = metrics.count()

        for metric in metrics:
            # Count occurrences for distribution
            content_toughness_distribution[metric.content_toughness] = content_toughness_distribution.get(metric.content_toughness, 0) + 1
            workload_distribution[metric.workload] = workload_distribution.get(metric.workload, 0) + 1

            # Aggregate scores
            total_content_toughness += metric.content_toughness
            total_workload += metric.workload

            # Recommendation count
            if metric.recommendation >= 5:
                recommended_count += 1
            else:
                not_recommended_count += 1

        # Convert distribution to list format
        content_toughness_list = [{"value": k, "count": v} for k, v in sorted(content_toughness_distribution.items())]
        workload_list = [{"value": k, "count": v} for k, v in sorted(workload_distribution.items())]

        # Calculate averages
        content_toughness_avg = total_content_toughness // total_entries if total_entries else 0
        workload_avg = total_workload // total_entries if total_entries else 0
        recommended_percentage = (recommended_count * 100) // total_entries if total_entries else 0
        not_recommended_percentage = (not_recommended_count * 100) // total_entries if total_entries else 0

        # Construct final response
        return Response({
            "id": str(course_obj.id),
            "name": course_obj.name,
            "code": course_obj.code,
            "professor": course_obj.professor,
            "metrics": {
                "contentToughness": {
                    "average": content_toughness_avg,
                    "distribution": content_toughness_list
                },
                "workload": {
                    "average": workload_avg,
                    "distribution": workload_list
                },
                "overallRecommendation": {
                    "recommended": recommended_percentage,
                    "notRecommended": not_recommended_percentage
                }
            },
            "resources": [
                {
                    "id": str(res.resource_id),
                    "name": res.name,
                    "type": res.remarks,
                    "url": res.url,
                    "contributor": {
                        "name": res.contributor if not res.is_anonymous else "Anonymous",
                        "isAnonymous": res.is_anonymous
                    },
                    "upvotes": res.upvotes,
                    "downvotes": res.downvotes,
                    "dateAdded": res.date_added.strftime("%Y-%m-%d")
                } for res in resources
            ],
            "comments": [
                {
                    "id": str(comment.comment_id),
                    "text": comment.text,
                    "author": {
                        "name": comment.contributor if not comment.is_anonymous else "Anonymous",
                        "isAnonymous": comment.is_anonymous
                    },
                    "upvotes": comment.upvotes,
                    "downvotes": comment.downvotes,
                    "datePosted": comment.date_posted.strftime("%Y-%m-%d")
                } for comment in comments
            ]
        })
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)