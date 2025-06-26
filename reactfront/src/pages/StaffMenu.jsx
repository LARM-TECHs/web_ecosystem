import { useEffect, useState } from "react";
import { apiService } from "../api/axios";

function StaffMenu() {
  const [menus, setMenus] = useState([]);
  const [editingMenu, setEditingMenu] = useState(null);
  const [newMenu, setNewMenu] = useState({
    date: '',
    breakfast: '',
    lunch: '',
    dinner: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllMenus();
      setMenus(data);
    } catch (err) {
      console.error("Error:", err);
      setError("Error al cargar los menús");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMenu = async (menuData) => {
    if (!menuData.date) {
      setError('La fecha es requerida');
      return;
    }

    try {
      setLoading(true);
      await apiService.createOrUpdateMenu(menuData);
      await fetchMenus();
      setNewMenu({ date: '', breakfast: '', lunch: '', dinner: '' });
      setEditingMenu(null);
      setError('');
      alert('Menú guardado exitosamente');
    } catch (err) {
      console.error("Error:", err);
      setError("Error al guardar el menú");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenu = async (date) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este menú?')) {
      try {
        await apiService.deleteMenu(date);
        await fetchMenus();
        alert('Menú eliminado exitosamente');
      } catch (err) {
        console.error("Error:", err);
        setError("Error al eliminar el menú");
      }
    }
  };

  const handleChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingMenu({ ...editingMenu, [name]: value });
    } else {
      setNewMenu({ ...newMenu, [name]: value });
    }
  };

  const startEdit = (menu) => {
    setEditingMenu({
      date: menu.date,
      breakfast: menu.breakfast || '',
      lunch: menu.lunch || '',
      dinner: menu.dinner || ''
    });
    setNewMenu({ date: '', breakfast: '', lunch: '', dinner: '' });
  };

  const cancelEdit = () => {
    setEditingMenu(null);
    setNewMenu({ date: '', breakfast: '', lunch: '', dinner: '' });
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    margin: "5px 0",
    border: "1px solid #ddd",
    borderRadius: "3px"
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "60px",
    resize: "vertical"
  };

  const buttonStyle = {
    padding: "8px 15px",
    margin: "5px",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer"
  };

  const currentMenu = editingMenu || newMenu;
  const isEditing = !!editingMenu;

  return (
    <div>
      <h2>Gestión de Menús del Comedor</h2>
      
      {error && (
        <div style={{
          color: "red",
          padding: "10px",
          backgroundColor: "#ffe6e6",
          borderRadius: "3px",
          marginBottom: "20px"
        }}>
          {error}
        </div>
      )}

      {/* Formulario para crear/editar menú */}
      <div style={{
        border: "1px solid #ddd",
        padding: "20px",
        marginBottom: "30px",
        borderRadius: "5px",
        backgroundColor: "#f8f9fa"
      }}>
        <h3>{isEditing ? 'Editar Menú' : 'Crear Nuevo Menú'}</h3>
        
        <div>
          <label>Fecha:</label>
          <input
            type="date"
            name="date"
            value={currentMenu.date}
            onChange={(e) => handleChange(e, isEditing)}
            style={inputStyle}
            disabled={isEditing} // No permitir cambiar fecha al editar
          />
        </div>

        <div>
          <label>Desayuno:</label>
          <textarea
            name="breakfast"
            value={currentMenu.breakfast}
            onChange={(e) => handleChange(e, isEditing)}
            placeholder="Describe el menú del desayuno..."
            style={textareaStyle}
          />
        </div>

        <div>
          <label>Almuerzo:</label>
          <textarea
            name="lunch"
            value={currentMenu.lunch}
            onChange={(e) => handleChange(e, isEditing)}
            placeholder="Describe el menú del almuerzo..."
            style={textareaStyle}
          />
        </div>

        <div>
          <label>Cena:</label>
          <textarea
            name="dinner"
            value={currentMenu.dinner}
            onChange={(e) => handleChange(e, isEditing)}
            placeholder="Describe el menú de la cena..."
            style={textareaStyle}
          />
        </div>

        <div style={{ marginTop: "15px" }}>
          <button
            onClick={() => handleSaveMenu(currentMenu)}
            disabled={loading}
            style={{
              ...buttonStyle,
              backgroundColor: loading ? "#ccc" : "#28a745",
              color: "white"
            }}
          >
            {loading ? "Guardando..." : (isEditing ? "Actualizar Menú" : "Crear Menú")}
          </button>
          
          {isEditing && (
            <button
              onClick={cancelEdit}
              style={{
                ...buttonStyle,
                backgroundColor: "#6c757d",
                color: "white"
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Lista de menús existentes */}
      <div>
        <h3>Menús Registrados</h3>
        {loading && menus.length === 0 ? (
          <p>Cargando menús...</p>
        ) : menus.length === 0 ? (
          <p>No hay menús registrados aún.</p>
        ) : (
          <div>
            {menus.map((menu) => (
              <div key={menu.id} style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "5px",
                backgroundColor: "white"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px"
                }}>
                  <h4>📅 Menú del {menu.date}</h4>
                  <div>
                    <button
                      onClick={() => startEdit(menu)}
                      style={{
                        ...buttonStyle,
                        backgroundColor: "#007bff",
                        color: "white"
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteMenu(menu.date)}
                      style={{
                        ...buttonStyle,
                        backgroundColor: "#dc3545",
                        color: "white"
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
                
                <div>
                  <p><strong>🌅 Desayuno:</strong> {menu.breakfast || "No especificado"}</p>
                  <p><strong>🍽️ Almuerzo:</strong> {menu.lunch || "No especificado"}</p>
                  <p><strong>🌙 Cena:</strong> {menu.dinner || "No especificado"}</p>
                </div>
                
                {menu.updated_at && (
                  <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
                    Última actualización: {new Date(menu.updated_at).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffMenu;