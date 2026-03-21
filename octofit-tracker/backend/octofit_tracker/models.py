from djongo import models
from django.contrib.auth.models import AbstractUser


class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class User(AbstractUser):
    email = models.EmailField(unique=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username


class Activity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=50)
    duration = models.IntegerField()  # in minutes
    distance = models.FloatField()    # in km
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'activities'

    def __str__(self):
        return f"{self.user.username} - {self.type}"


class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    duration = models.IntegerField()  # in minutes

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return self.name


class Leaderboard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    points = models.IntegerField()

    class Meta:
        db_table = 'leaderboard'

    def __str__(self):
        return f"{self.user.username}: {self.points}"
