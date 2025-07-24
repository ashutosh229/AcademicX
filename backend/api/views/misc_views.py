from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import (
    Student,
    Comment,
    CourseMetrics,
    Resource,
    CommentVote,
    ResourceVote,
)
from django.db import connection


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
