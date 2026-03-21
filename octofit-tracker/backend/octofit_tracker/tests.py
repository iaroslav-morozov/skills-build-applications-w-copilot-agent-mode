from django.test import TestCase
from .models import Team, User, Activity, Workout, Leaderboard

class ModelSmokeTest(TestCase):
    def test_team_str(self):
        team = Team(name="Test Team")
        self.assertEqual(str(team), "Test Team")

    def test_user_str(self):
        team = Team(name="Test Team")
        user = User(username="testuser", email="test@example.com", team=team)
        self.assertEqual(str(user), "testuser")

    def test_activity_str(self):
        team = Team(name="Test Team")
        user = User(username="testuser", email="test@example.com", team=team)
        activity = Activity(user=user, type="run", duration=30, distance=5.0)
        self.assertIn("testuser", str(activity))

    def test_workout_str(self):
        workout = Workout(name="Cardio", description="desc", duration=20)
        self.assertEqual(str(workout), "Cardio")

    def test_leaderboard_str(self):
        team = Team(name="Test Team")
        user = User(username="testuser", email="test@example.com", team=team)
        leaderboard = Leaderboard(user=user, points=100)
        self.assertIn("testuser", str(leaderboard))
