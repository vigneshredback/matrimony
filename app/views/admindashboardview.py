from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from app.forms import BiodataForm,UserRegistrationForm
from django.contrib import messages
from app.models import Biodata,User
from django.core.paginator import Paginator
from django.http import JsonResponse


# Create your views here.


@login_required(login_url='login')
def adminhome(request):
    if request.user.is_admin:
        return render(request,'adminpages/adminhome.html')
    else:
        return redirect('home')
    
# @login_required(login_url='login')
# def adminadduser(request):
#     if request.user.is_admin:
#         if request.method == 'POST':
#             newuser = None
#             userform = UserRegistrationForm(request.POST)
#             if userform.is_valid():
#                 # Save the user without committing first to handle password
#                 user = userform.save(commit=False)
#                 user.set_password(userform.cleaned_data['password'])
#                 user.save()
#                 newuser = user
#             form = BiodataForm(request.POST, request.FILES)
#             print(form)
#             if form.is_valid():
#                 biodata = form.save(commit=False)
#                 biodata.user = newuser
#                 id  = Biodata.objects.latest('id').id
#                 biodata.user_id = id + 1
#                 biodata.save()
#                 messages.success(request,"Biodata created successfully!")
#                 return redirect('adminhome')
#             else:
#                 print(form.errors)
#         else:
#             form = BiodataForm()
#             userform = UserRegistrationForm()
#         messages.info(request,"Create your biodata first")
#         return render(request,'adminpages/adduser.html', {'form': form, 'userform': userform})
#     else:
#         return redirect('home')

@login_required(login_url='login')
def adminadduser(request):
    if request.user.is_admin:
        if request.method == 'POST':
            newuser = None
            userform = UserRegistrationForm(request.POST)
            
            # Check if the user form is valid
            if userform.is_valid():
                # Save the user without committing to handle the password
                user = userform.save(commit=False)
                user.set_password(userform.cleaned_data['password'])  # Set the password correctly
                user.save()
                newuser = user  # Store the newly created user
                
                # Debugging print to ensure user is saved
                print("User created:", newuser)
            else:
                print("User form errors:", userform.errors)  # Print form errors if invalid
            
            form = BiodataForm(request.POST, request.FILES)
            
            # Ensure newuser is not None before assigning to biodata
            if form.is_valid() and newuser:
                biodata = form.save(commit=False)
                biodata.user = newuser  # Assign the newly created user to biodata.user
                biodata.save()
                messages.success(request, "Biodata created successfully!")
                return redirect('adminhome')
            else:
                # Debugging print to see any form errors
                print("Biodata form errors:", form.errors)
        else:
            form = BiodataForm()
            userform = UserRegistrationForm()
        return render(request, 'adminpages/adduser.html', {'form': form, 'userform': userform})
    else:
        return redirect('home')



# @login_required(login_url='login')
def adminregister(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            # Save the user without committing first to handle password
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            return redirect('login')  # Redirect to login or any other page after successful registration
    else:
        form = UserRegistrationForm()

    return render(request, 'register.html', {'form': form})


@login_required(login_url='login')
def adminalluser(request):
    if request.user.is_admin:
        email = request.GET.get('email', '')
        biodata = Biodata.objects.all()

        # Filter by email if the email parameter is present
        if email:
            biodata = biodata.filter(user__email__icontains=email)

        # Implement pagination, displaying 5 profiles per page
        paginator = Paginator(biodata, 15)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        # Check if the request is AJAX for search or pagination
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            users_data = []
            for biodata_item in page_obj:
                users_data.append({
                    'id': biodata_item.id,
                    'name': biodata_item.user.name,
                    'email': biodata_item.user.email,
                    'phone': biodata_item.user.phone,
                    'plan': biodata_item.plan.name,
                    'city': biodata_item.city.name if biodata_item.city else '',
                    'date_of_birth': biodata_item.date_of_birth.strftime('%Y-%m-%d') if biodata_item.date_of_birth else ''
                })
            
            data = {
                'users': users_data,
                'has_previous': page_obj.has_previous(),
                'has_next': page_obj.has_next(),
                'current_page': page_obj.number,
                'total_pages': paginator.num_pages
            }
            return JsonResponse(data)

        # Regular render for non-AJAX requests
        return render(request, 'adminpages/adminallusers.html', {
            'page_obj': page_obj
        })

    else:
        return redirect('home')
    

@login_required(login_url='login')
def adminfreeuser(request):
    if request.user.is_admin:
        email = request.GET.get('email', '')
        biodata = Biodata.objects.filter(plan=1)
        print(biodata)

        # Filter by email if the email parameter is present
        if email:
            biodata = biodata.filter(user__email__icontains=email )

        # Implement pagination, displaying 5 profiles per page
        paginator = Paginator(biodata, 15)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        # Check if the request is AJAX for search or pagination
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            users_data = []
            for biodata_item in page_obj:
                users_data.append({
                    'id': biodata_item.id,
                    'name': biodata_item.user.name,
                    'email': biodata_item.user.email,
                    'phone': biodata_item.user.phone,
                    'plan': biodata_item.plan.name,
                    'city': biodata_item.city.name if biodata_item.city else '',
                    'date_of_birth': biodata_item.date_of_birth.strftime('%Y-%m-%d') if biodata_item.date_of_birth else ''
                })
            
            data = {
                'users': users_data,
                'has_previous': page_obj.has_previous(),
                'has_next': page_obj.has_next(),
                'current_page': page_obj.number,
                'total_pages': paginator.num_pages
            }
            return JsonResponse(data)

        # Regular render for non-AJAX requests
        return render(request, 'adminpages/adminfreeuser.html', {
            'page_obj': page_obj
        })

    else:
        return redirect('home')
    

@login_required(login_url='login')
def adminpremiumuser(request):
    if request.user.is_admin:
        email = request.GET.get('email', '')
        biodata = Biodata.objects.filter(plan=2)
        print(biodata)

        # Filter by email if the email parameter is present
        if email:
            biodata = biodata.filter(user__email__icontains=email)

        # Implement pagination, displaying 5 profiles per page
        paginator = Paginator(biodata, 15)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        # Check if the request is AJAX for search or pagination
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            users_data = []
            for biodata_item in page_obj:
                users_data.append({
                    'id': biodata_item.id,
                    'name': biodata_item.user.name,
                    'email': biodata_item.user.email,
                    'phone': biodata_item.user.phone,
                    'plan': biodata_item.plan.name,
                    'city': biodata_item.city.name if biodata_item.city else '',
                    'date_of_birth': biodata_item.date_of_birth.strftime('%Y-%m-%d') if biodata_item.date_of_birth else ''
                })            
            data = {
                'users': users_data,
                'has_previous': page_obj.has_previous(),
                'has_next': page_obj.has_next(),
                'current_page': page_obj.number,
                'total_pages': paginator.num_pages
            }
            return JsonResponse(data)

        # Regular render for non-AJAX requests
        return render(request, 'adminpages/adminpremiumuser.html', {
            'page_obj': page_obj
        })

    else:
        return redirect('home')