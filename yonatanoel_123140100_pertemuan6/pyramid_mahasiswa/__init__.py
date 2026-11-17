from pyramid.config import Configurator


def main(global_config, **settings):
    """Fungsi entry point WSGI aplikasi Pyramid."""
    with Configurator(settings=settings) as config:
        config.include('pyramid_jinja2')
        config.include('.models')
        config.include('.routes')
        config.scan()
    return config.make_wsgi_app()
