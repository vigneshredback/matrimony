from django.shortcuts import render,redirect,HttpResponse,get_object_or_404
from app.forms import BiodataForm,Biodata,BiodataUpdateForm
from datetime import date
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.contrib import messages
from app.models import Biodata,City,Religion,Like
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from app.models import Like, Biodata
from app.serializers import LikeSerializer



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

@login_required(login_url='login')
def allprofiles(request):
    profiles = Biodata.objects.all()
    cities = City.objects.all()
    religions = Religion.objects.all()
    context = {'cities': cities, 'religions': religions}
    totalprofiles = profiles.count()

    paginator = Paginator(profiles, 5)  # 5 profiles per page

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':  # Check if request is AJAX
        profiles_data = []
        for profile in page_obj:
            # Check if the user has liked this profile
            user_has_liked = Like.objects.filter(user=request.user, biodata=profile).exists()

            profiles_data.append({
                'id': profile.id,
                'gender': profile.gender,
                'name': profile.user.name,  # Assuming `user` is a ForeignKey in `Biodata`
                'degree': profile.degree,
                'profession': profile.profession,
                'age': profile.age,
                'height': profile.height,
                'image1': profile.image1.url if profile.image1 else '',  # Convert ImageField to URL
                'user_has_liked': user_has_liked  # Add like status to the data
            })
        
        data = {
            'profiles': profiles_data,
            'has_next': page_obj.has_next(),
        }
        return JsonResponse(data)

    # Pass the same data for HTML response
    for profile in page_obj:
        profile.user_has_liked = Like.objects.filter(user=request.user, biodata=profile).exists()

    return render(request, 'pages/allprofiles.html', {
        'profiles': page_obj,
        'totalprofiles': totalprofiles,
        'cities': cities,
        'religions': religions
    })

# def searchprofile(request):
    if request.method == 'POST' or request.method == 'GET':
        # Retrieve filters from request
        gender = request.GET.get('gender', 'all') if request.method == 'GET' else request.POST.get('gender', 'all')
        age = request.GET.get('age', 'all') if request.method == 'GET' else request.POST.get('age', 'all')
        city = request.GET.get('city', 'all') if request.method == 'GET' else request.POST.get('city', 'all')
        religion = request.GET.get('religion', 'all') if request.method == 'GET' else request.POST.get('religion', 'all')

        cities = City.objects.all()
        religions = Religion.objects.all()

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

        profiles_data = []
        for profile in page_obj:
            user_has_liked = Like.objects.filter(user=request.user, biodata=profile).exists()
            profiles_data.append({
                'id': profile.id,
                'gender': profile.gender,
                'name': profile.user.name,
                'degree': profile.degree,
                'profession': profile.profession,
                'age': profile.age,
                'height': profile.height,
                'image1': profile.image1.url if profile.image1 else '',
                'user_has_liked': user_has_liked
            })

        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            data = {
                'profiles': profiles_data,
                'has_next': page_obj.has_next(),
            }
            return JsonResponse(data)

        return render(request, 'pages/filteredprofiles.html', {
            'profiles': page_obj,
            'totalprofiles': totalprofiles,
            'gender': gender,
            'age': age,
            'city': city,
            'religion': religion,
            'cities': cities,
            'religions': religions
        })

    return JsonResponse({'error': 'Invalid request method'}, status=400)
# @login_required(login_url='login')
# def searchprofile(request):
#     if request.method == 'POST' or request.method == 'GET':
#         # Retrieve filters from request
#         gender = request.GET.get('gender', 'all') if request.method == 'GET' else request.POST.get('gender', 'all')
#         age = request.GET.get('age', 'all') if request.method == 'GET' else request.POST.get('age', 'all')
#         city = request.GET.get('city', 'all') if request.method == 'GET' else request.POST.get('city', 'all')
#         religion = request.GET.get('religion', 'all') if request.method == 'GET' else request.POST.get('religion', 'all')

#         cities = City.objects.all()
#         religions = Religion.objects.all()

#         # Start with the base queryset
#         profiles = Biodata.objects.all()

#         # Apply filters
#         if gender != 'all':
#             profiles = profiles.filter(gender=gender)

#         if age != 'all':
#             if age == '1':
#                 profiles = profiles.filter(age__gte=18, age__lte=30)
#             elif age == '2':
#                 profiles = profiles.filter(age__gte=31, age__lte=40)
#             elif age == '3':
#                 profiles = profiles.filter(age__gte=41, age__lte=50)

#         if city != 'all':
#             profiles = profiles.filter(city__name=city)

#         if religion != 'all':
#             profiles = profiles.filter(religion__name=religion)

#         # Count the total profiles
#         totalprofiles = profiles.count()

#         # Implement pagination, displaying 5 profiles per page
#         paginator = Paginator(profiles, 5)
#         page_number = request.GET.get('page', 1)
#         page_obj = paginator.get_page(page_number)

#         # Prepare profiles data for the JSON response
#         profiles_data = []
#         for profile in page_obj:
#             user_has_liked = Like.objects.filter(user=request.user, biodata=profile).exists()
#             profiles_data.append({
#                 'id': profile.id,
#                 'gender': profile.gender,
#                 'name': profile.user.name,
#                 'degree': profile.degree,
#                 'profession': profile.profession,
#                 'age': profile.age,
#                 'height': profile.height,
#                 'image1': profile.image1.url if profile.image1 else '',
#                 'user_has_liked': user_has_liked
#             })

#         # Handle AJAX requests for infinite scroll
#         if request.headers.get('x-requested-with') == 'XMLHttpRequest':
#             data = {
#                 'profiles': profiles_data,
#                 'has_next': page_obj.has_next(),  # Check if more profiles exist
#             }
#             if totalprofiles < 5:
#                 return JsonResponse('no data', safe=False)
#             return JsonResponse(data)

#         # Regular non-AJAX response for initial page load
#         return render(request, 'pages/filteredprofiles.html', {
#             'profiles': page_obj,
#             'totalprofiles': totalprofiles,
#             'gender': gender,
#             'age': age,
#             'city': city,
#             'religion': religion,
#             'cities': cities,
#             'religions': religions,
#             'user_has_liked': user_has_liked
#         })

#     return JsonResponse({'error': 'Invalid request method'}, status=400)

from django.http import JsonResponse
from django.shortcuts import render
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
from app.models import Biodata, City, Religion, Like

@login_required(login_url='login')
def searchprofile(request):
    if request.method == 'POST' or request.method == 'GET':
        # Retrieve filters from request
        gender = request.GET.get('gender', 'all') if request.method == 'GET' else request.POST.get('gender', 'all')
        age = request.GET.get('age', 'all') if request.method == 'GET' else request.POST.get('age', 'all')
        city = request.GET.get('city', 'all') if request.method == 'GET' else request.POST.get('city', 'all')
        religion = request.GET.get('religion', 'all') if request.method == 'GET' else request.POST.get('religion', 'all')

        cities = City.objects.all()
        religions = Religion.objects.all()

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
            profiles = profiles.filter(religion__name=religion)

        # Count the total profiles
        totalprofiles = profiles.count()

        # Implement pagination, displaying 5 profiles per page
        paginator = Paginator(profiles, 5)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        # Initialize `user_has_liked` to avoid UnboundLocalError
        user_has_liked = False

        # Prepare profiles data for the JSON response
        profiles_data = []
        for profile in page_obj:
            user_has_liked = Like.objects.filter(user=request.user, biodata=profile).exists()
            profiles_data.append({
                'id': profile.id,
                'gender': profile.gender,
                'name': profile.user.name,
                'degree': profile.degree,
                'profession': profile.profession,
                'age': profile.age,
                'height': profile.height,
                'image1': profile.image1.url if profile.image1 else '',
                'user_has_liked': user_has_liked
            })

        # Handle AJAX requests for infinite scroll
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            data = {
                'profiles': profiles_data,
                'has_next': page_obj.has_next(),  # Check if more profiles exist
            }
            if totalprofiles < 5:
                return JsonResponse('no data', safe=False)
            return JsonResponse(data)

        # Regular non-AJAX response for initial page load
        return render(request, 'pages/filteredprofiles.html', {
            'profiles': page_obj,
            'totalprofiles': totalprofiles,
            'gender': gender,
            'age': age,
            'city': city,
            'religion': religion,
            'cities': cities,
            'religions': religions,
            'user_has_liked': user_has_liked  # Pass a default value for user_has_liked
        })

    return JsonResponse({'error': 'Invalid request method'}, status=400)


def profile_detail(request, pk):
    try:
        profile = Biodata.objects.get(pk=pk)
        return render(request, 'pages/profile_detail.html', {'profile': profile})
    except Biodata.DoesNotExist:
        messages.warning(request, "create your profile first")
        return redirect('biodata')

def biodata_update_view(request):
    user_id = request.user.id

    try:
        # Try to get the existing Biodata object for the logged-in user
        biodata = Biodata.objects.get(user_id=user_id)
    except Biodata.DoesNotExist:
        # Handle the case where the Biodata object does not exist
        biodata = None
        messages.error(request, "Biodata does not exist.")
        return redirect('biodata')  # Redirect to an error page or some other page

    # If a Biodata object exists, continue with the form handling
    if request.method == 'POST':
        form = BiodataUpdateForm(request.POST, request.FILES, instance=biodata)
        if form.is_valid():
            print('Form is valid')
            form.save()
            messages.success(request, "Biodata updated successfully!")
            return redirect('home')  # Redirect to a success page
        else:
            print('Form is not valid')
            messages.error(request, "Error updating biodata. Please try again.")
    else:
        # GET request: Display the form with the current Biodata instance
        form = BiodataUpdateForm(instance=biodata)

    return render(request, 'pages/biodata_update.html', {'form': form})

from django.views.decorators.http import require_POST

class LikeToggleView(APIView):
    def post(self, request, pk, *args, **kwargs):
        user = request.user
        biodata = get_object_or_404(Biodata, pk=pk)
        
        # Check if the user already liked this Biodata
        like = Like.objects.filter(user=user, biodata=biodata).first()
        
        if like:
            # User already liked, remove the like (unlike)
            like.delete()
            liked = False
        else:
            # Add a new like
            Like.objects.create(user=user, biodata=biodata)
            liked = True

        # Return the like status (True for liked, False for unliked)
        
        return Response({"liked": liked}, status=status.HTTP_200_OK)