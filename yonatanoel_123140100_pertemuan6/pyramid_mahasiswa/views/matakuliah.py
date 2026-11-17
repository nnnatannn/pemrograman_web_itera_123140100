from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPNotFound,
    HTTPBadRequest,
)
from ..models import Matakuliah


# 1. READ ALL: Menampilkan daftar seluruh mata kuliah
@view_config(route_name='matakuliah_list', renderer='json')
def matakuliah_list(request):
    """View untuk mengambil seluruh data mata kuliah"""
    dbsession = request.dbsession
    matakuliahs = dbsession.query(Matakuliah).order_by(Matakuliah.id.asc()).all()
    return {'matakuliahs': [m.to_dict() for m in matakuliahs]}


# 2. READ ONE: Menampilkan detail satu mata kuliah berdasarkan ID
@view_config(route_name='matakuliah_detail', renderer='json')
def matakuliah_detail(request):
    """View untuk melihat detail satu mata kuliah berdasarkan ID di URL"""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']
    matakuliah = dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()

    if matakuliah is None:
        return HTTPNotFound(json_body={'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'})

    return {'matakuliah': matakuliah.to_dict()}


# 3. CREATE: Menambahkan data mata kuliah baru
@view_config(route_name='matakuliah_add', request_method='POST', renderer='json')
def matakuliah_add(request):
    """View untuk menambahkan mata kuliah baru dari payload JSON"""
    try:
        json_data = request.json_body

        # Validasi field wajib
        required_fields = ['kode_mk', 'nama_mk', 'sks', 'semester']
        for field in required_fields:
            if field not in json_data or json_data[field] is None or json_data[field] == '':
                return HTTPBadRequest(json_body={'error': f'Field {field} wajib diisi!'})

        # Validasi tipe dan rentang sks (harus integer dan > 0)
        try:
            sks = int(json_data['sks'])
            if sks <= 0:
                return HTTPBadRequest(json_body={'error': 'Field sks harus berupa bilangan bulat positif lebih dari 0!'})
        except (ValueError, TypeError):
            return HTTPBadRequest(json_body={'error': 'Field sks harus berupa angka integer valid!'})

        # Validasi tipe dan rentang semester (harus integer dan > 0)
        try:
            semester = int(json_data['semester'])
            if semester <= 0:
                return HTTPBadRequest(json_body={'error': 'Field semester harus berupa bilangan bulat positif lebih dari 0!'})
        except (ValueError, TypeError):
            return HTTPBadRequest(json_body={'error': 'Field semester harus berupa angka integer valid!'})

        # Validasi keunikan kode_mk
        kode_mk = str(json_data['kode_mk']).strip()
        nama_mk = str(json_data['nama_mk']).strip()

        dbsession = request.dbsession
        existing = dbsession.query(Matakuliah).filter_by(kode_mk=kode_mk).first()
        if existing:
            return HTTPBadRequest(json_body={'error': f'Matakuliah dengan kode {kode_mk} sudah terdaftar!'})

        matakuliah = Matakuliah(
            kode_mk=kode_mk,
            nama_mk=nama_mk,
            sks=sks,
            semester=semester
        )

        dbsession.add(matakuliah)
        dbsession.flush()

        return {'success': True, 'matakuliah': matakuliah.to_dict()}

    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


# 4. UPDATE: Mengubah data mata kuliah yang sudah ada
@view_config(route_name='matakuliah_update', request_method='PUT', renderer='json')
def matakuliah_update(request):
    """View untuk memperbarui data mata kuliah berdasarkan ID"""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']

    matakuliah = dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    if matakuliah is None:
        return HTTPNotFound(json_body={'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'})

    try:
        json_data = request.json_body

        if 'kode_mk' in json_data and json_data['kode_mk']:
            new_kode = str(json_data['kode_mk']).strip()
            if new_kode != matakuliah.kode_mk:
                existing = dbsession.query(Matakuliah).filter_by(kode_mk=new_kode).first()
                if existing:
                    return HTTPBadRequest(json_body={'error': f'Matakuliah dengan kode {new_kode} sudah terdaftar!'})
            matakuliah.kode_mk = new_kode

        if 'nama_mk' in json_data and json_data['nama_mk']:
            matakuliah.nama_mk = str(json_data['nama_mk']).strip()

        if 'sks' in json_data and json_data['sks'] is not None:
            try:
                sks = int(json_data['sks'])
                if sks <= 0:
                    return HTTPBadRequest(json_body={'error': 'Field sks harus berupa bilangan bulat positif lebih dari 0!'})
                matakuliah.sks = sks
            except (ValueError, TypeError):
                return HTTPBadRequest(json_body={'error': 'Field sks harus berupa angka integer valid!'})

        if 'semester' in json_data and json_data['semester'] is not None:
            try:
                semester = int(json_data['semester'])
                if semester <= 0:
                    return HTTPBadRequest(json_body={'error': 'Field semester harus berupa bilangan bulat positif lebih dari 0!'})
                matakuliah.semester = semester
            except (ValueError, TypeError):
                return HTTPBadRequest(json_body={'error': 'Field semester harus berupa angka integer valid!'})

        return {'success': True, 'matakuliah': matakuliah.to_dict()}

    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


# 5. DELETE: Menghapus data mata kuliah
@view_config(route_name='matakuliah_delete', request_method='DELETE', renderer='json')
def matakuliah_delete(request):
    """View untuk menghapus mata kuliah berdasarkan ID"""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']

    matakuliah = dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    if matakuliah is None:
        return HTTPNotFound(json_body={'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'})

    dbsession.delete(matakuliah)

    return {'success': True, 'message': f'Matakuliah dengan ID {matakuliah_id} berhasil dihapus'}
