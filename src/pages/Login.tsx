import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Envelope, Lock } from "react-bootstrap-icons";

const ADMIN_EMAIL = "test@admin.com";
const ADMIN_PASSWORD = "123456";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError("");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("admin-auth", "true");
      navigate("/");
    } else {
      setError("E-posta veya şifre hatalı.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "white" }}
    >
      <div className="p-4 rounded shadow" style={{ width: 350 , background: "#212529",color:'white'}}>
        
        {/* Logo */}
        <div className="text-center">
          <img src="/logo.png" alt="Logo" width={160} />
        </div>
        <h5 className="text-center mb-4" style={{ }}>
          Giriş
        </h5>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* EMAIL INPUT */}
          <div className="mb-2">

            <div className="input-group">
              <span className="input-group-text bg-white">
                <Envelope size={16} color="#9ca3af" />
              </span>
              <input
                className="form-control"
                type="email"
                required
                placeholder="E-posta adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

          </div>

          {/* PASSWORD INPUT */}
          <div className="mb-3">

            <div className="input-group">
              <span className="input-group-text bg-white">
                <Lock size={16} color="#9ca3af" />
              </span>
              <input
                className="form-control"
                type="password"
                required
                placeholder="Şifreniz"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

          </div>

          <button
            type="submit"
            className="btn w-100 text-black"
            style={{ background: "var(--secondary)", fontWeight: "600" }}
          >
            Giriş Yap
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
