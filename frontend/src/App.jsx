import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Yarn from "./pages/Yarn";
import Home from "./pages/Home";
import Patterns from "./pages/Patterns";
import Tutorials from "./pages/Tutorials";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import VideoTutorial from './pages/VideoTutorial';
import Profile from "./pages/Profile"
import AuthRoute from './AuthRoute';
import CreateAccount from './pages/CreateAccount';
import EditAccount from './pages/EditAccount';
import FavoritePatterns from './pages/FavoritePatterns';
import FavoriteYarns from './pages/FavoriteYarns';


function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/yarn" element={<Yarn />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route path="/videotutorial" element={<VideoTutorial />} />
          <Route element={<AuthRoute />}>
            <Route path="/profile" element={<Profile />}></Route>
          </Route>
          <Route element={<AuthRoute />}>
            <Route path="/profile/edit" element={<EditAccount />}></Route>
          </Route>
          <Route element={<AuthRoute />}>
            <Route path="/profile/favoriteyarn" element={<FavoriteYarns />}></Route>
          </Route>
          <Route element={<AuthRoute />}>
            <Route path="/profile/favoritepattern" element={<FavoritePatterns />}></Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}




export default App

