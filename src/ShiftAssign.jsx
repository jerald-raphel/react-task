import React, { useState } from "react";

const shifts = ["Shift 1", "Shift 2", "Shift 3", "Shift 4"];

const ShiftAssign = ({ teams, setTeams }) => {
  const [assigningWorkerId, setAssigningWorkerId] = useState(null);

  const assigningWorker =
    assigningWorkerId &&
    teams
      .map((team) =>
        team.labours
          .filter((lab) => lab.id === assigningWorkerId)
          .map((lab) => ({ ...lab, teamId: team.id, teamName: team.teamName }))
      )
      .flat()[0];

  const toggleShift = (teamId, workerId, shiftName) => {
    const updatedTeams = teams.map((team) =>
      team.id === teamId
        ? {
            ...team,
            labours: team.labours.map((lab) =>
              lab.id === workerId
                ? {
                    ...lab,
                    shift: lab.shift.includes(shiftName)
                      ? lab.shift.filter((s) => s !== shiftName)
                      : [...lab.shift, shiftName],
                  }
                : lab
            ),
          }
        : team
    );
    setTeams(updatedTeams);
    localStorage.setItem("teamsData", JSON.stringify(updatedTeams));
  };

  
  const presentWorkers = teams
    .flatMap((team) =>
      team.labours
        .filter((lab) => lab.status === "present")
        .map((lab) => ({ ...lab, teamId: team.id, teamName: team.teamName }))
    );

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1>Shift Assignment</h1>

      
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "5px",
        }}
      >
        <h3>Present Workers: {presentWorkers.length}</h3>
        {presentWorkers.length === 0 ? (
          <p style={{ color: "gray" }}>No present workers to assign shifts.</p>
        ) : (
          <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
            {presentWorkers.map((worker) => (
              <li key={worker.id} style={{ marginBottom: "5px" }}>
                {worker.name} ({worker.teamName})
                {worker.shift.length > 0 && (
                  <>
                    <span style={{ marginLeft: "10px", color: "#0066cc" }}>
                      - Shifts: {worker.shift.join(", ")}
                    </span>
                    <button
                      onClick={() => {
                        
                        const updatedTeams = teams.map((team) =>
                          team.id === worker.teamId
                            ? {
                                ...team,
                                labours: team.labours.map((lab) =>
                                  lab.id === worker.id ? { ...lab, shift: [] } : lab
                                ),
                              }
                            : team
                        );
                        setTeams(updatedTeams);
                        localStorage.setItem(
                          "teamsData",
                          JSON.stringify(updatedTeams)
                        );
                      }}
                      style={{
                        marginLeft: "10px",
                        padding: "2px 6px",
                        fontSize: "12px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      Revoke
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

     
      {teams.map((team) => {
        const teamPresentWorkers = team.labours.filter(
          (lab) => lab.status === "present"
        );
        return (
          <div
            key={team.id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "5px",
              backgroundColor: teamPresentWorkers.length === 0 ? "#f9f9f9" : "#fff",
            }}
          >
            <h2>{team.teamName}</h2>
            <p style={{ color: "gray", fontSize: "14px" }}>
              Present Workers: {teamPresentWorkers.length} / {team.labours.length}
            </p>

            {teamPresentWorkers.length === 0 && <p>No present workers in this team.</p>}

            {teamPresentWorkers.map((lab) => (
              <div
                key={lab.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  padding: "10px",
                  backgroundColor: "#e8f5e9",
                  borderRadius: "4px",
                }}
              >
                <span style={{ width: "150px", fontWeight: "500" }}>{lab.name}</span>
                <span style={{ width: "100px", color: "#388e3c", fontWeight: "600" }}>
                  ✓ PRESENT
                </span>

                <button
                  onClick={() => setAssigningWorkerId(lab.id)}
                  style={{
                    marginLeft: "10px",
                    padding: "6px 12px",
                    backgroundColor: "#2196f3",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  Assign Shifts
                </button>

                {lab.shift.length > 0 && (
                  <span
                    style={{
                      marginLeft: "15px",
                      padding: "5px 10px",
                      backgroundColor: "#fff3e0",
                      borderRadius: "3px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#e65100",
                    }}
                  >
                    📅 {lab.shift.join(", ")}
                  </span>
                )}
              </div>
            ))}

           
            {team.labours.filter((lab) => lab.status === "absent").length > 0 && (
              <div
                style={{
                  marginTop: "15px",
                  paddingTop: "15px",
                  borderTop: "1px solid #ddd",
                }}
              >
                <p style={{ color: "gray", fontSize: "14px" }}>
                  Absent Workers:{" "}
                  {team.labours.filter((lab) => lab.status === "absent").length}
                </p>
                {team.labours
                  .filter((lab) => lab.status === "absent")
                  .map((lab) => (
                    <div
                      key={lab.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                        padding: "8px",
                        backgroundColor: "#ffebee",
                        borderRadius: "4px",
                        opacity: 0.7,
                      }}
                    >
                      <span style={{ width: "150px", color: "#666" }}>{lab.name}</span>
                      <span
                        style={{
                          width: "100px",
                          color: "#d32f2f",
                          fontWeight: "600",
                        }}
                      >
                        ✗ ABSENT
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      })}

    
      {assigningWorker && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "5px",
              width: "300px",
            }}
          >
            <h3>
              Assign Shifts for {assigningWorker.name} ({assigningWorker.teamName})
            </h3>

            {shifts.map((shift) => (
              <div key={shift} style={{ marginBottom: "5px" }}>
                <input
                  type="checkbox"
                  checked={assigningWorker.shift.includes(shift)}
                  onChange={() =>
                    toggleShift(assigningWorker.teamId, assigningWorker.id, shift)
                  }
                />{" "}
                {shift}
              </div>
            ))}

            <button
              onClick={() => setAssigningWorkerId(null)}
              style={{ marginTop: "10px" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftAssign;