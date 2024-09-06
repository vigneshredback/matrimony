from django.shortcuts import render,redirect
from app.forms import BiodataForm,Biodata,BiodataUpdateForm
from datetime import date
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.contrib import messages

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
    totalprofiles = profiles.count()
    paginator = Paginator(profiles, 5)  # 10 profiles per page

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':  # Check if request is AJAX
        profiles_data = []
        for profile in page_obj:
            profiles_data.append({
                'id': profile.id,
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

    return render(request, 'pages/allprofiles.html', {'profiles': page_obj, 'totalprofiles': totalprofiles})

def profile_detail(request, pk):
    try:
        profile = Biodata.objects.get(pk=pk)
        return render(request, 'pages/profile_detail.html', {'profile': profile})
    except Biodata.DoesNotExist:
        messages.warning(request, "create your profile first")
        return redirect('biodata')



from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse
from django.views.generic.edit import UpdateView
from app.models import Biodata
from app.forms import BiodataUpdateForm

# class BiodataUpdateView(UpdateView):
#     model = Biodata
#     form_class = BiodataUpdateForm
#     template_name = 'pages/biodata_update.html'
    
#     def get_object(self):
#         return get_object_or_404(Biodata, user=self.request.user)
    
#     def form_valid(self, form):
#         # Save the form with files
#         return super().form_valid(form)
    
#     def get_success_url(self):
#         return reverse('biodata_update')  # Modify according to your URL configuration
    
# def biodata_update_view(request):
#     user = request.user
#     biodata = Biodata.objects.get(user=user)
    
#     if request.method == 'POST':
#         form = BiodataUpdateForm(request.POST, request.FILES, instance=biodata)
#         if form.is_valid():
#             print(' form is valid')
#             form.save()
#             return redirect('home')  # Redirect to a success page
#         else:
#             print(' form is not valid')
#     else:
#         form = BiodataUpdateForm(instance=biodata)
    
#     return render(request, 'pages/biodata_update.html', {'form': form})


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