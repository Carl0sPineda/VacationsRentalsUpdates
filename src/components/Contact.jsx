import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import { db } from "../firebase";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Contact({ userRef, listing }) {
  const [landlord, setLandlord] = useState(null);
  const currentURL = window.location.href;

  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Error con el formulario de contacto");
      }
    }
    getLandlord();
  }, [userRef]);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const templateParams = {
      user_name: values.name,
      user_email: values.email,
      message: `Nombre: ${values.name}\nEmail: ${values.email}\nTelefono: ${values.phone}\nCantidad de personas: ${values.persons}\nFecha inicio: ${values.startDate}\nFecha fin: ${values.endDate}\n\nPropiedad solicitada: ${currentURL}`,
    };
    emailjs
      .send(
        import.meta.env.VITE_SERVICE_EMAILJS,
        import.meta.env.VITE_TEMPLATE_EMAILJS,
        templateParams,
        import.meta.env.VITE_PUBLIC_KEY_EMAILJS
      )
      .then((result) => {
        // console.log(result.text);
      })
      .catch((error) => {
        // console.log(error.text);
      });
    Swal.fire({
      title: "Solicitud de reserva enviada",
      text: "Gracias por su interés. Nos pondremos en contacto con usted lo antes posible para confirmar su reserva.",
      icon: "success",
      confirmButtonText: "Aceptar",
    });

    setSubmitting(false);
    resetForm();
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es requerido"),
    email: Yup.string()
      .email("El correo electrónico es inválido")
      .required("El correo electrónico es requerido"),
    phone: Yup.string().required("El teléfono es requerido"),
    persons: Yup.number()
      .required("La cantidad de personas es requerida")
      .min(1, "La cantidad de personas debe ser mayor a 0"),
    startDate: Yup.date().required("La fecha de inicio es requerida"),
    endDate: Yup.date()
      .min(
        Yup.ref("startDate"),
        "La fecha de fin debe ser posterior a la fecha de inicio"
      )
      .required("La fecha de fin es requerida"),
  });

  return (
    <>
      {landlord !== null && (
        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            persons: "",
            startDate: "",
            endDate: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex flex-col w-full">
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-gray-700 font-bold mb-2"
              >
                Nombre
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-600"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                Correo electrónico
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-600"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-gray-700 font-bold mb-2"
              >
                Teléfono
              </label>
              <Field
                type="tel"
                name="phone"
                id="phone"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-red-600"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="persons"
                className="block text-gray-700 font-bold mb-2"
              >
                Cantidad de personas
              </label>
              <Field
                type="number"
                name="persons"
                id="persons"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
              />
              <ErrorMessage
                name="persons"
                component="div"
                className="text-red-600"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="startDate"
                className="block text-gray-700 font-bold mb-2"
              >
                Fecha de inicio
              </label>
              <Field
                type="date"
                name="startDate"
                id="startDate"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
              />
              <ErrorMessage
                name="startDate"
                component="div"
                className="text-red-600"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="endDate"
                className="block text-gray-700 font-bold mb-2"
              >
                Fecha de fin
              </label>
              <Field
                type="date"
                name="endDate"
                id="endDate"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
              />
              <ErrorMessage
                name="endDate"
                component="div"
                className="text-red-600"
              />
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full px-6 py-3 font-bold text-center text-white bg-slate-600 rounded hover:bg-slate-500 focus:outline-none focus:shadow-outline-slate active:bg-slate-700"
              >
                Enviar
              </button>
            </div>
          </Form>
        </Formik>
      )}
    </>
  );
}
