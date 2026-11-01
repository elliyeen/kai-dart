/** Test-case scenarios behind the auto demo. Every step names the actor, the input, the output and the owning team. */
export interface ScenarioStep { stage: "Detected" | "Ticket opened" | "Dispatched" | "In progress" | "Verified"; actor: string; input: string; output: string; owner: string }
export interface Scenario {
  id: string; testId: string; station: string; line: string; title: string; priority: "Critical" | "High" | "Routine";
  precondition: string; trigger: string; steps: ScenarioStep[]; expected: string; passCriteria: string[]; sampleMinutes: number;
}

export const SCENARIOS: Scenario[] = [
  { id: "park-lane", testId: "TC-PL-01", station: "Park Lane", line: "Red Line", title: "Graffiti on the north platform wall", priority: "High", sampleMinutes: 38,
    precondition: "Park Lane readiness is in the high 80s and no open cleanliness ticket exists.",
    trigger: "Camera analytics flag new marking on the north platform wall.",
    steps: [
      { stage: "Detected", actor: "KAI", input: "Camera frame flagged as graffiti", output: "Incident created, readiness score drops", owner: "Station Manager" },
      { stage: "Ticket opened", actor: "Operations Command", input: "Incident, priority High", output: "Ticket with owner and due time", owner: "Operations Command" },
      { stage: "Dispatched", actor: "Operations Command", input: "Ticket", output: "Work order assigned to Cleaning crew A", owner: "Operations Command" },
      { stage: "In progress", actor: "Cleaning crew A", input: "Work order", output: "Surface cleaned, proof photo and notes submitted", owner: "Cleaning crew A" },
      { stage: "Verified", actor: "Field Inspector", input: "Proof photo, on-site check", output: "Approved, ticket closed, readiness recovers", owner: "Field Inspector" },
    ],
    expected: "Graffiti removed and signed off by an inspector who is not the crew member.",
    passCriteria: ["Ticket has a named owner at every stage", "Proof photo is attached before verification", "Verifier differs from the person who submitted proof", "Readiness score returns to its pre-incident range", "Every step appears in the audit log"] },
  { id: "spring-valley", testId: "TC-SV-01", station: "Spring Valley", line: "Red Line", title: "Trash bin at capacity", priority: "Routine", sampleMinutes: 29,
    precondition: "Spring Valley platform bin is in service and within normal fill level.",
    trigger: "Fill-level check shows the platform bin is full.",
    steps: [
      { stage: "Detected", actor: "KAI", input: "Fill-level reading at capacity", output: "Incident created, readiness score drops", owner: "Station Cleaning (contractor)" },
      { stage: "Ticket opened", actor: "Operations Command", input: "Incident, priority Routine", output: "Ticket with owner and due time", owner: "Operations Command" },
      { stage: "Dispatched", actor: "Operations Command", input: "Ticket", output: "Work order assigned to Cleaning crew B", owner: "Operations Command" },
      { stage: "In progress", actor: "Cleaning crew B", input: "Work order", output: "Bin emptied, liner replaced, proof photo submitted", owner: "Cleaning crew B" },
      { stage: "Verified", actor: "Field Inspector", input: "Proof photo", output: "Approved, ticket closed, readiness recovers", owner: "Field Inspector" },
    ],
    expected: "Bin emptied within the routine window and verified clear.",
    passCriteria: ["Ticket closes only after inspector approval", "Asset record for the bin shows its owner and last inspection", "Readiness score recovers after verification", "Every step appears in the audit log"] },
  { id: "akard", testId: "TC-AK-01", station: "Akard", line: "Red Line", title: "Platform B camera offline after dark", priority: "Critical", sampleMinutes: 47,
    precondition: "Akard Platform B camera is in service; a security officer is available nearby.",
    trigger: "Platform B camera stops reporting after dark, leaving a coverage gap.",
    steps: [
      { stage: "Detected", actor: "KAI", input: "Camera heartbeat lost on Platform B", output: "Coverage-gap alert, readiness score drops", owner: "Security Systems" },
      { stage: "Ticket opened", actor: "Operations Command", input: "Alert, priority Critical", output: "Ticket opened; security approval requested", owner: "Operations Command" },
      { stage: "Ticket opened", actor: "Security Supervisor", input: "Coverage-gap alert", output: "Approves moving an officer to Platform B", owner: "Security / Compliance" },
      { stage: "Dispatched", actor: "Operations Command", input: "Ticket", output: "Work order assigned to Security Systems", owner: "Operations Command" },
      { stage: "In progress", actor: "Security Systems", input: "Work order", output: "Camera restored, feed confirmed, proof submitted", owner: "Security Systems" },
      { stage: "In progress", actor: "Security Supervisor", input: "Feed confirmed", output: "Officer released from Platform B", owner: "Security / Compliance" },
      { stage: "Verified", actor: "Field Inspector", input: "Live feed check, proof", output: "Approved, coverage restored, readiness recovers", owner: "Field Inspector" },
    ],
    expected: "Coverage is never left unattended: the officer covers until the camera is back, then is released.",
    passCriteria: ["Officer move is approved by the security supervisor before it happens", "Officer is released only after the feed is confirmed", "Verifier differs from the person who restored the camera", "Camera asset status returns to in service", "Every step, including the approval, appears in the audit log"] },
  { id: "smu-mockingbird", testId: "TC-SM-01", station: "SMU/Mockingbird", line: "Red Line", title: "Elevator out of service", priority: "Critical", sampleMinutes: 66,
    precondition: "Station elevator is in service; accessible route signage is available.",
    trigger: "Elevator reports a fault and goes out of service.",
    steps: [
      { stage: "Detected", actor: "KAI", input: "Elevator fault reported", output: "Incident created, asset marked out of service, readiness score drops", owner: "Facilities Maintenance" },
      { stage: "Ticket opened", actor: "Operations Command", input: "Incident, priority Critical", output: "Ticket with owner and due time", owner: "Operations Command" },
      { stage: "Ticket opened", actor: "Station Manager", input: "Out-of-service elevator", output: "Accessible route notice posted", owner: "Station Manager" },
      { stage: "Dispatched", actor: "Operations Command", input: "Ticket", output: "Work order assigned to Facilities Maintenance", owner: "Operations Command" },
      { stage: "In progress", actor: "Facilities Maintenance", input: "Work order", output: "Repair completed, elevator tested, proof submitted", owner: "Facilities Maintenance" },
      { stage: "Verified", actor: "Field Inspector", input: "Test ride, proof", output: "Approved, asset back in service, readiness recovers", owner: "Field Inspector" },
    ],
    expected: "Riders with accessibility needs are told the alternate route immediately, and the elevator returns to service only after independent verification.",
    passCriteria: ["Accessible route notice is posted before repair starts", "Elevator asset shows out of service until verified", "Verifier differs from the person who submitted proof", "Readiness score returns to its pre-incident range", "Every step appears in the audit log"] },
];
