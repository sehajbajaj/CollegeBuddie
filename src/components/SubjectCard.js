import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const SubjectCard = ({ subject, onDelete }) => {
  const [attendance, setAttendance] = useState(subject.attended);
  const [fetchError, setFetchError] = useState(null);

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .delete()
      .match({ id: subject.id })
      .select();

    if (error) {
      setFetchError("Server Error!");
    }

    if (data) {
      onDelete(subject.id);
      setFetchError(null);
    }
  };

  const handleIncrement = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .update({ attended: attendance + 1 })
      .match({ id: subject.id })
      .select("attended")
      .single();

    if (error) {
      setFetchError("Server Error!");
      setAttendance(null);
    }

    if (data) {
      setAttendance(data.attended);
      setFetchError(null);
    }
  };
  const handleDecrement = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .update({ attended: attendance - 1 })
      .match({ id: subject.id })
      .select("attended")
      .single();

    if (error) {
      setFetchError("Server Error !");
      setAttendance(null);
    }

    if (data) {
      setAttendance(data.attended);
      setFetchError(null);
    }
  };
  return (
    <>
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
      <div className="card bg-base-300 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between py-2">
            <h2 className="card-title font-semibold text-xl py-2">
              {subject.subject_name}
            </h2>
            <div className="card-actions justify-end">
              <Link to={"/subject/edit/" + subject.id}>
                <button className="btn btn-circle btn-outline btn-primary btn-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-pencil"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                  </svg>
                </button>
              </Link>
              <button
                className="btn btn-circle btn-outline btn-primary btn-sm"
                onClick={handleDelete}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div>
            Mid-Semester Marks: <span>{subject.sem_marks}</span>
          </div>
          <div>
            Final Marks: <span>{subject.final_marks}</span>
          </div>
          <div className="flex justify-between">
            Days Attended: {attendance}
            <div className="btn-group btn-group-horizontal">
              <button
                className="btn btn-xs btn-outline btn-primary"
                onClick={handleDecrement}
              >
                -
              </button>
              <button
                className="btn btn-xs btn-outline btn-primary"
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubjectCard;
