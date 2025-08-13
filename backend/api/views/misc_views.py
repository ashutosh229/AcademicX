from rest_framework.decorators import api_view
from rest_framework.response import Response
import random
import requests
from api.models import (
    Student,
    Comment,
    CourseMetrics,
    Resource,
    CommentVote,
    ResourceVote,
)
from django.db import connection
import time

@api_view(["GET"])
def get_analytics(request):
    analytics = {
        "number_of_users_activated": Student.objects.filter(activated=True).count(),
        "number_of_comments": Comment.objects.count(),
        "number_of_feedbacks": CourseMetrics.objects.count(),
        "number_of_courses_rated": CourseMetrics.objects.values("course")
        .distinct()
        .count(),
        "number_of_unique_users_gave_feedback": CourseMetrics.objects.values(
            "contributor"
        )
        .distinct()
        .count(),
        "number_of_resources": Resource.objects.count(),
        "number_of_upvotes": CommentVote.objects.filter(vote_type=1).count()
        + ResourceVote.objects.filter(vote_type=1).count(),
        "number_of_downvotes": CommentVote.objects.filter(vote_type=-1).count()
        + ResourceVote.objects.filter(vote_type=-1).count(),
    }
    return Response(analytics)


@api_view(["GET", "HEAD"])
def warmup(request):
    try:
        analytics = {
            "number_of_comments": Comment.objects.count(),
            "number_of_feedbacks": CourseMetrics.objects.count(),
            "number_of_resources": Resource.objects.count(),
            "number_of_upvotes": CommentVote.objects.filter(vote_type=1).count()
                                 + ResourceVote.objects.filter(vote_type=1).count(),
            "number_of_downvotes": CommentVote.objects.filter(vote_type=-1).count()
                                   + ResourceVote.objects.filter(vote_type=-1).count(),
        }

        return Response({
            "status": "backend and Supabase warmed",
            "analytics_summary": analytics
        })
    except Exception as e:
        return Response({
            "status": "error",
            "details": str(e)
        }, status=500)

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    "Mozilla/5.0 (X11; Linux x86_64)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
    "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)",
    "Mozilla/5.0 (Android 10; Mobile; rv:79.0) Gecko/79.0 Firefox/79.0",
    "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
]



@api_view(["GET","HEAD"])
def real_user_ping(request):
    """
    used to call time table creator's api to prevent circular calling
    (calling request on your own instance causes deadlock)
    """

    chosen_ua = random.choice(USER_AGENTS)
    target_url = "https://timetable-creator-n51f.onrender.com/submit/"

    headers = {
        "User-Agent": chosen_ua,
        "Content-Type": "application/json"
    }

    payload = {
        "course_id_list": [101, 102]
    }
    # Add 5 second delay before making the request
    time.sleep(5)
    internal_response = requests.post(target_url, json=payload, headers=headers)

    return Response("warmup",status=internal_response.status_code)

