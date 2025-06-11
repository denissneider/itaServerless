import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db, storage } from "./firebase";
import { ref, getDownloadURL } from "firebase/storage";

export default function PetList() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const q = query(collection(db, "pets"), where("owner", "==", uid));
      const snapshot = await getDocs(q);

      const petData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const petId = doc.id;

          // Pridobi URL slike, če obstaja
          try {
            const imageRef = ref(storage, `pets/${petId}.jpg`);
            const imageUrl = await getDownloadURL(imageRef);
            return { id: petId, ...data, imageUrl };
          } catch {
            return { id: petId, ...data, imageUrl: null };
          }
        })
      );

      setPets(petData);
    };

    fetchPets();
  }, []);

  return (
    <div>
      <h3>Tvoje živali</h3>
      {pets.length === 0 ? (
        <p>Ni živali.</p>
      ) : (
        <ul>
          {pets.map((pet) => (
            <li key={pet.id} style={{ marginBottom: "1rem" }}>
              <strong>{pet.name}</strong> ({pet.type})
              {pet.imageUrl && (
                <div>
                  <img
                    src={pet.imageUrl}
                    alt="slika živali"
                    style={{ maxWidth: "200px", marginTop: "0.5rem" }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
