from django.shortcuts import render,redirect,HttpResponse
from app.forms import BiodataForm,Biodata,BiodataUpdateForm
from datetime import date
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.contrib import messages
from app.models import Biodata,City,Religion
def create_biodata(request):
    if request.method == 'POST':
        form = BiodataForm(request.POST, request.FILES)
        print(form)
        if form.is_valid():
            biodata = form.save(commit=False)
            biodata.user = request.user
            biodata.save()
            messages.success(request,"Biodata created successfully!")
            return redirect('home')
        else:
            print(form.errors)
    else:
        form = BiodataForm()
    messages.info(request,"Create your biodata first")
    return render(request, 'pages/biodata_form.html', {'form': form})

def calculate_age(birthdate):
    today = date.today()
    return today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))

def allprofiles(request):
    profiles = Biodata.objects.all()
    cities = City.objects.all()
    religions = Religion.objects.all()
    context = {'cities':cities,'religions':religions}
    totalprofiles = profiles.count()
    paginator = Paginator(profiles, 5)  # 10 profiles per page

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':  # Check if request is AJAX
        profiles_data = []
        for profile in page_obj:
            profiles_data.append({
                'id': profile.id,
                'gender': profile.gender,
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

    return render(request, 'pages/allprofiles.html', {'profiles': page_obj, 'totalprofiles': totalprofiles,'cities':cities,'religions':religions})



def searchprofile(request):
    if request.method == 'POST':  # Handle POST request for search
        # Retrieve filters from POST request
        gender = request.POST.get('gender', 'all')
        age = request.POST.get('age', 'all')
        city = request.POST.get('city', 'all')
        religion = request.POST.get('religion', 'all')
        cities = City.objects.all()
        religions = Religion.objects.all()

        print(gender, age, city, religion)

        # Start with the base queryset
        profiles = Biodata.objects.all()

        # Apply filters
        if gender != 'all':
            profiles = profiles.filter(gender=gender)
        
        if age != 'all':
            if age == '1':
                profiles = profiles.filter(age__gte=18, age__lte=30)
            elif age == '2':
                profiles = profiles.filter(age__gte=31, age__lte=40)
            elif age == '3':
                profiles = profiles.filter(age__gte=41, age__lte=50)

        if city != 'all':
            profiles = profiles.filter(city__name=city)

        if religion != 'all':
            profiles = profiles.filter(religion__name=religion).order_by('id')

        # Count the total profiles
        totalprofiles = profiles.count()
        paginator = Paginator(profiles, 5)  # 5 profiles per page

        # Default to page 1 if not specified
        page_number = request.GET.get('page', 1)  
        page_obj = paginator.get_page(page_number)

        if request.headers.get('x-requested-with') == 'XMLHttpRequest':  # Check if request is AJAX
            profiles_data = ['hello sajkdg']
            for profile in page_obj:
                profiles_data.append({
                    'id': profile.id,
                    'gender': profile.gender,
                    'name': profile.user.name,
                    'degree': profile.degree,
                    'profession': profile.profession,
                    'age': profile.age,
                    'height': profile.height,
                    'image1': profile.image1.url if profile.image1 else '',
                })
            
            data = {
                'profiles': profiles_data,
                'has_next': page_obj.has_next(),
            }
            return JsonResponse(data)

        return render(request, 'pages/filteredprofiles.html', {'profiles': page_obj, 'totalprofiles': totalprofiles,'gender':gender,'age':age,'city':city,'religion':religion,'cities':cities,'religions':religions})
    
    if request.method == 'GET':
        print('GET request received')

        # Retrieve filters from GET request
        gender = request.GET.get('gender', 'all')
        age = request.GET.get('age', 'all')
        city = request.GET.get('city', 'all')
        religion = request.GET.get('religion', 'all')
        # print(gender, age, city, religion)
        print({'gender':gender,'age':age,'city':city,'religion':religion})

        # Start with the base queryset
        profiles = Biodata.objects.all()

        # Apply filters
        if gender != 'all':
            profiles = profiles.filter(gender=gender)
        
        if age != 'all':
            if age == '1':
                profiles = profiles.filter(age__gte=18, age__lte=30)
            elif age == '2':
                profiles = profiles.filter(age__gte=31, age__lte=40)
            elif age == '3':
                profiles = profiles.filter(age__gte=41, age__lte=50)

        if city != 'all':
            profiles = profiles.filter(city__name=city)

        if religion != 'all':
            profiles = profiles.filter(religion__name=religion).order_by('id')
            print(profiles)
        totalprofiles = profiles.count()
        paginator = Paginator(profiles, 5)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        profiles_data = []
        for profile in page_obj:
            profiles_data.append({
                'id': profile.id,
                'gender': profile.gender,
                'name': profile.user.name,
                'degree': profile.degree,
                'profession': profile.profession,
                'age': profile.age,
                'height': profile.height,
                'image1': profile.image1.url if profile.image1 else '',
            })
        
        data = {
            'profiles': profiles_data,
            'has_next': page_obj.has_next(),
        }
        return JsonResponse(data)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


def profile_detail(request, pk):
    try:
        profile = Biodata.objects.get(pk=pk)
        return render(request, 'pages/profile_detail.html', {'profile': profile})
    except Biodata.DoesNotExist:
        messages.warning(request, "create your profile first")
        return redirect('biodata')

def biodata_update_view(request):
    user = request.user
    biodata = Biodata.objects.get(user=user)
    
    if request.method == 'POST':
        form = BiodataUpdateForm(request.POST, request.FILES, instance=biodata)
        if form.is_valid():
            print('Form is valid')
            form.save()
            messages.success(request, "Biodata updated succesfully!")
            return redirect('home')  # Redirect to a success page
        else:
            print('Form is not valid')
            form = BiodataUpdateForm(instance=biodata)
            messages.error(request, "Error updating biodata. Please try again.")
            return render(request, 'pages/biodata_update.html', {'form': form})
            # print(form.errors)  # Debugging form errors
    else:
        form = BiodataUpdateForm(instance=biodata)
    
    return render(request, 'pages/biodata_update.html', {'form': form})