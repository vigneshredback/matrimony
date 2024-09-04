from django.shortcuts import render, redirect,HttpResponse,get_object_or_404
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from app.forms import RegistrationForm
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from app.models import Biodata

User = get_user_model()



def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.save()

            # Send email verification
            current_site = get_current_site(request)
            mail_subject = 'Activate your account.'
            message = render_to_string('pages/activation_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': default_token_generator.make_token(user),
            })
            send_mail(mail_subject, message, settings.EMAIL_HOST_USER, [user.email])

            return redirect('home')
    else:
        form = RegistrationForm()
    return render(request, 'pages/register.html')

def activate(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return redirect('login')
    else:
        return render(request, 'pages/activation_invalid.html')
    


def loginview(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request,user)
            try:
                biodata = Biodata.objects.get(user=user)
                return redirect('home')
            except Biodata.DoesNotExist:
                return redirect('profile_detail', pk=user.id)

        else:
            return render(request, 'pages/login.html', {'error': 'Invalid username or password'})
    else:
        return render(request, 'pages/login.html')
    

def logoutview(request):
    """
    Logs out the user and redirects them to the homepage or another page.
    """
    logout(request)  # This logs out the user
    return redirect('home')  # Redirect to a named URL (e.g., homepage or login page)

def password_reset_request(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        if email:
            user = get_object_or_404(User, email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = request.build_absolute_uri(reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token}))
            message = f"Reset your password by clicking the link: {reset_url}"
            send_mail(
                'Password Reset Request',
                message,
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=False,
            )
            return redirect('password_reset_done')
    return render(request, 'pages/password_reset.html')

def password_reset_done(request):
    return render(request, 'pages/password_reset_done.html')

def password_reset_confirm(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        if request.method == 'POST':
            password = request.POST.get('password')
            confirm_password = request.POST.get('confirm_password')
            if password and password == confirm_password:
                user.set_password(password)
                user.save()
                return redirect('password_reset_complete')
            else:
                return HttpResponse('Passwords do not match', status=400)
        return render(request, 'pages/password_reset_confirm.html', {'validlink': True})
    else:
        return render(request, 'pages/password_reset_confirm.html', {'validlink': False})

def password_reset_complete(request):
    return render(request, 'pages/password_reset_complete.html')
