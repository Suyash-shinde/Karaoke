import {BrowserRouter,Routes,Route, Outlet, Navigate} from "react-router-dom";
import { Register1 } from "./pages/Register/Register1.jsx";
import { Register2 } from "./pages/Register/Register2.jsx";
import {  Auth } from "./pages/Register/Auth.jsx";
import { Login } from "./pages/Login/Login.jsx";
import { Home } from "./pages/Rooms/Home.jsx";
import { RoomPage } from "./pages/RoomPage/RoomPage.jsx";
import {useSelector} from 'react-redux';
import Profile from "./pages/Profile/Profile.jsx";
import Avatar from "./pages/Avatar/Avatar.jsx";
function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/register" element={<Register1/>}/>
          <Route path="/auth" element={<Auth/>}/>
          <Route path="/details" element={<Register2/>}/>
        <Route element={<ProtectedRoute/>}>
        <Route path="/home" element={<Home/>}/>
        <Route path="/room/:id" element={<RoomPage/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/avatar" element={<Avatar/>}/>
        </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

const ProtectedRoute = () => {
  const {isAuth } = useSelector((state) => state.auth);
  return (
    isAuth? <Outlet/> : <Navigate to='/'/>   
  );
};


export default App
