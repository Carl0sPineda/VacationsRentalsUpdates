import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../firebase";

export default function Contact({ userRef, listing }) {
  const [landlord, setLandlord] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [persons, setPersons] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const currentURL = window.location.href 

  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could not get landlord data");
      }
    }
    getLandlord();
  }, [userRef]);
 
  return (
    <>
      {landlord !== null && (
        <div className="flex flex-col w-full">
          <div className="mb-6">
  <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
    Nombre
  </label>
  <input
    type="text"
    name="name"
    id="name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
  />
</div>

<div className="mb-6">
  <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
    Telefono
  </label>
  <input
    type="text"
    name="phone"
    id="phone"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
  />
</div>

<div className="mb-6">
  <label htmlFor="persons" className="block text-gray-700 font-bold mb-2">
    Cantidad de personas
  </label>
  <input
    type="text"
    name="persons"
    id="persons"
    value={persons}
    onChange={(e) => setPersons(e.target.value)}
    className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
  />
</div>

<div className="mb-6">
  <label htmlFor="startDate" className="block text-gray-700 font-bold mb-2">
    Fecha de inicio
  </label>
  <DatePicker
    name="startDate"
    id="startDate"
    selected={startDate}
    onChange={(date) => setStartDate(date)}
    className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
  />
</div>
<div className="mb-6">
  <label htmlFor="endDate" className="block text-gray-700 font-bold mb-2">
    Fecha de fin
  </label>
  <DatePicker
    name="endDate"
    id="endDate"
    selected={endDate}
    onChange={(date) => setEndDate(date)}
    className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
  />
</div>
<a href={`mailto:${landlord.email}?Subject=${listing.name}&body=Solicitud de reserva:%0A%0ANombre:%20${name}%0ATelefono: ${phone}%0ACantidad de personas:%20${persons}%0AFecha inicio: %20${startDate.toLocaleDateString("en-US")}%0AFecha fin: %20${endDate.toLocaleDateString("en-US")}%0A%0APropiedad solicitada:%20${currentURL}`} >

            <button className="px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full text-center mb-6" type="button">
              Enviar
            </button>
          </a>
        </div>
      )}
    </>
  );
}
