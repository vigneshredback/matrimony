from django.contrib import admin
from .models import Couples
from .models import Biodata, City, JobType, Hobby, Religion,User


# Register your models here.
admin.site.register(Biodata)
admin.site.register(City)
admin.site.register(JobType)
admin.site.register(Hobby)
admin.site.register(Religion)
admin.site.register(Couples)
admin.site.register(User)
