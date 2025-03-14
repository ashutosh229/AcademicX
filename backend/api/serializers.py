from rest_framework import serializers
from .models import Person, Course


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['firstname', 'surname']

class CourseSerializer(serializers.ModelSerializer):
    name = serializers.CharField(min_length=1, max_length=255)  #  Enforcing length
    code = serializers.CharField(min_length=1,max_length=10)
    # these above enforcements are optional and only checked/applied during POST or PUT request
    class Meta:
        model = Course
        fields = '__all__'
        # course_id is auto field it wont be expected in POST req but rest all must be given
