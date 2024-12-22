import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import CarViewer from './components/CarViewer';
import AppWeb from './screens/admin/AppWeb';
import AdminScreen from './screens/admin/adminScreen';
import AuthAdmin from './screens/admin/authAdmin';
import AdminSection from './components/admin/adminSection';
import UserSection from './components/admin/userSection';
import CarViewAdmin from './screens/admin/carViewAdmin';
import AuthClient from './screens/client/authClient';
import CarViewClient from './screens/client/carViewClient';

function App() {
  return (
    <div id='fullScreen' data-theme={"myTheme"}>
      <Router>
        <Routes>
          <Route path='/' element={<AppWeb />}>
            <Route path='/' element={<CarViewClient />}>
              <Route path='/' element={<CarViewer />} />
            </Route>
            <Route path='/admin' element={<AdminScreen />}>
              <Route path='/admin' element={<AdminSection />} />
              <Route path='/admin/users' element={<UserSection />} />
            </Route>
            <Route path='/admin/carViewer' element={<CarViewAdmin />}>
              <Route path='/admin/carViewer/' element={<CarViewer />} />
            </Route>
            <Route path='/admin/authAdmin' element={<AuthAdmin />} />
            <Route path='/authClient' element={<AuthClient />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
