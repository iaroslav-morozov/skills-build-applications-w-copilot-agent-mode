from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Activity, Leaderboard, Team, User, Workout
from .serializers import (
    ActivitySerializer,
    LeaderboardSerializer,
    TeamSerializer,
    UserSerializer,
    WorkoutSerializer,
)


@api_view(['GET'])
def api_root(request, format=None):
    return Response(
        {
            'users': request.build_absolute_uri('/api/users/'),
            'teams': request.build_absolute_uri('/api/teams/'),
            'activities': request.build_absolute_uri('/api/activities/'),
            'leaderboard': request.build_absolute_uri('/api/leaderboard/'),
            'workouts': request.build_absolute_uri('/api/workouts/'),
        }
    )


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all().order_by('id')
    serializer_class = TeamSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all().order_by('-timestamp')
    serializer_class = ActivitySerializer


class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all().order_by('-points')
    serializer_class = LeaderboardSerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all().order_by('id')
    serializer_class = WorkoutSerializer
