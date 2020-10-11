from django.contrib import admin
from django.urls import path, re_path

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('works_metadata.json', views.works_metadata),
    re_path('^w/(?P<work>[a-zA-Z_]+)/(?P<doctype>s|a|image)/(?P<docname>[a-zA-Z0-9_ ]+\\.[a-z]+)', views.document),
    re_path(r'^.*$', views.react_app)
]
