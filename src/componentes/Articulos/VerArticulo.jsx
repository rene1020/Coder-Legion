import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { fetchArticle, fetchEliminarArticulo } from "../../hooks/ArticlesCon";
import { CrearComentario } from "../Comentarios/CrearComentarios";
import EditarComentario from "../Comentarios/EditarComentarios"; 
import { fetchEliminarComentario } from "../../hooks/CommentsCon";

const placeholderImage = "https://via.placeholder.com/150?text=No+Imagen";

export const VerArticulo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null); // Para rastrear qué comentario se está editando

    useEffect(() => {
        const loadArticle = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchArticle(id);
                setArticle(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadArticle();
    }, [id]);

    useEffect(() => {
        const loadComments = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`https://sandbox.academiadevelopers.com/infosphere/comments/?article=${id}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los comentarios');
                }
                const data = await response.json();
                setComments(data.results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadComments();
    }, [id]);

    const handleVolver = () => {
        navigate("/");
    };

    const handleNuevoArticulo = () => {
        navigate("/articles/nuevo-articulo");
    };

    const handleEditarArticulo = () => {
        navigate(`/articles/editar/${id}`);
    };

    const handleEliminarArticulo = async () => {
        try {
            await fetchEliminarArticulo(id);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCommentCreated = (newComment) => {
        setComments([newComment, ...comments]);
    };

    const handleEditComment = (commentId) => {
        setEditingCommentId(commentId);
    };

    const handleCommentUpdated = (updatedComment) => {
        setComments(comments.map(comment => comment.id === updatedComment.id ? updatedComment : comment));
        setEditingCommentId(null);
    };
    const handleEliminarComentario = async (commentId) => {
        try {
            await fetchEliminarComentario(commentId, auth.token);
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (err) {
            console.error(err.message);
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
            {article ? (
                <>
                    {/* Detalles del artículo */}
                    <div className="card mb-4">
                        <img 
                            src={article.image || placeholderImage} 
                            className="card-img-top mt-1" 
                            alt={article.title} 
                            style={{ width: "200px", height: "200px", objectFit: "cover", display: "block", margin: "auto" }}
                        />
                        <div className="card-body">
                            <h3 className="card-title">{article.title}</h3>
                            <p className="card-text">{article.content}</p>
                            <p className="card-text">
                                <small className="text-muted">Publicado el {new Date(article.created_at).toLocaleDateString()}</small>
                            </p>
                        </div>
                    </div>
    
                    <div className="card-footer text-muted text-center">
                        <button onClick={handleVolver} className="btn btn-primary me-2">Volver</button>
                        {auth.isAuthenticated && (
                            <>
                                <button onClick={handleEditarArticulo} className="btn btn-warning me-2">Editar Artículo</button>
                                <button onClick={handleEliminarArticulo} className="btn btn-danger">Eliminar Artículo</button>
                            </>
                        )}
                    </div>
    
                    {auth.isAuthenticated && (
                        <CrearComentario articleId={id} onCommentCreated={handleCommentCreated} />
                    )}
    
                    <div className="mt-4">
                        <h4>Comentarios:</h4>
                        {comments.length === 0 ? (
                            <p>No hay comentarios aún.</p>
                        ) : (
                            <ul className="list-unstyled">
                                {comments.map((comment) => (
                                    <li key={comment.id} className="mb-3">
                                        <div className="card">
                                            <div className="card-body">
                                                {editingCommentId === comment.id ? (
                                                    <EditarComentario
                                                        commentId={comment.id}
                                                        articleId={id}
                                                        onEditSuccess={handleCommentUpdated}
                                                    />
                                                ) : (
                                                    <>
                                                        <p className="card-text">{comment.content}</p>
                                                        <p className="card-text">
                                                            <small className="text-muted">Publicado el {new Date(comment.created_at).toLocaleDateString()}</small>
                                                        </p>
                                                        {auth.isAuthenticated && (
                                                            <>
                                                                <button onClick={() => handleEditComment(comment.id)} className="btn btn-sm btn-warning me-2">
                                                                    Editar
                                                                </button>
                                                                <button onClick={() => handleEliminarComentario(comment.id)} className="btn btn-sm btn-danger">
                                                                    Eliminar
                                                                </button>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            ) : (
                <p>No se encontró el artículo.</p>
            )}
        </div>
    );
    
};
