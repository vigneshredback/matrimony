from django.shortcuts import render
from app.models import Biodata

# Create your views here.

def dashboard(request):
    user = request.user
    biodata = Biodata.objects.filter(user=user).first()
    return render(request,'pages/dashboard.html',{'biodata':biodata})

def dashboardprofile(request):
    return render(request,'pages/dashboard_profile.html')