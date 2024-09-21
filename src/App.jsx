import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PlayGround from "./pages/PlayGround";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/playground" element={<PlayGround />}></Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
}
