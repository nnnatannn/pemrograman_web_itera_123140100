import argparse
import os
import sys
from datetime import date

# Tambahkan root proyek ke sys.path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError

from .. import models


def setup_models(dbsession):
    """Menambahkan data awal (seeding) mahasiswa dan matakuliah ke database"""
    # 1. Seeding Data Mahasiswa
    mahasiswa1 = models.Mahasiswa(
        nim='12345',
        nama='Budi Santoso',
        jurusan='Teknik Informatika',
        tanggal_lahir=date(2000, 5, 15),
        alamat='Jl. Merdeka No. 123, Bandung'
    )

    mahasiswa2 = models.Mahasiswa(
        nim='54321',
        nama='Siti Aminah',
        jurusan='Sistem Informasi',
        tanggal_lahir=date(2001, 8, 22),
        alamat='Jl. Mawar No. 45, Jakarta'
    )

    dbsession.add(mahasiswa1)
    dbsession.add(mahasiswa2)

    # 2. Seeding Data Matakuliah (Minimal 3 data awal sesuai spesifikasi tugas)
    mk1 = models.Matakuliah(
        kode_mk='IF2110',
        nama_mk='Algoritma dan Pemrograman',
        sks=3,
        semester=3
    )

    mk2 = models.Matakuliah(
        kode_mk='IF3140',
        nama_mk='Pemrograman Web',
        sks=3,
        semester=5
    )

    mk3 = models.Matakuliah(
        kode_mk='IF2220',
        nama_mk='Basis Data',
        sks=4,
        semester=4
    )

    dbsession.add(mk1)
    dbsession.add(mk2)
    dbsession.add(mk3)


def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'config_uri',
        help='Configuration file, e.g., development.ini',
    )
    return parser.parse_args(argv[1:])


def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)

    try:
        env = bootstrap(args.config_uri)
        with env['request'].tm:
            dbsession = env['request'].dbsession
            setup_models(dbsession)
            print("Berhasil memasukkan data seeding awal mahasiswa dan matakuliah!")
    except OperationalError as e:
        print(f"Pyramid gagal terhubung ke database SQL: {e}")
        print("Pastikan service database berjalan dan connection string di file konfigurasi benar.")
    except Exception:
        # Fallback inisialisasi langsung jika paket belum terdaftar melalui pip install -e .
        from sqlalchemy import engine_from_config
        from sqlalchemy.orm import sessionmaker
        import transaction
        import zope.sqlalchemy
        import configparser
        try:
            cp = configparser.ConfigParser(interpolation=None)
            cp.read(args.config_uri)
            if cp.has_section('app:main'):
                here = os.path.abspath(os.path.dirname(args.config_uri))
                settings = {k: v.replace('%(here)s', here) for k, v in cp.items('app:main')}
            else:
                settings = {}
            engine = engine_from_config(settings, prefix='sqlalchemy.')
            SessionFactory = sessionmaker(bind=engine)
            dbsession = SessionFactory()
            with transaction.manager:
                zope.sqlalchemy.register(dbsession, transaction_manager=transaction.manager)
                setup_models(dbsession)
            print("Berhasil memasukkan data seeding awal mahasiswa dan matakuliah!")
        except OperationalError as err:
            print(f"Pyramid gagal terhubung ke database SQL: {err}")
            print("Pastikan service database berjalan dan connection string di file konfigurasi benar.")
        except Exception as err:
            print(f"Error saat inisialisasi database: {err}")


if __name__ == '__main__':
    main()
