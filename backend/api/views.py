from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Person
from .serializers import PersonSerializer


@api_view(['POST'])
def insert_name_test(request):
    """POST API to insert firstname and surname into PostgreSQL"""
    serializer = PersonSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Data inserted successfully"}, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def fetch_surname_test(request, firstname):  # Accepts path parameter
    """GET API to fetch surname based on firstname"""
    try:
        person = Person.objects.get(firstname=firstname)
        return Response({"surname": person.surname})
    except Person.DoesNotExist:
        return Response({"error": "Person not found"}, status=404)

