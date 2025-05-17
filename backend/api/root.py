from rest_framework.decorators import api_view, permission_classes
from rest_framework.reverse import reverse
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes((AllowAny,))
def api_root(request, format=None):
    return Response(
        {

            "Add Comment": reverse(
                "add_comment", request=request, format=format
            ),
            "Add Resource": reverse(
                "add_resource", request=request, format=format
            ),
            "Delete Comment": reverse(
                "delete_comment", request=request, format=format
            ),
            "Delete Resource": reverse(
                "delete_resource", request=request, format=format
            ),
            "Give Course Feedback": reverse(
                "give_course_feedback", request=request, format=format
            ),

            "Get All Courses": reverse(
                "get_all_courses",  request=request, format=format

            ),
            "Get Course Details": reverse(
                "get_course_details", request=request, format=format

            ),
            "Get Course Feedbacks": reverse(
                "get_course_feedbacks",args=["1808"], request=request, format=format

            ),
            "Get Course Comments": reverse(
                "get_course_comments", request=request, format=format

            ),
            "Get Course Resources": reverse(
                "get_course_resources", request=request, format=format

            ),

            "Activate Student (if not already)": reverse(
                "activate_student", request=request, format=format

            ),
            "Fetch Student Profile": reverse(
                "get_student_profile", request=request, format=format

            ),
            "Edit Student Name": reverse(
                "edit_student_name", request=request, format=format

            ),
            "Fetch User's Course Feedback": reverse(
                "user_course_feedback",  request=request, format=format

            ),
            "Delete User's Course Feedback": reverse(
                "delete_user_course_feedback", request=request, format=format

            ),
            "Upvote Comment": reverse(
                "upvote_comment", request=request, format=format
            ),
            "Remove Upvote from Comment": reverse(
                "remove_upvote_comment", request=request, format=format
            ),
            "Downvote Comment": reverse(
                "downvote_comment", request=request, format=format
            ),
            "Remove Downvote from Comment": reverse(
                "remove_downvote_comment", request=request, format=format
            ),

            "Upvote Resource": reverse(
                "upvote_resource", request=request, format=format
            ),
            "Remove Upvote from Resource": reverse(
                "remove_upvote_resource", request=request, format=format
            ),
            "Downvote Resource": reverse(
                "downvote_resource", request=request, format=format
            ),
            "Remove Downvote from Resource": reverse(
                "remove_downvote_resource", request=request, format=format
            ),

            "Get Analytics": reverse(
                "get_analytics", request=request, format=format

            ),
            "Warm Up Backend and DB": reverse(
                "warmup", request=request, format=format

            ),


        }
    )