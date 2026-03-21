from rest_framework import serializers

from .models import Activity, Leaderboard, Team, User, Workout


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'team', 'team_name']


class ActivitySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Activity
        fields = ['id', 'user', 'username', 'type', 'duration', 'distance', 'timestamp']


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'


class LeaderboardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Leaderboard
        fields = ['id', 'user', 'username', 'points']
