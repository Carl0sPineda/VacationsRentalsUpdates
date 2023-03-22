import React from 'react'
import {Link} from 'react-router-dom'
import Moment from "react-moment";
import {MdLocationOn,MdEdit} from 'react-icons/md'
import {FaTrash} from 'react-icons/fa'

export default function ListingItem({listing,id,onEdit,onDelete}) {
 
  function limitText(text) {
    const words = text.split(' ');
    if (words.length > 15) {
      return words.slice(0, 15).join(' ') + '...';
    }
    return text;
  }
  
  return (
    <>
<li className="mr-1.5 ml-1.5">
  <Link className="contents" to={`/category/${listing.type}/${id}`}>
    <div className="property-card">
      <figure className="card-banner">
        {/* <a href="#"> */}
        <img
          loading="lazy"
          src={listing.imgUrls[0]}
          alt="propiedad"
          className="w-100"
        />
        {/* </a> */}
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
        {/* <h3 className="h3 card-title">
          <a href="#">Posee increibles vistas</a>
        </h3> */}
        <p className="card-text">{limitText(listing.description)}</p>
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
          {/* <li className="card-item">
              <strong>1500</strong>
              <ion-icon name="square-outline"></ion-icon>
              <span>m2</span>
            </li> */}
        </ul>
      </div>
    </div>
  </Link>
        <div className="card-footer">
          <div className="card-footer-actions">
            {onDelete && (
              <FaTrash
              className=" right-2 h-[14px] cursor-pointer text-red-500"
                onClick={() => onDelete(listing.id)}
              />
            )}
            {onEdit && (
              <MdEdit
              className=" bottom-2 right-7 h-4 cursor-pointer "
                onClick={() => onEdit(listing.id)}
              />
            )}
          </div>
        </div>
    </li>
    </>
  )
}
