from rest_framework.decorators import api_view, permission_classes
from rest_framework.reverse import reverse
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes((AllowAny,))
def api_root(request, format=None):
    return Response(
        {

            "Create Course": reverse(
                "create_course", request=request, format=format
            ),
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
            "Get Course Details using course id": reverse(
                "get_course_details",args=["1"], request=request, format=format

            ),
            "Activate Student (if not already)": reverse(
                "activate_student", args=["shubhamy@iitbhilai.ac.in"], request=request, format=format

            ),
            "Get Student Profile using email": reverse(
                "get_student_profile", args=["shubhamy@iitbhilai.ac.in"], request=request, format=format

            ),
            "Edit Student Name": reverse(
                "edit_student_name", args=["shubhamy@iitbhilai.ac.in"], request=request, format=format

            ),
            "Get User's Course Feedback": reverse(
                "user_course_feedback", args=["1","shubhamy@iitbhilai.ac.in"], request=request, format=format

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


        }
    )