import { useState } from "react";
import LoginForm from "./LoginForm";
import { auth } from "./firebase";
import AddPetForm from "./AddPetForm";
import ScheduleCareForm from "./ScheduleCareForm";
import CareTaskList from "./CareTaskList";



function App() {
  const [user, setUser] = useState(null);

  // Ni prijavljen
  if (!user) return <LoginForm onLogin={setUser} />;

  // Prijavljen uporabnik
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Dobrodošel, {user.email}</h1>
      <button
        className="bg-red-600 text-white px-4 py-2 mb-4"
        onClick={() => {
          auth.signOut();
          setUser(null);
        }}
      >
        Odjava
      </button>

      {/* Dodajanje živali */}

      <AddPetForm />
      <ScheduleCareForm />
      <CareTaskList />


    </div>
  );
}

export default App;
