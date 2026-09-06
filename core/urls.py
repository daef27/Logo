from django.contrib import admin
from django.urls import path, re_path
from django.http import JsonResponse, HttpResponse

def home(request):
    return JsonResponse({
        "status": "online",
        "message": "API Django rodando com sucesso na Vercel!",
        "admin_url": "/admin/"
    })

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    # Captura rotas da API se a Vercel repassar api/ ou api/index.py
    re_path(r'^api/?.*$', home),
]
