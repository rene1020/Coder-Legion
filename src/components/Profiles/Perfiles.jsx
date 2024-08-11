import React, { useEffect, useState } from "react";
import { fetchProfiles } from "../../hooks/useFetchUsers"; // Asegúrate de que esta importación sea correcta

export const Perfiles = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const loadProfiles = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchProfiles(currentPage);
                setProfiles(data.profiles);
                setTotalPages(Math.ceil(data.totalCount / 10)); // Ajusta el número según el tamaño de página
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProfiles();
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Cargando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="my-4">Perfiles de Usuarios</h1>
            {profiles.length > 0 ? (
                <>
                    <div className="row">
                        {profiles.map((profile) => (
                            <div key={profile.user__id} className="col-md-4 mb-4">
                                <div className="card">
                                    {profile.image ? (
                                        <img
                                            src={profile.image}
                                            className="card-img-top"
                                            alt={`${profile.username}'s profile`}
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <img
                                            src="https://via.placeholder.com/150?text=No+Imagen"
                                            className="card-img-top"
                                            alt="No Imagen"
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{profile.username}</h5>
                                        <p className="card-text">
                                            <strong>Nombre:</strong> {profile.first_name} {profile.last_name}
                                        </p>
                                        <p className="card-text">
                                            <strong>Email:</strong> {profile.email}
                                        </p>
                                        <p className="card-text">
                                            <strong>Fecha de Nacimiento:</strong> {profile.dob || "No disponible"}
                                        </p>
                                        <p className="card-text">
                                            <strong>Biografía:</strong> {profile.bio || "No disponible"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <nav aria-label="Page navigation">
                        <ul className="pagination">
                            <li className="page-item">
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </button>
                            </li>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li
                                    key={index + 1}
                                    className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li className="page-item">
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Siguiente
                                </button>
                            </li>
                        </ul>
                    </nav>
                </>
            ) : (
                <div className="alert alert-info" role="alert">
                    No se encontraron perfiles.
                </div>
            )}
        </div>
    );
};