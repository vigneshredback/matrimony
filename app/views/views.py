from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from app.models import Biodata
from app.serializers import BiodataSerializer
from rest_framework.response import Response


def aj(request):
    return render(request,'pages/aj.html')


@api_view(['GET'])
def get_post(request):
    # Simulating some data to be returned
    # Return the data as a JSON response
    return Response(BiodataSerializer(Biodata.objects.all().order_by('-id'), many=True).data)

# def get_post(request):
#     try:
#         bio = Biodata.objects.all()
#         data = BiodataSerializer(bio, many=True)
#         return JsonResponse(data.data, safe=False)
#     except Exception as e:
#         print(f"Error: {e}")  # Print the error in the server console for debugging
#         return JsonResponse({'error': 'Something went wrong!'}, status=500)

