import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useContext } from "react";
import { SessionContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const UpdateTodo = () => {
  const { session } = useContext(SessionContext);
  const navigate = useNavigate();
  const [task, setTask] = useState("");
  const { id } = useParams();
  const [isComplete, setIsComplete] = useState(false);
  const [subject_name, setSubject_Name] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [formError, setFormError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [subjects, setSubjects] = useState(null);

  useEffect(() => {
    const fetchTodo = async () => {
      const { data, error } = await supabase
        .from("todos")
        .select()
        .match({ id: id })
        .single();

      if (error) {
        setFormError("Server Error!");
        navigate("/", { replace: true });
      }

      if (data) {
        setTask(data.task);
        setSubject_Name(data.subject_name);
        setDeadline(data.deadline);
        setUserId(data.user_id);
        setIsComplete(data.is_complete);
      }
    };
    fetchTodo();
  }, [id, navigate]);

  useEffect(() => {
    if (session) {
      const fetchSubjectNames = async () => {
        const { data, error } = await supabase
          .from("subjects")
          .select("subject_name")
          .match({ user_id: session.user.id });

        if (error) {
          setFormError("No subjects added");
          setSubjects(null);
        }

        if (data) {
          setSubjects(data);
          setFormError(null);
        }
      };

      fetchSubjectNames();
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (session) {
      if (!task || !subject_name || !deadline) {
        setFormError("Please fill all the fields correctly!");
        return;
      }

      const { data, error } = await supabase
        .from("todos")
        .update([
          {
            task,
            is_complete: isComplete,
            subject_name,
            deadline,
            user_id: session.user.id,
          },
        ])
        .match({ id: id })
        .select();

      if (error) {
        setFormError("Server Error!");
        navigate("/", { replace: true });
      }

      if (data) {
        setFormError(null);
        navigate("/todos/");
      }
    }
  };

  return (
    <Layout>
      {session?.user?.id === userId ? (
        <main className="max-w-2xl mx-auto px-5">
          <h1 className="text-4xl font-extrabold py-5 text-center">
            Update Todo
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="label">
              <span className="label-text text-lg">Task</span>
            </label>
            <textarea
              className="textarea textarea-primary"
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            ></textarea>
            <label className="label">
              <span className="label-text text-lg">Subject Name</span>
            </label>
            <select
              className="select select-primary w-full"
              name="subject_name"
              id="subject_name"
              value={subject_name}
              onChange={(e) => setSubject_Name(e.target.value)}
            >
              {subjects?.map((sub) => (
                <option value={sub.subject_name} key={sub.id}>
                  {sub.subject_name}
                </option>
              ))}
            </select>
            <label className="label">
              <span className="label-text text-lg">Deadline</span>
            </label>
            <input
              className="input input-bordered input-primary w-full"
              name="date"
              id="date"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <div className="form-control flex justify-between">
              <label className="label cursor-pointer flex-wrap">
                <span className="label-text text-lg">Status</span>
                <input
                  type="checkbox"
                  className="toggle toggle-lg toggle-primary"
                  onChange={() => {
                    setIsComplete(!isComplete);
                  }}
                  checked={isComplete}
                />
              </label>
            </div>
            {session?.user.id === userId ? (
              <button className="btn btn-primary my-5">Update Todo</button>
            ) : (
              <button className="btn btn-primary my-5" disabled="disabled">
                You don't have access to edit
              </button>
            )}
            {formError && (
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
                  <span>{formError}</span>
                </div>
              </div>
            )}
          </form>
        </main>
      ) : (
        <h1 className="normal-case text-2xl text-primary font-bold text-center mt-20">
          You don't have access to edit!
        </h1>
      )}
    </Layout>
  );
};

export default UpdateTodo;
