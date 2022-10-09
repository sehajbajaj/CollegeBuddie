import React from "react";
import Layout from "../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { SessionContext } from "../App";
import { useContext, useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { session } = useContext(SessionContext);

  useEffect(() => {
    if (session) {
      navigate("/user/");
    }
  }, [session, navigate]);
  return (
    <Layout>
      <div className="hero min-h-[80vh]">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Create clear, multi-functional to-do lists to easily manage your
              ideas and work from anywhere so you never forget anything again.
              Student Planner helps you keep track of every single task – no
              matter how big or small, along with your marks and attendance.
            </p>
            <Link to="/auth">
              <button className="btn btn-primary">Login to Get Started</button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
