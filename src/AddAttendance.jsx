import React, { useState, useEffect } from "react";
import maleIcon from "./assets/male.png";
import femaleIcon from "./assets/female.png";

const randomNames = ["Mani", "Karthik", "Anitha", "Priya", "Raj", "Sara"];

const AddAttendance = ({ teams, setTeams }) => {
  const [addingWorkerTo, setAddingWorkerTo] = useState(null);
  const [newWorkerName, setNewWorkerName] = useState("");

  useEffect(() => {
    localStorage.setItem("teamsData", JSON.stringify(teams));
  }, [teams]);

  const handleAddWorker = (teamId, gender) => {
    if (!newWorkerName.trim()) return;

    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              labours: [
                ...team.labours,
                {
                  id: Date.now(),
                  name: newWorkerName.trim(),
                  gender,
                  status: "present",
                  shift: [],
                },
              ],
            }
          : team
      )
    );
    setAddingWorkerTo(null);
    setNewWorkerName("");
  };

  // Updated generateWorkers function
  const generateWorkers = (teamId) => {
    let total = prompt("Enter total workers (max 5):");

    // Check if input is a valid number
    if (!/^\d+$/.test(total)) {
      alert("Please enter a valid number!");
      return;
    }

    total = parseInt(total);
    if (total <= 0) {
      alert("Please enter a number greater than 0!");
      return;
    }

    if (total > 5) total = 5;

    let maleCount = prompt(`How many male workers (0-${total})?`);

    if (!/^\d+$/.test(maleCount)) {
      alert("Please enter a valid number for male workers!");
      return;
    }

    maleCount = parseInt(maleCount);
    if (maleCount < 0) maleCount = 0;
    if (maleCount > total) maleCount = total;

    const femaleCount = total - maleCount;

    const newWorkers = [];
    for (let i = 0; i < femaleCount; i++) {
      newWorkers.push({
        id: Date.now() + i,
        name: randomNames[Math.floor(Math.random() * randomNames.length)],
        gender: "female",
        status: "present",
        shift: [],
      });
    }
    for (let i = 0; i < maleCount; i++) {
      newWorkers.push({
        id: Date.now() + i + femaleCount,
        name: randomNames[Math.floor(Math.random() * randomNames.length)],
        gender: "male",
        status: "present",
        shift: [],
      });
    }

    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId ? { ...team, labours: [...team.labours, ...newWorkers] } : team
      )
    );
  };

  const updateStatus = (teamId, workerId, status) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              labours: team.labours.map((lab) =>
                lab.id === workerId ? { ...lab, status } : lab
              ),
            }
          : team
      )
    );
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1>Attendance Management</h1>
      {teams.map((team) => (
        <div
          key={team.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
          }}
        >
          <h2>{team.teamName}</h2>

          {addingWorkerTo === team.id ? (
            <div style={{ marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Worker name"
                value={newWorkerName}
                onChange={(e) => setNewWorkerName(e.target.value)}
              />
              <button
                onClick={() => handleAddWorker(team.id, "male")}
                style={{ marginLeft: "5px" }}
              >
                <img src={maleIcon} alt="Male" style={{ width: "20px" }} />
              </button>
              <button
                onClick={() => handleAddWorker(team.id, "female")}
                style={{ marginLeft: "5px" }}
              >
                <img src={femaleIcon} alt="Female" style={{ width: "20px" }} />
              </button>
              <button
                onClick={() => setAddingWorkerTo(null)}
                style={{ marginLeft: "5px" }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => setAddingWorkerTo(team.id)}>Add Worker</button>
              <button
                onClick={() => generateWorkers(team.id)}
                style={{ marginLeft: "10px" }}
              >
                Auto Worker
              </button>
            </>
          )}

          {team.labours.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <h4>Workers:</h4>
              {team.labours.map((lab) => (
                <div
                  key={lab.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                    padding: "8px",
                    backgroundColor: lab.status === "absent" ? "#ffe0e0" : "#e0f0ff",
                    borderRadius: "4px",
                  }}
                >
                  <img
                    src={lab.gender === "male" ? maleIcon : femaleIcon}
                    alt={lab.gender}
                    style={{ width: "20px", marginRight: "10px" }}
                  />
                  <span style={{ width: "150px", fontWeight: "500" }}>{lab.name}</span>
                  <span
                    style={{
                      width: "80px",
                      fontWeight: "600",
                      color: lab.status === "absent" ? "#d32f2f" : "#388e3c",
                    }}
                  >
                    {lab.status.toUpperCase()}
                  </span>
                  <>
                    <button
                      onClick={() => updateStatus(team.id, lab.id, "present")}
                      style={{
                        marginLeft: "10px",
                        padding: "5px 10px",
                        backgroundColor: lab.status === "present" ? "#4caf50" : "#ddd",
                        color: lab.status === "present" ? "white" : "black",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => updateStatus(team.id, lab.id, "absent")}
                      style={{
                        marginLeft: "5px",
                        padding: "5px 10px",
                        backgroundColor: lab.status === "absent" ? "#f44336" : "#ddd",
                        color: lab.status === "absent" ? "white" : "black",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      Absent
                    </button>
                  </>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AddAttendance;