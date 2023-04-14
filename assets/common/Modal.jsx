import React from "react"

const Modal = ({
    id,
    handleSubmit,
    title,
    content,
    action = "Confirmer",
    isValid = true,
}) => {
    return (
        <React.Fragment>
            <div
                className="modal fade"
                id={id}
                aria-labelledby="confirmationLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="confirmationLabel">
                                {title}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">{content}</div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-light"
                                data-bs-dismiss="modal"
                            >
                                Annuler
                            </button>
                            <button
                                className={
                                    "btn mx-1 " +
                                    (action === "Supprimer"
                                        ? "btn-danger"
                                        : "btn-primary")
                                }
                                onClick={handleSubmit}
                                data-bs-toggle={isValid ? "modal" : "null"}
                                data-bs-target={isValid ? `#${id}` : "null"}
                            >
                                <i
                                    className={
                                        "fa " +
                                        (action === "Supprimer"
                                            ? "fa-trash-o"
                                            : "fa-pencil")
                                    }
                                    aria-hidden="true"
                                ></i>{" "}
                                {action}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Modal
