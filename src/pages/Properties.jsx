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
  const [width, setWidth] = useState(0);
  const inputBed = useRef(null);
  const inputBath = useRef(null);
  const inputPrice = useRef(null);
  const inputSearch = useRef(null);

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

  // async function onFetchMoreListings() {
  //   try {
  //     const listingRef = collection(db, "listings");
  //     const q = query(
  //       listingRef,
  //       where("type", "==", "rent"),
  //       orderBy("timestamp", "desc"),
  //       startAfter(lastFetchedListing),
  //       limit(4)
  //     );
  //     const querySnap = await getDocs(q);
  //     const lastVisible = querySnap.docs[querySnap.docs.length - 1];
  //     setLastFetchListing(lastVisible);
  //     const listings = [];
  //     querySnap.forEach((doc) => {
  //       return listings.push({
  //         id: doc.id,
  //         data: doc.data(),
  //       });
  //     });
  //     setListings((prevState)=>[...prevState, ...listings]);
  //     setLoading(false);
  //   } catch (error) {
  //     toast.error("Could not fetch listing");
  //   }
  // }

  return (
    <div className="sm:mr-3 sm:ml-5 pt-4 space-y-6 mt-8">
      {/* <h1 className="text-3xl text-center mt-6 font-bold mb-2">Propiedades Disponibles</h1> */}

      <div className="flex md:flex-row space-y-10 md:space-y-0 md:space-x-10 justify-center sm: flex-col ml-6 mb-6">
        <div>
          <label className="text-lg text-center mt-6 font-bold mb-2 mr-4 sm:mb-10">
            Habitaciones
          </label>
          <select
            className="cursor-pointer w-small text-sm text-gray-700
                 bg-white border border-gray-400 rounded transition
                  duration-400 ease-in-out focus:text-gray-700 
                  focus:bg-white focus:border-slate-400"
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

        <div>
          <label className="text-lg text-center mt-6 font-bold mb-2 mr-4">
            Baños
          </label>
          <select
            className="cursor-pointer w-small text-sm text-gray-700
                 bg-white border border-gray-400 rounded transition
                  duration-400 ease-in-out focus:text-gray-700 
                  focus:bg-white focus:border-slate-400"
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

        <div>
          <label className="text-lg text-center mt-6 font-bold mb-2 mr-4">
            Precio
          </label>
          <input
            type="number"
            step={10}
            placeholder="Filtrar por precio"
            onChange={(event) => {
              {
                setPriceRange(event.target.value);
              }
            }}
            className="w-small text-sm text-gray-700
          bg-white border border-gray-400 rounded transition
          duration-400 ease-in-out focus:text-gray-700 
          focus:bg-white focus:border-slate-400"
            style={{ borderRadius: 100 }}
          ></input>
        </div>

        <div>
          <label className="text-lg text-center mt-6 font-bold mb-2 mr-4">
            Ubicación
          </label>
          <input
            type="text"
            placeholder="Filtrar por ubicación"
            onChange={(event) => {
              setSearchBar(event.target.value);
            }}
            className="w-small px-4 py-2 text-sm text-gray-700
          bg-white border border-gray-400 rounded transition
          duration-400 ease-in-out focus:text-gray-700 
          focus:bg-white focus:border-slate-400"
            style={{ borderRadius: 100 }}
          ></input>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
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

          {/* {lastFetchedListing && (
            <div className="flex justify-center items-center">
              <button
                onClick={onFetchMoreListings}
                className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
              >
                Load more
              </button>
            </div>
          )} */}
        </>
      ) : (
        <p>No se encuentran propiedades registradas actualmente</p>
      )}
    </div>
  );
}
