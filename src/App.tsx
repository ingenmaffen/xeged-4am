import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Draft } from "./draft/Draft";
import { Main } from "./main/Main";
import { Dev } from "./dev/Dev";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Main />} />
        <Route path="draft" element={<Draft />} />
        <Route path="dev" element={<Dev />} />
      </Routes>
    </BrowserRouter>
  );

  // temporary routing for deployment (until project is finished)

  // return (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route index element={<Draft />} />
  //       <Route path="dev" element={<Main />} />
  //     </Routes>
  //   </BrowserRouter>
  // );
};

export default App;
