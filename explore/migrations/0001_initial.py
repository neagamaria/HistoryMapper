# Generated by Django 4.2.6 on 2023-10-30 13:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('date', models.DateTimeField()),
                ('era', models.CharField(max_length=10)),
                ('description', models.TextField(blank=True)),
                ('image', models.ImageField(blank=True, upload_to='', verbose_name='Event Image')),
            ],
        ),
        migrations.CreateModel(
            name='EventType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('War', 'War'), ('Battle', 'Battle'), ('Invasion', 'Invasion'), ('Uprising', 'Uprising'), ('Revolution', 'Revolution'), ('Human disaster', 'Human_disaster'), ('Natural disaster', 'Natural_disaster'), ('Treaty', 'Treaty'), ('Truce', 'Truce'), ('Discovery', 'Discovery'), ('Epidemic', 'Epidemic'), ('Succession', 'Succession'), ('Social', 'Social'), ('Religious', 'Religious')], max_length=30)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='HistoricalArea',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('actual_name', models.CharField(blank=True, max_length=100)),
                ('description', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='HistoricalPeriod',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('start_year', models.SmallIntegerField()),
                ('end_year', models.SmallIntegerField()),
                ('era', models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='MilitaryEvent',
            fields=[
                ('event_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='explore.event')),
                ('commanders', models.TextField()),
                ('winner', models.CharField(max_length=100)),
                ('casualties', models.BigIntegerField()),
                ('strategy', models.TextField(blank=True)),
            ],
            bases=('explore.event',),
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('latitude', models.DecimalField(decimal_places=6, max_digits=9)),
                ('longitude', models.DecimalField(decimal_places=6, max_digits=9)),
                ('historical_area', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='explore.historicalarea')),
            ],
        ),
        migrations.AddField(
            model_name='event',
            name='event_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='explore.eventtype'),
        ),
        migrations.AddField(
            model_name='event',
            name='historical_period',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='explore.historicalperiod'),
        ),
        migrations.AddField(
            model_name='event',
            name='location',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='explore.location'),
        ),
        migrations.AddField(
            model_name='event',
            name='tag',
            field=models.ManyToManyField(blank=True, related_name='tags', related_query_name='tag', to='explore.tag'),
        ),
    ]
