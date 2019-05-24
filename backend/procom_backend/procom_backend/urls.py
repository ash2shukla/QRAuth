from django.contrib import admin
from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from django.core.cache import cache


urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('jwt_auth.urls')),
    path('docs/', include_docs_urls(title='procom REST', public=False)),
    
    path('wipe-redis/', lambda x: cache.delete('*'))
]