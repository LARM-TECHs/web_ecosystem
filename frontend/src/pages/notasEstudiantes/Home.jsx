import Layout from "../../components/notasEstudiantes/Layout";
// import LogoutButton from "../../components/notasEstudiantes/LogoutButton";
import { Link } from "react-router-dom";
import imagen from '../../assets/ult.png';

const Home = () => {
  return (
    <>
      <Layout />
      <div className="container mx-auto p-2 mt-5">
        <LogoutButton />
        <div className="d-flex flex-column-aling-items-center  col-4 mx-auto"><img src={imagen} /></div>
        <div className="d-flex flex-column-aling-items-center mt-5">
          
          <ul style={{ listStyleType: "none" }}>
            <li>
              <Link
                to="/home/facultades"
                className="text-decoration-none"
                href="#"
              >
                Gestionar Facultades
              </Link>
            </li>
            <li>
              <Link
                to="/home/asignaturas"
                className="text-decoration-none"
                href="#"
              >
                Gestionar Asignaturas
              </Link>
            </li>
            <li>
              <Link
                to="/home/carreras"
                className="text-decoration-none"
                href="#"
              >
                Gestionar Carreras
              </Link>
            </li>
            <li>
              <Link
                to="/home/brigadas"
                className="text-decoration-none"
                href="#"
              >
                Gestionar Brigadas
              </Link>
            </li>
            <li>
              <Link
                to="/home/estudiantes"
                className="text-decoration-none"
                href="#"
              >
                Gestionar Estudiantes
              </Link>
            </li>
          </ul>
          
          
        </div>
      </div>
    </>
  );
};

export default Home;
