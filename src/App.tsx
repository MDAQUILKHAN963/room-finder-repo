import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AddRoom from '@/pages/rooms/AddRoom';
import Home from '@/pages/Home';
import SearchRooms from '@/pages/rooms/SearchRooms';
import RoomDetails from '@/pages/rooms/RoomDetails';
import Dashboard from '@/pages/dashboard/Dashboard';
import EditRoom from '@/pages/rooms/EditRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/rooms/add" element={<AddRoom />} />
            <Route path="/rooms/edit/:id" element={<EditRoom />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
