import LoginForm from "../../components/auth/LoginForm";
import "../../assets/css/Login.css";

export default function Login() {
  return (
    <div className="login-page">

      <div className="container">

        <div className="row justify-content-center align-items-center min-vh-100">

          <div className="col-lg-10">

            <div className="login-card row g-0">

              {/* Imagen */}

              <div className="col-lg-6 d-none d-lg-flex login-image">

                <img
                  src="/src/assets/img/Logo.jpeg"
                  alt="HolyHoly"
                />

              </div>

              {/* Formulario */}

              <div className="col-lg-6">

                <LoginForm />

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};