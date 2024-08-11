import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchArticles } from "../hooks/ArticlesCon";
import { fetchCategories } from "../hooks/CategoryCon";

const placeholderImage = "https://via.placeholder.com/150?text=No+Imagen";

export const Articulos = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadArticlesAndCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const articlesData = await fetchArticles(page);
                const sortedArticles = articlesData.articles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setArticles(sortedArticles);
                setTotalCount(articlesData.totalCount);
                setNextPage(articlesData.nextPage);
                setPrevPage(articlesData.prevPage);

                const categoriesData = await fetchCategories();
                setCategories(categoriesData); 
            } catch (err) {
                setError("Error al cargar los artículos");
            } finally {
                setLoading(false);
            }
        };

        loadArticlesAndCategories();
    }, [page]);

    const handleNextPage = () => {
        if (nextPage) setPage(Number(nextPage));
    };

    const handlePrevPage = () => {
        if (prevPage) setPage(Number(prevPage));
    };

    const handleNuevoArticulo = () => {
        navigate("/articles/nuevo-articulo");
    };

    const getCategoryName = (id) => {
        const category = categories.find(cat => cat.id === id);
        return category ? category.name : "Desconocida";
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="my-4">Artículos</h1>
                <button onClick={handleNuevoArticulo} className="btn btn-success">Nuevo Artículo</button>
            </div>
            {loading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Cargando...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            ) : (
                <>
                    <div className="row">
                        {articles.map((article) => (
                            <div className="col-md-4 mb-4" key={article.id}>
                                <div className="card h-100 d-flex flex-column">
                                    <img 
                                        src={article.image || placeholderImage} 
                                        style={{ height: "200px", objectFit: "cover" }}
                                        className="card-img-top" 
                                        alt={article.title} 
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{article.title}</h5>
                                        <p className="card-text abstract">{article.abstract}</p>
                                        <p className="card-text mt-auto">
                                            <small className="text-muted">Publicado: {new Date(article.created_at).toLocaleDateString()}</small>
                                        </p>
                                        {article.categories && article.categories.length > 0 && (
                                            <div className="mb-2">
                                                <h6>Categorías:</h6>
                                                <ul className="list-unstyled">
                                                    {article.categories.map((categoryId) => (
                                                        <li key={categoryId} className="badge bg-primary me-1">
                                                            {getCategoryName(categoryId)}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {article.tags && article.tags.length > 0 && (
                                            <div className="mb-2">
                                                <h6>Etiquetas:</h6>
                                                <ul className="list-unstyled">
                                                    {article.tags.map((tag) => (
                                                        <li key={tag} className="badge bg-secondary me-1">
                                                            {tag}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {article.reactions && article.reactions.length > 0 && (
                                            <div className="mb-2">
                                                <h6>Reacciones:</h6>
                                                <ul className="list-unstyled">
                                                    {article.reactions.map((reaction) => (
                                                        <li key={reaction} className="badge bg-success me-1">
                                                            {reaction}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        <a href={`/articles/${article.id}`} className="btn btn-primary mt-auto">
                                            Ver más
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-center">
                            {prevPage && (
                                <li className="page-item">
                                    <button className="page-link" onClick={handlePrevPage}>
                                        Página Anterior
                                    </button>
                                </li>
                            )}
                            {nextPage && (
                                <li className="page-item">
                                    <button className="page-link" onClick={handleNextPage}>
                                        Página Siguiente
                                    </button>
                                </li>
                            )}
                        </ul>
                    </nav>
                </>
            )}
        </div>
    );
};

export default Articulos;