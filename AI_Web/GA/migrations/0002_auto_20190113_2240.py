# Generated by Django 2.1 on 2019-01-13 14:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GA', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='gastate',
            old_name='Temperature',
            new_name='Generations',
        ),
    ]