import { useState } from 'react';
import Link from 'next/link';
import QRScanner from '../components/QRScanner';
import MenuManagement from '../components/MenuManagement';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('scanner');

  const tabStyle = (isActive) => ({
    padding: '10px 20px',
    margin: '0 5px',
    backgroundColor: isActive ? '#007bff' : '#f8f9fa',
    color: isActive ? 'white' : '#333',
    border: '1px solid #ddd',
    borderRadius: '5px 5px 0 0',
    cursor: 'pointer',
    display: 'inline-block'
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Link href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
        ← Volver al inicio
      </Link>
      
      <h1>Panel de Administración</h1>

      {/* Pestañas */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('scanner')}
          style={tabStyle(activeTab === 'scanner')}
        >
          Escáner QR
        </button>
        <button
          onClick={() => setActiveTab('menus')}
          style={tabStyle(activeTab === 'menus')}
        >
          Gestión de Menús
        </button>
      </div>

      {/* Contenido de las pestañas */}
      {activeTab === 'scanner' && <QRScanner />}
      {activeTab === 'menus' && <MenuManagement />}
    </div>
  );
}