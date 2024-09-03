from django.shortcuts import render,redirect
from app.forms import BiodataForm,Biodata
from datetime import date
from django.core.paginator import Paginator
from django.http import JsonResponse

def create_biodata(request):
    if request.method == 'POST':
        form = BiodataForm(request.POST, request.FILES)
        if form.is_valid():
            biodata = form.save(commit=False)
            biodata.user = request.user
            biodata.save()
            return redirect('profile')
    else:
        form = BiodataForm()
    return render(request, 'pages/biodata_form.html', {'form': form})

def calculate_age(birthdate):
    today = date.today()
    return today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))

def allprofiles(request):
    profiles = Biodata.objects.all()
    paginator = Paginator(profiles, 5)  # 10 profiles per page

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':  # Check if request is AJAX
        profiles_data = []
        for profile in page_obj:
            profiles_data.append({
                'name': profile.user.name,  # Assuming `user` is a ForeignKey in `Biodata`
                'degree': profile.degree,
                'profession': profile.profession,
                'age': profile.age,
                'height': profile.height,
                'image1': profile.image1.url if profile.image1 else '',  # Convert ImageField to URL
            })
        
        data = {
            'profiles': profiles_data,
            'has_next': page_obj.has_next(),
        }
        return JsonResponse(data)

    return render(request, 'pages/allprofiles.html', {'profiles': page_obj})