import React, { useContext, useEffect, useState } from "react";
import { SessionContext } from "../App";
import Layout from "../components/Layout";
import TodoCard from "../components/TodoCard";
import { Link } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const Todos = () => {
  const { session, username } = useContext(SessionContext);
  const [fetchError, setFetchError] = useState(null);
  const [todo, setTodo] = useState(null);
  const [orderBy, setOrderBy] = useState("inserted_at");

  const handleDelete = (id) => {
    setTodo((prevTodo) => {
      return prevTodo.filter((jk) => jk.id !== id);
    });
  };

  useEffect(() => {
    if (session) {
      const fetchTodo = async () => {
        const { data, error } = await supabase
          .from("todos")
          .select()
          .match({ user_id: session.user.id })
          .order(orderBy, { ascending: true });

        if (error) {
          setFetchError("Could not fetch the required todo!");
          setTodo(null);
        }

        if (data) {
          setTodo(data);
          setFetchError(null);
        }
      };
      fetchTodo();
    }
  }, [session, orderBy]);

  return (
    <Layout>
      {fetchError && (
        <div className="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{fetchError}</span>
          </div>
        </div>
      )}
      {todo !== null ? (
        <main>
          <div className="m-6">
            <h1 className="normal-case text-2xl text-primary font-bold text-center">
              {username}'s TODOS
              <Link to={"/todos/add/"}>
                <button className="btn btn-ghost ml-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    class="bi bi-plus"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />{" "}
                  </svg>
                </button>
              </Link>
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold py-3">Order By:</h2>
            <div className="btn-group">
              <button
                className="btn btn-sm md:btn-md"
                onClick={() => {
                  setOrderBy("inserted_at");
                }}
              >
                Time Created
              </button>
              <button
                className="btn btn-sm md:btn-md"
                onClick={() => {
                  setOrderBy("is_complete");
                }}
              >
                Status
              </button>
              <button
                className="btn btn-sm md:btn-md"
                onClick={() => {
                  setOrderBy("deadline");
                }}
              >
                Deadline
              </button>
            </div>
          </div>
          <br />
          <div className="flex flex-wrap">
            {todo?.map((item) => (
              <div
                key={item.id}
                className="lg:w-1/3 md:w-1/2 w-full flex flex-col p-5"
              >
                <TodoCard todoitem={item} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        </main>
      ) : (
        <h1 className="normal-case text-2xl text-primary font-bold text-center mt-20">
          Please Login to your account to view your Todo List
        </h1>
      )}
    </Layout>
  );
};

export default Todos;
