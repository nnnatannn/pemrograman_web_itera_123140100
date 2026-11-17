from pyramid.view import view_config


@view_config(route_name='home', renderer='json')
def my_view(request):
    """View default untuk root path (/) yang mengembalikan ringkasan status API"""
    return {
        'status': 'online',
        'message': 'Selamat datang di RESTful API Sistem Informasi Akademik ITERA (Pertemuan 6)',
        'endpoints': {
            'mahasiswa': {
                'list': 'GET /api/mahasiswa',
                'detail': 'GET /api/mahasiswa/{id}',
                'create': 'POST /api/mahasiswa',
                'update': 'PUT /api/mahasiswa/{id}',
                'delete': 'DELETE /api/mahasiswa/{id}',
            },
            'matakuliah': {
                'list': 'GET /api/matakuliah',
                'detail': 'GET /api/matakuliah/{id}',
                'create': 'POST /api/matakuliah',
                'update': 'PUT /api/matakuliah/{id}',
                'delete': 'DELETE /api/matakuliah/{id}',
            }
        }
    }
