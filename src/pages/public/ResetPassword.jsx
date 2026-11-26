import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePostFetch } from '../../hooks/usePostFetch';
import '../../assets/css/Login.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { post, loading, error } = usePostFetch('/auth/reset-password');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await post({ token, password });
      setSuccess(true);
    } catch {
      // The request error is displayed from the hook state.
    }
  };

  return (
    <main className="login-page">
      <div className="container px-3 py-4">
        <section className="login-card mx-auto" style={{ maxWidth: 520 }}>
          <div className="login-form">
            <h1 className="h2 fw-bold mb-1">Crear contraseña nueva</h1>
            <p className="mb-4 text-muted">Elige una contraseña de al menos 6 caracteres.</p>

            {success ? (
              <>
                <div className="alert alert-success small">
                  Tu contraseña se actualizó. Ya puedes iniciar sesión.
                </div>
                <Link to="/login" className="btn login-btn w-100 py-2">Ir a iniciar sesión</Link>
              </>
            ) : !token ? (
              <div className="alert alert-danger small">
                El enlace de restablecimiento no es válido o ha expirado.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {(formError || error) && (
                  <div className="alert alert-danger small">
                    {formError || error.response?.data?.message || 'No se pudo actualizar la contraseña.'}
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label small fw-semibold" htmlFor="new-password">Contraseña nueva</label>
                  <input
                    id="new-password"
                    className="form-control"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-semibold" htmlFor="confirm-password">Confirmar contraseña</label>
                  <input
                    id="confirm-password"
                    className="form-control"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                  />
                </div>
                <button className="btn login-btn w-100 py-2" type="submit" disabled={loading}>
                  {loading ? 'Guardando...' : 'Actualizar contraseña'}
                </button>
              </form>
            )}

            {!success && (
              <div className="text-center mt-4 small">
                <Link to="/login" className="text-decoration-none">Volver a iniciar sesión</Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
