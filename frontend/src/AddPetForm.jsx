import { httpsCallable } from "firebase/functions";
import { functions, auth, storage, db } from "./firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { useState } from "react";

export default function AddPetForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleAddPet = async () => {
    try {
      const addPet = httpsCallable(functions, "addPet");
      await addPet({ name, type });

      // pridobi zadnjo dodano žival
      const petId = await getLastPetId();

      // če obstaja ID in slika je izbrana, naloži
      if (petId && imageFile) {
        const imageRef = ref(storage, `pets/${petId}.jpg`);
        await uploadBytes(imageRef, imageFile);
        console.log("Slika naložena za ID:", petId);
      }

      setMessage("Žival dodana");
      setName("");
      setType("");
      setImageFile(null);
    } catch (error) {
      console.error(error);
      setMessage("Napaka pri dodajanju.");
    }
  };

  const getLastPetId = async () => {
    const q = query(
      collection(db, "pets"),
      where("owner", "==", auth.currentUser.uid),
      orderBy("created", "desc"),
      limit(1)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs[0]?.id || null;
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
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />
      <button onClick={handleAddPet}>Dodaj</button>
      <p>{message}</p>
    </div>
  );
}
