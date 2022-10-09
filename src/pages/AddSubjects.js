import React, { useState } from "react";
import Layout from "../components/Layout";
import { useContext } from "react";
import { SessionContext } from "../App";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const AddSubjects = () => {
  const { session } = useContext(SessionContext);
  const navigate = useNavigate();
  const [subjectName, setSubjectName] = useState("");
  const [semMarks, setSemMarks] = useState(0);
  const [finalMarks, setFinalMarks] = useState(0);
  const [attendance, setAttendance] = useState(0);
  const [totalMidSem, setTotalMidSem] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (session) {
      if (!subjectName || !semMarks || !finalMarks) {
        setFormError("Please fill all the fields correctly!");
        return;
      }

      const { data, error } = await supabase
        .from("subjects")
        .insert([
          {
            subject_name: subjectName,
            final_marks: finalMarks,
            sem_marks: semMarks,
            final_total: totalFinal,
            sem_total: totalMidSem,
            attended: attendance,
            user_id: session.user.id,
          },
        ])
        .select();

      if (error) {
        setFormError("Server Error!");
      }

      if (data) {
        setFormError(null);
        navigate("/user/");
      }
    }
  };

  return (
    <Layout>
      <main className="max-w-2xl mx-auto px-5">
        <h1 className="text-4xl font-extrabold py-2 text-center">
          Create New Subject
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="label">
            <span className="label-text text-lg">Subject Name</span>
          </label>
          <input
            className="input input-bordered input-primary w-full"
            id="subjectName"
            onChange={(e) => setSubjectName(e.target.value)}
          />
          <label className="label">
            <span className="label-text text-lg">Mid-Semester Marks</span>
          </label>
          <input
            className="input input-bordered input-primary w-full"
            name="semMarks"
            id="semMarks"
            onChange={(e) => setSemMarks(e.target.value)}
          />
          <label className="label">
            <span className="label-text text-lg">
              Maximum Mid-Semester Marks
            </span>
          </label>
          <input
            className="input input-bordered input-primary w-full"
            name="totalMidSem"
            id="totalMidSem"
            onChange={(e) => setTotalMidSem(e.target.value)}
          />
          <label className="label">
            <span className="label-text text-lg">Final Marks</span>
          </label>
          <input
            className="input input-bordered input-primary w-full"
            name="finalMarks"
            id="finalMarks"
            onChange={(e) => setFinalMarks(e.target.value)}
          />
          <label className="label">
            <span className="label-text text-lg">Maximum Final Marks</span>
          </label>
          <input
            className="input input-bordered input-primary w-full"
            name="totalFinal"
            id="totalFinal"
            onChange={(e) => setTotalFinal(e.target.value)}
          />
          <label className="label cursor-pointer flex-wrap">
            <span className="label-text text-lg">Attendance</span>
          </label>
          <input
            className="input input-bordered input-primary w-full"
            name="attendance"
            id="attendance"
            onChange={(e) => setAttendance(e.target.value)}
          />

          {session ? (
            <button className="btn btn-primary my-5">Add Subject</button>
          ) : (
            <button className="btn btn-primary my-5" disabled="disabled">
              Login to submit
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
    </Layout>
  );
};

export default AddSubjects;
