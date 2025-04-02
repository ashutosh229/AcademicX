from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from api.models import Comment, CommentVote, Student
from api.serializers import AddCommentSerializer
@api_view(['POST'])
def add_comment(request):

    serializer = AddCommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "comment added"}, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def delete_comment(request):
    email = request.data.get("email")
    comment_id = request.data.get("comment_id")

    if not email or not comment_id:
        return Response({"error": "Email and comment_id are required."}, status=status.HTTP_400_BAD_REQUEST)

    student = get_object_or_404(Student, email=email)
    comment = get_object_or_404(Comment, comment_id=comment_id, contributor=student)

    comment.delete()
    return Response({"message": "comment deleted"}, status=status.HTTP_200_OK)
@api_view(['POST'])
def upvote_comment(request):
    email = request.data.get('email')
    comment_id = request.data.get('comment_id')

    if not email or not comment_id:
        return Response({"error": "Email and comment_id are required."}, status=status.HTTP_400_BAD_REQUEST)

    student = get_object_or_404(Student, email=email)
    comment = get_object_or_404(Comment, comment_id=comment_id)

    # Check if the user already upvoted
    if CommentVote.objects.filter(student=student, comment=comment, vote_type=1).exists():
        return Response({"error": "User already upvoted this comment."}, status=status.HTTP_400_BAD_REQUEST)

    # Remove downvote if it exists (preventing both upvote and downvote at the same time)
    downvote = CommentVote.objects.filter(student=student, comment=comment, vote_type=-1).first()
    if downvote:
        downvote.delete()
        comment.downvotes -= 1  # Decrement downvote count

    # Add upvote
    CommentVote.objects.create(student=student, comment=comment, vote_type=1)
    comment.upvotes += 1
    comment.save()

    return Response({"message": "Upvote added successfully."}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def remove_upvote_comment(request):
    email = request.data.get('email')
    comment_id = request.data.get('comment_id')

    if not email or not comment_id:
        return Response({"error": "Email and comment_id are required."}, status=status.HTTP_400_BAD_REQUEST)

    student = get_object_or_404(Student, email=email)
    comment = get_object_or_404(Comment, comment_id=comment_id)

    # Find the upvote record
    vote = CommentVote.objects.filter(student=student, comment=comment, vote_type=1).first()
    if not vote:
        return Response({"error": "User has not upvoted this comment."}, status=status.HTTP_400_BAD_REQUEST)

    # Remove upvote
    vote.delete()
    comment.upvotes -= 1
    comment.save()

    return Response({"message": "Upvote removed successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
def downvote_comment(request):
    email = request.data.get('email')
    comment_id = request.data.get('comment_id')

    if not email or not comment_id:
        return Response({"error": "Email and comment_id are required."}, status=status.HTTP_400_BAD_REQUEST)

    student = get_object_or_404(Student, email=email)
    comment = get_object_or_404(Comment, comment_id=comment_id)

    # Check if the user already downvoted
    if CommentVote.objects.filter(student=student, comment=comment, vote_type=-1).exists():
        return Response({"error": "User already downvoted this comment."}, status=status.HTTP_400_BAD_REQUEST)

    # Remove upvote if it exists (preventing both upvote and downvote at the same time)
    upvote = CommentVote.objects.filter(student=student, comment=comment, vote_type=1).first()
    if upvote:
        upvote.delete()
        comment.upvotes -= 1

    # Add downvote
    CommentVote.objects.create(student=student, comment=comment, vote_type=-1)
    comment.downvotes += 1
    comment.save()

    return Response({"message": "Downvote added successfully."}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def remove_downvote_comment(request):
    email = request.data.get('email')
    comment_id = request.data.get('comment_id')

    if not email or not comment_id:
        return Response({"error": "Email and comment_id are required."}, status=status.HTTP_400_BAD_REQUEST)

    student = get_object_or_404(Student, email=email)
    comment = get_object_or_404(Comment, comment_id=comment_id)

    # Find the downvote record
    vote = CommentVote.objects.filter(student=student, comment=comment, vote_type=-1).first()
    if not vote:
        return Response({"error": "User has not downvoted this comment."}, status=status.HTTP_400_BAD_REQUEST)

    # Remove downvote
    vote.delete()
    comment.downvotes -= 1
    comment.save()

    return Response({"message": "Downvote removed successfully."}, status=status.HTTP_200_OK)