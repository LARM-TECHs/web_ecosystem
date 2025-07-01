import { useEffect, useState } from "react";
import { apiService } from "../api/apiService";

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

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const data = await apiService.getAllMenus();
            setMenus(data);
        } catch (err) {
            console.error("Error fetching menus:", err);
        }
    };

    const handleInputChange = (e, isEditing = false) => {
        const { name, value } = e.target;

        if (isEditing) {
            setEditingMenu({ ...editingMenu, [name]: value });
        } else {
            setNewMenu({ ...newMenu, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const menuData = editingMenu || newMenu;

        if (!menuData.date) {
            alert('La fecha es requerida');
            return;
        }

        setLoading(true);
        try {
            await apiService.saveMenu(menuData);
            setNewMenu({ date: '', breakfast: '', lunch: '', dinner: '' });
            setEditingMenu(null);
            fetchMenus();
            alert('Menú guardado exitosamente');
        } catch (err) {
            console.error("Error saving menu:", err);
            alert('Error guardando menú');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (date) => {
        if (confirm('¿Estás seguro de que quieres eliminar este menú?')) {
            try {
                await apiService.deleteMenu(date);
                fetchMenus();
                alert('Menú eliminado exitosamente');
            } catch (err) {
                console.error("Error deleting menu:", err);
                alert('Error eliminando menú');
            }
        }
    };

    const handleEdit = (menu) => {
        setEditingMenu(menu);
        setNewMenu({ date: '', breakfast: '', lunch: '', dinner: '' });
    };

    const handleCancelEdit = () => {
        setEditingMenu(null);
        setNewMenu({ date: '', breakfast: '', lunch: '', dinner: '' });
    };

    const getCurrentDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const inputStyle = {
        width: '100%',
        padding: '8px',
        margin: '5px 0',
        border: '1px solid #ddd',
        borderRadius: '3px'
    };

    const currentMenu = editingMenu || newMenu;

    return (
        <div>
            <h2>Gestión de Menús</h2>

            {/* Formulario para crear/editar menú */}
            <form onSubmit={handleSubmit} style={{
                border: '1px solid #ddd',
                padding: '20px',
                marginBottom: '30px',
                borderRadius: '5px'
            }}>
                <h3>{editingMenu ? 'Editar Menú' : 'Crear Nuevo Menú'}</h3>

                <div>
                    <label>Fecha:</label>
                    <input
                        type="date"
                        name="date"
                        value={currentMenu.date}
                        onChange={(e) => handleInputChange(e, !!editingMenu)}
                        style={inputStyle}
                        min={getCurrentDate()}
                        required
                    />
                </div>

                <div>
                    <label>Desayuno:</label>
                    <textarea
                        name="breakfast"
                        value={currentMenu.breakfast || ''}
                        onChange={(e) => handleInputChange(e, !!editingMenu)}
                        style={{ ...inputStyle, height: '80px' }}
                        placeholder="Describe el menú del desayuno..."
                    />
                </div>

                <div>
                    <label>Almuerzo:</label>
                    <textarea
                        name="lunch"
                        value={currentMenu.lunch || ''}
                        onChange={(e) => handleInputChange(e, !!editingMenu)}
                        style={{ ...inputStyle, height: '80px' }}
                        placeholder="Describe el menú del almuerzo..."
                    />
                </div>

                <div>
                    <label>Cena:</label>
                    <textarea
                        name="dinner"
                        value={currentMenu.dinner || ''}
                        onChange={(e) => handleInputChange(e, !!editingMenu)}
                        style={{ ...inputStyle, height: '80px' }}
                        placeholder="Describe el menú de la cena..."
                    />
                </div>

                <div style={{ marginTop: '15px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: loading ? '#ccc' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginRight: '10px'
                        }}
                    >
                        {loading ? 'Guardando...' : (editingMenu ? 'Actualizar Menú' : 'Crear Menú')}
                    </button>

                    {editingMenu && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
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
            </form>

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
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '10px'
                                }}>
                                    <h4>📅 Menú del {menu.date}</h4>
                                    <div>
                                        <button
                                            onClick={() => handleEdit(menu)}
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
                                            onClick={() => handleDelete(menu.date)}
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

                                <div>
                                    <p><strong>🍳 Desayuno:</strong> {menu.breakfast || 'No especificado'}</p>
                                    <p><strong>🍽️ Almuerzo:</strong> {menu.lunch || 'No especificado'}</p>
                                    <p><strong>🌙 Cena:</strong> {menu.dinner || 'No especificado'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StaffMenu;