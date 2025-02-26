import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register: React.FC = () => {
    const history = useHistory();
    const [form, setForm] = useState({ nombre: '', correo: '', matricula: '', contrasena: '', contrasena_confirmation: ''  });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://dispmovilesapi-production.up.railway.app/api/register', form);
            localStorage.setItem('token', response.data.token);
            window.location.replace('/home');
        } catch (error) {
            alert('Error al registrar: ' + error);
        }
    };

    return (
        <IonPage>
            <IonContent className="" style={{ minHeight: '100vh' }}>
                <div className="d-flex align-items-center justify-content-center m-4">
                    <div className="d-block row p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
                        <h3 className="text-center mb-4">Registro</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    className="form-control"
                                    placeholder="Ingresa tu nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Correo</label>
                                <input
                                    type="email"
                                    name="correo"
                                    className="form-control"
                                    placeholder="correo@ejemplo.com"
                                    value={form.correo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Matrícula</label>
                                <input
                                    type="text"
                                    name="matricula"
                                    className="form-control"
                                    placeholder="Ingresa tu matrícula"
                                    value={form.matricula}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    name="contrasena"
                                    className="form-control"
                                    placeholder="Contraseña segura"
                                    value={form.contrasena}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    name="contrasena_confirmation"
                                    className="form-control"
                                    placeholder="Repite la contraseña"
                                    value={form.contrasena_confirmation}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Registrarse</button>
                        </form>
                        <p className="text-center mt-3">
                            ¿Ya tienes cuenta? <a href="/login" className="text-decoration-none">Iniciar sesión</a>
                        </p>
                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default Register;
