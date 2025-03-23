import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Draft } from "./draft/Draft";
import { Main } from "./main/Main";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Main />} />
        <Route path="draft" element={<Draft />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
