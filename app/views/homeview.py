from django.shortcuts import render
from app.models import Couples
from app.models import City,Religion

# Create your views here.

def home(request):
    couples = Couples.objects.all()
    cities = City.objects.all()
    religions = Religion.objects.all()
    context = {'couples':couples,'cities':cities,'religions':religions}
    return render(request,'pages/home.html',context)

