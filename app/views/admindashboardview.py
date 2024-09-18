from django.shortcuts import render,redirect


# Create your views here.

def adminhome(request):
    return render(request,'adminpages/adminhome.html')