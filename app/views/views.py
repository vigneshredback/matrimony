from django.http import JsonResponse
from django.shortcuts import render


def aj(request):
    return render(request,'pages/aj.html')

def get_post(request):
    # Simulating some data to be returned
    data = {
        'title': 'Sample Post Title',
        'body': 'This is the body of the sample post.'
    }
    
    # Return the data as a JSON response
    return JsonResponse(data,status=200)
