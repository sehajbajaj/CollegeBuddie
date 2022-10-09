import { supabase } from "./config/supabaseClient";
import { useEffect, useState, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import User from "./pages/User";
import Todos from "./pages/Todos";
import AddTodo from "./pages/AddTodo";
import UpdateTodo from "./pages/UpdateTodo";
import AddSubjects from "./pages/AddSubjects";
import UpdateSubjects from "./pages/UpdateSubjects";

const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");

export const SessionContext = createContext();

function App() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  const [done, isDone] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      const updateProfile = async () => {
        const updates = {
          id: session.user.id,
          username: uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            style: "capital",
          }),
        };

        let { error } = await supabase.from("profiles").insert([updates]);

        if (error) {
          isDone(true);
          throw error;
        } else {
          isDone(true);
        }
      };
      updateProfile();
    }
  }, [session]);

  useEffect(() => {
    if (done) {
      const getProfile = async () => {
        let { data, error, status } = await supabase
          .from("profiles")
          .select(`id, username`)
          .match({ id: session.user.id })
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username);
          setId(data.id);
          isDone(false);
        }
      };
      getProfile();
    }
  }, [done]);

  return (
    <SessionContext.Provider value={{ session, id, username }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/user/" element={<User />} />
          <Route path="/todos/" element={<Todos />} />
          <Route path="/todos/add/" element={<AddTodo />} />
          <Route path="/todos/edit/:id" element={<UpdateTodo />} />
          <Route path="/subject/edit/:id" element={<UpdateSubjects />} />
          <Route path="/subject/add/" element={<AddSubjects />} />
        </Routes>
      </BrowserRouter>
    </SessionContext.Provider>
  );
}

export default App;
