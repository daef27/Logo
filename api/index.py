import os
import sys
import traceback

# Aponta para a raiz do repositório
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', '')

try:
    from django.core.wsgi import get_wsgi_application
    _django_app = get_wsgi_application()

    def app(environ, start_response):
        try:
            return _django_app(environ, start_response)
        except Exception as e:
            err = traceback.format_exc()
            start_response('500 Internal Server Error', [('Content-Type', 'text/html; charset=utf-8')])
            return [f"<h2>Erro na requisição:</h2><pre>{err}</pre>".encode('utf-8')]

except Exception as e:
    err = traceback.format_exc()
    def app(environ, start_response):
        start_response('500 Internal Server Error', [('Content-Type', 'text/html; charset=utf-8')])
        return [f"<h2>Erro ao iniciar Django ({MODULE_SETTINGS}):</h2><pre>{err}</pre>".encode('utf-8')]

application = app
handler = app
