import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import { useState } from "react";

export default function AddPetForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  const handleAddPet = async () => {
    try {
      const addPet = httpsCallable(functions, "addPet");
      const result = await addPet({ name, type });
      setMessage(result.data.message);
      setName("");
      setType("");
    } catch (error) {
      setMessage("Napaka pri dodajanju.");
      console.error(error);
    }
  };

  return (
    <div>
      <h3>Dodaj žival</h3>
      <input
        type="text"
        placeholder="Ime"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Vrsta (npr. pes)"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <button onClick={handleAddPet}>Dodaj</button>
      <p>{message}</p>
    </div>
  );
}
