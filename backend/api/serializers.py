from rest_framework import serializers
from .models import *


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    name = serializers.CharField(min_length=1, max_length=100)  #  Enforcing length
    code = serializers.CharField(min_length=1,max_length=50)
    # these above enforcements are optional and only checked/applied during POST or PUT request
    class Meta:
        model = Course
        fields = '__all__'
        # course_id is auto field it wont be expected in POST req but rest all must be given

class CourseMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseMetrics
        fields = '__all__'


class AddResourceSerializer(serializers.ModelSerializer):
    name = serializers.CharField(min_length=1, max_length=100)  # Enforcing length
    remarks = serializers.CharField(min_length=0, max_length=255)
    class Meta:
        model = Resource
        fields = ['course','name','remarks','url','contributor','is_anonymous']

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'

class AddCommentSerializer(serializers.ModelSerializer):
    name = serializers.CharField(min_length=1, max_length=100)  # Enforcing length
    remarks = serializers.CharField(min_length=0, max_length=255)
    class Meta:
        model = Comment
        fields = ['course','text','contributor','is_anonymous']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'