from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager,PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, name, phone, password=None):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, phone=phone)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, phone, password=None):
        user = self.create_user(
            email=email,
            name=name,
            phone=phone,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_superuser=models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin


# Create your models here.
class Couples(models.Model):
    image = models.ImageField(upload_to='couples/')
    bridename = models.CharField(max_length=50)
    broomname = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.bridename} and {self.broomname}"


class City(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class JobType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Hobby(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Religion(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

genderchoices = (('Male', 'Male'), ('Female', 'Female'))
class Biodata(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    gender = models.CharField(choices=genderchoices,max_length=10)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True)
    date_of_birth = models.DateField()
    age = models.IntegerField()
    height = models.DecimalField(max_digits=5, decimal_places=2)  # Example: 5.9 for 5'9"
    weight = models.DecimalField(max_digits=5, decimal_places=2)  # Example: 70.5 for 70.5 kg
    father_name = models.CharField(max_length=150)
    mother_name = models.CharField(max_length=150)
    address = models.TextField()
    job_type = models.ForeignKey(JobType, on_delete=models.SET_NULL, null=True)
    company_name = models.CharField(max_length=150)
    salary = models.IntegerField()
    job_experience = models.DecimalField(max_digits=5, decimal_places=2)  # Example: 3.5 for 3.5 years
    degree = models.CharField(max_length=150)
    about = models.TextField(default='no details')
    school = models.CharField(max_length=150)
    college = models.CharField(max_length=150)
    whatsapp_link = models.URLField(max_length=200, blank=True, null=True)
    facebook_link = models.URLField(max_length=200, blank=True, null=True)
    instagram_link = models.URLField(max_length=200, blank=True, null=True)
    x_link = models.URLField(max_length=200, blank=True, null=True)  # X (formerly Twitter)
    youtube_link = models.URLField(max_length=200, blank=True, null=True)
    linkedin_link = models.URLField(max_length=200, blank=True, null=True)
    hobbies = models.ManyToManyField(Hobby)
    religion = models.ForeignKey(Religion, on_delete=models.SET_NULL, null=True)
    family_name = models.CharField(max_length=150)
    profession = models.CharField(max_length=150)
    position = models.CharField(max_length=150)

    # Image fields
    image1 = models.ImageField(upload_to='images/profile', blank=True, null=True)
    image2 = models.ImageField(upload_to='images/profile', blank=True, null=True)
    image3 = models.ImageField(upload_to='images/profile', blank=True, null=True)
    image4 = models.ImageField(upload_to='images/profile', blank=True, null=True)

    def __str__(self):
        return self.user.name
