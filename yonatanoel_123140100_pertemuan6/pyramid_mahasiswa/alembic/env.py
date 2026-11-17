"""Pyramid bootstrap environment for Alembic."""
import os
import sys

# Tambahkan direktori root proyek ke sys.path agar paket pyramid_mahasiswa dapat diimpor langsung
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from alembic import context
from pyramid.paster import get_appsettings, setup_logging
from sqlalchemy import engine_from_config

from pyramid_mahasiswa.models.meta import Base

config = context.config

if config.config_file_name:
    try:
        setup_logging(config.config_file_name)
    except Exception:
        pass
    try:
        settings = get_appsettings(config.config_file_name)
    except Exception:
        # Fallback pembacaan file konfigurasi INI langsung jika package belum di-install via pip install -e .
        import configparser
        cp = configparser.ConfigParser(interpolation=None)
        cp.read(config.config_file_name)
        if cp.has_section('app:main'):
            here = os.path.abspath(os.path.dirname(config.config_file_name))
            settings = {k: v.replace('%(here)s', here) for k, v in cp.items('app:main')}
        else:
            settings = {}
else:
    settings = config.get_section(config.config_ini_section) or {}
    if 'sqlalchemy.url' not in settings:
        settings['sqlalchemy.url'] = config.get_main_option('sqlalchemy.url')

target_metadata = Base.metadata


def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    context.configure(url=settings['sqlalchemy.url'])
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""
    engine = engine_from_config(settings, prefix='sqlalchemy.')

    connection = engine.connect()
    context.configure(
        connection=connection,
        target_metadata=target_metadata
    )

    try:
        with context.begin_transaction():
            context.run_migrations()
    finally:
        connection.close()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
