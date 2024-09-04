from django.urls import path 
from .views import  dashboardview, homeview,aboutview,faqview,planview,contactview,registrationview,biodataview
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('',homeview.home,name='home'),
    path('about/',aboutview.about,name='about'),
    path('faq/',faqview.faq,name='faq'),
    path('plan/',planview.plan,name='plan'),
    path('contact/',contactview.contact,name='contact'),
    path('dashboard/',dashboardview.dashboard,name='dashboard'),
    path('register/', registrationview.register, name='register'),
    path('login/', registrationview.loginview, name='login'),
    path('logout/', registrationview.logoutview, name='logout'),
    path('activate/<uidb64>/<token>/', registrationview.activate, name='activate'),
    # Password reset URLs
    path('password-reset/', registrationview.password_reset_request, name='password_reset'),
    path('password-reset/done/', registrationview.password_reset_done, name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>/', registrationview.password_reset_confirm, name='password_reset_confirm'),
    path('password-reset-complete/', registrationview.password_reset_complete, name='password_reset_complete'),
    path('biodata/', biodataview.create_biodata, name='biodata'),
    # profile urls
    path('allprofiles/', biodataview.allprofiles, name='allprofiles'),
    path('profile-detail/<int:pk>/', biodataview.profile_detail, name='profile_detail'),
    path('biodata/update/', biodataview.biodata_update_view, name='biodata_update'),
    # dashboard urls
    path('dashboard/', dashboardview.dashboard, name='dashboard'),
    path('dashboard-profile/', dashboardview.dashboardprofile, name='dashboardprofile')
    ]
