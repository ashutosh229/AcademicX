"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import *
from api.root import api_root


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api_root'),  # Root page
    path('create_course/', create_course, name='create_course'),
    path('add_comment/', add_comment, name='add_comment'),
    path('add_resource/', add_resource, name='add_resource'),
    path('delete_comment/', delete_comment, name='delete_comment'),
    path('delete_resource/', delete_resource, name='delete_resource'),
    path('give_course_feedback/', give_course_feedback, name='give_course_feedback'),
    path('get_all_courses/', get_all_courses, name='get_all_courses'),
    path('get_course_details/<str:id>/', get_course_details, name='get_course_details'),
    path('get_student_profile/<str:email>/', get_student_profile, name='get_student_profile'),
    path('edit_student_name/', edit_student_name, name='edit_student_name'),
    path('user_course_feedback/<int:course_id>/<str:email>/', get_user_course_feedback, name='user_course_feedback'),
    path('activate_student/', activate_student, name='activate_student'),
    path('delete_course_feedback/', delete_user_course_feedback, name='delete_user_course_feedback'),
    path('comments/upvote/', upvote_comment, name='upvote_comment'),
    path('comments/remove_upvote/', remove_upvote_comment, name='remove_upvote_comment'),
    path('comments/downvote/', downvote_comment, name='downvote_comment'),
    path('comments/remove_downvote/', remove_downvote_comment, name='remove_downvote_comment'),

    # Resource vote endpoints
    path('resources/upvote/', upvote_resource, name='upvote_resource'),
    path('resources/remove_upvote/', remove_upvote_resource, name='remove_upvote_resource'),
    path('resources/downvote/', downvote_resource, name='downvote_resource'),
    path('resources/remove_downvote/', remove_downvote_resource, name='remove_downvote_resource'),

    path('get_analytics/', get_analytics, name='get_analytics'),


    
]