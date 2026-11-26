import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePostFetch } from '../../hooks/usePostFetch';
import '../../assets/css/Login.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { post, loading, error } = usePostFetch('/auth/forgot-password');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const result = await post({ email });
      setMessage(result.message);
    } catch {
      // The request error is displayed from the hook state.
    }
  };

  return (
    <main className="login-page">
      <div className="container px-3 py-4">
        <section className="login-card mx-auto" style={{ maxWidth: 520 }}>
          <div className="login-form">
            <h1 className="h2 fw-bold mb-1">Recuperar contraseña</h1>
            <p className="mb-4 text-muted">Te enviaremos un enlace para crear una contraseña nueva.</p>

            {message && <div className="alert alert-success small">{message}</div>}
            {error && (
              <div className="alert alert-danger small">
                {error.response?.data?.message || 'No se pudo procesar la solicitud.'}
              </div>
            )}

            {!message && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold" htmlFor="reset-email">Correo electrónico</label>
                  <input
                    id="reset-email"
                    className="form-control"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <button className="btn login-btn w-100 py-2" type="submit" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar enlace'}
                </button>
              </form>
            )}

            <div className="text-center mt-4 small">
              <Link to="/login" className="text-decoration-none">Volver a iniciar sesión</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
