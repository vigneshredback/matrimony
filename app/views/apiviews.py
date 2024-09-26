# myapp/views.py

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

data = [
    {'id': 1, 'name': 'Alice', 'email': 'alice@example.com'},
    {'id': 2, 'name': 'Bob', 'email': 'bob@example.com'},
]

@swagger_auto_schema(method='get', responses={200: openapi.Response('A list of users')})
@swagger_auto_schema(method='post', request_body=openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'name': openapi.Schema(type=openapi.TYPE_STRING, description='The name of the user'),
        'email': openapi.Schema(type=openapi.TYPE_STRING, description='The email of the user')
    }
))
@api_view(['GET', 'POST'])
def user_list(request):
    if request.method == 'GET':
        return Response(data)

    elif request.method == 'POST':
        new_user = {
            'id': len(data) + 1,
            'name': request.data.get('name'),
            'email': request.data.get('email')
        }
        data.append(new_user)
        return Response(new_user, status=status.HTTP_201_CREATED)

@swagger_auto_schema(method='get', responses={200: openapi.Response('User details'), 404: 'Not Found'})
@swagger_auto_schema(method='put', request_body=openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'name': openapi.Schema(type=openapi.TYPE_STRING, description='The name of the user'),
        'email': openapi.Schema(type=openapi.TYPE_STRING, description='The email of the user')
    }
))
@swagger_auto_schema(method='delete', responses={204: 'No Content', 404: 'Not Found'})
@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, user_id):
    user = next((item for item in data if item['id'] == user_id), None)


    if request.method == 'GET':
        if user is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(user)

    elif request.method == 'PUT':
        if user is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user['name'] = request.data.get('name', user['name'])
        user['email'] = request.data.get('email', user['email'])
        return Response(user)

    elif request.method == 'DELETE':
        if user is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data.remove(user)
        return Response(status=status.HTTP_204_NO_CONTENT)
