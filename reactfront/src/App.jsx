import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StaffMenu from "./pages/StaffMenu";
import QRScanner from "./pages/QRScanner";
import StudentMenu from "./pages/StudentMenu";
import StudentQRGenerator from "./pages/StudentQRGenerator";
import Navigation from "./components/Navigation";

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <Navigation />
      <div style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/staff/menu" element={<StaffMenu />} />
          <Route path="/staff/scan" element={<QRScanner />} />
          <Route path="/student/menu" element={<StudentMenu />} />
          <Route path="/student/qrcode" element={<StudentQRGenerator />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;