import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);

  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState({});

  const [questions, setQuestions] = useState([]);

  const [answers, setAnswers] = useState([
    "",
    "",
    "",
    "",
    ""
  ]);

  const [result, setResult] = useState(null);

  const uploadResume = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      "http://127.0.0.1:8000/uploadResume",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    setSummary(data.summary);
    setSkills(data.skills);
    setProjects(data.projects);
  };

  const generateQuestions = async () => {
    const res = await fetch(
      "http://127.0.0.1:8000/generateQue"
    );

    const data = await res.json();

    setQuestions(data.Questions);
  };

  const handleAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const submitAnswers = async () => {
    const res = await fetch(
      "http://127.0.0.1:8000/ansSubmit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ans: answers,
        }),
      }
    );

    const data = await res.json();

    setResult(data);
  };

  return (
    <div className="container">
      <h1>AI Interview Simulator</h1>

      <div className="card">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

        <button onClick={uploadResume}>
          Upload Resume
        </button>
      </div>

      {summary && (
        <div className="card">
          <h2>Summary</h2>
          <p>{summary}</p>

          <h2>Skills</h2>

          <div className="skills">
            {skills.map((skill, index) => (
              <span key={index}>
                {skill}
              </span>
            ))}
          </div>

          <h2>Projects</h2>

          <pre>
            {JSON.stringify(
              projects,
              null,
              2
            )}
          </pre>

          <button
            onClick={generateQuestions}
          >
            Start Interview
          </button>
        </div>
      )}

      {questions.length > 0 && (
        <div className="card">
          <h2>Interview Questions</h2>

          {questions.map(
            (question, index) => (
              <div
                key={index}
                className="question"
              >
                <p>
                  <strong>
                    Q{index + 1}.
                  </strong>{" "}
                  {question}
                </p>

                <textarea
                  rows="4"
                  placeholder="Write your answer..."
                  value={
                    answers[index]
                  }
                  onChange={(e) =>
                    handleAnswer(
                      index,
                      e.target.value
                    )
                  }
                />
              </div>
            )
          )}

          <button
            onClick={submitAnswers}
          >
            Submit Interview
          </button>
        </div>
      )}

      {result && (
        <div className="card">
          <h2>Interview Result</h2>

          <p>Q1: {result.q1}</p>
          <p>Q2: {result.q2}</p>
          <p>Q3: {result.q3}</p>
          <p>Q4: {result.q4}</p>
          <p>Q5: {result.q5}</p>
        </div>
      )}
    </div>
  );
}

export default App;