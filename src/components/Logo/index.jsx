import logoImg from "../../assets/logo.png"; 

export const Logo = ({ className = "" }) => {
  return (
    <img
      src={logoImg}
      alt="Logo Mais Consultas"
     
      className={`w-auto ${className}`}
    />
  );
};