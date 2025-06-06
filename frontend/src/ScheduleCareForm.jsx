import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export default function ScheduleCareForm() {
  const [petId, setPetId] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSchedule = async () => {
    try {
      const scheduleCare = httpsCallable(functions, "scheduleCare");
      const result = await scheduleCare({ petId, date, description });
      setMessage(result.data.message);
      setPetId("");
      setDate("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setMessage("Napaka pri načrtovanju nege.");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="font-bold mb-2">Načrtuj nego</h3>
      <input
        type="text"
        placeholder="ID živali (petId)"
        value={petId}
        onChange={(e) => setPetId(e.target.value)}
        className="border p-2 block mb-2 w-full"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 block mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Opis nege"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 block mb-2 w-full"
      />
      <button
        onClick={handleSchedule}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Načrtuj
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
