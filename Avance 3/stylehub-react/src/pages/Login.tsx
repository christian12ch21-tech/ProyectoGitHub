import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../services/http';

const loginSchema = z.object({
  email: z.email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
type LoginData = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginData) => {
    setServerError(null);
    try {
      const ok = await login(data.email, data.password);
      if (ok) navigate(from, { replace: true });
      else setServerError('Correo o contraseña incorrectos');
    } catch (e) {
      setServerError(errorMessage(e));
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <h3 className="mb-3">Iniciar sesión</h3>
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Correo
            </label>
            <input id="email" type="email" className={`form-control${errors.email ? ' is-invalid' : ''}`} {...register('email')} />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className={`form-control${errors.password ? ' is-invalid' : ''}`}
              {...register('password')}
            />
            <div className="invalid-feedback">{errors.password?.message}</div>
          </div>
          <button className="btn btn-dark w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p className="mt-3 small text-body-secondary">
          Demo: cliente@stylehub.com / cliente123 · admin@stylehub.com / admin123
        </p>
        <p className="small">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
