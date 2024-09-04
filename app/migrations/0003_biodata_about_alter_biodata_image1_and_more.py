# Generated by Django 5.1 on 2024-09-04 06:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_city_hobby_jobtype_religion_biodata'),
    ]

    operations = [
        migrations.AddField(
            model_name='biodata',
            name='about',
            field=models.TextField(default='no details'),
        ),
        migrations.AlterField(
            model_name='biodata',
            name='image1',
            field=models.ImageField(blank=True, null=True, upload_to='images/profile'),
        ),
        migrations.AlterField(
            model_name='biodata',
            name='image2',
            field=models.ImageField(blank=True, null=True, upload_to='images/profile'),
        ),
        migrations.AlterField(
            model_name='biodata',
            name='image3',
            field=models.ImageField(blank=True, null=True, upload_to='images/profile'),
        ),
        migrations.AlterField(
            model_name='biodata',
            name='image4',
            field=models.ImageField(blank=True, null=True, upload_to='images/profile'),
        ),
    ]
