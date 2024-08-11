import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export const CrearComentario = ({ articleId, onCommentCreated }) => {
    const { auth } = useContext(AuthContext);
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!auth.isAuthenticated) {
            setError('Debes estar autenticado para comentar.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://sandbox.academiadevelopers.com/infosphere/comments/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${auth.token}`,
                },
                body: JSON.stringify({
                    content,
                    article: articleId,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear el comentario');
            }

            const data = await response.json();
            onCommentCreated(data);
            setContent('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card mt-4">
            <div className="card-header">
                <h5>Deja un comentario</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            rows="3"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Enviando...' : 'Enviar Comentario'}
                    </button>
                </form>
            </div>
        </div>
    );
};