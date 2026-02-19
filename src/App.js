import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AddClientModal from './components/AddClienteModal';
import UpdateClientModal from './components/UpdateClientModa';

const API_URL = 'https://back-crud-production.up.railway.app/items';
const API_KEY = process.env.REACT_APP_API_KEY;
const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
};


function App() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

 const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}`, {
        headers: headers,
      });
      if (response.status === 429) {
        throw new Error('RATE_LIMIT_GET');
      }
      if (!response.ok) throw new Error('Error al obtener clientes');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      if (error.message === 'RATE_LIMIT_GET') {
        Swal.fire({
          title: 'Demasiadas solicitudes',
          text: 'Has alcanzado el limite de 60 solicitudes cada 15 minutos. Intenta mas tarde.',
          icon: 'warning',
          confirmButtonColor: '#0f172a',
        });
        return;
      }
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los clientes.',
        icon: 'error',
        confirmButtonColor: '#0f172a',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    // Deshabilitar clic derecho
    const disableRightClick = (e) => {
      e.preventDefault();
      return false;
    };

    // Deshabilitar teclas de acceso a herramientas de desarrollo
    const disableDevTools = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableDevTools);

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableDevTools);
    };
  }, []);

  const openUpdateModal = (client) => {
    setSelectedClient(client);
    setIsUpdateOpen(true);
  };

  const handleAddClient = async (nombre) => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ nombre }),
      });


      if (response.status === 429) {
        throw new Error('RATE_LIMIT_WRITE');
      }
      if (!response.ok) throw new Error('Error al crear cliente');
      fetchClients();
      setIsAddOpen(false);
    } catch (error) {
      console.error('Error:', error);
      if (error.message === 'RATE_LIMIT_WRITE') {
        Swal.fire({
          title: 'Demasiadas solicitudes',
          text: 'Has alcanzado el limite de solicitudes. Intenta mas tarde.',
          icon: 'warning',
          confirmButtonColor: '#0f172a',
        });
        return;
      }
      Swal.fire({
        title: 'Error',
        text: 'No se pudo agregar el cliente.',
        icon: 'error',
        confirmButtonColor: '#0f172a',
      });
    }
  };

  const handleUpdateClient = async (id, nombre) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ nombre }),
      });

      if (response.status === 429) {
        throw new Error('RATE_LIMIT_WRITE');
      }
      if (!response.ok) throw new Error('Error al actualizar cliente');
      fetchClients();
      setIsUpdateOpen(false);
    } catch (error) {
      console.error('Error:', error);
      if (error.message === 'RATE_LIMIT_WRITE') {
        Swal.fire({
          title: 'Demasiadas solicitudes',
          text: 'Has alcanzado el limite de solicitudes cada. Intenta mas tarde.',
          icon: 'warning',
          confirmButtonColor: '#0f172a',
        });
        return;
      }
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el cliente.',
        icon: 'error',
        confirmButtonColor: '#0f172a',
      });
    }
  };

  const handleDelete = async (client) => {
    const result = await Swal.fire({
      title: 'Eliminar cliente',
      text: `Deseas eliminar a ${client.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0f172a',
      cancelButtonColor: '#94a3b8',
    });

    if (result.isConfirmed) {
       try {
        const response = await fetch(`${API_URL}/${client.id}`, {
          method: 'DELETE',
          headers: headers,
        });

        if (response.status === 429) {
          throw new Error('RATE_LIMIT_WRITE');
        }
        if (!response.ok) throw new Error('Error al eliminar cliente');
        
        await Swal.fire({
          title: 'Eliminado',
          text: 'El cliente fue eliminado correctamente.',
          icon: 'success',
          confirmButtonText: 'Listo',
          confirmButtonColor: '#0f172a',
        });
        
        fetchClients();
      } catch (error) {
        console.error('Error:', error);
        if (error.message === 'RATE_LIMIT_WRITE') {
          Swal.fire({
            title: 'Demasiadas solicitudes',
            text: 'Has alcanzado el limite de solicitudes. Intenta mas tarde.',
            icon: 'warning',
            confirmButtonColor: '#0f172a',
          });
          return;
        }
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el cliente.',
          icon: 'error',
          confirmButtonColor: '#0f172a',
        });
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Panel</p>
              <h1 className="text-2xl font-semibold text-slate-900">Bienvenido</h1>
            </div>
            <span className="rounded-full bg-slate-900 px-4 py-1 text-sm font-semibold text-white">
              Clientes
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-10">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Directorio de clientes</h2>
                <p className="text-sm text-slate-500">Gestiona la informacion clave en un solo lugar.</p>
              </div>
              <button
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-slate-900/30"
                onClick={() => setIsAddOpen(true)}
              >
                Nuevo cliente
              </button>
            </div>

            <table className="min-w-full border-collapse">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-8 py-4">Nombre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {loading ? (
                  <tr>
                    <td className="px-8 py-5 text-center text-slate-500">Cargando...</td>
                  </tr>
                ) : clients.length === 0 ? (
                  <tr>
                    <td className="px-8 py-5 text-center text-slate-500">No hay clientes</td>
                  </tr>
                ) : (
                  [...clients].reverse().map((client) => (
                    <tr key={client.id} className="group transition hover:bg-slate-50">
                      <td className="px-8 py-5">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <span className="font-medium text-slate-900">{client.nombre}</span>
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                              onClick={() => openUpdateModal(client)}
                            >
                              Actualizar
                            </button>
                            <button
                              className="rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-100"
                              onClick={() => handleDelete(client)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <AddClientModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSave={handleAddClient} />
      <UpdateClientModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        client={selectedClient}
        onSave={handleUpdateClient}
      />
    </>
  );
}

export default App;
