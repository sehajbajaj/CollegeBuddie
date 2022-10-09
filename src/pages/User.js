import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../App";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import SubjectCard from "../components/SubjectCard";
import { supabase } from "../config/supabaseClient";

const User = () => {
  const { session, username } = useContext(SessionContext);
  const [fetchError, setFetchError] = useState(null);
  const [details, setDetails] = useState(null);
  const [newusername, setNewUsername] = useState(username);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (session) {
      if (!newusername) {
        setFetchError("The username field cant be blank!");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({ username: newusername })
        .match({ id: session.user.id })
        .select("username");

      if (error) {
        setFetchError(
          "The username might already be in use, try another username else contact the administrator!"
        );
      }

      if (data) {
        setFetchError(null);
        window.location.reload();
      }
    }
  };

  const handleDelete = (id) => {
    setDetails((prevTodo) => {
      return prevTodo.filter((jk) => jk.id !== id);
    });
  };

  useEffect(() => {
    if (session) {
      const fetchSubjectProfile = async () => {
        const { data, error } = await supabase
          .from("subjects")
          .select()
          .match({ user_id: session.user.id });

        if (error) {
          setFetchError("Could not fetch your details!");
          setDetails(null);
        }

        if (data) {
          setDetails(data);
          setFetchError(null);
        }
      };
      fetchSubjectProfile();
    }
  }, [session]);

  const sumMid = details?.map((i) => i.sem_marks);
  const ansSem = sumMid?.reduce((p, c) => p + c, 0);

  const sumFinal = details?.map((i) => i.final_marks);
  const ansFinal = sumFinal?.reduce((p, c) => p + c, 0);

  const totalSemMarks = details?.map((t) => t.sem_total);
  const totalSem = totalSemMarks?.reduce((p, c) => p + c, 0);

  const totalFinalMarks = details?.map((f) => f.final_total);
  const totalFinal = totalFinalMarks?.reduce((p, c) => p + c, 0);

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
      <form action="submit" onSubmit={handleSubmit}>
        <div className="input-group flex justify-end">
          <input
            type="text"
            placeholder="Username"
            value={newusername}
            className="input input-bordered max-w-xs"
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <button className="btn btn-sqaure btn-ghost btn-outline">
            Change
          </button>
        </div>
      </form>
      {details !== null ? (
        <main className="my-5 px-5">
          <div className="card bg-base-300 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between py-2">
                <h2 className="card-title font-bold text-4xl leading-10 tracking-wide">
                  {username?.toUpperCase()}
                </h2>
              </div>
              <p className="py-2 text-2xl leading-10">
                Overall Marks:{" "}
                <span>
                  {ansSem + ansFinal} / {totalSem + totalFinal}
                </span>
              </p>
              <p className="py-2 text-2xl leading-10">
                Percentage:{" "}
                <span className="text-xl">
                  {(
                    ((ansSem + ansFinal) / (totalFinal + totalSem)) *
                    100
                  ).toPrecision(3)}{" "}
                  %
                </span>
              </p>
              <p className="py-2 text-2xl leading-10">
                CGPA:{" "}
                <span className="text-xl">
                  {(
                    (
                      ((ansSem + ansFinal) / (totalFinal + totalSem)) *
                      100
                    ).toPrecision(3) / 9.5
                  ).toPrecision(3)}
                </span>
              </p>
            </div>
          </div>
          <h2 className="font-bold text-3xl mt-12 text-accent">
            Subjects
            <Link to={"/subject/add/"}>
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
          </h2>
          <div className="flex flex-wrap">
            {details &&
              details?.map((item) => (
                <div
                  key={item.id}
                  className="lg:w-1/3 md:w-1/2 w-full flex flex-col p-5"
                >
                  <SubjectCard subject={item} onDelete={handleDelete} />
                </div>
              ))}
          </div>
        </main>
      ) : (
        <h1 className="normal-case text-2xl text-primary font-bold text-center mt-20">
          Please Login to your account to view your Profile
        </h1>
      )}
    </Layout>
  );
};

export default User;
