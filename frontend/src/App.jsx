import { useEffect, useState } from "react";
import { getUsers } from "./api";
import HomePage from "./pages/HomePage.jsx";
function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <div className="p-6">
      <HomePage/>
    </div>
  );
}

export default App;
