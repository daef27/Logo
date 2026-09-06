import os
import sys
import traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Detectar pasta de settings
SETTINGS_MODULE = None
for root, dirs, files in os.walk('.'):
    if 'settings.py' in files and 'venv' not in root and '.git' not in root:
        folder = os.path.basename(root)
        SETTINGS_MODULE = f"{folder}.settings"
        break

if not SETTINGS_MODULE:
    SETTINGS_MODULE = "Logo.settings"

os.environ.setdefault('DJANGO_SETTINGS_MODULE', SETTINGS_MODULE)

try:
    from django.core.wsgi import get_wsgi_application
    _django_app = get_wsgi_application()

    def app(environ, start_response):
        try:
            return _django_app(environ, start_response)
        except Exception as e:
            err = traceback.format_exc()
            print("ERRO NA REQUISIÇÃO DJANGO:\n", err)
            start_response('500 Internal Server Error', [('Content-Type', 'text/html; charset=utf-8')])
            return [f"<h2>Erro no Django:</h2><pre>{err}</pre>".encode('utf-8')]

except Exception as e:
    err = traceback.format_exc()
    print("ERRO STARTUP DJANGO:\n", err)
    def app(environ, start_response):
        start_response('500 Internal Server Error', [('Content-Type', 'text/html; charset=utf-8')])
        return [f"<h2>Erro ao iniciar Django:</h2><pre>{err}</pre>".encode('utf-8')]

application = app
handler = app
