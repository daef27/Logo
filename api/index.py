import os
import sys
import traceback

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, ROOT_DIR)

# Encontra a pasta do settings
SETTINGS_MODULE = None
for item in os.listdir(ROOT_DIR):
    item_path = os.path.join(ROOT_DIR, item)
    if os.path.isdir(item_path) and os.path.exists(os.path.join(item_path, 'settings.py')):
        SETTINGS_MODULE = f"{item}.settings"
        break

if not SETTINGS_MODULE:
    SETTINGS_MODULE = "Logo.settings"

os.environ.setdefault('DJANGO_SETTINGS_MODULE', SETTINGS_MODULE)

try:
    from django.core.wsgi import get_wsgi_application
    _application = get_wsgi_application()

    def app(environ, start_response):
        return _application(environ, start_response)

except Exception as e:
    err_msg = traceback.format_exc()
    print("ERRO DJANGO STARTUP:\n", err_msg)
    
    def app(environ, start_response):
        start_response('500 Internal Server Error', [('Content-Type', 'text/html; charset=utf-8')])
        html = f"""
        <html>
        <body style="font-family: monospace; padding: 30px; background: #fff1f2; color: #991b1b;">
            <h2>⚠️ Erro ao Inicializar o Django na Vercel</h2>
            <pre style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #fecaca; overflow: auto;">{err_msg}</pre>
        </body>
        </html>
        """
        return [html.encode('utf-8')]

application = app
handler = app
