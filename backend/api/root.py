from rest_framework.decorators import api_view, permission_classes
from rest_framework.reverse import reverse
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes((AllowAny,))
def api_root(request, format=None):
    return Response(
        {
            "insert_name": reverse(
                "insert_name", request=request, format=format
            ),

            "fetch_surname": reverse(
                "fetch_surname", args=["John"], request=request, format=format # ek default arg deke rakha for example output
            ),

            "create_course": reverse(
                "create_course", request=request, format=format
            ),

            "get_all_courses": reverse(
                "get_all_courses",  request=request, format=format

            ),

        }
    )