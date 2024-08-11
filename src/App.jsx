import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Articulos } from "./componentes/Articulos";
import { VerArticulo } from "./componentes/Articulos/VerArticulo";
import { CrearArticulo } from "./componentes/Articulos/CrearArticulo";
import { Login } from "./routes/Login";
import Navbar from "./componentes/NavBar";
import { EditarArticulo } from "./componentes/Articulos/EditarArticulo";
import { ProtectedRoute } from "./contexts/ProtectedRoute";
import {Perfiles} from "./componentes/Profiles/Perfiles";

const App = () => {
    return (
        <Router>
            <Navbar /> {/* Coloca el Navbar aquí */}
            <Routes>
                <Route path="/" element={<Articulos />} />
                <Route path="/login" element={<Login />} />
                <Route path="/articles/:id" element={<VerArticulo />} />
                <Route path="/articles/nuevo-articulo" element={ <ProtectedRoute> <CrearArticulo /> </ProtectedRoute>} />
                <Route path="/articles/editar/:id" element={<ProtectedRoute><EditarArticulo /></ProtectedRoute>} />
                <Route path="/perfil" element={<Perfiles />}></Route>
                <Route path="*" element={<Navigate to="/" />}></Route>
            </Routes>
        </Router>
    );
};

export default App;
