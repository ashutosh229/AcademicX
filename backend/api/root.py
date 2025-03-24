from rest_framework.decorators import api_view, permission_classes
from rest_framework.reverse import reverse
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes((AllowAny,))
def api_root(request, format=None):
    return Response(
        {

            "create_course": reverse(
                "create_course", request=request, format=format
            ),
            "add_comment": reverse(
                "add_comment", request=request, format=format
            ),
            "add_resource": reverse(
                "add_resource", request=request, format=format
            ),
            "give_course_feedback": reverse(
                "give_course_feedback", request=request, format=format
            ),

            "get_all_courses": reverse(
                "get_all_courses",  request=request, format=format

            ),
            "get_course_details": reverse(
                "get_course_details",args=["CS201"], request=request, format=format

            ),


        }
    )