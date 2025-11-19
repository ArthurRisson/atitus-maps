import "./navbar.css";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export function Navbar() {
    const { logout, user } = useAuth();

    return (
        <nav className="bg-blue-800 text-white shadow-md px-6 py-3 flex justify-between items-center w-full">
            
            {/* Lado Esquerdo: Agrupamos Logo, Título e a Mensagem */}
            <div className="flex items-center gap-4">
                {/* Logo */}
                <img 
                    src={logo} 
                    alt="Logo Mais Consultas" 
                    className="h-10 w-auto bg-white rounded-md p-1 shadow-sm" 
                />
                
                

                {/* Mensagem de boas-vindas na mesma linha */}
                {user?.name && (
                    <span className="hidden md:inline-block text-sm text-blue-200 whitespace-nowrap ml-2 border-l border-blue-600 pl-4">
                        Bem-vindo de volta, <span className="font-bold text-white">{user.name}</span>
                    </span>
                )}
            </div>

            {/* Lado Direito: Apenas o botão Sair */}
            <button 
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors text-sm font-semibold shadow-sm whitespace-nowrap"
            >
                Sair
            </button>
        </nav>
    );
}