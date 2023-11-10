/* eslint-disable react/jsx-pascal-case */
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Driver_Profile from './components/driverProfile'; 
import Not_Found from './components/404';

function App() {
  return (
    <div className="App">
      <main className="content">
        <Router>
          <Routes>
            <Route path="/add-driver/driver-profile" element={<Driver_Profile />} />
            <Route path="/*" element={<Not_Found />} />
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;
