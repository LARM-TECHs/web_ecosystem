import { useState, useEffect } from 'react';
import { apiService } from '../utils/api';

export default function MenuManagement() {
  const [menus, setMenus] = useState([]);
  const [editingMenu, setEditingMenu] = useState(null);
  const [newMenu, setNewMenu] = useState({
    date: '',
    breakfast: '',
    lunch: '',
    dinner: ''
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const data = await apiService.getMenus();
      setMenus(data);
    } catch (err) {
      console.error('Error fetching menus:', err);
    }
  };

  const handleSaveMenu = async (menuData) => {
    try {
      await apiService.saveMenu(menuData);
      fetchMenus();
      setNewMenu({ date: '', breakfast: '', lunch: '', dinner: '' });
      setEditingMenu(null);
      alert('Menú guardado exitosamente');
    } catch (err) {
      console.error('Error saving menu:', err);
      alert('Error guardando menú');
    }
  };

  const handleDeleteMenu = async (date) => {
    if (confirm('¿Estás seguro de que quieres eliminar este menú?')) {
      try {
        await apiService.deleteMenu(date);
        fetchMenus();
        alert('Menú eliminado exitosamente');
      } catch (err) {
        console.error('Error deleting menu:', err);
        alert('Error eliminando menú');
      }
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    margin: '5px 0',
    border: '1px solid #ddd',
    borderRadius: '3px'
  };

  return (
    <div>
      <h2>Gestión de Menús</h2>

      {/* Formulario para nuevo menú */}
      <div style={{ 
        border: '1px solid #ddd', 
        padding: '20px', 
        marginBottom: '30px', 
        borderRadius: '5px' 
      }}>
        <h3>Crear/Editar Menú</h3>
        <div>
          <label>Fecha:</label>
          <input
            type="date"
            value={editingMenu ? editingMenu.date : newMenu.date}
            onChange={(e) => {
              if (editingMenu) {
                setEditingMenu({ ...editingMenu, date: e.target.value });
              } else {
                setNewMenu({ ...newMenu, date: e.target.value });
              }
            }}
            style={inputStyle}
          />
        </div>
        <div>
          <label>Desayuno:</label>
          <textarea
            value={editingMenu ? editingMenu.breakfast || '' : newMenu.breakfast}
            onChange={(e) => {
              if (editingMenu) {
                setEditingMenu({ ...editingMenu, breakfast: e.target.value });
              } else {
                setNewMenu({ ...newMenu, breakfast: e.target.value });
              }
            }}
            style={{ ...inputStyle, height: '60px' }}
            placeholder="Describe el desayuno..."
          />
        </div>
        <div>
          <label>Almuerzo:</label>
          <textarea
            value={editingMenu ? editingMenu.lunch || '' : newMenu.lunch}
            onChange={(e) => {
              if (editingMenu) {
                setEditingMenu({ ...editingMenu, lunch: e.target.value });
              } else {
                setNewMenu({ ...newMenu, lunch: e.target.value });
              }
            }}
            style={{ ...inputStyle, height: '60px' }}
            placeholder="Describe el almuerzo..."
          />
        </div>
        <div>
          <label>Cena:</label>
          <textarea
            value={editingMenu ? editingMenu.dinner || '' : newMenu.dinner}
            onChange={(e) => {
              if (editingMenu) {
                setEditingMenu({ ...editingMenu, dinner: e.target.value });
              } else {
                setNewMenu({ ...newMenu, dinner: e.target.value });
              }
            }}
            style={{ ...inputStyle, height: '60px' }}
            placeholder="Describe la cena..."
          />
        </div>
        <div style={{ marginTop: '15px' }}>
          <button
            onClick={() => handleSaveMenu(editingMenu || newMenu)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            {editingMenu ? 'Actualizar Menú' : 'Crear Menú'}
          </button>
          {editingMenu && (
            <button
              onClick={() => {
                setEditingMenu(null);
                setNewMenu({ date: '', breakfast: '', lunch: '', dinner: '' });
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Lista de menús existentes */}
      <div>
        <h3>Menús Existentes</h3>
        {menus.length === 0 ? (
          <p>No hay menús registrados</p>
        ) : (
          <div>
            {menus.map((menu) => (
              <div key={menu.id} style={{
                border: '1px solid #ddd',
                padding: '15px',
                marginBottom: '15px',
                borderRadius: '5px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4>Menú del {menu.date}</h4>
                  <div>
                    <button
                      onClick={() => setEditingMenu(menu)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        marginRight: '5px'
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteMenu(menu.date)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <p><strong>Desayuno:</strong> {menu.breakfast || 'No especificado'}</p>
                  <p><strong>Almuerzo:</strong> {menu.lunch || 'No especificado'}</p>
                  <p><strong>Cena:</strong> {menu.dinner || 'No especificado'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}