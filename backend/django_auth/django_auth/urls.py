from django.urls import path, include
from authapp import views as auth_views

urlpatterns = [
    path('', auth_views.index),
    path('api/', include('authapp.urls')),
]
