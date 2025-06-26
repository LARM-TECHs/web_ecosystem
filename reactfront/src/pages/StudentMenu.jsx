import { useEffect, useState } from "react";
import { apiService } from "../api/axios";

function StudentMenu() {
  const [menu, setMenu] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodayMenu();
  }, []);

  const fetchTodayMenu = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTodayMenu();
      setMenu(data);
      setSelectedDate(today);
    } catch (err) {
      console.error("Error:", err);
      setError("Error al cargar el menú");
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuByDate = async (date) => {
    if (!date) return;
    
    try {
      setLoading(true);
      const data = await apiService.getMenuByDate(date);
      setMenu(data);
    } catch (err) {
      console.error("Error:", err);
      setError("Error al cargar el menú para la fecha seleccionada");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (date === today) {
      fetchTodayMenu();
    } else {
      fetchMenuByDate(date);
    }
  };

  const inputStyle = {
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "3px",
    marginLeft: "10px"
  };

  const menuItemStyle = {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #dee2e6"
  };

  if (loading) {
    return (
      <div>
        <h2>Menú del Comedor</h2>
        <p>Cargando menú...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Menú del Comedor</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="date-picker">Seleccionar fecha:</label>
        <input
          id="date-picker"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          style={inputStyle}
        />
        {selectedDate === today && (
          <span style={{ marginLeft: "10px", color: "#28a745", fontWeight: "bold" }}>
            (Hoy)
          </span>
        )}
      </div>

      {error && (
        <div style={{ color: "red", padding: "10px", backgroundColor: "#ffe6e6", borderRadius: "3px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {menu && (
        <div>
          <h3>Menú para el {menu.date}</h3>
          
          <div style={menuItemStyle}>
            <h4>🌅 Desayuno</h4>
            <p>{menu.breakfast || "No disponible"}</p>
          </div>

          <div style={menuItemStyle}>
            <h4>🍽️ Almuerzo</h4>
            <p>{menu.lunch || "No disponible"}</p>
          </div>

          <div style={menuItemStyle}>
            <h4>🌙 Cena</h4>
            <p>{menu.dinner || "No disponible"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentMenu;