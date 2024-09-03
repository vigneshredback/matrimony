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
            'salary', 'job_experience', 'degree', 'school', 'college', 'whatsapp_link',
            'facebook_link', 'instagram_link', 'x_link', 'youtube_link', 'linkedin_link',
            'hobbies', 'religion', 'family_name', 'profession', 'position',
            'image1', 'image2', 'image3', 'image4'
        ]
        widgets = {
            'hobbies': forms.CheckboxSelectMultiple,
        }