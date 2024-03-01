import {BrowserRouter,Routes,Route} from "react-router-dom";
import { Register1 } from "./pages/Register/Register1.jsx";
import { Register2 } from "./pages/Register/Register2.jsx";
import {  Auth } from "./pages/Register/Auth.jsx";
import { Login } from "./pages/Login/Login.jsx";
function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} exact />
        <Route path="/register" element={<Register1/>}/>
        <Route path="/auth" element={<Auth/>}/>
        <Route path="/register-form" element={<Register2/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
