from django.shortcuts import render,redirect
from app.models import Biodata
from django.contrib import messages

# Create your views here.

def dashboard(request):
    user = request.user.id
    print(user)
    try:
        biodata = Biodata.objects.get(user_id=user)
        context={'biodata':biodata,
                'user':user,
                'phone':request.user.phone,
                'email':request.user.email,
                'name':request.user.name
                }
        return render(request,'pages/dashboard.html',context)
    except Exception as e:
        messages.warning(request,'Please add your biodata first')
        return redirect('biodata')

def dashboardprofile(request):
    user = request.user.id
    print(user)
    try:
        biodata = Biodata.objects.get(user_id=user)
        print(biodata.age)
        context={'biodata':biodata,
                'user':user,
                'phone':request.user.phone,
                'email':request.user.email,
                'name':request.user.name
                }
        return render(request,'pages/dashboard_profile.html',context)
    except Exception as e:
        messages.warning(request,'Please add your biodata first')
        return redirect('biodata')
    
def dashboardsetting(request):
    user = request.user.id
    print(user)
    try:
        biodata = Biodata.objects.get(user_id=user)
        print(biodata.age)
        context={'biodata':biodata,
                'user':user,
                'phone':request.user.phone,
                'email':request.user.email,
                'name':request.user.name
                }
        return render(request,'pages/dashboard_setting.html',context)
    except Exception as e:
        messages.warning(request,'Please add your biodata first')
        return redirect('biodata')
    