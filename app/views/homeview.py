from django.shortcuts import render
from app.models import Couples

# Create your views here.

def home(request):
    couples = Couples.objects.all()
    return render(request,'pages/home.html',{'couples':couples})

