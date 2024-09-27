from django.urls import path 
from .views import  dashboardview, homeview,aboutview,faqview,planview,contactview,registrationview,biodataview,views,admindashboardview,apiviews
from django.contrib.auth import views as auth_views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Matrimony API",
      default_version='v1',
      description="A simple CRUD API for managing users",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@yourapi.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
)

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
    path('edit-account/', registrationview.edit_account, name='edit_account'),
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
    path('search/',biodataview.searchprofile, name='search'),
    # dashboard urls
    path('dashboard/', dashboardview.dashboard, name='dashboard'),
    path('dashboard-profile/', dashboardview.dashboardprofile, name='dashboardprofile'),
    path('dashboard-setting/', dashboardview.dashboardsetting, name='dashboardsetting'),
    # 
    path('aj', views.aj, name='aj'),
    path('get-post/', views.get_post, name='get_post'),
    # other URL patterns
     path('post/<int:pk>/like/', biodataview.LikeToggleView.as_view(), name='like_toggle'),
     path('post/<int:pk>/interest/', biodataview.InterestToggleView.as_view(), name='like_toggle'),


    # admin dashboard
    path('admin-home/', admindashboardview.adminhome, name='adminhome'),
    path('admin-adduser/', admindashboardview.adminadduser, name='adminadduser'),
    path('admin-alluser/', admindashboardview.adminalluser, name='adminalluser'),
    path('admin-freeuser/', admindashboardview.adminfreeuser, name='adminfreeuser'),
    path('admin-premiumuser/', admindashboardview.adminpremiumuser, name='adminpremiumuser'),
    # swagger urls
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),  # Swagger UI
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),  # ReDoc UI
    # 
    path('users/', apiviews.user_list, name='user_list'),
    path('users/<int:user_id>/', apiviews.user_detail, name='user_detail'),

]