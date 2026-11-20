import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../services/http';

const registerSchema = z
  .object({
    name: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z.email('Correo electrónico inválido'),
    password: z
      .string()
      .min(6, 'Mínimo 6 caracteres')
      .regex(/\d/, 'Debe incluir al menos un número'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm'],
  });
type RegisterData = z.infer<typeof registerSchema>;

export default function Register() {
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterData) => {
    setServerError(null);
    try {
      await signUp(data.name, data.email, data.password);
      navigate('/');
    } catch (e) {
      setServerError(errorMessage(e));
    }
  };

  const field = (name: keyof RegisterData, label: string, type = 'text') => (
    <div className="mb-3">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <input id={name} type={type} className={`form-control${errors[name] ? ' is-invalid' : ''}`} {...register(name)} />
      <div className="invalid-feedback">{errors[name]?.message}</div>
    </div>
  );

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <h3 className="mb-3">Crear cuenta</h3>
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {field('name', 'Nombre completo')}
          {field('email', 'Correo', 'email')}
          {field('password', 'Contraseña', 'password')}
          {field('confirm', 'Confirmar contraseña', 'password')}
          <button className="btn btn-dark w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Registrarme'}
          </button>
        </form>
        <p className="small mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
