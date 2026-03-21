from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from octofit_tracker.models import Team, Activity, Leaderboard, Workout


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        User = get_user_model()
        # Clear existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Create Teams
        team_marvel = Team.objects.create(name='Team Marvel')
        team_dc = Team.objects.create(name='Team DC')

        # Create Users
        ironman = User.objects.create_user(
            username='ironman',
            email='ironman@marvel.com',
            password='password',
            first_name='Tony',
            last_name='Stark',
            team=team_marvel,
        )
        captain_america = User.objects.create_user(
            username='captain_america',
            email='captain.america@marvel.com',
            password='password',
            first_name='Steve',
            last_name='Rogers',
            team=team_marvel,
        )
        batman = User.objects.create_user(
            username='batman',
            email='batman@dc.com',
            password='password',
            first_name='Bruce',
            last_name='Wayne',
            team=team_dc,
        )
        superman = User.objects.create_user(
            username='superman',
            email='superman@dc.com',
            password='password',
            first_name='Clark',
            last_name='Kent',
            team=team_dc,
        )

        # Create Activities
        Activity.objects.create(user=ironman, type='run', duration=30, distance=5)
        Activity.objects.create(user=captain_america, type='cycle', duration=60, distance=20)
        Activity.objects.create(user=batman, type='swim', duration=45, distance=2)
        Activity.objects.create(user=superman, type='run', duration=50, distance=10)

        # Create Workouts
        Workout.objects.create(name='Morning Cardio', description='Cardio for all heroes', duration=40)
        Workout.objects.create(name='Strength Training', description='Strength for all heroes', duration=60)

        # Create Leaderboard
        Leaderboard.objects.create(user=ironman, points=100)
        Leaderboard.objects.create(user=captain_america, points=90)
        Leaderboard.objects.create(user=batman, points=95)
        Leaderboard.objects.create(user=superman, points=110)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
