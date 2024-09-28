# Generated by Django 5.1 on 2024-09-28 04:15

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_interest'),
    ]

    operations = [
        migrations.AddField(
            model_name='interest',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='interest',
            name='interest_status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Interested', 'Interested'), ('Not Interested', 'Not Interested')], default='Pending', max_length=20),
        ),
    ]
