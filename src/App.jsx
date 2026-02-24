import React, { useState, useEffect } from "react";
import AddAttendance from "./AddAttendance.jsx";
import ShiftAssign from "./ShiftAssign.jsx";

function App() {
  const defaultTeams = [
    { id: 1, teamName: "Krish Team", labours: [] },
    { id: 2, teamName: "Arun Team", labours: [] },
    { id: 3, teamName: "Ravi Team", labours: [] },
  ];

  const [page, setPage] = useState("attendance");
  const [teams, setTeams] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("teamsData"));
      setTeams(stored && stored.length ? stored : defaultTeams);
    } catch {
      setTeams(defaultTeams);
    }
  }, []);

  const totalWorkers = teams.reduce((sum, team) => sum + team.labours.length, 0);
  const presentWorkers = teams.reduce(
    (sum, team) => sum + team.labours.filter((lab) => lab.status === "present").length,
    0
  );
  const absentWorkers = teams.reduce(
    (sum, team) => sum + team.labours.filter((lab) => lab.status === "absent").length,
    0
  );

  const handleTeamSelect = (teamId) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter((id) => id !== teamId));
    } else {
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  const handleAssignProject = () => {
    if (!selectedProject) return alert("Please select a project!");
    if (selectedTeams.length === 0) return alert("Please select at least one team!");

    const assignedTeamNames = teams
      .filter((team) => selectedTeams.includes(team.id))
      .map((team) => team.teamName)
      .join(", ");
    alert(`Project "${selectedProject}" assigned to: ${assignedTeamNames}`);
    setSelectedProject("");
    setSelectedTeams([]);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        width: "100vw",
        background: "#f4f6f8",
        display: "flex",
        flexDirection: "column",
      }}
    >
      
      <div
        style={{
          width: "100%",
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "25px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ margin: "0 0 20px 0", fontSize: "28px", fontWeight: "700" }}>
          Worker Management System
        </h1>

        
        <div style={{ display: "flex", gap: "15px", marginBottom: "25px" }}>
          <button
            onClick={() => setPage("attendance")}
            style={{
              padding: "12px 25px",
              backgroundColor: page === "attendance" ? "#1abc9c" : "#34495e",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "0.3s",
            }}
          >
            Attendance Management
          </button>
          <button
            onClick={() => setPage("shift")}
            style={{
              padding: "12px 25px",
              backgroundColor: page === "shift" ? "#3498db" : "#34495e",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "0.3s",
            }}
          >
            Shift Assignment
          </button>
        </div>

        
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <div>
            <label style={{ fontWeight: "600" }}>
              Select Project:{" "}
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                style={{
                  padding: "8px 12px",
                  marginLeft: "10px",
                  borderRadius: "5px",
                  border: "none",
                  outline: "none",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                <option value="">-- Select --</option>
                <option value="Project Alpha">Project Alpha</option>
                <option value="Project Beta">Project Beta</option>
                <option value="Project Gamma">Project Gamma</option>
                <option value="Project Delta">Project Delta</option>
                <option value="Project Omega">Project Omega</option>
              </select>
            </label>
          </div>

          {selectedProject && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "center" }}>
              {teams.map((team) => (
                <label
                  key={team.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#34495e",
                    padding: "6px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedTeams.includes(team.id)}
                    onChange={() => handleTeamSelect(team.id)}
                    style={{ marginRight: "8px", cursor: "pointer" }}
                  />
                  {team.teamName}
                </label>
              ))}

              <button
                onClick={handleAssignProject}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#1abc9c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "0.3s",
                }}
              >
                Assign
              </button>
            </div>
          )}
        </div>

      
        <div style={{ display: "flex", gap: "40px", fontSize: "15px" }}>
          <div>
            <span style={{ color: "#bdc3c7" }}>Total Workers:</span>
            <span style={{ fontWeight: "700", marginLeft: "10px", fontSize: "18px" }}>
              {totalWorkers}
            </span>
          </div>
          <div>
            <span style={{ color: "#bdc3c7" }}>Present:</span>
            <span
              style={{
                fontWeight: "700",
                marginLeft: "10px",
                fontSize: "18px",
                color: "#2ecc71",
              }}
            >
              {presentWorkers}
            </span>
          </div>
          <div>
            <span style={{ color: "#bdc3c7" }}>Absent:</span>
            <span
              style={{
                fontWeight: "700",
                marginLeft: "10px",
                fontSize: "18px",
                color: "#e74c3c",
              }}
            >
              {absentWorkers}
            </span>
          </div>
        </div>
      </div>

   
      <div
        style={{
          width: "100vw",
          flex: 1, 
          overflowY: "auto",
          padding: "30px",
          boxSizing: "border-box",
        }}
      >
        {page === "attendance" ? (
          <AddAttendance teams={teams} setTeams={setTeams} />
        ) : (
          <ShiftAssign teams={teams} setTeams={setTeams} />
        )}
      </div>
    </div>
  );
}

export default App;