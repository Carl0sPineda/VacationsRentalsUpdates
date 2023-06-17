import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

export default function Properties() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchListing] = useState(null);
  const [searchBar, setSearchBar] = useState(" ");
  const [cantBedrooms, setCantBendrooms] = useState(0);
  const [cantBathrooms, setCantBathdrooms] = useState(0);
  const [priceRange, setPriceRange] = useState(0);
 
 

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc")
          // limit(8)
        );
        const querySnap = await getDocs(q);
        // const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        // setLastFetchListing(lastVisible);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listing");
      }
    }

    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="sm:mr-3 sm:ml-5 pt-4 space-y-6 mt-2">
      {/* <h1 className="text-3xl text-center mt-6 font-bold mb-2">Propiedades Disponibles</h1> */}

      <div className="flex md:flex-row space-y-2 md:space-y-0 md:space-x-10 justify-center sm: flex-col ml-2 mb-6">
        <div className="flex sm:flex space-x-8 justify-center">
        <div className="flex flex-col mt-2 md:flex-row md:items-center">
          <label className="text-lg text-center font-bold mr-4">
            Habitaciones
          </label>
          <div className="text-center">

          <select
            className="cursor-pointer text-sm text-gray-700
                 bg-white border border-gray-400 rounded transition
                  duration-400 ease-in-out focus:text-gray-700 
                  focus:bg-white focus:border-slate-400 w-40 md:w-32"
            onChange={(event) => {
              setCantBendrooms(event.target.value);
            }}
            style={{ borderRadius: 100 }}
          >
            <option value="">Sin filtro</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
          </div>
        </div>

        <div className="flex flex-col mt-2 md:flex-row md:items-center">
          <label className="text-lg text-center font-bold mr-4">
            Baños
          </label>
          <div className="text-center">
          <select
            className="cursor-pointer text-sm text-gray-700
            bg-white border border-gray-400 rounded transition
             duration-400 ease-in-out focus:text-gray-700 
             focus:bg-white focus:border-slate-400 w-40 md:w-32"
            onChange={(event) => {
              setCantBathdrooms(event.target.value);
            }}
            style={{ borderRadius: 100 }}
          >
            <option value="">Sin filtro</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
          </div>
        </div>
        </div>

        <div className="flex sm:flex space-x-8 justify-center">
        <div className="flex flex-col mt-2 md:flex-row md:items-center">
          <label className="text-lg text-center font-bold mr-4">
            Precio
          </label>

          <div className="text-center">
          <input
            type="number"
            step={10}
            placeholder="Filtrar $/Noche"
            onChange={(event) => {
              {
                setPriceRange(event.target.value);
              }
            }}
            className="cursor-pointer text-sm text-gray-700
            bg-white border border-gray-400 rounded transition
             duration-400 ease-in-out focus:text-gray-700 
             focus:bg-white focus:border-slate-400 w-40 md:w-32"
            style={{ borderRadius: 100 }}
          ></input>
          </div>
        </div>

        <div className="flex flex-col mt-2 md:flex-row md:items-center">
          <label className="text-lg text-center font-bold mr-4">
            Ubicación
          </label>
          <div className="text-center">
          <input
            type="text"
            placeholder="Filtrar Ubicación"
            onChange={(event) => {
              setSearchBar(event.target.value);
            }}
            className="cursor-pointer text-sm text-gray-700
            bg-white border border-gray-400 rounded transition
             duration-400 ease-in-out focus:text-gray-700 
             focus:bg-white focus:border-slate-400 w-40 md:w-32"
            style={{ borderRadius: 100 }}
          ></input>
          </div>
        </div>

        </div>
      </div>

      {listings && listings.length > 0 ? (
        <>
          <main>
            {listings
              .filter((listing) => {
                //Se filtra por el numero de habitacions, ubicacion, precio

                if (
                  cantBedrooms == 0 &&
                  priceRange == 0 &&
                  cantBathrooms == 0
                ) {
                  //filtra unicamente por ubicacion

                  return listing.data.address
                    .toLowerCase()
                    .includes(searchBar.toLowerCase());
                } else if (cantBedrooms == 0 && cantBathrooms == 0) {
                  //filtra por precio o  ubicacion-precio
                  return (
                    parseInt(listing.data.regularPrice) <= priceRange &&
                    listing.data.address
                      .toLowerCase()
                      .includes(searchBar.toLowerCase())
                  );
                } else if (priceRange == 0 && cantBathrooms == 0) {
                  //filtra por habitacion o ubicacion-habitacion

                  return (
                    listing.data.address
                      .toLowerCase()
                      .includes(searchBar.toLowerCase()) &&
                    listing.data.bedrooms == cantBedrooms
                  );
                } else if (cantBedrooms == 0 && priceRange == 0) {
                  //filtra por baños o ubicacion-baños

                  return (
                    listing.data.bathroms == cantBathrooms &&
                    listing.data.address
                      .toLowerCase()
                      .includes(searchBar.toLowerCase())
                  );
                } else if (priceRange == 0) {
                  //filtra por habitaciones-baños o ubicacion-habitaciones-baños

                  return (
                    listing.data.bedrooms == cantBedrooms &&
                    listing.data.bathroms == cantBathrooms &&
                    listing.data.address
                      .toLowerCase()
                      .includes(searchBar.toLowerCase())
                  );
                } else if (cantBathrooms == 0) {
                  //filtra por habitacions-precios o ubicacion-habitaciones-precios
                  return (
                    listing.data.bedrooms == cantBedrooms &&
                    parseInt(listing.data.regularPrice) <= priceRange &&
                    listing.data.address
                      .toLowerCase()
                      .includes(searchBar.toLowerCase())
                  );
                } else if (cantBedrooms == 0) {
                  //filtrar por banos-precio o ubicacion-banos-precio

                  return (
                    listing.data.bathroms == cantBathrooms &&
                    parseInt(listing.data.regularPrice) <= priceRange &&
                    listing.data.address
                      .toLowerCase()
                      .includes(searchBar.toLowerCase())
                  );
                } else {
                  //filtra por todas las categorias
                  return (
                    listing.data.address
                      .toLowerCase()
                      .includes(searchBar.toLowerCase()) &&
                    cantBedrooms == listing.data.bedrooms &&
                    parseInt(listing.data.regularPrice) <= priceRange &&
                    listing.data.bathroms == cantBathrooms
                  );
                }
              })
              .map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              )).length > 0 ? ( //verifica que existan propiedades con los filtros ingresados
              <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {listings
                  .filter((listing) => {
                    //Se filtra por el numero de habitacions, ubicacion, precio

                    if (
                      cantBedrooms == 0 &&
                      priceRange == 0 &&
                      cantBathrooms == 0
                    ) {
                      //filtra unicamente por ubicacion

                      return listing.data.address
                        .toLowerCase()
                        .includes(searchBar.toLowerCase());
                    } else if (cantBedrooms == 0 && cantBathrooms == 0) {
                      //filtra por precio o  ubicacion-precio
                      return (
                        parseInt(listing.data.regularPrice) <= priceRange &&
                        listing.data.address
                          .toLowerCase()
                          .includes(searchBar.toLowerCase())
                      );
                    } else if (priceRange == 0 && cantBathrooms == 0) {
                      //filtra por habitacion o ubicacion-habitacion

                      return (
                        listing.data.address
                          .toLowerCase()
                          .includes(searchBar.toLowerCase()) &&
                        listing.data.bedrooms == cantBedrooms
                      );
                    } else if (cantBedrooms == 0 && priceRange == 0) {
                      //filtra por baños o ubicacion-baños

                      return (
                        listing.data.bathroms == cantBathrooms &&
                        listing.data.address
                          .toLowerCase()
                          .includes(searchBar.toLowerCase())
                      );
                    } else if (priceRange == 0) {
                      //filtra por habitaciones-baños o ubicacion-habitaciones-baños

                      return (
                        listing.data.bedrooms == cantBedrooms &&
                        listing.data.bathroms == cantBathrooms &&
                        listing.data.address
                          .toLowerCase()
                          .includes(searchBar.toLowerCase())
                      );
                    } else if (cantBathrooms == 0) {
                      //filtra por habitacions-precios o ubicacion-habitaciones-precios
                      return (
                        listing.data.bedrooms == cantBedrooms &&
                        parseInt(listing.data.regularPrice) <= priceRange &&
                        listing.data.address
                          .toLowerCase()
                          .includes(searchBar.toLowerCase())
                      );
                    } else if (cantBedrooms == 0) {
                      //filtrar por banos-precio o ubicacion-banos-precio

                      return (
                        listing.data.bathroms == cantBathrooms &&
                        parseInt(listing.data.regularPrice) <= priceRange &&
                        listing.data.address
                          .toLowerCase()
                          .includes(searchBar.toLowerCase())
                      );
                    } else {
                      //filtra por todas las categorias
                      return (
                        listing.data.address
                          .toLowerCase()
                          .includes(searchBar.toLowerCase()) &&
                        cantBedrooms == listing.data.bedrooms &&
                        parseInt(listing.data.regularPrice) <= priceRange &&
                        listing.data.bathroms == cantBathrooms
                      );
                    }
                  })
                  .map((listing) => (
                    <ListingItem
                      key={listing.id}
                      id={listing.id}
                      listing={listing.data}
                    />
                  ))}
              </ul>
            ) : (
              <p className="text-center mt-2  mb-2">
                No hay propiedades disponibles con las caracteristicas
                ingresadas
              </p>
            )}
          </main>
        </>
      ) : (
        <p>No se encuentran propiedades registradas actualmente</p>
      )}
    </div>
  );
}
