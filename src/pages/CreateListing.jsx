// npm i leaflet-control-geocoder 
// npm i leaflet-fullscreen
// import "leaflet/dist/leaflet.css"; importar en listing tambien
// borrar las importaciones de leaflet en el index.html

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Spinner from '../components/Spinner'
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid'
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from 'react-router-dom';
import L from "leaflet";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css"; 
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import 'leaflet-fullscreen';

export default function CreateListing() {
  const navigate = useNavigate()
  const auth = getAuth()
  // const [geolocationEnabled, setLocationEnabled] = useState(true)
  const [geolocation, setGeolocation] = useState({ lat: 10.36402678444531, lng: -85.3908877959475 });
  // const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState([])
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathroms: 1,
    parking: false,
    furnished: false,
    address: '',
    description: '',
    offer: false,
    regularPrice: 0,
    highPrice: 0,
    premiunPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {}
  })

  const { type, name, bedrooms, bathroms, parking, furnished, address, description, offer, regularPrice, highPrice, premiunPrice, discountedPrice, latitude, longitude, images } = formData

  useEffect(() => {
    const map = L.map("mapid").setView([geolocation.lat, geolocation.lng], 10);

    const osmLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "OpenStreetMap contributors",
      }
    );

    const esriLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Esri",
      }
    );

    osmLayer.addTo(map);

    const baseLayers = {
      "Por defecto": osmLayer,
      Satelite: esriLayer,
      // Dark: darkLayer,
      // OpenTopoMap: layer2,
      // "Thunderforest Cycle": layer3,
      // "Esri Street Map": layer4,
    };

    const marker = L.marker([geolocation.lat, geolocation.lng], {
      draggable: true,
    }).addTo(map);

    marker.on("dragend", async function (e) {
      const { lat, lng } = e.target.getLatLng();
      setGeolocation({ lat, lng });

      setFormData((prevState) => ({
        ...prevState,
        latitude: lat,
        longitude: lng
      }));

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );

      const data = await response.json();
      const address = data?.display_name ?? "";
      //   setAddress(address);
    });

    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
    }).on("markgeocode", function (e) {
      const { center } = e.geocode;
      marker.setLatLng(center);
      map.setView(center, 16);
    }).addTo(map);

    // L.control
    //   .zoom({
    //     position: "topright",
    //   })
    //   .addTo(map);

    L.control
      .scale({
        position: "bottomright",
      })
      .addTo(map);

    L.control.fullscreen({
       position: "topleft",
     }).addTo(map);

    L.control.layers(baseLayers).addTo(map);

    // Clean up function to remove the map and marker when the component unmounts
    return () => {
      map.remove();
    };
  }, []); // Empty array to run the effect only once


  function onChange(e) {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }
    //files
    if (e.target.files) {
      setSelectedImage(e.target.files); //Used for preview the image before upload files[0]

      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))

    }
    //text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value
      }))
    }
  }

  function uploadMultipleFiles(e) {
    fileObj.push(setSelectedImage(e.target.files[0]))
    for (let i = 0; i < fileObj[0].length; i++) {
      fileArray.push(URL.createObjectURL(fileObj[0][i]))
    }
  }

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImage = () => {
    setSelectedImage();
  };

  async function onSubmit(e) {
    e.preventDefault()
    // alert(URL.createObjectURL(selectedImage))//new
    setLoading(true)

    if (images.length > 6) {
      setLoading(false)
      toast.error('Maximun 6 images are allowed')
      return
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
        const storageRef = ref(storage, filename)
        const uploadTask = uploadBytesResumable(storageRef, image)
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            // console.log("Upload is " + progress + "% done");
            setProgress(progress);
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      })
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid
    }
    delete formDataCopy.images
    !formDataCopy.offer && delete formDataCopy.discountedPrice
    delete formDataCopy.latitude
    delete formDataCopy.longitude
    console.log(formDataCopy);
    const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
    setLoading(false)
    toast.success('Propiedad agregada!')
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }

  // if (loading) {
  //   return <Spinner />
  // }

  return (
    <main className='max-w-md px-2 mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl'>
      <h1 className='text-3xl text-center mt-6
        font-bold'>Formulario agregar propiedades</h1>
      <form onSubmit={onSubmit}>
        <p className='text-lg mt-6 font-semibold'>Dirección</p>
        <input type="text" id='address' value={address} onChange={onChange}
          placeholder='Ejm: Liberia, Guanacaste' maxLength='32' minLength='5' required
          className='w-full px-4 py-2 text-xl text-gray-700
            bg-white border border-gray-300 rounded transition
            duration-150 ease-in-out focus:text-gray-700 
            focus:bg-white focus:border-slate-600 mb-6'/>

        <div className='flex space-x-6 mb-6'>
          <div>
            <p className='text-lg font-semibold'>Camas</p>
            <input type="number" id='bedrooms' value={bedrooms}
              onChange={onChange} min='1' max='50' required
              className='w-full px-4 py-2 text-xl text-gray-700
                    bg-white border border-gray-300 rounded 
                    transition duration-150 ease-in-out
                    focus:text-gray-700 focus:bg-white 
                    focus:border-slate-600 text-center'/>
          </div>
          <div>
            <p className='text-lg font-semibold'>Baños</p>
            <input type="number" id='bathroms' value={bathroms}
              onChange={onChange} min='1' max='50' required
              className='w-full px-4 py-2 text-xl text-gray-700
                    bg-white border border-gray-300 rounded 
                    transition duration-150 ease-in-out
                    focus:text-gray-700 focus:bg-white 
                    focus:border-slate-600 text-center'/>
          </div>
        </div>

        <p className='text-lg font-semibold'>Descripción</p>
        <textarea type="text" id='description' value={description} onChange={onChange}
          placeholder='Maximo 300 caracteres' required maxLength='300'
          className='w-full px-4 py-2 text-xl text-gray-700
            bg-white border border-gray-300 rounded transition
            duration-150 ease-in-out focus:text-gray-700 
            focus:bg-white focus:border-slate-600 mb-6'/>

        <div className='flex items-center mb-6'>
          <div className=''>
            <p className='text-lg font-semibold'>Precio temporada baja</p>
            <div className='flex w-full justify-center items-center
                space-x-6'>
              <input type="number" id='regularPrice'
                value={regularPrice} onChange={onChange} min='50'
                max='400000000' required className='w-full px-4
                    py-2 text-xl text-gray-700 bg-white border
                    border-gray-300 rounded transition duration-150
                    ease-in-out focus:text-gray-700 focus:bg-white
                    focus:border-slate-600 text-center'/>

              {type === 'rent' && (
                <div className=''>
                  <p className='text-md w-full
                        whitespace-nowrap'>$ / Noche</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='flex items-center mb-6'>
          <div className=''>
            <p className='text-lg font-semibold'>Precio temporada alta</p>
            <div className='flex w-full justify-center items-center
                space-x-6'>
              <input type="number" id='highPrice'
                value={highPrice} onChange={onChange} min='50'
                max='400000000' required className='w-full px-4
                    py-2 text-xl text-gray-700 bg-white border
                    border-gray-300 rounded transition duration-150
                    ease-in-out focus:text-gray-700 focus:bg-white
                    focus:border-slate-600 text-center'/>

              {type === 'rent' && (
                <div className=''>
                  <p className='text-md w-full
                        whitespace-nowrap'>$ / Noche</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='flex items-center mb-6'>
          <div className=''>
            <p className='text-lg font-semibold'>Precio temporada premiun</p>
            <div className='flex w-full justify-center items-center
                space-x-6'>
              <input type="number" id='premiunPrice'
                value={premiunPrice} onChange={onChange} min='50'
                max='400000000' required className='w-full px-4
                    py-2 text-xl text-gray-700 bg-white border
                    border-gray-300 rounded transition duration-150
                    ease-in-out focus:text-gray-700 focus:bg-white
                    focus:border-slate-600 text-center'/>

              {type === 'rent' && (
                <div className=''>
                  <p className='text-md w-full
                        whitespace-nowrap'>$ / Noche</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='mb-6'>
          <p className='text-lg font-semibold'>Imagenes</p>
          <p className='text-gray-600'>La primera será la portada (max 6)</p>
          <input type="file" id='images' onChange={onChange}
            accept='.jpg,.png,.jpeg'
            multiple
            required
            className='w-full px-3 py-1.5 text-gray-700
                bg-white border border-gray-300 rounded
                transition duration-150 ease-in-out
                focus:bg-white focus:border-slate-600'/>
          <div className="form-group multi-preview md:w-[100%] lg:w-[94%] mt-3  mb-12 md:mb-6" style={{ display: 'flex', flexWrap: 'nowrap' }}>
            <ul className="has-scrollbar">
              {selectedImage &&
                Array.from(selectedImage).map((image, index) => (
                  <img className='rounded-2xl' key={index} src={URL.createObjectURL(image)} alt={`Image ${index}`} style={{ maxWidth: '100%', height: '220px', marginRight: '10px' }} />
                ))
              }
            </ul>
          </div>
        </div>

        <div>
          <p className='text-lg font-semibold mb-2'>Seleccione una ubicación especifica</p>
          <div id="mapid" style={{ height: "400px" }}></div>
          {/* <p>Latitude: {geolocation.lat}</p>
          <p>Longitude: {geolocation.lng}</p> */}
          {/* <p>Address: {address}</p> */}
        </div>

        {
          loading && (
            <div className="mt-1 mb-1">
              <span className="font-bold text-cyan-700 text-lg">Subiendo... {progress}%</span>
              <progress
                className="bg-gray-300 w-full h-3 rounded-full overflow-hidden"
                value={progress}
                max="100"
              >
              </progress>
            </div>
          )
        }

        <button type='submit' className='mx-auto block mb-4 w-[400px] px-4 mt-4
            py-3 bg-slate-600 text-white font-bold text-sm
            uppercase rounded shadow-md hover:bg-slate-700
            hover:shadow-lg focus:bg-slate-700 focus:shadow-lg
            active:bg-slate-800 active:shadow-lg transition
            duration-150 ease-in-out text-center'>Guardar</button>

      </form>
    </main>
  )
}

