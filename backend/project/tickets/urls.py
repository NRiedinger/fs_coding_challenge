from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tickets import views

router = DefaultRouter()
router.register(r"tickets", views.TicketViewSet, basename="ticket")
router.register(r"users", views.UserViewSet, basename="user")

urlpatterns = [
    path("", include(router.urls))
]

urlpatterns += [
    path("api-auth/", include("rest_framework.urls"))
]