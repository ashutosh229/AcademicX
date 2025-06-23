from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from api.models import ResourceVote, Resource, Student
from api.serializers import AddResourceSerializer, ResourceSerializer
import jwt
import os


@api_view(["POST"])
def add_resource(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "Unauthorized"}, status=401)
    token = auth_header.split(" ")[1]
    next_auth_secret = os.environ.get("NEXTAUTH_SECRET", "mysite.settings")
    decoded = jwt.decode(token, next_auth_secret, algorithms=["HS256"])
    role = decoded.get("role")
    if not role:
        return Response({"error": "Role not found"}, status=402)
    serializer = AddResourceSerializer(data=request.data)
    if serializer.is_valid():
        resource = serializer.save()  # Save and get instance
        resource_item = ResourceSerializer(
            resource
        ).data  # Get serialized data as a dict
        del resource_item["course"]  # remove without return
        resource_item["id"] = resource_item.pop("resource_id")
        resource_item["user_vote"] = 0  # default
        anonymous_value = resource_item.pop("is_anonymous")
        contributor_email = resource_item.pop("contributor")
        # Fetch student's name if available, otherwise keep the email

        student = Student.objects.get(email=contributor_email)
        contributor_name = student.name if student.name else contributor_email

        resource_item["contributor"] = {
            "name": contributor_name,
            "batch": student.batch,
            "degree": student.degree,
            "branch": student.branch,
            "email": contributor_email,
            "isAnonymous": anonymous_value,
        }

        return Response(resource_item, status=201)
    return Response(serializer.errors, status=400)


@api_view(["POST"])
def delete_resource(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "Unauthorized"}, status=401)
    token = auth_header.split(" ")[1]
    next_auth_secret = os.environ.get("NEXTAUTH_SECRET", "mysite.settings")
    decoded = jwt.decode(token, next_auth_secret, algorithms=["HS256"])
    role = decoded.get("role")
    if not role:
        return Response({"error": "Role not found"}, status=402)
    email = request.data.get("email")
    resource_id = request.data.get("resource_id")

    if not email or not resource_id:
        return Response(
            {"error": "Email and resource_id are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    student = get_object_or_404(Student, email=email)
    resource = get_object_or_404(Resource, resource_id=resource_id, contributor=student)

    resource.delete()
    return Response({"message": "resource deleted"}, status=status.HTTP_200_OK)


@api_view(["POST"])
def upvote_resource(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "Unauthorized"}, status=401)
    token = auth_header.split(" ")[1]
    next_auth_secret = os.environ.get("NEXTAUTH_SECRET", "mysite.settings")
    decoded = jwt.decode(token, next_auth_secret, algorithms=["HS256"])
    role = decoded.get("role")
    if not role:
        return Response({"error": "Role not found"}, status=402)
    email = request.data.get("email")
    resource_id = request.data.get("resource_id")

    if not email or not resource_id:
        return Response(
            {"error": "Email and resource_id are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    student = get_object_or_404(Student, email=email)
    resource = get_object_or_404(Resource, resource_id=resource_id)

    # Check if already upvoted
    if ResourceVote.objects.filter(
        student=student, resource=resource, vote_type=1
    ).exists():
        return Response(
            {"error": "User already upvoted this resource."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Remove downvote if exists
    downvote = ResourceVote.objects.filter(
        student=student, resource=resource, vote_type=2
    ).first()
    if downvote:
        downvote.delete()
        resource.downvotes -= 1

    # Add upvote
    ResourceVote.objects.create(student=student, resource=resource, vote_type=1)
    resource.upvotes += 1
    resource.save()

    return Response(
        {"message": "Upvote added successfully."}, status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
def remove_upvote_resource(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "Unauthorized"}, status=401)
    token = auth_header.split(" ")[1]
    next_auth_secret = os.environ.get("NEXTAUTH_SECRET", "mysite.settings")
    decoded = jwt.decode(token, next_auth_secret, algorithms=["HS256"])
    role = decoded.get("role")
    if not role:
        return Response({"error": "Role not found"}, status=402)
    email = request.data.get("email")
    resource_id = request.data.get("resource_id")

    if not email or not resource_id:
        return Response(
            {"error": "Email and resource_id are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    student = get_object_or_404(Student, email=email)
    resource = get_object_or_404(Resource, resource_id=resource_id)

    # Find the upvote
    vote = ResourceVote.objects.filter(
        student=student, resource=resource, vote_type=1
    ).first()
    if not vote:
        return Response(
            {"error": "User has not upvoted this resource."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Remove upvote
    vote.delete()
    resource.upvotes -= 1
    resource.save()

    return Response(
        {"message": "Upvote removed successfully."}, status=status.HTTP_200_OK
    )


@api_view(["POST"])
def downvote_resource(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "Unauthorized"}, status=401)
    token = auth_header.split(" ")[1]
    next_auth_secret = os.environ.get("NEXTAUTH_SECRET", "mysite.settings")
    decoded = jwt.decode(token, next_auth_secret, algorithms=["HS256"])
    role = decoded.get("role")
    if not role:
        return Response({"error": "Role not found"}, status=402)
    email = request.data.get("email")
    resource_id = request.data.get("resource_id")

    if not email or not resource_id:
        return Response(
            {"error": "Email and resource_id are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    student = get_object_or_404(Student, email=email)
    resource = get_object_or_404(Resource, resource_id=resource_id)

    # Check if already downvoted
    if ResourceVote.objects.filter(
        student=student, resource=resource, vote_type=2
    ).exists():
        return Response(
            {"error": "User already downvoted this resource."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Remove upvote if exists
    upvote = ResourceVote.objects.filter(
        student=student, resource=resource, vote_type=1
    ).first()
    if upvote:
        upvote.delete()
        resource.upvotes -= 1

    # Add downvote
    ResourceVote.objects.create(student=student, resource=resource, vote_type=2)
    resource.downvotes += 1
    resource.save()

    return Response(
        {"message": "Downvote added successfully."}, status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
def remove_downvote_resource(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "Unauthorized"}, status=401)
    token = auth_header.split(" ")[1]
    next_auth_secret = os.environ.get("NEXTAUTH_SECRET", "mysite.settings")
    decoded = jwt.decode(token, next_auth_secret, algorithms=["HS256"])
    role = decoded.get("role")
    if not role:
        return Response({"error": "Role not found"}, status=402)
    email = request.data.get("email")
    resource_id = request.data.get("resource_id")

    if not email or not resource_id:
        return Response(
            {"error": "Email and resource_id are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    student = get_object_or_404(Student, email=email)
    resource = get_object_or_404(Resource, resource_id=resource_id)

    # Find the downvote
    vote = ResourceVote.objects.filter(
        student=student, resource=resource, vote_type=2
    ).first()
    if not vote:
        return Response(
            {"error": "User has not downvoted this resource."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Remove downvote
    vote.delete()
    resource.downvotes -= 1
    resource.save()

    return Response(
        {"message": "Downvote removed successfully."}, status=status.HTTP_200_OK
    )
