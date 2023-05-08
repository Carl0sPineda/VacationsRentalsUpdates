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
      .then((result) => {})
      .catch((error) => {
        toast.error("Ha ocurrido un error.");
      });
    toast.success(
      "Solicitud de reserva enviada, nos pondremos en contacto mediante su email para la confirmación."
    );
    // Swal.fire({
    //   title: "Solicitud de reserva enviada",
    //   text: "Gracias por su interés. Nos pondremos en contacto con usted lo antes posible para confirmar su reserva.",
    //   icon: "success",
    //   confirmButtonText: "Aceptar",
    // });

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
      .min(1, "Debe ser ser mayor a 0"),
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
          <Form className="w-full max-w-lg ">
            <div className="flex flex-wrap -mx-3 mb-6">
              <h1 className="ml-3 mt-4 mb-2 text-3xl font-bold text-teal-700">
                Solicitud de reserva
              </h1>
              <div className="w-full md:w-1.5/2 px-3 mb-4">
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className=" block w-full text-gray-700 border-b-1 border-b-gray-700    placeholder-gray-700  leading-tight  bg-transparent py-3 px-4 focus:ring-0    "
                  placeholder="Nombre completo"
                />
                <ErrorMessage
                  name="name"
                  component="span"
                  className="text-red-600 font-semibold text-sm"
                />
              </div>

              <div className="w-full md:w-1.5/2 px-3 mb-4">
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className=" block w-full text-gray-700 border-b-1 border-b-gray-700  placeholder-gray-700  leading-tight  bg-transparent py-3 px-4 focus:ring-0    "
                  placeholder="Email"
                />
                <ErrorMessage
                  name="email"
                  component="span"
                  className="text-red-600 font-semibold text-sm mt-0"
                />
              </div>

              <div className="w-full md:w-1/2 px-3 mb-4">
                <Field
                  type="tel"
                  name="phone"
                  id="phone"
                  className=" block w-full text-gray-700 border-b-1 border-b-gray-700  placeholder-gray-700  bg-transparent py-3 px-4 focus:ring-0  "
                  placeholder="Teléfono"
                />
                <ErrorMessage
                  name="phone"
                  component="span"
                  className="text-red-600 font-semibold text-sm"
                />
              </div>

              <div className="w-full md:w-1/2 px-3 mb-4">
                <Field
                  type="number"
                  name="persons"
                  placeholder="Cantidad de personas"
                  id="persons"
                  className=" block w-full text-gray-700 border-b-1 border-b-gray-700  placeholder-gray-700  bg-transparent py-3 px-4 focus:ring-0  "
                />
                <ErrorMessage
                  name="persons"
                  component="span"
                  className="text-red-600 font-semibold text-sm"
                />
              </div>

              <div className="w-full md:w-1/2 px-3 mb-4">
                <label htmlFor="startDate" className=" text-gray-800">
                  Fecha de inicio
                </label>
                <Field
                  type="date"
                  name="startDate"
                  id="startDate"
                  className="mt-1 block w-full text-gray-700 border-b-1 border-b-gray-700  placeholder-gray-700  bg-transparent py-3 px-4 focus:ring-0  "
                />
                <ErrorMessage
                  name="startDate"
                  component="span"
                  className="text-red-600 font-semibold text-sm"
                />
              </div>

              <div className="w-full md:w-1/2 px-3 mb-4">
                <label htmlFor="endDate" className=" text-gray-800">
                  Fecha de fin
                </label>
                <Field
                  type="date"
                  name="endDate"
                  id="endDate"
                  className="mt-1 block w-full text-gray-700 border-b-1 border-b-gray-700  placeholder-gray-700  bg-transparent py-3 px-4 focus:ring-0  "
                />
                <ErrorMessage
                  name="endDate"
                  component="span"
                  className="text-red-600 font-semibold text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-[300] ml-3 mb-4 px-3 py-2 font-bold text-center text-white bg-[#078169] rounded hover:bg-[#568577] focus:outline-none focus:shadow-outline-slate active:bg-slate-700"
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
