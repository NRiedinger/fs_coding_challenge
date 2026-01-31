from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Ticket


class TicketSerializer(serializers.HyperlinkedModelSerializer):
    # owner = serializers.ReadOnlyField(source="owner.id")

    class Meta:
        model = Ticket
        fields = [
            "url",
            "id",
            "owner",
            "subject",
            "from_email",
            "message",
            "created_at",
            "category",
            "priority",
            "summary",
            "suggested_reply",
            "feedback_accepted",
        ]


class UserSerializer(serializers.ModelSerializer):
    tickets = serializers.HyperlinkedIdentityField(
        many=True,
        view_name="ticket-detail",
        read_only=True,
    )

    class Meta:
        model = User
        fields = [
            "url",
            "id", 
            "username",
            "email",
            "tickets",
        ]