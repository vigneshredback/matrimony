import json
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Load user data from JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str)

    def handle(self, *args, **options):
        with open(options['json_file'], 'r') as file:
            data = json.load(file)
            for item in data:
                # Ensure the password is hashed
                item['password'] = make_password(item['password'])
                
                # Create or update user
                User.objects.update_or_create(
                    email=item['email'],
                    defaults={
                        'password': item['password'],
                        'name': item['name'],
                        'phone': item['phone'],
                        'is_active': item['is_active'],
                        'is_admin': item['is_admin']
                    }
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported user data'))
