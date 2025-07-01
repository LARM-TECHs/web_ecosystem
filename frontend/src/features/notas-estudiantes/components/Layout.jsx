import Navegador from "./Navegador";

// eslint-disable-next-line react/prop-types
export default function Layout({ children }) {
  return (
    <>
      <Navegador />
      <div className="mt-4">{children}</div>
    </>
  );
}
