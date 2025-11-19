import "./navbar.css"; 
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.png"; 
import { Link } from "react-router-dom";

export function Navbar() {
    const { logout, user } = useAuth();

    return (
    
        <nav className="bg-blue-800 text-white shadow-md px-6 py-3 flex justify-between items-center w-full">
            
            
            <div className="flex items-center gap-4">
               
                <img 
                    src={logo} 
                    alt="Logo Mais Consultas" 
                    className="h-10 w-auto bg-white rounded-md p-1 shadow-sm" 
                />
                
                <Link to="/map" className="text-lg font-bold tracking-wide hover:text-blue-200 transition-colors">
                    Mais Consultas
                </Link>
            </div>

           
            <div className="flex items-center gap-4">
               
                <div className="hidden md:flex flex-col text-right text-sm leading-tight">
                    <span className="opacity-80 font-light">Bem-vindo de volta,</span>
                    <span className="font-bold text-base">{user?.name}</span>
                </div>
                
                <button 
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors text-sm font-semibold shadow-sm"
                >
                    Sair
                </button>
            </div>
        </nav>
    );
}