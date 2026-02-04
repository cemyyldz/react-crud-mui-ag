import LoginLayout from "../components/login/LoginLayout";
import LoginForm from "../components/login/LoginForm";

function Login({ onLogin }) {
  return (
    <LoginLayout>
      <LoginForm onLogin={onLogin} />
    </LoginLayout>
  );
}

export default Login;
