import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
    const history = useHistory();
    const [form, setForm] = useState({ correo: '', contrasena: '' });
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://dispmovilesapi-production.up.railway.app/api/login', form);
            localStorage.setItem('token', response.data.token);
            window.location.replace('/home');
        } catch (error) {
            alert('Error al iniciar sesión: ' + error);
        }
    };

    return (
        <IonPage>
            <IonContent style={{ minHeight: '100vh' }}>
                <div className="d-flex align-items-center justify-content-center m-4">
                    <div className="d-block row p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
                        <h3 className="text-center mb-4">Iniciar Sesión</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Correo</label>
                                <input 
                                    type="email" 
                                    name="correo" 
                                    className="form-control" 
                                    value={form.correo} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Contraseña</label>
                                <input 
                                    type="password" 
                                    name="contrasena" 
                                    className="form-control" 
                                    value={form.contrasena} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                Iniciar Sesión
                            </button>
                            <div className="text-center mt-3">
                                <p>¿No tienes una cuenta? <a href="/register">Regístrate aquí</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;
