import os

from django.core.wsgi import get_wsgi_application
from .routes import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "procom_backend.settings")

wsgi_application = get_wsgi_application()
asgi_application = get_asgi_application()