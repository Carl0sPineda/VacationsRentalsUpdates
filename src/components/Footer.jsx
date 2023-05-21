export default function Footer() {
  const date = new Date(); // crea un objeto Date con la fecha actual
  const year = date.getFullYear(); // obtiene el año actual del objeto Date

  return (
    <div>
      <footer className="footer">
        <div className="footer-bottom">
          <div className="container">
            <p className="copyright ">
              &copy; VACATIONS RENTALS COSTA RICA {year}. TODOS LOS DERECHOS
              RESERVADOS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
