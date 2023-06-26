import './App.css';
import Login from './pages/Login'
import Main from './pages/Main'
import 'bootstrap/dist/css/bootstrap.min.css'


const code = new URLSearchParams(window.location.search).get('code')
function App() {
  return (
    code ? <Main code={code} /> : <Login />
  );
}

export default App;
