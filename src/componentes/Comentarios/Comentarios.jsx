import React, { useState, useEffect } from "react";
import { fetchComentarios } from "../../hooks/CommentsCon";

const Comentarios = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadComments = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchComentarios();
                setComments(data.results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadComments();
    }, []);

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
            <h1 className="my-4">Comentarios</h1>
            {comments.length > 0 ? (
                <ul className="list-group">
                    {comments.map((comment) => (
                        <li key={comment.id} className="list-group-item">
                            <div>
                                <strong>Autor:</strong> {comment.author}
                            </div>
                            <div>
                                <strong>Contenido:</strong> {comment.content}
                            </div>
                            <div>
                                <small>
                                    <strong>Creado:</strong> {new Date(comment.created_at).toLocaleDateString()}
                                </small>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="alert alert-info" role="alert">
                    No hay comentarios disponibles.
                </div>
            )}
        </div>
    );
};

export default Comentarios;