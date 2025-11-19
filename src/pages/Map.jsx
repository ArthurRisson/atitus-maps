import { useEffect, useState } from "react";
import { Navbar } from "../components";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api"; // Importando InfoWindow
import { getPoints, postPoint } from '../services/mapService';
import { useAuth } from "../contexts/AuthContext";
import iconConsulta from "../assets/icon-consulta.png"; 

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -23.55052,
  lng: -46.633308,
};

export const Map = () => {
  const { token } = useAuth();
  const [markers, setMarkers] = useState([]);
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempPosition, setTempPosition] = useState(null);
  const [newDescription, setNewDescription] = useState("");

  
  const [selectedMarker, setSelectedMarker] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    async function fetchMarkers() {
      try {
        const data = await getPoints(token);
        setMarkers(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    if (token) {
        fetchMarkers();
    }
  }, [token]);

  
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    setTempPosition({ latitude: lat, longitude: lng });
    setNewDescription(""); 
    setIsModalOpen(true);  
    setSelectedMarker(null); 
  };

  
  const handleConfirmAdd = async (e) => {
    e.preventDefault(); 

    if (!newDescription.trim()) return;

    const newPoint = {
      ...tempPosition,
      description: newDescription, 
    };

    try {
      const savedPoint = await postPoint(token, newPoint);

      const savedMarker = {
        id: savedPoint.id,
        title: savedPoint.description, 
        position: {
          lat: savedPoint.latitude,
          lng: savedPoint.longitude,
        },
      };
      setMarkers((prev) => [...prev, savedMarker]);
      
      
      setIsModalOpen(false);
      setTempPosition(null);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar />

      <div className="flex-1 relative w-full">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onClick={handleMapClick}
            options={{
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                styles: [
                    { featureType: "poi", elementType: "labels", stylers: [{HNvisibility: "off" }] }
                ]
            }}
          >
            {markers.map(marker => (
              <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
                onClick={() => setSelectedMarker(marker)} 
                animation={window.google.maps.Animation.DROP} 
                icon={{
                    url: iconConsulta, 
                    scaledSize: new window.google.maps.Size(40, 40),
                    anchor: new window.google.maps.Point(20, 40)
                }}
              />
            ))}

            
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)} 
              >
                <div className="p-2 min-w-[150px]">
                  <h3 className="font-bold text-gray-800 text-sm mb-1">Local de Consulta</h3>
                  <p className="text-gray-600 text-base">{selectedMarker.title}</p>
                </div>
              </InfoWindow>
            )}

          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full text-blue-800 font-semibold text-xl animate-pulse">
            Carregando mapa...
          </div>
        )}

       
        <div className="absolute top-4 left-4 bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-800 max-w-xs z-10 hidden sm:block">
            <h3 className="font-bold text-gray-800 mb-1">Adicionar Consulta</h3>
            <p className="text-sm text-gray-600">
                Clique no mapa para marcar um novo local de atendimento.
            </p>
        </div>

        
        {isModalOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md animate-fade-in">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Nova Consulta</h2>
              <p className="mb-4 text-gray-600">Digite o nome ou descrição para este local:</p>
              
              <form onSubmit={handleConfirmAdd}>
                <input
                  type="text"
                  autoFocus
                  className="w-full border-2 border-gray-300 rounded-md p-3 mb-6 focus:outline-none focus:border-blue-600 transition-colors"
                  placeholder="Ex: Unidade Central..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-800 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};