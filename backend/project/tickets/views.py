from .models import Ticket
from .serializers import TicketSerializer, UserSerializer
from .permissions import IsOwnerOrReadOnly
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.decorators import api_view, action
from rest_framework.reverse import reverse
from rest_framework import renderers
from rest_framework import viewsets

@api_view(["GET"])
def api_root(request, format=None):
    return Response(
        {
            "users": reverse("user-list", request=request, format=format),
            "tickets": reverse("ticket-list", request=request, format=format),
        }
    )

class TicketViewSet(viewsets.ModelViewSet):
    """
    This ViewSet automatically provides `list`, `create`, `retrieve`, `update` and `destroy` actions.
    """
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `retrieve` actions.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

# class TicketCreate(generics.CreateAPIView):
#     queryset = Ticket.objects.all()
#     serializer_class = TicketSerializer

# class TicketList(generics.ListAPIView):
#     queryset = Ticket.objects.all()
#     serializer_class = TicketSerializer

# class TicketDetail(generics.RetrieveAPIView):
#     queryset = Ticket.objects.all()
#     serializer_class = TicketSerializer

# class TicketUpdate(generics.RetrieveUpdateAPIView):
#     queryset = Ticket.objects.all()
#     serializer_class = TicketSerializer

# class TicketDelete(generics.RetrieveDestroyAPIView):
#     queryset = Ticket.objects.all()
#     serializer_class = TicketSerializer

