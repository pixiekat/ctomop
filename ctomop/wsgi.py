"""
WSGI config for ctomop project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ctomop.settings')

# Subpath note:
# When FORCE_SCRIPT_NAME is set (we use SUB_PATH=/ctomop behind a reverse
# proxy), middlewares need to know the script prefix at __init__ time so they
# can compute correct path prefixes — WhiteNoise in particular strips it from
# STATIC_URL so that paths arriving from the (prefix-stripping) reverse proxy
# still match.
#
# get_wsgi_application() calls django.setup(set_prefix=False), so the script
# prefix would default to "/" during middleware construction. We call
# django.setup() ourselves first with set_prefix=True (the default) so it
# reads FORCE_SCRIPT_NAME and sets the prefix before the WSGIHandler builds
# its middleware chain.
import django
django.setup()

from django.core.wsgi import get_wsgi_application  # noqa: E402
application = get_wsgi_application()
