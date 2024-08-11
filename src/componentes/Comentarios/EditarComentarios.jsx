import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const EditarComentario = ({ commentId, articleId, onEditSuccess, initialContent }) => {
    const { auth } = useContext(AuthContext);
    const [content, setContent] = useState(initialContent || "");

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/infosphere/comments/${commentId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${auth.token}`,
                },
                body: JSON.stringify({
                    content,
                    article: articleId,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al editar el comentario");
            }

            const updatedComment = await response.json();
            onEditSuccess(updatedComment);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleEdit}>
            <div className="mb-3">
                <textarea
                    className="form-control"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">Guardar</button>
        </form>
    );
};

export default EditarComentario;