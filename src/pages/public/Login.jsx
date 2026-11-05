import LoginForm from "../../components/auth/LoginForm";
import "../../assets/css/Login.css";

export default function Login() {
  return (
    <div className="login-page d-flex align-items-center justify-content-center">

      <div className="container px-3 py-2">
        <div className="row justify-content-center align-items-center">

          <div className="col-12 col-lg-10">
            <div className="login-card row g-0">

              {/* Imagen */}
              <div className="col-lg-6 d-none d-lg-flex login-image">
                <img
                  src="/src/assets/img/loginholly.webp"
                  alt="HolyHoly"
                />
              </div>

              {/* Formulario */}
              <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
                <LoginForm />
              </div>

            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
};