import React from "react";
import { Link } from "react-router-dom";
// import Moment from "react-moment";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

export default function ListingItem({ listing, id, onEdit, onDelete }) {
  function truncarCadena(cadena) {
    let nuevaCadena = cadena;
    if (cadena.length > 60) {
      nuevaCadena = "";
      for (let i = 0; i < 60; i++) {
        nuevaCadena += cadena[i];
      }
      nuevaCadena += "...";
    }
    return nuevaCadena;
  }

  return (
    <>
      <li className="mr-1.5 ml-1.5">
        <Link className="contents" to={`/category/${listing.type}/${id}`}>
          <div className="property-card">
            <figure className="card-banner">
              <img
                loading="lazy"
                src={listing.imgUrls[0]}
                alt="propiedad"
                className="w-100"
              />
              <div className="card-badge green">Se Alquila</div>
              <div className="banner-actions">
                <button className="banner-actions-btn">
                  <ion-icon name="location"></ion-icon>
                  <address> {listing.address} </address>
                </button>
                <button className="banner-actions-btn">
                  <ion-icon name="camera"></ion-icon>
                  <span>{listing.imgUrls.length}</span>
                </button>
              </div>
            </figure>
            <div className="card-content">
              <div className="card-price">
                <strong>${listing.regularPrice}</strong>/Noche
              </div>

              <p className="card-text">{truncarCadena(listing.description)}</p>
              <ul className="card-list">
                <li className="card-item">
                  <strong>{listing.bedrooms}</strong>

                  <ion-icon name="bed-outline"></ion-icon>
                  <span>Habitaciones</span>
                </li>
                <li className="card-item">
                  <strong>{listing.bathroms}</strong>
                  <ion-icon name="man-outline"></ion-icon>
                  <span>Baños</span>
                </li>
              </ul>
            </div>
          </div>
        </Link>
        <div className="card-footer">
          <div className="card-footer-actions flex justify-center">
            {onDelete && (
              <FaTrash
                className="ml-[84px] cursor-pointer text-red-500"
                onClick={() => onDelete(listing.id)}
              />
            )}
            {onEdit && (
              <MdEdit
                className="cursor-pointer  text-blue-900"
                onClick={() => onEdit(listing.id)}
              />
            )}
          </div>
        </div>
      </li>
    </>
  );
}
