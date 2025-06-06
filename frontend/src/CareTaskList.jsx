import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { auth } from "./firebase";

import { db } from "./firebase";

export default function CareTaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.log("Ni prijavljenega uporabnika");
        return;
      }

      console.log("Prijavljen UID:", user.uid);

      const q = query(
        collection(db, "careTasks"),
        where("owner", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Najdene nege:", results);
      setTasks(results);
    };

    fetchTasks();
  }, []);

  return (
    <div className="mt-8">
      <h3 className="font-bold mb-2">Tvoja opravila nege</h3>
      {tasks.length === 0 && <p>Ni opravil.</p>}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border p-2">
            <p><strong>Opis:</strong> {task.description}</p>
            <p><strong>Datum:</strong> {task.date}</p>
            <p><strong>Status:</strong> {task.done ? "✔️ Opravljeno" : "⏳ Čaka"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
