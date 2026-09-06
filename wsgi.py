import os
import sys

# Adiciona a pasta atual ao sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Logo.settings')

from django.core.wsgi import get_wsgi_application

# Vercel procura exatamente por 'app' ou 'application' no nível superior
application = get_wsgi_application()
app = application
handler = application
