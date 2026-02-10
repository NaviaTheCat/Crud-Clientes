import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';

function ClientModal({ isOpen, onClose, title, submitLabel, defaultValues, onSave }) {
	const [nombre, setNombre] = useState(defaultValues?.nombre || '');

	useEffect(() => {
		if (isOpen) {
			setNombre(defaultValues?.nombre || '');
		}
	}, [isOpen, defaultValues]);

	if (!isOpen) {
		return null;
	}

	const handleNameChange = (e) => {
		const value = e.target.value;
		const filteredValue = value.replace(/[^a-zA-Z0-9\s\-'áéíóúÁÉÍÓÚñÑ]/g, '');
		setNombre(filteredValue);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!nombre.trim()) {
			Swal.fire({
				title: 'Error',
				text: 'Por favor ingresa un nombre.',
				icon: 'warning',
				confirmButtonColor: '#0f172a',
			});
			return;
		}
		if (onSave) {
			await onSave(nombre);
		}
		setNombre('');
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
			<div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl shadow-slate-900/30" role="dialog" aria-modal="true">
				<div className="flex items-center justify-between border-b border-slate-100 pb-4">
					<h3 className="text-lg font-semibold text-slate-900">{title}</h3>
					<button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100" onClick={onClose}>
						Cerrar
					</button>
				</div>

				<form
					className="mt-6 grid gap-4"
					onSubmit={handleSubmit}
				>
					<label className="grid gap-2 text-sm font-medium text-slate-700">
						Nombre
						<input
							className="h-11 rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
							value={nombre}
						onChange={handleNameChange}
						type="text"
						placeholder="Nombre"
						maxLength="30"
						/>
					</label>

					<div className="mt-2 flex flex-wrap items-center justify-end gap-3">
						<button
							className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
							type="button"
							onClick={onClose}
						>
							Cancelar
						</button>
						<button
							className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-slate-900/30"
							type="submit"
						>
							{submitLabel}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default function AddClientModal({ isOpen, onClose, onSave }) {
	return (
		<ClientModal
			isOpen={isOpen}
			onClose={onClose}
			title="Agregar cliente"
			submitLabel="Guardar"
			onSave={onSave}
		/>
	);
}
