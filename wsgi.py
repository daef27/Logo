import os
import sys

# Adiciona o diretório raiz ao caminho do Python
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', '')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
app = application
handler = application
