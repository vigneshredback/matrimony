from django.contrib import admin
from .models import Couples
from .models import Biodata, City, JobType, Hobby, Religion,User,Like
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserAdmin(BaseUserAdmin):
    # The fields to be used in displaying the User model.
    list_display = ('email', 'name', 'phone', 'is_admin')
    list_filter = ('is_admin',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name', 'phone')}),
        ('Permissions', {'fields': ('is_admin',)}),
    )
    # Add fieldsets for changing password
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'phone', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'name', 'phone')
    ordering = ('email',)
    filter_horizontal = ()

# Now register the new UserAdmin
admin.site.register(User, UserAdmin)

# Register your models here.
admin.site.register(Biodata)
admin.site.register(City)
admin.site.register(JobType)
admin.site.register(Hobby)
admin.site.register(Religion)
admin.site.register(Couples)
admin.site.register(Like)
