from django.urls import path
from . import views

urlpatterns = [
    path('verify/<str:product_id>/', views.verify_product, name='verify_product'),
    path('audit/<str:product_id>/', views.audit_product, name='audit_product'),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),
    path('recent-blocks/', views.recent_blocks, name='recent_blocks'),
    path('auth/login/', views.auth_login, name='auth_login'),
    path('auth/register/', views.auth_register, name='auth_register'),
]

