"""AI_Web URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url

from SA.views import sa_views as sa
from Astar.views import Astar_views as astar

urlpatterns = [
    # url
    path('admin/', admin.site.urls),
    path('SA/', sa.SA),
    path('Astar/', astar.Astar),

    # api
    url(r'api/SA_origin$', sa.SA_origin),
    url(r'api/SA_step$', sa.SA_step),
    url(r'api/LS_step$', sa.LS_step),
    url(r'api/SA_clear$', sa.SA_Clear),
    url(r'api/LS_clear$', sa.LS_Clear),
]
