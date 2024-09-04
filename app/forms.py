from django import forms
from .models import User,Biodata, JobType, Hobby, Religion

class RegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['name', 'email', 'phone', 'password']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
        return user



class BiodataForm(forms.ModelForm):
    class Meta:
        model = Biodata
        fields = [
            'gender', 'city', 'date_of_birth', 'age', 'height', 'weight',
            'father_name', 'mother_name', 'address', 'job_type', 'company_name',
            'salary', 'job_experience', 'degree', 'about', 'school', 'college',
            'whatsapp_link', 'facebook_link', 'instagram_link', 'x_link',
            'youtube_link', 'linkedin_link', 'hobbies', 'religion', 'family_name',
            'profession', 'position', 'image1', 'image2', 'image3', 'image4'
        ]
        widgets = {
            'gender': forms.Select(attrs={'class': 'form-select chosen-select'}),
            'city': forms.Select(attrs={'class': 'form-select chosen-select'}),
            'date_of_birth': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'age': forms.NumberInput(attrs={'class': 'form-control'}),
            'height': forms.TextInput(attrs={'class': 'form-control'}),
            'weight': forms.TextInput(attrs={'class': 'form-control'}),
            'father_name': forms.TextInput(attrs={'class': 'form-control'}),
            'mother_name': forms.TextInput(attrs={'class': 'form-control'}),
            'address': forms.TextInput(attrs={'class': 'form-control'}),
            'job_type': forms.Select(attrs={'class': 'form-select chosen-select'}),
            'company_name': forms.TextInput(attrs={'class': 'form-control'}),
            'salary': forms.TextInput(attrs={'class': 'form-control'}),
            'job_experience': forms.TextInput(attrs={'class': 'form-control'}),
            'degree': forms.TextInput(attrs={'class': 'form-control'}),
            'about': forms.Textarea(attrs={'rows': 4, 'class': 'form-control'}),
            'school': forms.TextInput(attrs={'class': 'form-control'}),
            'college': forms.TextInput(attrs={'class': 'form-control'}),
            'whatsapp_link': forms.TextInput(attrs={'class': 'form-control'}),
            'facebook_link': forms.TextInput(attrs={'class': 'form-control'}),
            'instagram_link': forms.TextInput(attrs={'class': 'form-control'}),
            'x_link': forms.TextInput(attrs={'class': 'form-control'}),
            'youtube_link': forms.TextInput(attrs={'class': 'form-control'}),
            'linkedin_link': forms.TextInput(attrs={'class': 'form-control'}),
            'hobbies': forms.SelectMultiple(attrs={'class': 'chosen-select'}),
            'religion': forms.Select(attrs={'class': 'form-control'}),
            'family_name': forms.TextInput(attrs={'class': 'form-control'}),
            'profession': forms.TextInput(attrs={'class': 'form-control'}),
            'position': forms.TextInput(attrs={'class': 'form-control'}),
            'image1': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'image2': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'image3': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'image4': forms.ClearableFileInput(attrs={'class': 'form-control'}),
        }



class BiodataUpdateForm(forms.ModelForm):
    class Meta:
        model = Biodata
        fields = [
            'gender', 'city', 'date_of_birth', 'age', 'height', 'weight',
            'father_name', 'mother_name', 'address', 'job_type', 'company_name',
            'salary', 'job_experience', 'degree', 'about', 'school', 'college',
            'whatsapp_link', 'facebook_link', 'instagram_link', 'x_link',
            'youtube_link', 'linkedin_link', 'hobbies', 'religion', 'family_name',
            'profession', 'position', 'image1', 'image2', 'image3', 'image4'
        ]
        widgets = {
            'gender': forms.Select(attrs={'class': 'form-select chosen-select'}),
            'city': forms.Select(attrs={'class': 'form-select chosen-select'}),
            'date_of_birth': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'age': forms.NumberInput(attrs={'class': 'form-control'}),
            'height': forms.TextInput(attrs={'class': 'form-control'}),
            'weight': forms.TextInput(attrs={'class': 'form-control'}),
            'father_name': forms.TextInput(attrs={'class': 'form-control'}),
            'mother_name': forms.TextInput(attrs={'class': 'form-control'}),
            'address': forms.TextInput(attrs={'class': 'form-control'}),
            'job_type': forms.Select(attrs={'class': 'form-select chosen-select'}),
            'company_name': forms.TextInput(attrs={'class': 'form-control'}),
            'salary': forms.TextInput(attrs={'class': 'form-control'}),
            'job_experience': forms.TextInput(attrs={'class': 'form-control'}),
            'degree': forms.TextInput(attrs={'class': 'form-control'}),
            'about': forms.Textarea(attrs={'rows': 4, 'class': 'form-control'}),
            'school': forms.TextInput(attrs={'class': 'form-control'}),
            'college': forms.TextInput(attrs={'class': 'form-control'}),
            'whatsapp_link': forms.TextInput(attrs={'class': 'form-control'}),
            'facebook_link': forms.TextInput(attrs={'class': 'form-control'}),
            'instagram_link': forms.TextInput(attrs={'class': 'form-control'}),
            'x_link': forms.TextInput(attrs={'class': 'form-control'}),
            'youtube_link': forms.TextInput(attrs={'class': 'form-control'}),
            'linkedin_link': forms.TextInput(attrs={'class': 'form-control'}),
            'hobbies': forms.SelectMultiple(attrs={'class': 'chosen-select'}),
            'religion': forms.Select(attrs={'class': 'form-control'}),
            'family_name': forms.TextInput(attrs={'class': 'form-control'}),
            'profession': forms.TextInput(attrs={'class': 'form-control'}),
            'position': forms.TextInput(attrs={'class': 'form-control'}),
            'image1': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'image2': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'image3': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'image4': forms.ClearableFileInput(attrs={'class': 'form-control'}),
        }