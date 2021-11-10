import React from "react";

const Modal = ({ id, handleDelete, title, content }) => {
  return (
    <React.Fragment>
      <div
        className="modal fade"
        id={`confirmationModal${id}`}
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
                className="btn btn-danger mx-1"
                onClick={handleDelete}
                data-bs-toggle="modal"
                data-bs-target="#confirmationModal"
              >
                <i className="fa fa-trash-o" aria-hidden="true"></i> Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Modal;
