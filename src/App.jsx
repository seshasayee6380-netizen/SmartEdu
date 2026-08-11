
import { useState, useEffect, useMemo, useRef, useCallback, createContext, useContext } from "react";

/* ============================================================================
   ICONS — small hand-rolled SVG set (keeps this file dependency-light)
============================================================================ */
const Icon = ({d, size=18, ...p}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}>{d}</svg>
);
const IconSet = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
  qr: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM19 14h2M14 19h2M19 19h2v2h-2z"/></>,
  users: <><circle cx="9" cy="8" r="3.4"/><path d="M2.5 20c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2"/><circle cx="17.5" cy="8.5" r="2.6"/><path d="M15.6 13.9c2.9.3 5 2.6 5 6.1"/></>,
  activity: <><path d="M3 12h4l2.5-7L14 19l2.5-7H21"/></>,
  clipboard: <><rect x="6" y="4" width="12" height="17" rx="2"/><rect x="9" y="2.3" width="6" height="3.4" rx="1"/><path d="M9 11h6M9 15h6"/></>,
  chart: <><path d="M4 20V10M11 20V4M18 20v-7"/><path d="M3 20h18"/></>,
  trophy: <><path d="M8 4h8v4a4 4 0 01-8 0V4z"/><path d="M8 5H5a3 3 0 003 3M16 5h3a3 3 0 01-3 3"/><path d="M12 12v3M9 20h6M10 17h4l.6 3H9.4z"/></>,
  calendarOff: <><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/><path d="M8.5 13l7 6M15.5 13l-7 6"/></>,
  bell: <><path d="M6 9a6 6 0 0112 0c0 4.5 1.5 6 1.5 6H4.5S6 13.5 6 9z"/><path d="M9.5 19a2.5 2.5 0 005 0"/></>,
  user: <><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5c0-4.4 3.4-7 7.5-7s7.5 2.6 7.5 7"/></>,
  file: <><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></>,
  building: <><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/></>,
  layers: <><path d="M12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12l9 4.5 9-4.5M3 16l9 4.5 9-4.5"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.9 2.9l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 11-4 0v-.2a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.9-2.9l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.6-1H3a2 2 0 110-4h.2a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.9-2.9l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.6V3a2 2 0 114 0v.2a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.9 2.9l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.6 1H21a2 2 0 110 4h-.2a1.7 1.7 0 00-1.6 1z"/></>,
  logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
  sun: <><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></>,
  moon: <><path d="M20 14.5A8.5 8.5 0 119.5 4a7 7 0 0010.5 10.5z"/></>,
  menu: <><path d="M3 6h18M3 12h18M3 18h18"/></>,
  x: <><path d="M18 6L6 18M6 6l12 12"/></>,
  check: <><path d="M20 6L9 17l-5-5"/></>,
  checkCircle: <><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9"/></>,
  xCircle: <><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></>,
  alert: <><path d="M12 3L2 21h20z"/><path d="M12 10v4M12 17.5v.1"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  download: <><path d="M12 3v13M7 11l5 5 5-5"/><path d="M4 20h16"/></>,
  send: <><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>,
  refresh: <><path d="M21 12a9 9 0 10-3.5 7.1"/><path d="M21 5v6h-6"/></>,
  chevRight: <><path d="M9 6l6 6-6 6"/></>,
  chevDown: <><path d="M6 9l6 6 6-6"/></>,
  medal: <><circle cx="12" cy="15" r="6"/><path d="M9 10.5L6 3h3l3 6.5L15 3h3l-3 7.5"/></>,
  scan: <><path d="M4 8V5a1 1 0 011-1h3M17 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M7 20H4a1 1 0 01-1-1v-3"/><path d="M4 12h16"/></>,
  target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.6"/></>,
  book: <><path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5v-15z"/><path d="M4 20.5A2.5 2.5 0 016.5 18H20"/></>,
  sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></>,
  filter: <><path d="M4 5h16M7 12h10M10 19h4"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></>,
  edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></>,
  mapPin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="2.8"/></>,
  shield: <><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z"/></>,
  award: <><circle cx="12" cy="8" r="5.5"/><path d="M8.5 13l-1.5 8 5-2.5 5 2.5-1.5-8"/></>,
};
const Ic = ({name, size, className, style, color}) => <Icon d={IconSet[name]} size={size} className={className} style={{color, ...style}} />;

/* ============================================================================
   DATA LAYER — seeded demo data, persisted to localStorage
============================================================================ */
const DB_KEY = "smartedu_db_v4";
const uid = (p="id") => p + "_" + Math.random().toString(36).slice(2, 9);
const todayISO = () => "2026-08-10";
const nowISO = () => new Date("2026-08-10T10:00:00").toISOString();
const clamp = (n, a=0, b=100) => Math.max(a, Math.min(b, n));
const pct = (a,b) => b<=0 ? 0 : Math.round((a/b)*100);
const CLASSROOM_RADIUS_M = 75;
const DEMO_CAMPUS = {lat:13.0827, lng:80.2707};
function distanceMeters(lat1, lon1, lat2, lon2){
  const R=6371000, toRad=v=>v*Math.PI/180;
  const dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1);
  const a=Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return Math.round(R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)));
}
function attendanceIntegrity(record){
  if(record.proximityStatus==="verified") return {label:"Verified", tone:"green", reason:"Student was verified within the classroom proximity."};
  if(record.proximityStatus==="mismatch") return {label:"Review", tone:"red", reason:"Student location could not be verified within the classroom radius."};
  return {label:"Pending", tone:"gold", reason:"Location verification is pending."};
}

const SUBJECTS = ["Data Structures","Database Management","Computer Networks","Operating Systems","Web Development"];
const DEPARTMENTS = ["Computer Science","Information Technology","Electronics"];
const CLASSES = ["CSE-3A","CSE-3B","IT-2A"];

function seedDB(){
  const students = [
    {id:"s1", name:"Ananya Devi", email:"student@smartedu.com", password:"student123", dept:"Computer Science", cls:"CSE-3A", roll:"21CS001", color:"#6C63FF"},
    {id:"s2", name:"Arun Kumar", email:"arun@smartedu.com", password:"student123", dept:"Computer Science", cls:"CSE-3A", roll:"21CS002", color:"#1F9C86"},
    {id:"s3", name:"Priya Sharma", email:"priya@smartedu.com", password:"student123", dept:"Computer Science", cls:"CSE-3A", roll:"21CS003", color:"#E8A33D"},
    {id:"s4", name:"Rahul Raj", email:"rahul@smartedu.com", password:"student123", dept:"Information Technology", cls:"IT-2A", roll:"22IT004", color:"#E15B5B"},
    {id:"s5", name:"Karthik S", email:"karthik@smartedu.com", password:"student123", dept:"Computer Science", cls:"CSE-3B", roll:"21CS005", color:"#3C8CE0"},
    {id:"s6", name:"Sneha R", email:"sneha@smartedu.com", password:"student123", dept:"Electronics", cls:"IT-2A", roll:"22EC006", color:"#B45CC7"},
    {id:"s7", name:"Vishal Kumar", email:"vishal@smartedu.com", password:"student123", dept:"Computer Science", cls:"CSE-3B", roll:"21CS007", color:"#D2825A"},
    {id:"s8", name:"Divya M", email:"divya@smartedu.com", password:"student123", dept:"Information Technology", cls:"IT-2A", roll:"22IT008", color:"#4AA96C"},
  ];
  const teachers = [
    {id:"t1", name:"Dr. Meera Nair", email:"teacher@smartedu.com", password:"teacher123", subjects:["Data Structures","Operating Systems"]},
    {id:"t2", name:"Prof. Suresh Iyer", email:"suresh@smartedu.com", password:"teacher123", subjects:["Database Management","Web Development"]},
  ];
  const admins = [{id:"a1", name:"Institution Admin", email:"admin@smartedu.com", password:"admin123"}];

  // Parent accounts are linked to a student so parents only see their child's actionable academic information.
  const parents = [
    {id:"p1", name:"Mrs. Ananya Devi", email:"parent@smartedu.com", password:"parent123", childId:"s1", relation:"Mother", color:"#B45CC7"},
    {id:"p2", name:"Mr. Priya Sharma", email:"priya.parent@smartedu.com", password:"parent123", childId:"s3", relation:"Father", color:"#3C8CE0"},
  ];

  // A simple daily timetable used by the prototype. Empty subject slots are intentional free periods.
  const timetable = [
    {day:"Monday", slots:[
      {time:"09:00 AM", end:"10:00 AM", subject:"Data Structures", room:"Lab 2"},
      {time:"10:00 AM", end:"11:00 AM", subject:"Database Management", room:"Room 104"},
      {time:"11:00 AM", end:"12:00 PM", subject:null, room:"Library / Self Study"},
      {time:"12:00 PM", end:"01:00 PM", subject:"Computer Networks", room:"Room 202"},
      {time:"01:00 PM", end:"02:00 PM", subject:null, room:"Lunch / Free"},
      {time:"02:00 PM", end:"03:00 PM", subject:"Operating Systems", room:"Room 301"},
      {time:"03:00 PM", end:"04:00 PM", subject:"Web Development", room:"Lab 1"},
    ]},
    {day:"Tuesday", slots:[
      {time:"09:00 AM", end:"10:00 AM", subject:"Computer Networks", room:"Room 202"},
      {time:"10:00 AM", end:"11:00 AM", subject:"Operating Systems", room:"Room 301"},
      {time:"11:00 AM", end:"12:00 PM", subject:null, room:"Library / Self Study"},
      {time:"12:00 PM", end:"01:00 PM", subject:"Web Development", room:"Lab 1"},
      {time:"01:00 PM", end:"02:00 PM", subject:null, room:"Lunch / Free"},
      {time:"02:00 PM", end:"03:00 PM", subject:"Data Structures", room:"Lab 2"},
      {time:"03:00 PM", end:"04:00 PM", subject:"Database Management", room:"Room 104"},
    ]},
  ];

  // studentAttendance[studentId][subject] = {attended,total}
  const base = {
    s1:{"Data Structures":[24,27],"Database Management":[20,26],"Computer Networks":[18,25],"Operating Systems":[23,26],"Web Development":[21,24]},
    s2:{"Data Structures":[26,27],"Database Management":[25,26],"Computer Networks":[23,25],"Operating Systems":[24,26],"Web Development":[22,24]},
    s3:{"Data Structures":[19,27],"Database Management":[18,26],"Computer Networks":[16,25],"Operating Systems":[19,26],"Web Development":[17,24]},
    s4:{"Data Structures":[17,27],"Database Management":[16,26],"Computer Networks":[15,25],"Operating Systems":[18,26],"Web Development":[16,24]},
    s5:{"Data Structures":[22,27],"Database Management":[21,26],"Computer Networks":[19,25],"Operating Systems":[20,26],"Web Development":[20,24]},
    s6:{"Data Structures":[15,27],"Database Management":[14,26],"Computer Networks":[13,25],"Operating Systems":[16,26],"Web Development":[14,24]},
    s7:{"Data Structures":[25,27],"Database Management":[24,26],"Computer Networks":[22,25],"Operating Systems":[23,26],"Web Development":[21,24]},
    s8:{"Data Structures":[20,27],"Database Management":[19,26],"Computer Networks":[17,25],"Operating Systems":[21,26],"Web Development":[18,24]},
  };
  const studentAttendance = {};
  Object.entries(base).forEach(([sid, subs])=>{
    studentAttendance[sid] = {};
    Object.entries(subs).forEach(([subj, [a,t]])=>{ studentAttendance[sid][subj] = {attended:a, total:t}; });
  });

  const activities = [
    {id:"act1", title:"Binary Tree Traversal Lab", subject:"Data Structures", type:"Lab Activity", description:"Implement in-order, pre-order and post-order traversal.", date:"2026-08-02", deadline:"2026-08-09", maxPoints:10, createdBy:"t1"},
    {id:"act2", title:"ER Diagram Workshop", subject:"Database Management", type:"Workshop", description:"Design an ER diagram for a hospital management system.", date:"2026-08-04", deadline:"2026-08-12", maxPoints:20, createdBy:"t2"},
    {id:"act3", title:"OSI Model Seminar", subject:"Computer Networks", type:"Seminar", description:"Group seminar presenting each OSI layer.", date:"2026-08-05", deadline:"2026-08-14", maxPoints:20, createdBy:"t1"},
    {id:"act4", title:"Portfolio Website Project", subject:"Web Development", type:"Project", description:"Build and deploy a personal portfolio site.", date:"2026-07-20", deadline:"2026-08-20", maxPoints:50, createdBy:"t2"},
    {id:"act5", title:"Process Scheduling Quiz", subject:"Operating Systems", type:"Quiz", description:"MCQ quiz on CPU scheduling algorithms.", date:"2026-08-06", deadline:"2026-08-11", maxPoints:10, createdBy:"t1"},
    {id:"act6", title:"Coding Club Meetup", subject:"Data Structures", type:"Club Activity", description:"Weekly DSA problem-solving club session.", date:"2026-08-07", deadline:"2026-08-15", maxPoints:15, createdBy:"t1"},
    {id:"act7", title:"Inter-Dept Sports Meet", subject:"Web Development", type:"Sports Activity", description:"Represent the department at the annual sports meet.", date:"2026-08-08", deadline:"2026-08-18", maxPoints:15, createdBy:"t2"},
  ];
  // completions: [{activityId, studentId, status, submittedAt, points}]
  const completions = [];
  const compTemplate = {
    s1:["completed","completed","pending","completed","completed","pending","completed"],
    s2:["completed","completed","completed","completed","completed","completed","pending"],
    s3:["pending","overdue","pending","pending","overdue","pending","pending"],
    s4:["overdue","pending","overdue","pending","overdue","pending","pending"],
    s5:["completed","pending","completed","pending","completed","pending","completed"],
    s6:["overdue","overdue","pending","overdue","overdue","pending","pending"],
    s7:["completed","completed","completed","pending","completed","completed","completed"],
    s8:["completed","pending","completed","completed","pending","pending","completed"],
  };
  Object.entries(compTemplate).forEach(([sid, arr])=>{
    activities.forEach((act,i)=>{
      const status = arr[i];
      completions.push({id:uid("comp"), activityId:act.id, studentId:sid, status,
        submittedAt: status==="completed" ? act.date : null,
        points: status==="completed" ? act.maxPoints : 0});
    });
  });

  const assignments = [
    {id:"asn1", title:"Linked List Assignment", subject:"Data Structures", deadline:"2026-08-11", instructions:"Implement singly and doubly linked lists with all operations.", maxMarks:20, createdBy:"t1"},
    {id:"asn2", title:"Normalization Exercise", subject:"Database Management", deadline:"2026-08-13", instructions:"Normalize the given schema up to 3NF.", maxMarks:20, createdBy:"t2"},
    {id:"asn3", title:"Subnetting Problems", subject:"Computer Networks", deadline:"2026-08-10", instructions:"Solve the 10 subnetting problems in the sheet.", maxMarks:15, createdBy:"t1"},
    {id:"asn4", title:"Responsive Layout Task", subject:"Web Development", deadline:"2026-08-16", instructions:"Build a responsive pricing page using CSS Grid.", maxMarks:15, createdBy:"t2"},
  ];
  const submissionTemplate = {
    s1:["submitted","submitted","submitted","pending"],
    s2:["submitted","submitted","submitted","submitted"],
    s3:["pending","pending","overdue","pending"],
    s4:["overdue","pending","overdue","pending"],
    s5:["submitted","pending","submitted","pending"],
    s6:["overdue","overdue","overdue","pending"],
    s7:["submitted","submitted","submitted","submitted"],
    s8:["submitted","submitted","pending","submitted"],
  };
  const submissions = [];
  Object.entries(submissionTemplate).forEach(([sid, arr])=>{
    assignments.forEach((asn,i)=>{
      const status = arr[i];
      submissions.push({id:uid("sub"), assignmentId:asn.id, studentId:sid, status,
        submittedAt: status==="submitted" ? asn.deadline : null,
        marks: status==="submitted" ? Math.round(asn.maxMarks*(0.65+Math.random()*0.3)) : null});
    });
  });

  const quizScores = [
    {studentId:"s1", subject:"Operating Systems", score:8, max:10},
    {studentId:"s2", subject:"Operating Systems", score:9, max:10},
    {studentId:"s3", subject:"Operating Systems", score:5, max:10},
    {studentId:"s4", subject:"Operating Systems", score:4, max:10},
    {studentId:"s5", subject:"Operating Systems", score:7, max:10},
    {studentId:"s6", subject:"Operating Systems", score:3, max:10},
    {studentId:"s7", subject:"Operating Systems", score:9, max:10},
    {studentId:"s8", subject:"Operating Systems", score:7, max:10},
  ];

  const leaveRequests = [
    {id:uid("lv"), studentId:"s3", from:"2026-08-12", to:"2026-08-13", reason:"Family function", status:"pending", doc:null, createdAt:"2026-08-09"},
    {id:uid("lv"), studentId:"s6", from:"2026-08-07", to:"2026-08-08", reason:"Medical appointment", status:"approved", doc:"medical_note.pdf", createdAt:"2026-08-05"},
    {id:uid("lv"), studentId:"s4", from:"2026-08-14", to:"2026-08-14", reason:"Personal work", status:"rejected", doc:null, createdAt:"2026-08-08"},
  ];

  const notifications = [
    {id:uid("nt"), audience:"s1", type:"assignment", title:"Assignment due tomorrow", message:"Linked List Assignment is due on 11 Aug.", read:false, date:"2026-08-10"},
    {id:uid("nt"), audience:"s3", type:"attendance", title:"Low attendance warning", message:"Your Computer Networks attendance is 64%. Please attend upcoming classes.", read:false, date:"2026-08-09"},
    {id:uid("nt"), audience:"s6", type:"leave", title:"Leave approved", message:"Your leave request (7–8 Aug) has been approved.", read:true, date:"2026-08-06"},
    {id:uid("nt"), audience:"s4", type:"leave", title:"Leave rejected", message:"Your leave request for 14 Aug was rejected.", read:false, date:"2026-08-08"},
    {id:uid("nt"), audience:"s1", type:"achievement", title:"Achievement unlocked", message:"You earned the Assignment Master badge!", read:false, date:"2026-08-08"},
    {id:uid("nt"), audience:"all-students", type:"announcement", title:"Teacher announcement", message:"Mid-semester review meeting scheduled for 15 Aug.", read:false, date:"2026-08-09"},
    {id:uid("nt"), audience:"t1", type:"progress", title:"3 students newly at-risk", message:"Rahul, Sneha and Priya crossed the risk threshold this week.", read:false, date:"2026-08-10"},
    {id:uid("nt"), audience:"p1", type:"attendance", title:"Attendance is healthy", message:"Ananya's attendance is currently above the 75% target. No action is required.", read:false, date:"2026-08-10"},
    {id:uid("nt"), audience:"p2", type:"attendance", title:"Attendance alert", message:"Priya's Computer Networks attendance is below the 75% target. Please review today's plan.", read:false, date:"2026-08-10"},
    {id:uid("nt"), audience:"p2", type:"assignment", title:"Academic work needs attention", message:"Priya has an overdue assignment. SmartEdu recommends using the next free period to complete it.", read:false, date:"2026-08-10"},
  ];

  return {
    students, teachers, admins, parents, subjects: SUBJECTS, departments: DEPARTMENTS, classes: CLASSES, timetable,
    studentAttendance, activities, completions, assignments, submissions, quizScores,
    leaveRequests, notifications,
    attendanceSessions: [], // live QR sessions
    attendanceLog: [], // {studentId, subject, date, time}
    settings: {attendanceThreshold:75, classroomRadiusMeters:CLASSROOM_RADIUS_M, pointsMap:{Assignment:10,Quiz:10,Seminar:20,Workshop:20,Project:50,"Club Activity":15,"Sports Activity":15,"Lab Activity":10,Presentation:20}},
  };
}

function loadDB(){
  try{
    const raw = localStorage.getItem(DB_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  const fresh = seedDB();
  localStorage.setItem(DB_KEY, JSON.stringify(fresh));
  return fresh;
}
function saveDB(db){ localStorage.setItem(DB_KEY, JSON.stringify(db)); }

/* ============================================================================
   GLOBAL STORE CONTEXT
============================================================================ */
const StoreCtx = createContext(null);
const useStore = () => useContext(StoreCtx);

function StoreProvider({children}){
  const [db, setDb] = useState(loadDB);
  const [toasts, setToasts] = useState([]);

  useEffect(()=>{ saveDB(db); }, [db]);

  // cross-tab sync (lets a teacher tab + student tab demo together)
  useEffect(()=>{
    const onStorage = (e) => { if(e.key === DB_KEY && e.newValue){ setDb(JSON.parse(e.newValue)); } };
    window.addEventListener("storage", onStorage);
    const poll = setInterval(()=>{
      try{
        const raw = localStorage.getItem(DB_KEY);
        if(raw){ const parsed = JSON.parse(raw); if(JSON.stringify(parsed)!==JSON.stringify(db)) setDb(parsed); }
      }catch(e){}
    }, 2000);
    return ()=>{ window.removeEventListener("storage", onStorage); clearInterval(poll); };
  }, [db]);

  const update = useCallback((fn) => {
    setDb(prev => { const next = JSON.parse(JSON.stringify(prev)); fn(next); return next; });
  }, []);

  const toast = useCallback((message, type="info") => {
    const id = uid("toast");
    setToasts(t => [...t, {id, message, type}]);
    setTimeout(()=> setToasts(t => t.filter(x=>x.id!==id)), 3600);
  }, []);

  const resetDemo = useCallback(()=>{
    const fresh = seedDB();
    localStorage.setItem(DB_KEY, JSON.stringify(fresh));
    setDb(fresh);
  }, []);

  return <StoreCtx.Provider value={{db, update, toast, toasts, resetDemo}}>{children}</StoreCtx.Provider>;
}

/* ============================================================================
   COMPUTED SELECTORS
============================================================================ */
function studentOverallAttendance(db, sid){
  const subs = db.studentAttendance[sid] || {};
  let a=0,t=0;
  Object.values(subs).forEach(v=>{a+=v.attended; t+=v.total;});
  return pct(a,t);
}
function studentActivityCompletion(db, sid){
  const rows = db.completions.filter(c=>c.studentId===sid);
  if(!rows.length) return 0;
  const done = rows.filter(r=>r.status==="completed").length;
  return pct(done, rows.length);
}
function studentAssignmentCompletion(db, sid){
  const rows = db.submissions.filter(s=>s.studentId===sid);
  if(!rows.length) return 0;
  const done = rows.filter(r=>r.status==="submitted").length;
  return pct(done, rows.length);
}
function studentQuizAvg(db, sid){
  const rows = db.quizScores.filter(q=>q.studentId===sid);
  if(!rows.length) return 0;
  let s=0,m=0; rows.forEach(r=>{s+=r.score; m+=r.max;});
  return pct(s,m);
}
function studentProjectCompletion(db, sid){
  const rows = db.completions.filter(c=>c.studentId===sid && db.activities.find(a=>a.id===c.activityId)?.type==="Project");
  if(!rows.length) return 0;
  const done = rows.filter(r=>r.status==="completed").length;
  return pct(done, rows.length);
}
function studentProgressScore(db, sid){
  const att = studentOverallAttendance(db, sid);
  const act = studentActivityCompletion(db, sid);
  const asn = studentAssignmentCompletion(db, sid);
  const quiz = studentQuizAvg(db, sid);
  return Math.round(att*0.3 + act*0.25 + asn*0.25 + quiz*0.2);
}
function studentPoints(db, sid){
  return db.completions.filter(c=>c.studentId===sid && c.status==="completed").reduce((sum,c)=>sum+(c.points||0),0);
}
function studentBadges(db, sid){
  const badges = [];
  if(studentActivityCompletion(db,sid) >= 85) badges.push({label:"Activity Champion", icon:"award"});
  if(studentAssignmentCompletion(db,sid) >= 90) badges.push({label:"Assignment Master", icon:"clipboard"});
  if(studentQuizAvg(db,sid) >= 85) badges.push({label:"Quiz Expert", icon:"target"});
  const projRows = db.completions.filter(c=>c.studentId===sid && db.activities.find(a=>a.id===c.activityId)?.type==="Project" && c.status==="completed");
  if(projRows.length>0) badges.push({label:"Project Star", icon:"sparkle"});
  const rankAll = [...db.students].sort((a,b)=>studentPoints(db,b.id)-studentPoints(db,a.id));
  if(rankAll[0]?.id===sid) badges.push({label:"Top Performer", icon:"trophy"});
  return badges;
}
function studentRisk(db, sid){
  const att = studentOverallAttendance(db, sid);
  const act = studentActivityCompletion(db, sid);
  const asn = studentAssignmentCompletion(db, sid);
  const quiz = studentQuizAvg(db, sid);
  // simple transparent rule-based weighted risk score (0=low risk,100=high risk)
  const riskScore = Math.round((100-att)*0.35 + (100-act)*0.25 + (100-asn)*0.25 + (100-quiz)*0.15);
  const reasons = [];
  if(att < db.settings.attendanceThreshold) reasons.push("Low attendance");
  const overdueAsn = db.submissions.filter(s=>s.studentId===sid && s.status==="overdue").length;
  if(overdueAsn >= 1) reasons.push(`${overdueAsn} pending/overdue assignment${overdueAsn>1?'s':''}`);
  if(act < 60) reasons.push("Low activity participation");
  if(quiz < 60) reasons.push("Low quiz performance");
  let level = "low";
  if(riskScore >= 55) level = "high"; else if(riskScore >= 32) level = "medium";
  return {score:riskScore, level, reasons, att, act, asn, quiz};
}
function leaderboardRows(db){
  return [...db.students]
    .map(s=>({...s, points: studentPoints(db,s.id), badges: studentBadges(db,s.id)}))
    .sort((a,b)=>b.points-a.points);
}
function unreadNotifications(db, role, userId){
  return db.notifications.filter(n=>{
    if(!n.read===false) return false;
    if(n.audience===userId) return true;
    if(role==="student" && n.audience==="all-students") return true;
    if(role==="teacher" && n.audience===userId) return true;
    return false;
  }).filter(n=>!n.read);
}
function notificationsFor(db, role, userId){
  return db.notifications.filter(n => n.audience===userId || (role==="student" && n.audience==="all-students"))
    .sort((a,b)=> a.date < b.date ? 1 : -1);
}
function smartInsights(db){
  const th = db.settings.attendanceThreshold;
  const lows = db.students.filter(s=>studentOverallAttendance(db,s.id) < th);
  const overdueMulti = db.students.filter(s=>db.submissions.filter(x=>x.studentId===s.id && x.status==="overdue").length>=2);
  const subjAvg = {};
  db.subjects.forEach(subj=>{
    let a=0,t=0;
    db.students.forEach(s=>{ const v=db.studentAttendance[s.id]?.[subj]; if(v){a+=v.attended; t+=v.total;} });
    subjAvg[subj] = pct(a,t);
  });
  const lowestSubject = Object.entries(subjAvg).sort((a,b)=>a[1]-b[1])[0];
  const recentCompletions = db.completions.filter(c=>c.status==="completed").length;
  return [
    {icon:"alert", text:`${lows.length} student${lows.length!==1?'s':''} have attendance below ${th}%.`},
    {icon:"clipboard", text:`${overdueMulti.length} student${overdueMulti.length!==1?'s':''} have multiple overdue assignments.`},
    lowestSubject ? {icon:"chart", text:`${lowestSubject[0]} has the lowest class attendance this month (${lowestSubject[1]}%).`} : null,
    {icon:"sparkle", text:`${recentCompletions} activities have been completed across the class so far.`},
  ].filter(Boolean);
}

/* ============================================================================
   REUSABLE UI PRIMITIVES
============================================================================ */
function StatCard({label, value, icon, tint, trend}){
  const tints = {
    gold:{bg:"rgba(232,163,61,0.14)", fg:"var(--gold-ink)"},
    teal:{bg:"rgba(31,156,134,0.14)", fg:"var(--teal-ink)"},
    coral:{bg:"rgba(225,91,91,0.14)", fg:"var(--coral-ink)"},
    violet:{bg:"rgba(108,99,255,0.14)", fg:"var(--violet-ink)"},
    ink:{bg:"rgba(16,27,51,0.08)", fg:"var(--ink)"},
  };
  const c = tints[tint] || tints.ink;
  return (
    <div className="card stat-card">
      <div className="stat-top">
        <div className="stat-icon" style={{background:c.bg, color:c.fg}}><Ic name={icon} size={18}/></div>
        {trend && <span className="stat-trend" style={{color:c.fg}}>{trend}</span>}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function ProgressBar({value, tint="gold", h=8}){
  const colors = {gold:"var(--gold)", teal:"var(--teal)", coral:"var(--coral)", violet:"var(--violet)", ink:"var(--ink)"};
  return <div className="progress-track" style={{height:h}}><div className="progress-fill" style={{width:`${clamp(value)}%`, background:colors[tint]||colors.gold, height:h}}/></div>;
}

function Donut({value, size=110, stroke=12, tint="gold", label, sub}){
  const colors = {gold:"var(--gold)", teal:"var(--teal)", coral:"var(--coral)", violet:"var(--violet)"};
  const r = (size-stroke)/2, c = 2*Math.PI*r;
  const offset = c - (clamp(value)/100)*c;
  return (
    <div className="donut-wrap" style={{width:size, height:size}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--border)" strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={colors[tint]} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{transition:"stroke-dashoffset .5s ease"}}/>
      </svg>
      <div className="donut-center">
        <div style={{fontFamily:"var(--font-display)", fontWeight:700, fontSize:size*0.22}}>{value}%</div>
        {sub && <div style={{fontSize:10.5, color:"var(--text-muted)"}}>{sub}</div>}
      </div>
    </div>
  );
}

function MiniBarChart({data, tint="violet", height=140}){
  // data: [{label, value(0-100)}]
  const colors = {gold:"var(--gold)", teal:"var(--teal)", coral:"var(--coral)", violet:"var(--violet)"};
  const max = 100;
  return (
    <div style={{display:"flex", alignItems:"flex-end", gap:10, height, padding:"0 4px"}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6, height:"100%", justifyContent:"flex-end"}}>
          <span style={{fontSize:11, fontWeight:700, color:"var(--text-muted)"}}>{d.value}%</span>
          <div title={`${d.label}: ${d.value}%`} style={{width:"100%", maxWidth:34, height:`${(d.value/max)*(height-40)}px`, background:colors[tint], borderRadius:"6px 6px 3px 3px", transition:"height .4s ease"}}/>
          <span style={{fontSize:10.5, color:"var(--text-faint)", textAlign:"center", lineHeight:1.15}}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function MiniLineChart({data, height=140, tint="gold"}){
  const colors = {gold:"var(--gold)", teal:"var(--teal)", violet:"var(--violet)"};
  const w = 100/(data.length-1||1);
  const pts = data.map((d,i)=> `${i*w},${100-d.value}`).join(" ");
  return (
    <div style={{height}}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{width:"100%", height:height-24}}>
        <polyline points={pts} fill="none" stroke={colors[tint]} strokeWidth="2.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round"/>
        {data.map((d,i)=><circle key={i} cx={i*w} cy={100-d.value} r="1.6" fill={colors[tint]} vectorEffect="non-scaling-stroke"/>)}
      </svg>
      <div style={{display:"flex", justifyContent:"space-between", marginTop:4}}>
        {data.map((d,i)=><span key={i} style={{fontSize:10, color:"var(--text-faint)"}}>{d.label}</span>)}
      </div>
    </div>
  );
}

function Badge({tone="gray", children, icon}){
  return <span className={`badge badge-${tone}`}>{icon && <Ic name={icon} size={12}/>}{children}</span>;
}
function RiskPill({level}){
  const map = {low:{cls:"risk-low", label:"Low Risk", dot:"🟢"}, medium:{cls:"risk-medium", label:"Medium Risk", dot:"🟡"}, high:{cls:"risk-high", label:"High Risk", dot:"🔴"}};
  const m = map[level];
  return <span className={`risk-pill ${m.cls}`}>{m.dot} {m.label}</span>;
}

function EmptyState({icon="clipboard", title, sub}){
  return <div className="empty-state"><Ic name={icon} size={40}/><div style={{fontWeight:700, color:"var(--text)"}}>{title}</div>{sub && <div style={{fontSize:12.5}}>{sub}</div>}</div>;
}

function Modal({title, onClose, children, footer, width}){
  return (
    <div className="modal-backdrop" onMouseDown={(e)=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="modal" style={width?{maxWidth:width}:{}}>
        <div className="modal-head">
          <h3 style={{fontSize:17}}>{title}</h3>
          <button className="icon-btn" onClick={onClose}><Ic name="x" size={16}/></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

function ToastStack(){
  const {toasts} = useStore();
  const icons = {success:"checkCircle", error:"xCircle", info:"bell"};
  return (
    <div className="toast-stack">
      {toasts.map(t=>(
        <div key={t.id} className={`toast ${t.type}`}>
          <Ic name={icons[t.type]||"bell"} size={16}/>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function Field({label, children}){
  return <div className="field"><label>{label}</label>{children}</div>;
}

function SmartInsightBox({insights}){
  return (
    <div className="smart-insight">
      <div style={{fontWeight:700, fontSize:13.5, display:"flex", alignItems:"center", gap:7}}><Ic name="sparkle" size={16}/> Smart Insight</div>
      {insights.map((it,i)=>(
        <div className="insight-line" key={i}><Ic name={it.icon} size={14}/><span>{it.text}</span></div>
      ))}
    </div>
  );
}

function ConfirmDialog({title, message, onConfirm, onClose, danger}){
  return (
    <Modal title={title} onClose={onClose} footer={<>
      <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
      <button className={`btn ${danger?"btn-danger":"btn-primary"}`} onClick={()=>{onConfirm(); onClose();}}>Confirm</button>
    </>}>
      <p style={{fontSize:13.5, color:"var(--text-muted)"}}>{message}</p>
    </Modal>
  );
}

/* ============================================================================
   AUTH
============================================================================ */
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

function AuthProvider({children}){
  const {db} = useStore();
  const [session, setSession] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem("smartedu_session")||"null"); }catch(e){ return null; }
  });
  const login = (role, email, password) => {
    const pool = role==="student"?db.students: role==="teacher"?db.teachers: role==="parent"?db.parents: db.admins;
    const found = pool.find(u=>u.email.toLowerCase()===email.toLowerCase() && u.password===password);
    if(!found) return {ok:false, error:"Invalid email or password for this role."};
    const s = {role, id:found.id};
    setSession(s);
    localStorage.setItem("smartedu_session", JSON.stringify(s));
    return {ok:true};
  };
  const logout = () => { setSession(null); localStorage.removeItem("smartedu_session"); };
  const user = useMemo(()=>{
    if(!session) return null;
    const pool = session.role==="student"?db.students: session.role==="teacher"?db.teachers: session.role==="parent"?db.parents: db.admins;
    return pool.find(u=>u.id===session.id) || null;
  }, [session, db]);
  return <AuthCtx.Provider value={{session, user, login, logout}}>{children}</AuthCtx.Provider>;
}

const initials = (name) => name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();

function LoginPage(){
  const {login} = useAuth();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const demo = {
    student:{email:"student@smartedu.com", password:"student123"},
    teacher:{email:"teacher@smartedu.com", password:"teacher123"},
    admin:{email:"admin@smartedu.com", password:"admin123"},
    parent:{email:"parent@smartedu.com", password:"parent123"},
  };
  const fillDemo = () => { setEmail(demo[role].email); setPassword(demo[role].password); setError(""); };

  const submit = (e) => {
    e.preventDefault();
    const res = login(role, email.trim(), password);
    if(!res.ok) setError(res.error);
  };

  return (
    <div className="login-wrap">
      <div className="login-side">
        <div style={{display:"flex", alignItems:"center", gap:11, marginBottom:34}}>
          <div className="brand-mark" style={{width:42, height:42, fontSize:20}}>S</div>
          <div>
            <div style={{fontFamily:"var(--font-display)", fontWeight:700, fontSize:22}}>SmartEdu</div>
            <div style={{fontSize:11, color:"#93A2C4", letterSpacing:"0.08em", textTransform:"uppercase"}}>Curriculum &amp; Attendance OS</div>
          </div>
        </div>
        <h1 style={{fontSize:38, lineHeight:1.15, maxWidth:480, color:"#fff", fontWeight:600}}>Attendance that becomes a better academic day.</h1>
        <p style={{color:"#9FB0D1", fontSize:14.5, marginTop:16, maxWidth:440, lineHeight:1.6}}>Verified QR attendance, classroom presence checks, smart timetable planning, free-period recommendations and early academic alerts — unified for teachers, students and parents.</p>
        <div style={{marginTop:32, paddingTop:24, borderTop:"1px solid rgba(255,255,255,0.1)"}}>
          {[
            "Teacher starts a 60‑second dynamic QR session",
            "Student scans in — attendance updates instantly",
            "Free periods become personalized study opportunities",
            "Parents receive meaningful academic alerts",
          ].map((t,i)=>(
            <div className="flow-step" key={i}><div className="flow-num">{i+1}</div><span style={{color:"#C9D4EA", fontSize:13.5}}>{t}</span></div>
          ))}
        </div>
      </div>
      <div className="login-form-side">
        <div className="login-card">
          <div style={{marginBottom:22}}>
            <h2 style={{fontSize:23}}>Welcome back</h2>
            <p style={{color:"var(--text-muted)", fontSize:13.5, marginTop:4}}>Sign in to your SmartEdu account</p>
          </div>
          <div className="role-tab-group">
            {["student","teacher","parent","admin"].map(r=>(
              <div key={r} className={`role-tab ${role===r?"active":""}`} onClick={()=>{setRole(r); setError("");}} style={{cursor:"pointer", textTransform:"capitalize"}}>{r}</div>
            ))}
          </div>
          <form onSubmit={submit}>
            <Field label="Email">
              <input className="input" type="email" placeholder="you@smartedu.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
            </Field>
            <Field label="Password">
              <input className="input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required/>
            </Field>
            {error && <div style={{color:"var(--coral-ink)", fontSize:12.5, marginBottom:12, fontWeight:600}}>{error}</div>}
            <button className="btn btn-primary btn-block" type="submit" style={{marginBottom:10}}>Sign in as {role}</button>
            <button type="button" className="btn btn-outline btn-block" onClick={fillDemo}>Autofill demo {role} account</button>
          </form>
          <div style={{marginTop:22, paddingTop:18, borderTop:"1px solid var(--border)"}}>
            <div style={{fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--text-faint)", marginBottom:8, fontWeight:700}}>Demo credentials</div>
            {Object.entries(demo).map(([r,d])=>(
              <div className="demo-chip" key={r}><span style={{textTransform:"capitalize", fontWeight:600}}>{r}</span><span className="mono" style={{color:"var(--text-muted)"}}>{d.email} / {d.password}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   NAVIGATION CONFIG
============================================================================ */
const NAV = {
  student:[
    {k:"dashboard", label:"Dashboard", icon:"dashboard"},
    {k:"attendance", label:"Attendance", icon:"qr"},
    {k:"planner", label:"My Day", icon:"calendarOff"},
    {k:"activities", label:"My Activities", icon:"activity"},
    {k:"assignments", label:"Assignments", icon:"clipboard"},
    {k:"progress", label:"Progress", icon:"chart"},
    {k:"leaderboard", label:"Leaderboard", icon:"trophy"},
    {k:"leave", label:"Leave Requests", icon:"calendarOff"},
    {k:"notifications", label:"Notifications", icon:"bell"},
    {k:"profile", label:"Profile", icon:"user"},
  ],
  teacher:[
    {k:"dashboard", label:"Dashboard", icon:"dashboard"},
    {k:"attendance", label:"Attendance", icon:"qr"},
    {k:"students", label:"Students", icon:"users"},
    {k:"classes", label:"My Classes", icon:"layers"},
    {k:"activities", label:"Activities", icon:"activity"},
    {k:"assignments", label:"Assignments", icon:"clipboard"},
    {k:"leave", label:"Leave Requests", icon:"calendarOff"},
    {k:"atrisk", label:"At-Risk Students", icon:"shield"},
    {k:"notifications", label:"Notifications", icon:"bell"},
    {k:"reports", label:"Reports", icon:"file"},
    {k:"profile", label:"Profile", icon:"user"},
  ],
  parent:[
    {k:"dashboard", label:"Child Overview", icon:"dashboard"},
    {k:"planner", label:"Daily Plan", icon:"calendarOff"},
    {k:"notifications", label:"Alerts", icon:"bell"},
    {k:"profile", label:"Profile", icon:"user"},
  ],
  admin:[
    {k:"dashboard", label:"Dashboard", icon:"dashboard"},
    {k:"students", label:"Students", icon:"users"},
    {k:"teachers", label:"Teachers", icon:"user"},
    {k:"departments", label:"Departments", icon:"building"},
    {k:"classes", label:"Classes", icon:"layers"},
    {k:"attendance", label:"Attendance", icon:"qr"},
    {k:"activities", label:"Activities", icon:"activity"},
    {k:"analytics", label:"Analytics", icon:"chart"},
    {k:"reports", label:"Reports", icon:"file"},
    {k:"notifications", label:"Notifications", icon:"bell"},
    {k:"settings", label:"Settings", icon:"settings"},
  ],
};

/* ============================================================================
   APP SHELL
============================================================================ */
function useHashRoute(defaultRoute){
  const [route, setRoute] = useState(()=> window.location.hash.replace("#","") || defaultRoute);
  useEffect(()=>{
    const onHash = () => setRoute(window.location.hash.replace("#","") || defaultRoute);
    window.addEventListener("hashchange", onHash);
    return ()=>window.removeEventListener("hashchange", onHash);
  }, [defaultRoute]);
  const go = (r) => { window.location.hash = r; };
  return [route, go];
}

function Shell(){
  const {user, session, logout} = useAuth();
  const {db, toast, resetDemo} = useStore();
  const [route, go] = useHashRoute(`${session.role}/dashboard`);
  const [theme, setTheme] = useState(()=>localStorage.getItem("smartedu_theme")||"light");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(()=>{ document.documentElement.setAttribute("data-theme", theme); localStorage.setItem("smartedu_theme", theme); }, [theme]);

  const parts = route.split("/");
  const routeRole = parts[0];
  // Always bind the visible application area to the authenticated role.
  // This prevents a previous role's hash (for example #student/dashboard)
  // from causing Teacher, Parent, or Admin to see the Student dashboard.
  const role = routeRole === session.role ? routeRole : session.role;
  const page = routeRole === session.role ? (parts[1] || "dashboard") : "dashboard";
  const navItems = NAV[role] || NAV.student;
  const current = navItems.find(n=>n.k===page) || navItems[0];

  useEffect(()=>{
    if(routeRole !== session.role){
      window.location.hash = `${session.role}/dashboard`;
    }
  }, [session.role, routeRole]);

  const myNotifs = notificationsFor(db, role, user.id);
  const unread = myNotifs.filter(n=>!n.read).length;

  const markAllRead = () => {
    // handled via store update below in a wrapper, but keep here for topbar quick action
  };

  return (
    <div className="app-shell">
      <div className={`sidebar ${sidebarOpen?"open":""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">S</div>
          <div>
            <div className="brand-name">SmartEdu</div>
            <div className="brand-sub">Campus OS</div>
          </div>
        </div>
        <div className="side-nav">
          <div className="side-section-label">{role} Menu</div>
          {navItems.map(item=>(
            <a key={item.k} href={`#${role}/${item.k}`} className={`side-link ${page===item.k?"active":""}`} onClick={()=>setSidebarOpen(false)}>
              <Ic name={item.icon} size={17}/> {item.label}
            </a>
          ))}
        </div>
        <div className="side-foot">
          <div className="role-chip" style={{marginBottom:12}}><Ic name="shield" size={12}/>{role}</div>
          <button className="btn btn-outline btn-block btn-sm" onClick={logout}><Ic name="logout" size={14}/> Log out</button>
        </div>
      </div>

      <div className="main-col">
        <div className="topbar">
          <div style={{display:"flex", alignItems:"center", gap:12, flex:1, minWidth:0}}>
            <button className="icon-btn hamburger" onClick={()=>setSidebarOpen(v=>!v)}><Ic name="menu" size={18}/></button>
            <div className="topbar-search">
              <Ic name="search" size={16}/>
              <input placeholder={`Search ${role==="admin"?"students, teachers, reports…":"activities, assignments…"}`} value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="icon-btn" onClick={()=>setTheme(t=>t==="light"?"dark":"light")} title="Toggle theme">
              <Ic name={theme==="light"?"moon":"sun"} size={17}/>
            </button>
            <div style={{position:"relative"}}>
              <button className="icon-btn" onClick={()=>setNotifOpen(v=>!v)} title="Notifications">
                <Ic name="bell" size={17}/>
                {unread>0 && <span className="badge-dot">{unread}</span>}
              </button>
              {notifOpen && <NotifDropdown onClose={()=>setNotifOpen(false)} role={role} user={user} go={go}/>}
            </div>
            <div className="user-pill" onClick={()=>go(`${role}/profile`)}>
              <div className="avatar" style={{background: user.color || "var(--ink)"}}>{initials(user.name)}</div>
              <div style={{lineHeight:1.1, display:window.innerWidth<680?"none":"block"}}>
                <div style={{fontSize:12.5, fontWeight:700}}>{user.name.split(" ")[0]}</div>
                <div style={{fontSize:10.5, color:"var(--text-faint)", textTransform:"capitalize"}}>{role}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <PageHeader role={role} page={page} current={current}/>
          <PageRouter role={role} page={page} go={go} search={search}/>
        </div>
      </div>
      {sidebarOpen && <div onClick={()=>setSidebarOpen(false)} style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:35}}/>}
    </div>
  );
}

function PageHeader({role, page, current}){
  const titles = {
    dashboard:"Dashboard overview", attendance:"Attendance & Integrity", students:"Students", activities:"Curriculum activities", planner:"Timetable & Personalized Planner",
    assignments:"Assignments", leave:"Leave requests", atrisk:"At-risk students", notifications:"Notification center",
    reports:"Reports", profile:"Profile", progress:"Academic progress", leaderboard:"Leaderboard",
    teachers:"Teachers", departments:"Departments", classes:"Classes", analytics:"Institution analytics", settings:"Settings",
  };
  return (
    <div className="section-head">
      <div>
        <span className="section-title eyebrow" style={{display:"block"}}>{role} · {page}</span>
        <h2 style={{fontSize:24}}>{titles[page]||current.label}</h2>
      </div>
    </div>
  );
}

function NotifDropdown({onClose, role, user, go}){
  const {db, update} = useStore();
  const items = notificationsFor(db, role, user.id).slice(0,7);
  const typeIcon = {assignment:"clipboard", attendance:"alert", leave:"calendarOff", achievement:"award", announcement:"bell", progress:"chart"};
  return (
    <div className="card" style={{position:"absolute", right:0, top:46, width:340, zIndex:60, maxHeight:420, overflowY:"auto"}} onMouseLeave={onClose}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", borderBottom:"1px solid var(--border)"}}>
        <strong style={{fontSize:13.5}}>Notifications</strong>
        <button className="btn btn-ghost btn-sm" onClick={()=>{ update(db=>{db.notifications.forEach(n=>{ if(n.audience===user.id || (role==="student"&&n.audience==="all-students")) n.read=true; }); }); }}>Mark all read</button>
      </div>
      {items.length===0 && <div style={{padding:18}}><EmptyState icon="bell" title="You're all caught up" /></div>}
      {items.map(n=>(
        <div key={n.id} style={{display:"flex", gap:10, padding:"11px 14px", borderBottom:"1px solid var(--border)", background:n.read?"transparent":"var(--card-2)"}}>
          <Ic name={typeIcon[n.type]||"bell"} size={16} style={{marginTop:2, flexShrink:0, color:"var(--gold-ink)"}}/>
          <div style={{minWidth:0}}>
            <div style={{fontSize:12.5, fontWeight:700}}>{n.title}</div>
            <div style={{fontSize:12, color:"var(--text-muted)", marginTop:1}}>{n.message}</div>
            <div style={{fontSize:10.5, color:"var(--text-faint)", marginTop:3}}>{n.date}</div>
          </div>
        </div>
      ))}
      <div style={{padding:10}}>
        <button className="btn btn-outline btn-block btn-sm" onClick={()=>{go(`${role}/notifications`); onClose();}}>View all notifications</button>
      </div>
    </div>
  );
}

/* ============================================================================
   PAGE ROUTER
============================================================================ */
function PageRouter({role, page, go, search}){
  const {user} = useAuth();
  const key = `${role}/${page}`;
  const props = {go, search, user};
  switch(key){
    case "student/dashboard": return <StudentDashboard {...props}/>;
    case "student/attendance": return <StudentAttendance {...props}/>;
    case "student/planner": return <StudentPlanner {...props}/>;
    case "student/activities": return <StudentActivities {...props}/>;
    case "student/assignments": return <StudentAssignments {...props}/>;
    case "student/progress": return <StudentProgress {...props}/>;
    case "student/leaderboard": return <Leaderboard {...props}/>;
    case "student/leave": return <StudentLeave {...props}/>;
    case "student/notifications": return <NotificationsPage {...props} role={role}/>;
    case "student/profile": return <ProfilePage {...props} role={role}/>;

    case "teacher/dashboard": return <TeacherDashboard {...props}/>;
    case "teacher/attendance": return <TeacherAttendance {...props}/>;
    case "teacher/students": return <TeacherStudents {...props}/>;
    case "teacher/classes": return <TeacherClasses {...props}/>;
    case "teacher/activities": return <TeacherActivities {...props}/>;
    case "teacher/assignments": return <TeacherAssignments {...props}/>;
    case "teacher/leave": return <TeacherLeave {...props}/>;
    case "teacher/atrisk": return <AtRiskStudents {...props}/>;
    case "teacher/notifications": return <NotificationsPage {...props} role={role} canCompose/>;
    case "teacher/reports": return <ReportsPage {...props} role={role}/>;
    case "teacher/profile": return <ProfilePage {...props} role={role}/>;

    case "parent/dashboard": return <ParentDashboard {...props}/>;
    case "parent/planner": return <ParentPlanner {...props}/>;
    case "parent/notifications": return <NotificationsPage {...props} role={role}/>;
    case "parent/profile": return <ProfilePage {...props} role={role}/>;

    case "admin/dashboard": return <AdminDashboard {...props}/>;
    case "admin/students": return <AdminStudents {...props}/>;
    case "admin/teachers": return <AdminTeachers {...props}/>;
    case "admin/departments": return <AdminSimpleList {...props} field="departments" title="Departments" icon="building"/>;
    case "admin/classes": return <AdminSimpleList {...props} field="classes" title="Classes" icon="layers"/>;
    case "admin/attendance": return <TeacherAttendance {...props} adminView/>;
    case "admin/activities": return <TeacherActivities {...props} adminView/>;
    case "admin/analytics": return <AdminAnalytics {...props}/>;
    case "admin/reports": return <ReportsPage {...props} role={role}/>;
    case "admin/notifications": return <NotificationsPage {...props} role={role} canCompose/>;
    case "admin/settings": return <AdminSettings {...props}/>;
    default: return <EmptyState icon="alert" title="Page not found"/>;
  }
}

/* ============================================================================
   STUDENT PAGES
============================================================================ */
function todayWeekday(){
  const d = new Date(todayISO()+"T12:00:00");
  return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()];
}

function todaySchedule(db){
  const day = todayWeekday();
  const exact = (db.timetable||[]).find(x=>x.day===day);
  return exact?.slots || (db.timetable||[])[0]?.slots || [];
}

function studentRecommendations(db, sid){
  const s = db.students.find(x=>x.id===sid);
  if(!s) return [];
  const rows = db.subjects.map(subject=>{
    const a = db.studentAttendance[sid]?.[subject] || {attended:0,total:0};
    const att = pct(a.attended,a.total);
    const quizRows = db.quizScores.filter(q=>q.studentId===sid && q.subject===subject);
    const quiz = quizRows.length ? pct(quizRows.reduce((x,q)=>x+q.score,0), quizRows.reduce((x,q)=>x+q.max,0)) : 75;
    const overdue = db.submissions.filter(x=>x.studentId===sid && x.status==="overdue").map(x=>db.assignments.find(a=>a.id===x.assignmentId)?.subject).filter(Boolean).includes(subject);
    const score = Math.round((100-att)*0.55 + (100-quiz)*0.25 + (overdue?20:0));
    return {subject, att, quiz, overdue, score};
  }).sort((a,b)=>b.score-a.score);
  const top = rows.slice(0,3);
  return top.map((r,i)=>({
    id:`rec_${sid}_${i}`,
    subject:r.subject,
    title:r.overdue ? `Finish ${r.subject} assignment` : r.att < db.settings.attendanceThreshold ? `Revise ${r.subject} & protect attendance` : `Practice ${r.subject}`,
    minutes:r.overdue?30:(r.att<db.settings.attendanceThreshold?25:20),
    reason:r.overdue ? "An assignment is overdue." : r.att < db.settings.attendanceThreshold ? `Attendance is ${r.att}%, below the ${db.settings.attendanceThreshold}% target.` : `Your recent ${r.subject} performance can improve further.`,
    priority:i===0?"High":i===1?"Medium":"Suggested"
  }));
}

function freePeriods(db){
  return todaySchedule(db).filter(slot=>!slot.subject);
}

function StudentDashboard({go, user}){
  const {db} = useStore();
  const att = studentOverallAttendance(db, user.id);
  const act = studentActivityCompletion(db, user.id);
  const asn = studentAssignmentCompletion(db, user.id);
  const prog = studentProgressScore(db, user.id);
  const pts = studentPoints(db, user.id);
  const board = leaderboardRows(db);
  const myRank = board.findIndex(b=>b.id===user.id)+1;
  const upcomingActs = db.activities.filter(a=>{
    const c = db.completions.find(c=>c.activityId===a.id && c.studentId===user.id);
    return c && c.status!=="completed";
  }).slice(0,4);
  const pendingAsn = db.submissions.filter(s=>s.studentId===user.id && s.status!=="submitted").slice(0,4);
  const notifs = notificationsFor(db, "student", user.id).slice(0,4);
  const insights = smartInsights(db).slice(0,3);
  const todaysClasses = db.subjects.slice(0,3).map((s,i)=>({subject:s, time:["9:00 AM","10:00 AM","2:00 PM"][i]}));

  return (
    <div>
      <div className="card card-pad" style={{marginBottom:18, background:"linear-gradient(120deg, var(--ink), var(--ink-3))", color:"#fff", border:"none"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:14}}>
          <div>
            <div style={{fontSize:12, color:"#9FB0D1", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700}}>Welcome back</div>
            <h1 style={{fontSize:26, color:"#fff", marginTop:4}}>{user.name}</h1>
            <div style={{fontSize:12.5, color:"#B9C4DE", marginTop:4}}>{user.roll} · {user.dept} · {user.cls}</div>
          </div>
          <button className="btn btn-gold" onClick={()=>go("student/attendance")}><Ic name="scan" size={15}/> Scan Attendance</button>
        </div>
      </div>

      <div className="grid grid-stats" style={{marginBottom:18}}>
        <StatCard label="Attendance" value={`${att}%`} icon="qr" tint={att>=75?"teal":"coral"}/>
        <StatCard label="Activities done" value={`${act}%`} icon="activity" tint="violet"/>
        <StatCard label="Assignments done" value={`${asn}%`} icon="clipboard" tint="gold"/>
        <StatCard label="Academic progress" value={`${prog}%`} icon="chart" tint="teal"/>
        <StatCard label="Activity points" value={pts} icon="trophy" tint="gold"/>
      </div>

      <div className="card card-pad" style={{marginBottom:18, background:"linear-gradient(135deg, rgba(108,99,255,0.08), rgba(232,163,61,0.10))"}}>
        <div className="section-head" style={{marginBottom:10}}><div><div className="section-title">🧠 Your day, intelligently planned</div><div style={{fontSize:12, color:"var(--text-muted)", marginTop:3}}>Free periods are matched with the academic work that matters most right now.</div></div><button className="btn btn-gold btn-sm" onClick={()=>go("student/planner")}>Open my plan →</button></div>
        <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>{freePeriods(db).map((f,i)=><Badge key={i} tone="violet">Free {f.time}–{f.end}</Badge>)}</div>
      </div>

      <div className="grid grid-2" style={{marginBottom:18}}>
        <div className="card card-pad">
          <div className="section-title" style={{marginBottom:12}}>Today's classes</div>
          {todaysClasses.map((c,i)=>(
            <div className="list-row" key={i}>
              <div style={{display:"flex", alignItems:"center", gap:10}}>
                <div style={{width:34, height:34, borderRadius:9, background:"var(--card-2)", display:"flex", alignItems:"center", justifyContent:"center"}}><Ic name="book" size={15}/></div>
                <div><div style={{fontWeight:600, fontSize:13.5}}>{c.subject}</div><div style={{fontSize:11.5, color:"var(--text-faint)"}}>{c.time}</div></div>
              </div>
              <Badge tone="gray">Scheduled</Badge>
            </div>
          ))}
        </div>
        <SmartInsightBox insights={insights}/>
      </div>

      <div className="grid grid-2" style={{marginBottom:18}}>
        <div className="card card-pad">
          <div className="section-title" style={{marginBottom:12}}>Upcoming activities</div>
          {upcomingActs.length===0 ? <EmptyState icon="activity" title="Nothing pending" sub="You're fully caught up on activities."/> :
            upcomingActs.map(a=>(
              <div className="list-row" key={a.id}>
                <div><div style={{fontWeight:600, fontSize:13.5}}>{a.title}</div><div style={{fontSize:11.5, color:"var(--text-faint)"}}>{a.subject} · due {a.deadline}</div></div>
                <Badge tone="violet">{a.type}</Badge>
              </div>
            ))}
        </div>
        <div className="card card-pad">
          <div className="section-title" style={{marginBottom:12}}>Pending assignments</div>
          {pendingAsn.length===0 ? <EmptyState icon="clipboard" title="No pending assignments"/> :
            pendingAsn.map(s=>{
              const a = db.assignments.find(x=>x.id===s.assignmentId);
              return (
                <div className="list-row" key={s.id}>
                  <div><div style={{fontWeight:600, fontSize:13.5}}>{a.title}</div><div style={{fontSize:11.5, color:"var(--text-faint)"}}>Due {a.deadline}</div></div>
                  <Badge tone={s.status==="overdue"?"red":"gold"}>{s.status}</Badge>
                </div>
              );
            })}
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card card-pad">
          <div className="section-title" style={{marginBottom:12}}>Recent notifications</div>
          {notifs.map(n=><div className="list-row" key={n.id}><div><div style={{fontWeight:600, fontSize:13}}>{n.title}</div><div style={{fontSize:11.5, color:"var(--text-faint)"}}>{n.message}</div></div>{!n.read && <span style={{width:8, height:8, borderRadius:"50%", background:"var(--coral)", flexShrink:0}}/>}</div>)}
        </div>
        <div className="card card-pad" style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10}}>
          <div className="section-title" style={{alignSelf:"flex-start", marginBottom:0}}>Leaderboard position</div>
          <div style={{fontFamily:"var(--font-display)", fontSize:44, fontWeight:700, color:"var(--gold-ink)"}}>#{myRank}</div>
          <div style={{fontSize:12.5, color:"var(--text-muted)"}}>{pts} activity points</div>
          <button className="btn btn-outline btn-sm" onClick={()=>go("student/leaderboard")}>View full leaderboard</button>
        </div>
      </div>
    </div>
  );
}

function StudentAttendance({user}){
  const {db, update, toast} = useStore();
  const [scanOpen, setScanOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const th = db.settings.attendanceThreshold;
  const overall = studentOverallAttendance(db, user.id);
  const subs = db.studentAttendance[user.id] || {};

  const activeSessions = db.attendanceSessions.filter(s=>s.active && new Date(s.expiresAt).getTime() > Date.now());
  const alreadyMarkedIds = new Set(db.attendanceLog.filter(l=>l.studentId===user.id).map(l=>l.sessionId));

  const verifyAndMark = (session) => {
    if(!navigator.geolocation){
      toast("Location services are unavailable. Use the demo verification button for the prototype.", "error");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos=>{
        const distance = distanceMeters(pos.coords.latitude, pos.coords.longitude, session.classroomLat||DEMO_CAMPUS.lat, session.classroomLng||DEMO_CAMPUS.lng);
        markAttendance(session, distance <= (session.radiusMeters||CLASSROOM_RADIUS_M) ? "verified" : "mismatch", distance);
        setLocating(false);
      },
      ()=>{ setLocating(false); toast("Could not read your location. Allow location access and try again.", "error"); },
      {enableHighAccuracy:true, timeout:7000, maximumAge:0}
    );
  };

  const markAttendance = (session, mode="verified", measuredDistance=null) => {
    if(new Date(session.expiresAt).getTime() <= Date.now()){ toast("QR expired — ask your teacher to regenerate.", "error"); return; }
    if(alreadyMarkedIds.has(session.id)){ toast("Attendance already marked for this session.", "error"); return; }

    const isMismatch = mode === "mismatch";
    const distance = measuredDistance == null ? (isMismatch ? 850 : 12) : measuredDistance;
    update(d=>{
      const sess = d.attendanceSessions.find(s=>s.id===session.id);
      if(!sess) return;
      const status = isMismatch ? "mismatch" : "verified";
      const reason = isMismatch ? "Location is outside the classroom radius." : "Location verified within classroom radius.";
      const time = new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
      sess.records.push({studentId:user.id, time, proximityStatus:status, distanceMeters:distance, reason});
      // Only verified proximity counts as present. Suspicious scans remain visible to the teacher for review.
      if(status === "verified") {
        const at = d.studentAttendance[user.id][sess.subject] || {attended:0,total:0};
        at.attended += 1; at.total += 1;
        d.studentAttendance[user.id][sess.subject] = at;
      }
      d.attendanceLog.push({sessionId:sess.id, studentId:user.id, subject:sess.subject, date:sess.date, time, proximityStatus:status, distanceMeters:distance});
      if(status === "mismatch") d.notifications.unshift({id:uid("nt"), audience:user.id, type:"attendance", title:"Attendance requires review", message:`Your ${sess.subject} scan was detected outside the classroom proximity and was sent to your teacher for review.`, read:false, date:todayISO()});
    });
    toast(isMismatch ? "Location mismatch detected — sent for teacher review." : `Attendance verified for ${session.subject}`, isMismatch ? "error" : "success");
    setScanOpen(false);
  };

  return (
    <div>
      <div className="grid grid-3" style={{marginBottom:18}}>
        <div className="card card-pad" style={{display:"flex", flexDirection:"column", alignItems:"center", gap:8}}>
          <Donut value={overall} tint={overall>=th?"teal":"coral"} sub="Overall"/>
          <Badge tone={overall>=th?"green":"red"}>{overall>=th ? "🟢 Good Attendance" : "🔴 Attendance Shortage"}</Badge>
        </div>
        <div className="card card-pad">
          <div className="stat-label">Required attendance</div>
          <div className="stat-value" style={{marginTop:6}}>{th}%</div>
          <p style={{fontSize:12, color:"var(--text-muted)", marginTop:8}}>Institution policy minimum to sit for semester exams.</p>
        </div>
        <div className="card card-pad" style={{display:"flex", flexDirection:"column", justifyContent:"center", gap:10}}>
          <button className="btn btn-gold btn-block" onClick={()=>setScanOpen(true)}><Ic name="scan" size={16}/> Scan Attendance QR</button>
          <span style={{fontSize:11.5, color:"var(--text-faint)"}}>{activeSessions.length} live session{activeSessions.length!==1?"s":""} right now</span>
        </div>
      </div>

      <div className="card card-pad" style={{marginBottom:18,background:"linear-gradient(135deg,var(--card),var(--card-2))"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:14,alignItems:"center",flexWrap:"wrap"}}>
          <div>
            <div className="section-title">🔐 Attendance Integrity</div>
            <div style={{fontSize:12,color:"var(--text-muted)",marginTop:5}}>Attendance is accepted only after the QR is valid and your device location is within the classroom radius.</div>
          </div>
          <Badge tone="green">QR + Proximity Verified</Badge>
        </div>
      </div>

      <div className="card card-pad">
        <div className="section-title" style={{marginBottom:14}}>Subject-wise attendance</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Subject</th><th>Attended</th><th>Missed</th><th>Required</th><th>% </th><th>Status</th><th style={{width:220}}>Classes needed</th></tr></thead>
            <tbody>
              {db.subjects.map(subj=>{
                const v = subs[subj] || {attended:0,total:0};
                const p = pct(v.attended, v.total);
                const missed = v.total - v.attended;
                // classes needed to reach threshold assuming attending every future class, total grows by 1 each time
                let need = 0; let a=v.attended, t=v.total;
                if(p < th){ while(t>0 && pct(a+need+1, t+need+1) < th && need < 60){ need++; } need = need+1 <= 60 ? need+1 : need; }
                return (
                  <tr key={subj}>
                    <td style={{fontWeight:600}}>{subj}</td>
                    <td>{v.attended}</td>
                    <td>{missed}</td>
                    <td>{th}%</td>
                    <td style={{fontWeight:700}}>{p}%</td>
                    <td>{p>=th ? <Badge tone="green">Good</Badge> : <Badge tone="red">Shortage</Badge>}</td>
                    <td style={{minWidth:180}}>
                      <div style={{display:"flex", alignItems:"center", gap:8}}>
                        <ProgressBar value={p} tint={p>=th?"teal":"coral"}/>
                        <span style={{fontSize:11.5, color:"var(--text-faint)", whiteSpace:"nowrap"}}>{p>=th ? "On track" : `${need} more`}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {scanOpen && (
        <Modal title="Scan attendance QR" onClose={()=>setScanOpen(false)}>
          {activeSessions.length===0 ? (
            <EmptyState icon="qr" title="No live sessions" sub="Ask your teacher to start attendance — this list updates automatically."/>
          ) : (
            <div>
              {activeSessions.map(s=>{
                const marked = alreadyMarkedIds.has(s.id);
                const secsLeft = Math.max(0, Math.round((new Date(s.expiresAt).getTime()-Date.now())/1000));
                return (
                  <div key={s.id} className="card card-pad" style={{marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:700, fontSize:13.5}}>{s.subject}</div>
                      <div style={{fontSize:11.5, color:"var(--text-faint)"}} className="mono">expires in {secsLeft}s · code {s.code}</div>
                      <div style={{fontSize:10.5,color:"var(--teal-ink)",marginTop:3}}>📍 Must be within {s.radiusMeters||CLASSROOM_RADIUS_M}m of {s.room||"the classroom"}</div>
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
                      <button className="btn btn-sm btn-primary" disabled={marked||locating} onClick={()=>verifyAndMark(s)}>
                        {marked ? "Marked ✓" : locating ? "Checking location…" : "Verify Location & Mark"}
                      </button>
                      {!marked && <><button className="btn btn-sm btn-outline" onClick={()=>markAttendance(s,"verified",12)}>Demo: Inside</button><button className="btn btn-sm btn-outline" onClick={()=>markAttendance(s,"mismatch",850)}>Demo: Outside</button></>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

function StudentActivities({user}){
  const {db, update, toast} = useStore();
  const [tab, setTab] = useState("upcoming");
  const rows = db.completions.filter(c=>c.studentId===user.id).map(c=>({...c, activity: db.activities.find(a=>a.id===c.activityId)}));
  const now = todayISO();
  const buckets = {
    upcoming: rows.filter(r=>r.status!=="completed" && r.activity.deadline >= now),
    completed: rows.filter(r=>r.status==="completed"),
    pending: rows.filter(r=>r.status==="pending"),
    overdue: rows.filter(r=>r.status==="overdue" || (r.status!=="completed" && r.activity.deadline < now)),
  };
  const complete = (compId) => {
    update(d=>{
      const c = d.completions.find(x=>x.id===compId);
      const act = d.activities.find(a=>a.id===c.activityId);
      c.status = "completed"; c.submittedAt = todayISO(); c.points = act.maxPoints;
    });
    toast("Activity marked as completed — points added!", "success");
  };
  return (
    <div>
      <div className="tabs">
        {["upcoming","completed","pending","overdue"].map(t=>(
          <div key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)} style={{textTransform:"capitalize", cursor:"pointer"}}>{t} ({buckets[t].length})</div>
        ))}
      </div>
      <div className="grid grid-3">
        {buckets[tab].length===0 && <EmptyState icon="activity" title={`No ${tab} activities`}/>}
        {buckets[tab].map(r=>(
          <div className="card card-pad" key={r.id}>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <Badge tone="violet">{r.activity.type}</Badge>
              <Badge tone={r.status==="completed"?"green":r.status==="overdue"?"red":"gold"}>{r.status}</Badge>
            </div>
            <h3 style={{fontSize:15.5, marginTop:10}}>{r.activity.title}</h3>
            <p style={{fontSize:12.5, color:"var(--text-muted)", marginTop:6}}>{r.activity.description}</p>
            <div style={{display:"flex", justifyContent:"space-between", fontSize:11.5, color:"var(--text-faint)", marginTop:12}}>
              <span>{r.activity.subject}</span><span>Due {r.activity.deadline}</span>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12}}>
              <span className="mono" style={{fontSize:11.5, color:"var(--gold-ink)", fontWeight:700}}>{r.activity.maxPoints} pts</span>
              {r.status!=="completed" && <button className="btn btn-sm btn-primary" onClick={()=>complete(r.id)}>Mark complete</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentAssignments({user}){
  const {db, update, toast} = useStore();
  const rows = db.submissions.filter(s=>s.studentId===user.id).map(s=>({...s, assignment: db.assignments.find(a=>a.id===s.assignmentId)}));
  const submit = (subId) => {
    update(d=>{
      const s = d.submissions.find(x=>x.id===subId);
      const a = d.assignments.find(x=>x.id===s.assignmentId);
      s.status = "submitted"; s.submittedAt = todayISO(); s.marks = null;
    });
    toast("Assignment submitted successfully 🟢", "success");
  };
  return (
    <div className="grid grid-2">
      {rows.map(r=>{
        const overdue = r.status!=="submitted" && r.assignment.deadline < todayISO();
        const dueSoon = r.status!=="submitted" && !overdue && r.assignment.deadline === "2026-08-11";
        return (
          <div className="card card-pad" key={r.id}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
              <div>
                <h3 style={{fontSize:15.5}}>{r.assignment.title}</h3>
                <div style={{fontSize:12, color:"var(--text-faint)", marginTop:3}}>{r.assignment.subject} · Max marks {r.assignment.maxMarks}</div>
              </div>
              {r.status==="submitted" ? <Badge tone="green">🟢 Submitted</Badge> : overdue ? <Badge tone="red">🔴 Overdue</Badge> : <Badge tone="gold">Pending</Badge>}
            </div>
            <p style={{fontSize:12.5, color:"var(--text-muted)", marginTop:10}}>{r.assignment.instructions}</p>
            {dueSoon && <div style={{marginTop:10}}><Badge tone="gold">🔔 Assignment due tomorrow</Badge></div>}
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:14}}>
              <span className="mono" style={{fontSize:11.5, color:"var(--text-faint)"}}>Due {r.assignment.deadline}</span>
              {r.status!=="submitted" ? <button className="btn btn-sm btn-primary" onClick={()=>submit(r.id)}>Submit assignment</button> : <span style={{fontSize:11.5, color:"var(--text-muted)"}}>{r.marks!=null?`${r.marks}/${r.assignment.maxMarks} marks`:"Awaiting grading"}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StudentProgress({user}){
  const {db} = useStore();
  const att = studentOverallAttendance(db, user.id);
  const act = studentActivityCompletion(db, user.id);
  const asn = studentAssignmentCompletion(db, user.id);
  const quiz = studentQuizAvg(db, user.id);
  const proj = studentProjectCompletion(db, user.id);
  const prog = studentProgressScore(db, user.id);
  const risk = studentRisk(db, user.id);
  return (
    <div>
      <div className="grid grid-2" style={{marginBottom:18}}>
        <div className="card card-pad" style={{display:"flex", alignItems:"center", gap:22}}>
          <Donut value={prog} size={130} tint="violet" sub="Overall"/>
          <div>
            <div className="eyebrow" style={{fontFamily:"var(--font-mono)", fontSize:11, color:"var(--text-faint)", textTransform:"uppercase"}}>Academic Progress</div>
            <div style={{fontFamily:"var(--font-display)", fontSize:28, fontWeight:700}}>{prog}%</div>
            <p style={{fontSize:12.5, color:"var(--text-muted)", marginTop:6, maxWidth:260}}>Weighted from attendance, activities, assignments and quiz performance.</p>
          </div>
        </div>
        <div className="card card-pad">
          <div className="section-title" style={{marginBottom:6}}>Risk assessment</div>
          <RiskPill level={risk.level}/>
          <ul style={{marginTop:12, paddingLeft:18, fontSize:12.5, color:"var(--text-muted)", display:"flex", flexDirection:"column", gap:5}}>
            {risk.reasons.length===0 ? <li>No risk factors detected — keep it up!</li> : risk.reasons.map((r,i)=><li key={i}>{r}</li>)}
          </ul>
        </div>
      </div>
      <div className="card card-pad">
        <div className="section-title" style={{marginBottom:12}}>Breakdown</div>
        <MiniBarChart tint="violet" data={[
          {label:"Attendance", value:att}, {label:"Activities", value:act}, {label:"Assignments", value:asn},
          {label:"Quizzes", value:quiz}, {label:"Projects", value:proj},
        ]}/>
      </div>
    </div>
  );
}

function Leaderboard(){
  const {db} = useStore();
  const rows = leaderboardRows(db);
  const medals = ["🥇","🥈","🥉"];
  return (
    <div className="card card-pad">
      <div className="section-title" style={{marginBottom:14}}><Ic name="trophy" size={18}/> Student leaderboard</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Rank</th><th>Student</th><th>Department</th><th>Activity Points</th><th>Badges</th></tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.id}>
                <td style={{fontWeight:700, fontSize:15}}>{i<3?medals[i]:`#${i+1}`}</td>
                <td>
                  <div style={{display:"flex", alignItems:"center", gap:9}}>
                    <div className="avatar" style={{width:28,height:28,fontSize:11, background:r.color}}>{initials(r.name)}</div>
                    <div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11, color:"var(--text-faint)"}}>{r.roll}</div></div>
                  </div>
                </td>
                <td style={{fontSize:12.5, color:"var(--text-muted)"}}>{r.dept}</td>
                <td className="mono" style={{fontWeight:700, color:"var(--gold-ink)"}}>{r.points} pts</td>
                <td>
                  <div style={{display:"flex", gap:5, flexWrap:"wrap"}}>
                    {r.badges.length===0 ? <span style={{fontSize:11.5, color:"var(--text-faint)"}}>—</span> : r.badges.map((b,bi)=><Badge tone="gold" icon={b.icon} key={bi}>{b.label}</Badge>)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentPlanner({go, user}){
  const {db, update, toast} = useStore();
  const schedule = todaySchedule(db);
  const recs = studentRecommendations(db,user.id);
  const [planned, setPlanned] = useState(()=>{ try{return JSON.parse(localStorage.getItem(`smartedu_plan_${user.id}`)||"[]")}catch(e){return []} });
  const addPlan = (rec, slot) => {
    const item = {...rec, slot:`${slot.time}–${slot.end}`};
    setPlanned(p=>{ const next=[...p.filter(x=>x.slot!==item.slot),item]; localStorage.setItem(`smartedu_plan_${user.id}`,JSON.stringify(next)); return next; });
    toast(`${rec.title} added to your plan`,"success");
  };
  const clearPlan = () => { setPlanned([]); localStorage.removeItem(`smartedu_plan_${user.id}`); toast("Today's plan cleared","info"); };
  return <div>
    <div className="card card-pad" style={{marginBottom:18, background:"linear-gradient(120deg,var(--ink),var(--ink-3))", color:"#fff", border:"none"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,flexWrap:"wrap"}}>
        <div><div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".08em",color:"#9FB0D1",fontWeight:700}}>Personalized academic day</div><h2 style={{fontSize:25,color:"#fff",marginTop:4}}>{todayWeekday()}, 10 Aug 2026</h2><div style={{fontSize:12.5,color:"#C9D4EA",marginTop:5}}>Your timetable + attendance + deadlines + performance → one actionable plan.</div></div>
        <button className="btn btn-outline btn-sm" style={{color:"#fff",borderColor:"rgba(255,255,255,.25)"}} onClick={clearPlan}>Reset plan</button>
      </div>
    </div>
    <div className="grid grid-2" style={{marginBottom:18}}>
      <div className="card card-pad"><div className="section-title" style={{marginBottom:12}}>Daily timetable</div>{schedule.map((slot,i)=>{
        const isFree=!slot.subject; return <div key={i} className="list-row" style={{background:isFree?"rgba(108,99,255,.06)":"transparent",padding:"12px 8px"}}>
          <div style={{width:108,fontFamily:"var(--font-mono)",fontSize:11.5,color:"var(--text-muted)"}}>{slot.time}<br/><span style={{color:"var(--text-faint)"}}>{slot.end}</span></div>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13.5}}>{slot.subject||"FREE PERIOD"}</div><div style={{fontSize:11.5,color:"var(--text-faint)",marginTop:2}}>{slot.room}</div></div>
          {isFree?<Badge tone="violet">Smart study</Badge>:<Badge tone="gray">Class</Badge>}
        </div>;
      })}</div>
      <div className="card card-pad"><div className="section-title" style={{marginBottom:12}}>Recommended during free periods</div>
        {freePeriods(db).map((slot,i)=>{ const rec=recs[i%recs.length]; return <div key={i} className="card" style={{padding:14,marginBottom:10,borderColor:"var(--border)"}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:10}}><div><div style={{fontSize:11,color:"var(--text-faint)",fontFamily:"var(--font-mono)"}}>{slot.time}–{slot.end}</div><div style={{fontWeight:700,fontSize:13.5,marginTop:3}}>{rec?.title||"Independent study"}</div></div><Badge tone={rec?.priority==="High"?"red":"gold"}>{rec?.priority||"Suggested"}</Badge></div>
          <div style={{fontSize:12,color:"var(--text-muted)",marginTop:6}}>{rec?.reason||"Use this time for revision or pending work."}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span className="mono" style={{fontSize:11,color:"var(--text-faint)"}}>{rec?.minutes||20} min</span><button className="btn btn-primary btn-sm" onClick={()=>rec&&addPlan(rec,slot)}>Add to plan</button></div>
        </div> })}
      </div>
    </div>
    <div className="card card-pad"><div className="section-head"><div><div className="section-title">My personalized plan</div><div style={{fontSize:11.5,color:"var(--text-faint)",marginTop:3}}>Built around what needs your attention today.</div></div><Badge tone="green">{planned.length} planned</Badge></div>
      {planned.length===0?<EmptyState icon="calendarOff" title="No study blocks added yet" sub="Choose a recommendation above to build your day."/>:<div className="table-wrap"><table><thead><tr><th>Time</th><th>Activity</th><th>Subject</th><th>Duration</th><th>Priority</th></tr></thead><tbody>{planned.map((p,i)=><tr key={i}><td className="mono">{p.slot}</td><td style={{fontWeight:700}}>{p.title}</td><td>{p.subject}</td><td>{p.minutes} min</td><td><Badge tone={p.priority==="High"?"red":p.priority==="Medium"?"gold":"violet"}>{p.priority}</Badge></td></tr>)}</tbody></table></div>}
    </div>
  </div>;
}

function StudentLeave({user}){
  const {db, update, toast} = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({from:"", to:"", reason:"", doc:""});
  const rows = db.leaveRequests.filter(l=>l.studentId===user.id).sort((a,b)=>a.createdAt<b.createdAt?1:-1);
  const submit = (e) => {
    e.preventDefault();
    if(!form.from || !form.to || !form.reason){ toast("Please fill in all required fields.", "error"); return; }
    update(d=>{ d.leaveRequests.push({id:uid("lv"), studentId:user.id, ...form, status:"pending", createdAt:todayISO()}); });
    toast("Leave request submitted", "success");
    setOpen(false); setForm({from:"",to:"",reason:"",doc:""});
  };
  const tone = {pending:"gold", approved:"green", rejected:"red"};
  return (
    <div>
      <div className="section-head"><div/><button className="btn btn-primary" onClick={()=>setOpen(true)}><Ic name="plus" size={15}/> Request leave</button></div>
      <div className="grid grid-3" style={{marginBottom:18}}>
        {["pending","approved","rejected"].map(st=>(
          <StatCard key={st} label={st[0].toUpperCase()+st.slice(1)} value={rows.filter(r=>r.status===st).length} icon={st==="approved"?"checkCircle":st==="rejected"?"xCircle":"clock"} tint={tone[st]==="green"?"teal":tone[st]==="red"?"coral":"gold"}/>
        ))}
      </div>
      <div className="card card-pad">
        {rows.length===0 ? <EmptyState icon="calendarOff" title="No leave requests yet"/> : (
          <div className="table-wrap"><table>
            <thead><tr><th>From</th><th>To</th><th>Reason</th><th>Document</th><th>Status</th></tr></thead>
            <tbody>{rows.map(r=>(
              <tr key={r.id}><td>{r.from}</td><td>{r.to}</td><td>{r.reason}</td><td>{r.doc||"—"}</td><td><Badge tone={tone[r.status]}>{r.status}</Badge></td></tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
      {open && (
        <Modal title="Request leave" onClose={()=>setOpen(false)} footer={<>
          <button className="btn btn-ghost" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Submit request</button>
        </>}>
          <form onSubmit={submit}>
            <div className="field-row">
              <Field label="From date"><input className="input" type="date" value={form.from} onChange={e=>setForm({...form, from:e.target.value})}/></Field>
              <Field label="To date"><input className="input" type="date" value={form.to} onChange={e=>setForm({...form, to:e.target.value})}/></Field>
            </div>
            <Field label="Reason"><textarea className="input" rows={3} value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})}/></Field>
            <Field label="Supporting document (optional)"><input className="input" type="text" placeholder="e.g. medical_note.pdf" value={form.doc} onChange={e=>setForm({...form, doc:e.target.value})}/></Field>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================================
   SHARED: NOTIFICATIONS / PROFILE
============================================================================ */
function NotificationsPage({role, user, canCompose}){
  const {db, update, toast} = useStore();
  const [compose, setCompose] = useState(false);
  const [form, setForm] = useState({title:"", message:"", audience:"all-students", type:"announcement"});
  const items = notificationsFor(db, role, user.id);
  const typeIcon = {assignment:"clipboard", attendance:"alert", leave:"calendarOff", achievement:"award", announcement:"bell", progress:"chart"};

  const markRead = (id) => update(d=>{ d.notifications.find(n=>n.id===id).read = true; });
  const del = (id) => update(d=>{ d.notifications = d.notifications.filter(n=>n.id!==id); });
  const markAll = () => update(d=>{ d.notifications.forEach(n=>{ if(n.audience===user.id || (role==="student"&&n.audience==="all-students")) n.read=true; }); });
  const send = () => {
    if(!form.title || !form.message){ toast("Add a title and message.", "error"); return; }
    update(d=>{ d.notifications.unshift({id:uid("nt"), ...form, read:false, date:todayISO()}); });
    toast("Notification sent", "success"); setCompose(false); setForm({title:"", message:"", audience:"all-students", type:"announcement"});
  };

  return (
    <div>
      <div className="section-head">
        <button className="btn btn-outline btn-sm" onClick={markAll}>Mark all as read</button>
        {canCompose && <button className="btn btn-primary" onClick={()=>setCompose(true)}><Ic name="send" size={15}/> Send notification</button>}
      </div>
      <div className="card">
        {items.length===0 && <div className="card-pad"><EmptyState icon="bell" title="No notifications yet"/></div>}
        {items.map(n=>(
          <div className="list-row" key={n.id} style={{padding:"14px 20px", background:n.read?"transparent":"var(--card-2)"}}>
            <div style={{display:"flex", gap:12, minWidth:0}}>
              <Ic name={typeIcon[n.type]||"bell"} size={18} style={{marginTop:2, color:"var(--gold-ink)", flexShrink:0}}/>
              <div style={{minWidth:0}}>
                <div style={{fontWeight:700, fontSize:13.5}}>{n.title}</div>
                <div style={{fontSize:12.5, color:"var(--text-muted)", marginTop:2}}>{n.message}</div>
                <div style={{fontSize:11, color:"var(--text-faint)", marginTop:4}}>{n.date}</div>
              </div>
            </div>
            <div style={{display:"flex", gap:6, flexShrink:0}}>
              {!n.read && <button className="btn btn-ghost btn-sm" onClick={()=>markRead(n.id)}>Mark read</button>}
              <button className="icon-btn" style={{width:32, height:32}} onClick={()=>del(n.id)}><Ic name="trash" size={14}/></button>
            </div>
          </div>
        ))}
      </div>
      {compose && (
        <Modal title="Send notification" onClose={()=>setCompose(false)} footer={<>
          <button className="btn btn-ghost" onClick={()=>setCompose(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={send}><Ic name="send" size={14}/> Send</button>
        </>}>
          <Field label="Audience">
            <select className="input" value={form.audience} onChange={e=>setForm({...form, audience:e.target.value})}>
              <option value="all-students">All students</option>
              {db.students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Type">
            <select className="input" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
              {["announcement","assignment","attendance","progress"].map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Title"><input className="input" value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/></Field>
          <Field label="Message"><textarea className="input" rows={3} value={form.message} onChange={e=>setForm({...form, message:e.target.value})}/></Field>
        </Modal>
      )}
    </div>
  );
}

function ParentDashboard({go,user}){
  const {db}=useStore();
  const child=db.students.find(s=>s.id===user.childId);
  if(!child) return <EmptyState icon="user" title="Child account not found"/>;
  const att=studentOverallAttendance(db,child.id), risk=studentRisk(db,child.id), prog=studentProgressScore(db,child.id);
  const recs=studentRecommendations(db,child.id).slice(0,3);
  const pending=db.submissions.filter(s=>s.studentId===child.id && s.status!=="submitted").map(s=>db.assignments.find(a=>a.id===s.assignmentId)).filter(Boolean);
  const free=freePeriods(db);
  const alertItems=[];
  if(att<db.settings.attendanceThreshold) alertItems.push({tone:"red",title:"Attendance needs attention",text:`${child.name}'s attendance is ${att}%, below the ${db.settings.attendanceThreshold}% target.`});
  if(pending.some(a=>a.deadline<=todayISO())) alertItems.push({tone:"gold",title:"Deadline pressure",text:"There is pending academic work due today or already overdue."});
  if(risk.level==="high") alertItems.push({tone:"red",title:"Early academic risk",text:"Attendance, performance or pending work suggests early intervention."});
  return <div>
    <div className="card card-pad" style={{marginBottom:18,background:"linear-gradient(120deg,var(--ink),var(--ink-3))",color:"#fff",border:"none"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,flexWrap:"wrap"}}><div><div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".08em",color:"#9FB0D1",fontWeight:700}}>Parent view · actionable, not noisy</div><h1 style={{fontSize:26,color:"#fff",marginTop:4}}>{child.name}</h1><div style={{fontSize:12.5,color:"#C9D4EA",marginTop:4}}>{child.roll} · {child.cls} · {user.relation}</div></div><button className="btn btn-gold" onClick={()=>go("parent/planner")}>View today's plan →</button></div>
    </div>
    <div className="grid grid-stats" style={{marginBottom:18}}><StatCard label="Attendance" value={`${att}%`} icon="qr" tint={att>=db.settings.attendanceThreshold?"teal":"coral"}/><StatCard label="Academic progress" value={`${prog}%`} icon="chart" tint="violet"/><StatCard label="Pending assignments" value={pending.length} icon="clipboard" tint="gold"/><StatCard label="Risk level" value={risk.level.toUpperCase()} icon="shield" tint={risk.level==="high"?"coral":risk.level==="medium"?"gold":"teal"}/></div>
    {alertItems.length>0 && <div className="card card-pad" style={{marginBottom:18,borderColor:"rgba(225,91,91,.35)"}}><div className="section-title" style={{marginBottom:10}}>⚠️ What needs your attention</div>{alertItems.map((a,i)=><div key={i} className="list-row"><div><div style={{fontWeight:700,fontSize:13.5}}>{a.title}</div><div style={{fontSize:12,color:"var(--text-muted)",marginTop:2}}>{a.text}</div></div><Badge tone={a.tone}>{a.tone==="red"?"Action":"Watch"}</Badge></div>)}</div>}
    <div className="grid grid-2" style={{marginBottom:18}}><div className="card card-pad"><div className="section-title" style={{marginBottom:12}}>Today's timetable</div>{todaySchedule(db).map((slot,i)=><div className="list-row" key={i}><div className="mono" style={{fontSize:11.5,color:"var(--text-muted)",width:100}}>{slot.time}</div><div style={{flex:1,fontWeight:600,fontSize:13.5}}>{slot.subject||"FREE PERIOD"}<div style={{fontSize:11,color:"var(--text-faint)",fontWeight:400}}>{slot.room}</div></div>{slot.subject?<Badge tone="gray">Class</Badge>:<Badge tone="violet">Study opportunity</Badge>}</div>)}</div><div className="card card-pad"><div className="section-title" style={{marginBottom:12}}>What the system recommends</div>{recs.map((r,i)=><div className="list-row" key={r.id}><div><div style={{fontWeight:700,fontSize:13}}>{r.title}</div><div style={{fontSize:11.5,color:"var(--text-faint)"}}>{r.reason}</div></div><Badge tone={i===0?"red":"gold"}>{r.minutes}m</Badge></div>)}<button className="btn btn-outline btn-sm" style={{marginTop:10}} onClick={()=>go("parent/planner")}>See full planner</button></div></div>
    <div className="card card-pad"><div className="section-title" style={{marginBottom:10}}>Parent takeaway</div><div className="smart-insight"><div className="insight-line"><Ic name="sparkle" size={16}/><span>SmartEdu turns attendance and academic signals into the <strong>next best action</strong> instead of sending parents a stream of irrelevant notifications.</span></div></div></div>
  </div>;
}

function ParentPlanner({go,user}){
  const {db}=useStore();
  const child=db.students.find(s=>s.id===user.childId);
  if(!child) return <EmptyState icon="user" title="Child account not found"/>;
  const recs=studentRecommendations(db,child.id);
  const free=freePeriods(db);
  return <div>
    <div className="card card-pad" style={{marginBottom:18}}><div className="section-head"><div><div className="section-title">Personalized daily planner</div><div style={{fontSize:12,color:"var(--text-muted)",marginTop:3}}>Recommendations are based on {child.name}'s attendance, deadlines and performance.</div></div><button className="btn btn-outline btn-sm" onClick={()=>go("parent/dashboard")}>← Overview</button></div></div>
    <div className="grid grid-2" style={{marginBottom:18}}><div className="card card-pad"><div className="section-title" style={{marginBottom:12}}>Free periods detected</div>{free.map((slot,i)=><div className="list-row" key={i}><div><div style={{fontWeight:700,fontSize:13.5}}>{slot.time}–{slot.end}</div><div style={{fontSize:11.5,color:"var(--text-faint)"}}>Available for focused study</div></div><Badge tone="violet">Free</Badge></div>)}</div><div className="card card-pad"><div className="section-title" style={{marginBottom:12}}>Suggested academic activities</div>{recs.map(r=><div className="card" key={r.id} style={{padding:14,marginBottom:9}}><div style={{display:"flex",justifyContent:"space-between",gap:10}}><div><div style={{fontWeight:700,fontSize:13.5}}>{r.title}</div><div style={{fontSize:11.5,color:"var(--text-faint)",marginTop:3}}>{r.subject} · {r.minutes} min</div></div><Badge tone={r.priority==="High"?"red":"gold"}>{r.priority}</Badge></div><div style={{fontSize:12,color:"var(--text-muted)",marginTop:7}}>{r.reason}</div></div>)}</div></div>
    <div className="card card-pad"><div className="section-title" style={{marginBottom:10}}>How SmartEdu decides</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>{[["Attendance","Prioritizes subjects below the target."],["Deadlines","Surfaces overdue or urgent work."],["Performance","Uses quiz/academic signals to focus revision."]].map(([a,b])=><div className="card" style={{padding:13}} key={a}><div style={{fontWeight:700,fontSize:13}}>{a}</div><div style={{fontSize:11.5,color:"var(--text-muted)",marginTop:4}}>{b}</div></div>)}</div></div>
  </div>;
}

function ProfilePage({role, user}){
  const {logout} = useAuth();
  return (
    <div className="grid grid-2">
      <div className="card card-pad" style={{display:"flex", flexDirection:"column", alignItems:"center", gap:12, textAlign:"center"}}>
        <div className="avatar" style={{width:76, height:76, fontSize:26, background:user.color||"var(--ink)"}}>{initials(user.name)}</div>
        <div>
          <h3 style={{fontSize:19}}>{user.name}</h3>
          <div style={{fontSize:12.5, color:"var(--text-faint)", textTransform:"capitalize"}}>{role}</div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={logout}><Ic name="logout" size={14}/> Log out</button>
      </div>
      <div className="card card-pad">
        <div className="section-title" style={{marginBottom:14}}>Account details</div>
        {[["Email", user.email], ["Role", role], user.roll?["Roll number", user.roll]:null, user.dept?["Department", user.dept]:null, user.cls?["Class", user.cls]:null, user.subjects?["Subjects", user.subjects.join(", ")]:null].filter(Boolean).map(([k,v])=>(
          <div className="list-row" key={k}><span style={{color:"var(--text-muted)", fontSize:13}}>{k}</span><span style={{fontWeight:600, fontSize:13}}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   TEACHER PAGES
============================================================================ */
function TeacherDashboard({go, user}){
  const {db} = useStore();
  const students = db.students;
  const th = db.settings.attendanceThreshold;
  const presentToday = db.attendanceLog.filter(l=>l.date===todayISO()).map(l=>l.studentId);
  const presentCount = new Set(presentToday).size;
  const avgAttendance = Math.round(students.reduce((s,st)=>s+studentOverallAttendance(db,st.id),0)/students.length);
  const lowAtt = students.filter(s=>studentOverallAttendance(db,s.id) < th);
  const atRisk = students.filter(s=>studentRisk(db,s.id).level==="high");
  const pendingActivities = db.activities.filter(a=>a.deadline >= todayISO()).length;
  const pendingLeave = db.leaveRequests.filter(l=>l.status==="pending");
  const insights = smartInsights(db);

  return (
    <div>
      <div className="grid grid-stats" style={{marginBottom:18}}>
        <StatCard label="Total students" value={students.length} icon="users" tint="ink"/>
        <StatCard label="Present today" value={presentCount} icon="checkCircle" tint="teal"/>
        <StatCard label="Absent today" value={students.length-presentCount} icon="xCircle" tint="coral"/>
        <StatCard label="Average attendance" value={`${avgAttendance}%`} icon="qr" tint="gold"/>
        <StatCard label="Pending activities" value={pendingActivities} icon="activity" tint="violet"/>
        <StatCard label="Low attendance" value={lowAtt.length} icon="alert" tint="coral"/>
        <StatCard label="At-risk students" value={atRisk.length} icon="shield" tint="coral"/>
        <StatCard label="Attendance reviews" value={db.attendanceLog.filter(l=>l.proximityStatus==="mismatch").length} icon="shield" tint="gold"/>
      </div>

      <div className="card card-pad" style={{marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginBottom:12,flexWrap:"wrap"}}><div className="section-title">Quick actions</div><span className="badge badge-violet">✨ Smart Attendance Integrity ON</span></div>
        <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
          <button className="btn btn-gold" onClick={()=>go("teacher/attendance")}><Ic name="qr" size={15}/> Start attendance</button>
          <button className="btn btn-outline" onClick={()=>go("teacher/classes")}><Ic name="layers" size={15}/> Manage classes</button>
          <button className="btn btn-outline" onClick={()=>go("teacher/activities")}><Ic name="plus" size={15}/> Create activity</button>
          <button className="btn btn-outline" onClick={()=>go("teacher/assignments")}><Ic name="plus" size={15}/> Create assignment</button>
          <button className="btn btn-outline" onClick={()=>go("teacher/notifications")}><Ic name="send" size={15}/> Send notification</button>
          <button className="btn btn-outline" onClick={()=>go("teacher/reports")}><Ic name="file" size={15}/> Generate report</button>
        </div>
      </div>

      <div className="grid grid-2" style={{marginBottom:18}}>
        <div className="card card-pad">
          <div className="section-title" style={{marginBottom:12}}>⚠️ Low attendance students</div>
          {lowAtt.length===0 ? <EmptyState icon="checkCircle" title="No students below threshold"/> : lowAtt.slice(0,5).map(s=>(
            <div className="list-row" key={s.id}><span style={{fontWeight:600, fontSize:13}}>{s.name}</span><Badge tone="red">{studentOverallAttendance(db,s.id)}%</Badge></div>
          ))}
          {lowAtt.length>0 && <button className="btn btn-outline btn-sm" style={{marginTop:10}} onClick={()=>go("teacher/students")}>View all</button>}
        </div>
        <div className="card card-pad">
          <div className="section-title" style={{marginBottom:12}}>At-risk students</div>
          {atRisk.length===0 ? <EmptyState icon="shield" title="No high-risk students"/> : atRisk.slice(0,5).map(s=>(
            <div className="list-row" key={s.id}><span style={{fontWeight:600, fontSize:13}}>{s.name}</span><RiskPill level="high"/></div>
          ))}
          {atRisk.length>0 && <button className="btn btn-outline btn-sm" style={{marginTop:10}} onClick={()=>go("teacher/atrisk")}>View details</button>}
        </div>
      </div>

      <div className="grid grid-2" style={{marginBottom:18}}>
        <div className="card card-pad"><div className="section-title" style={{marginBottom:6}}>Daily attendance snapshot</div><MiniBarChart data={db.students.slice(0,6).map(s=>({label:s.name.split(" ")[0],value:studentOverallAttendance(db,s.id)}))} tint="teal" height={150}/></div>
        <div className="card card-pad"><div className="section-title" style={{marginBottom:10}}>Parent-ready alerts</div>{lowAtt.slice(0,4).map(s=><div className="list-row" key={s.id}><div><div style={{fontWeight:700,fontSize:13}}>{s.name}</div><div style={{fontSize:11.5,color:"var(--text-faint)"}}>Attendance {studentOverallAttendance(db,s.id)}% · {studentRisk(db,s.id).level} risk</div></div><button className="btn btn-outline btn-sm" onClick={()=>go("teacher/notifications")}>Notify</button></div>)}{lowAtt.length===0&&<EmptyState icon="checkCircle" title="No parent alerts needed"/>}</div>
      </div>

      <div className="grid grid-2">
        <div className="card card-pad">
          <div className="section-title" style={{marginBottom:12}}>Pending leave requests</div>
          {pendingLeave.length===0 ? <EmptyState icon="calendarOff" title="No pending requests"/> : pendingLeave.map(l=>{
            const s = db.students.find(x=>x.id===l.studentId);
            return <div className="list-row" key={l.id}><span style={{fontWeight:600, fontSize:13}}>{s.name}</span><span style={{fontSize:11.5, color:"var(--text-faint)"}}>{l.from} → {l.to}</span></div>;
          })}
        </div>
        <SmartInsightBox insights={insights}/>
      </div>
    </div>
  );
}

function TeacherAttendance({user, adminView}){
  const {db, update, toast} = useStore();
  const [subject, setSubject] = useState(db.subjects[0]);
  const [tick, setTick] = useState(0);
  const qrRef = useRef(null);

  useEffect(()=>{ const iv = setInterval(()=>setTick(t=>t+1), 1000); return ()=>clearInterval(iv); }, []);

  const mySessions = db.attendanceSessions.filter(s => adminView ? true : s.teacherId===user.id).sort((a,b)=> b.date < a.date ? -1:1);
  const activeSession = mySessions.find(s=>s.active && new Date(s.expiresAt).getTime() > Date.now());

  useEffect(()=>{
    if(activeSession && qrRef.current){
      qrRef.current.innerHTML = "";
      new QRCode(qrRef.current, {text: JSON.stringify({sessionId:activeSession.id, code:activeSession.code}), width:150, height:150, colorDark:"#101B33", colorLight:"#ffffff"});
    }
  }, [activeSession?.id, activeSession?.code]);

  const startAttendance = () => {
    const id = uid("sess");
    const code = Math.random().toString(36).slice(2,8).toUpperCase();
    update(d=>{
      d.attendanceSessions.forEach(s=>{ if(s.teacherId===user.id) s.active=false; });
      d.attendanceSessions.push({id, teacherId:user.id, subject, date:todayISO(), code, active:true,
        room: subject==="Computer Networks" ? "Room 202" : subject==="Data Structures" ? "Lab 2" : "Room 104",
        classroomLat:DEMO_CAMPUS.lat, classroomLng:DEMO_CAMPUS.lng, radiusMeters:d.settings.classroomRadiusMeters||CLASSROOM_RADIUS_M,
        startedAt:new Date().toISOString(), expiresAt:new Date(Date.now()+60000).toISOString(), records:[]});
    });
    toast(`Attendance session started for ${subject}`, "success");
  };
  const regenerate = () => {
    update(d=>{
      const s = d.attendanceSessions.find(x=>x.id===activeSession.id);
      s.code = Math.random().toString(36).slice(2,8).toUpperCase();
      s.expiresAt = new Date(Date.now()+60000).toISOString();
    });
    toast("QR regenerated", "info");
  };
  const endSession = () => { update(d=>{ d.attendanceSessions.find(x=>x.id===activeSession.id).active=false; }); toast("Session ended", "info"); };

  const secsLeft = activeSession ? Math.max(0, Math.round((new Date(activeSession.expiresAt).getTime()-Date.now())/1000)) : 0;

  return (
    <div>
      {!activeSession ? (
        <div className="card card-pad" style={{maxWidth:460}}>
          <div className="section-title" style={{marginBottom:14}}>Start a new attendance session</div>
          <Field label="Subject">
            <select className="input" value={subject} onChange={e=>setSubject(e.target.value)}>
              {(user.subjects||db.subjects).map(s=><option key={s}>{s}</option>)}
            </select>
          </Field>
          <button className="btn btn-gold btn-block" onClick={startAttendance}><Ic name="qr" size={16}/> Start attendance</button>
        </div>
      ) : (
        <div className="grid" style={{gridTemplateColumns:"340px 1fr", gap:18, alignItems:"start"}}>
          <div className="ticket">
            <div className="ticket-stub">
              <div style={{fontSize:10, textTransform:"uppercase", letterSpacing:"0.1em", color:"#93A2C4"}}>Live QR</div>
              <div className="qr-box" style={{margin:"10px 0"}} ref={qrRef}></div>
              <div className="mono" style={{fontSize:15, fontWeight:700, color:"#F5D9A6"}}>{secsLeft}s</div>
              <div style={{fontSize:10, color:"#93A2C4", marginTop:2}}>auto-expires</div>
            </div>
            <div className="ticket-notch top" style={{left:"calc(150px - 10px)"}}></div>
            <div className="ticket-notch bottom" style={{left:"calc(150px - 10px)"}}></div>
            <div className="ticket-main">
              <div style={{fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--text-faint)", fontWeight:700}}>Session code</div>
              <div className="mono" style={{fontSize:20, fontWeight:700, margin:"4px 0 10px"}}>{activeSession.code}</div>
              <div style={{fontSize:13, fontWeight:700}}>{activeSession.subject}</div>
              <div style={{fontSize:11.5, color:"var(--text-faint)", marginBottom:5}}>{activeSession.date}</div>
              <div style={{fontSize:10.5, color:"var(--teal-ink)", marginBottom:14}}>🔐 {activeSession.room||"Classroom"} · {activeSession.radiusMeters||CLASSROOM_RADIUS_M}m proximity check</div>
              <div style={{display:"flex", gap:8}}>
                <button className="btn btn-outline btn-sm" onClick={regenerate}><Ic name="refresh" size={13}/> Regenerate</button>
                <button className="btn btn-danger btn-sm" onClick={endSession}>End session</button>
              </div>
            </div>
          </div>
          <div className="card card-pad">
            <div className="integrity-mini" style={{marginBottom:14}}><div className="integrity-mini-icon">🛡️</div><div><div style={{fontWeight:800,fontSize:12.5}}>Presence verified, not just scanned</div><div style={{fontSize:11,color:"var(--text-muted)",marginTop:2}}>Every scan is checked against the active QR and classroom proximity before it counts as present.</div></div></div>
            <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",marginBottom:12}}>
              <div>
                <div className="section-title">Live attendance ({activeSession.records.filter(r=>r.proximityStatus!=="mismatch").length} verified)</div>
                <div style={{fontSize:11.5,color:"var(--text-faint)",marginTop:3}}>{activeSession.room||"Assigned classroom"} · {activeSession.radiusMeters||CLASSROOM_RADIUS_M}m proximity radius</div>
              </div>
              <Badge tone={activeSession.records.filter(r=>r.proximityStatus==="mismatch").length ? "red" : "green"}>
                {activeSession.records.filter(r=>r.proximityStatus==="mismatch").length ? `${activeSession.records.filter(r=>r.proximityStatus==="mismatch").length} review` : "All verified"}
              </Badge>
            </div>
            {activeSession.records.filter(r=>r.proximityStatus==="mismatch").length>0 && <div className="smart-insight" style={{marginBottom:12}}><div className="insight-line"><Ic name="shield" size={16}/><span><strong>Attendance integrity alert:</strong> one or more scans were detected outside the classroom proximity. Review before confirming attendance.</span></div></div>}
            {activeSession.records.length===0 ? <EmptyState icon="scan" title="Waiting for students to scan…" sub="This updates automatically as students mark attendance."/> : (
              <div className="table-wrap"><table>
                <thead><tr><th>Student</th><th>Roll no.</th><th>Time</th><th>Status</th></tr></thead>
                <tbody>{activeSession.records.map((r,i)=>{
                  const s = db.students.find(x=>x.id===r.studentId);
                  const integrity = attendanceIntegrity(r);
                  return <tr key={i}><td style={{fontWeight:600}}>{s?.name}</td><td>{s?.roll}</td><td className="mono">{r.time}</td><td><div style={{display:"flex",alignItems:"center",gap:7}}><Badge tone={integrity.tone}>{integrity.label}</Badge>{r.distanceMeters!=null&&<span style={{fontSize:10.5,color:"var(--text-faint)"}}>{r.distanceMeters}m</span>}</div></td></tr>;
                })}</tbody>
              </table></div>
            )}
          </div>
        </div>
      )}

      <div className="card card-pad" style={{marginTop:18}}>
        <div className="section-title" style={{marginBottom:12}}>Session history</div>
        {mySessions.filter(s=>!s.active).length===0 ? <EmptyState icon="clock" title="No past sessions yet"/> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Date</th><th>Subject</th><th>Verified</th><th>Review</th><th>Status</th></tr></thead>
            <tbody>{mySessions.filter(s=>!s.active).map(s=>(
              <tr key={s.id}><td>{s.date}</td><td>{s.subject}</td><td>{s.records.filter(r=>r.proximityStatus!=="mismatch").length}/{db.students.length}</td><td>{s.records.filter(r=>r.proximityStatus==="mismatch").length ? <Badge tone="red">{s.records.filter(r=>r.proximityStatus==="mismatch").length} flagged</Badge> : <Badge tone="green">0 flagged</Badge>}</td><td><Badge tone="gray">Closed</Badge></td></tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}

function TeacherStudents({search}){
  const {db, update, toast} = useStore();
  const [dept, setDept] = useState("all");
  const [selected, setSelected] = useState([]);
  const th = db.settings.attendanceThreshold;
  const rows = db.students.filter(s => (dept==="all"||s.dept===dept) && (!search || s.name.toLowerCase().includes(search.toLowerCase())));

  const toggle = (id) => setSelected(sel => sel.includes(id) ? sel.filter(x=>x!==id) : [...sel, id]);
  const sendReminder = () => {
    if(selected.length===0){ toast("Select at least one student.", "error"); return; }
    update(d=>{ selected.forEach(sid=>{ d.notifications.unshift({id:uid("nt"), audience:sid, type:"attendance", title:"Low attendance reminder", message:"Please improve your attendance to stay above the required threshold.", read:false, date:todayISO()}); }); });
    toast(`Reminder sent to ${selected.length} student(s)`, "success");
    setSelected([]);
  };

  return (
    <div>
      <div className="section-head">
        <div style={{display:"flex", gap:8}}>
          <select className="input" style={{width:190}} value={dept} onChange={e=>setDept(e.target.value)}>
            <option value="all">All departments</option>
            {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
          </select>
        </div>
        <button className="btn btn-gold" disabled={selected.length===0} onClick={sendReminder}><Ic name="send" size={14}/> Send reminder ({selected.length})</button>
      </div>
      <div className="card">
        <div className="table-wrap"><table>
          <thead><tr><th></th><th>Student</th><th>Roll</th><th>Class</th><th>Attendance</th><th>Activities</th><th>Risk</th></tr></thead>
          <tbody>{rows.map(s=>{
            const att = studentOverallAttendance(db,s.id);
            const act = studentActivityCompletion(db,s.id);
            const risk = studentRisk(db,s.id);
            return (
              <tr key={s.id}>
                <td><input type="checkbox" checked={selected.includes(s.id)} onChange={()=>toggle(s.id)}/></td>
                <td style={{display:"flex", alignItems:"center", gap:9}}><div className="avatar" style={{width:26,height:26,fontSize:10,background:s.color}}>{initials(s.name)}</div><span style={{fontWeight:600}}>{s.name}</span></td>
                <td className="mono">{s.roll}</td>
                <td>{s.cls}</td>
                <td><Badge tone={att>=th?"green":"red"}>{att}%</Badge></td>
                <td><ProgressBar value={act} tint="violet"/></td>
                <td><RiskPill level={risk.level}/></td>
              </tr>
            );
          })}</tbody>
        </table></div>
      </div>
    </div>
  );
}

function TeacherClasses({user}){
  const {db, update, toast}=useStore();
  const [open,setOpen]=useState(false);
  const [name,setName]=useState("");
  const [subject,setSubject]=useState(db.subjects[0]);
  const owned = (db.classes||[]).map((name,i)=>({name,subject:(db.subjects||[])[i%(db.subjects||[]).length]}));
  const add=()=>{ if(!name.trim()){toast("Enter a class name","error");return;} update(d=>{if(!d.classes.includes(name.trim())) d.classes.push(name.trim());}); toast("Class created","success"); setName(""); setOpen(false); };
  const remove=(c)=>{update(d=>{d.classes=d.classes.filter(x=>x!==c)});toast("Class removed","info")};
  return <div>
    <div className="section-head"><div><div style={{fontSize:12,color:"var(--text-muted)"}}>Create and manage the classes you teach.</div></div><button className="btn btn-primary" onClick={()=>setOpen(true)}><Ic name="plus" size={15}/> Create class</button></div>
    <div className="grid grid-3">{owned.map(c=><div className="card card-pad" key={c.name}><div style={{display:"flex",justifyContent:"space-between",gap:10}}><div><div style={{fontFamily:"var(--font-display)",fontSize:19,fontWeight:700}}>{c.name}</div><div style={{fontSize:11.5,color:"var(--text-faint)",marginTop:3}}>{c.subject}</div></div><Badge tone="violet">Active</Badge></div><div style={{fontSize:12,color:"var(--text-muted)",marginTop:14}}>{db.students.filter(s=>s.cls===c.name).length} students · QR attendance enabled</div><button className="btn btn-outline btn-sm" style={{marginTop:12}} onClick={()=>remove(c.name)}><Ic name="trash" size={13}/> Remove</button></div>)}</div>
    {open&&<Modal title="Create class" onClose={()=>setOpen(false)} footer={<><button className="btn btn-ghost" onClick={()=>setOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={add}>Create class</button></>}><Field label="Class name"><input className="input" placeholder="e.g. CSE-4A" value={name} onChange={e=>setName(e.target.value)}/></Field><Field label="Primary subject"><select className="input" value={subject} onChange={e=>setSubject(e.target.value)}>{db.subjects.map(s=><option key={s}>{s}</option>)}</select></Field></Modal>}
  </div>;
}

function TeacherActivities({user, adminView}){
  const {db, update, toast} = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({title:"", subject:db.subjects[0], type:"Assignment", description:"", date:todayISO(), deadline:"2026-08-20", maxPoints:10});
  const types = ["Assignment","Quiz","Seminar","Workshop","Project","Presentation","Lab Activity","Sports Activity","Club Activity"];

  const create = () => {
    if(!form.title){ toast("Give the activity a title.", "error"); return; }
    update(d=>{
      const id = uid("act");
      d.activities.push({id, ...form, createdBy: user?.id||"t1"});
      d.students.forEach(s=>{ d.completions.push({id:uid("comp"), activityId:id, studentId:s.id, status:"pending", submittedAt:null, points:0}); });
    });
    toast("Activity created and assigned to all students", "success");
    setOpen(false);
  };

  return (
    <div>
      <div className="section-head"><div/><button className="btn btn-primary" onClick={()=>setOpen(true)}><Ic name="plus" size={15}/> Create activity</button></div>
      <div className="grid grid-3">
        {db.activities.map(a=>{
          const rows = db.completions.filter(c=>c.activityId===a.id);
          const done = rows.filter(r=>r.status==="completed").length;
          const rate = pct(done, rows.length);
          return (
            <div className="card card-pad" key={a.id}>
              <div style={{display:"flex", justifyContent:"space-between"}}><Badge tone="violet">{a.type}</Badge><span className="mono" style={{fontSize:11.5, color:"var(--gold-ink)", fontWeight:700}}>{a.maxPoints} pts</span></div>
              <h3 style={{fontSize:15.5, marginTop:10}}>{a.title}</h3>
              <div style={{fontSize:11.5, color:"var(--text-faint)", marginTop:4}}>{a.subject} · due {a.deadline}</div>
              <p style={{fontSize:12.5, color:"var(--text-muted)", marginTop:8}}>{a.description}</p>
              <div style={{marginTop:12}}>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:11.5, color:"var(--text-faint)", marginBottom:5}}><span>Completion</span><span>{done}/{rows.length}</span></div>
                <ProgressBar value={rate} tint="teal"/>
              </div>
            </div>
          );
        })}
      </div>
      {open && (
        <Modal title="Create curriculum activity" onClose={()=>setOpen(false)} footer={<>
          <button className="btn btn-ghost" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={create}>Create activity</button>
        </>}>
          <Field label="Title"><input className="input" value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/></Field>
          <div className="field-row">
            <Field label="Subject"><select className="input" value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})}>{db.subjects.map(s=><option key={s}>{s}</option>)}</select></Field>
            <Field label="Type"><select className="input" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>{types.map(t=><option key={t}>{t}</option>)}</select></Field>
          </div>
          <Field label="Description"><textarea className="input" rows={2} value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/></Field>
          <div className="field-row">
            <Field label="Date"><input className="input" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/></Field>
            <Field label="Deadline"><input className="input" type="date" value={form.deadline} onChange={e=>setForm({...form, deadline:e.target.value})}/></Field>
          </div>
          <Field label="Maximum points"><input className="input" type="number" value={form.maxPoints} onChange={e=>setForm({...form, maxPoints:Number(e.target.value)})}/></Field>
        </Modal>
      )}
    </div>
  );
}

function TeacherAssignments({user}){
  const {db, update, toast} = useStore();
  const [open, setOpen] = useState(false);
  const [viewSubs, setViewSubs] = useState(null);
  const [form, setForm] = useState({title:"", subject:db.subjects[0], deadline:"2026-08-20", instructions:"", maxMarks:20});

  const create = () => {
    if(!form.title){ toast("Give the assignment a title.", "error"); return; }
    update(d=>{
      const id = uid("asn");
      d.assignments.push({id, ...form, createdBy:user?.id||"t1"});
      d.students.forEach(s=>{ d.submissions.push({id:uid("sub"), assignmentId:id, studentId:s.id, status:"pending", submittedAt:null, marks:null}); });
    });
    toast("Assignment created and shared with students", "success");
    setOpen(false);
  };

  return (
    <div>
      <div className="section-head"><div/><button className="btn btn-primary" onClick={()=>setOpen(true)}><Ic name="plus" size={15}/> Create assignment</button></div>
      <div className="grid grid-2">
        {db.assignments.map(a=>{
          const subs = db.submissions.filter(s=>s.assignmentId===a.id);
          const done = subs.filter(s=>s.status==="submitted").length;
          return (
            <div className="card card-pad" key={a.id}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
                <div><h3 style={{fontSize:15.5}}>{a.title}</h3><div style={{fontSize:11.5, color:"var(--text-faint)"}}>{a.subject} · due {a.deadline} · max {a.maxMarks} marks</div></div>
                <button className="btn btn-outline btn-sm" onClick={()=>setViewSubs(a)}>View submissions</button>
              </div>
              <p style={{fontSize:12.5, color:"var(--text-muted)", marginTop:8}}>{a.instructions}</p>
              <div style={{marginTop:12}}>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:11.5, color:"var(--text-faint)", marginBottom:5}}><span>Submitted</span><span>{done}/{subs.length}</span></div>
                <ProgressBar value={pct(done,subs.length)} tint="gold"/>
              </div>
            </div>
          );
        })}
      </div>
      {open && (
        <Modal title="Create assignment" onClose={()=>setOpen(false)} footer={<>
          <button className="btn btn-ghost" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={create}>Create assignment</button>
        </>}>
          <Field label="Title"><input className="input" value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/></Field>
          <div className="field-row">
            <Field label="Subject"><select className="input" value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})}>{db.subjects.map(s=><option key={s}>{s}</option>)}</select></Field>
            <Field label="Deadline"><input className="input" type="date" value={form.deadline} onChange={e=>setForm({...form, deadline:e.target.value})}/></Field>
          </div>
          <Field label="Instructions"><textarea className="input" rows={3} value={form.instructions} onChange={e=>setForm({...form, instructions:e.target.value})}/></Field>
          <Field label="Maximum marks"><input className="input" type="number" value={form.maxMarks} onChange={e=>setForm({...form, maxMarks:Number(e.target.value)})}/></Field>
        </Modal>
      )}
      {viewSubs && (
        <Modal title={`Submissions — ${viewSubs.title}`} onClose={()=>setViewSubs(null)} width={560}>
          <div className="table-wrap"><table>
            <thead><tr><th>Student</th><th>Status</th><th>Marks</th></tr></thead>
            <tbody>{db.submissions.filter(s=>s.assignmentId===viewSubs.id).map(s=>{
              const st = db.students.find(x=>x.id===s.studentId);
              return <tr key={s.id}><td style={{fontWeight:600}}>{st.name}</td><td><Badge tone={s.status==="submitted"?"green":s.status==="overdue"?"red":"gold"}>{s.status}</Badge></td><td>{s.marks!=null?`${s.marks}/${viewSubs.maxMarks}`:"—"}</td></tr>;
            })}</tbody>
          </table></div>
        </Modal>
      )}
    </div>
  );
}

function TeacherLeave(){
  const {db, update, toast} = useStore();
  const rows = db.leaveRequests.slice().sort((a,b)=>a.createdAt<b.createdAt?1:-1);
  const act = (id, status) => {
    update(d=>{
      const l = d.leaveRequests.find(x=>x.id===id); l.status = status;
      if(status==="approved"){
        // credit attendance for the leave period across all subjects (simplified: +1 to each subject total & attended)
        const at = d.studentAttendance[l.studentId];
        Object.keys(at).forEach(subj=>{ at[subj].attended += 1; at[subj].total += 1; });
      }
      d.notifications.unshift({id:uid("nt"), audience:l.studentId, type:"leave", title:status==="approved"?"Leave approved":"Leave rejected",
        message:`Your leave request (${l.from} – ${l.to}) has been ${status}.`, read:false, date:todayISO()});
    });
    toast(`Leave request ${status}`, status==="approved"?"success":"info");
  };
  const tone = {pending:"gold", approved:"green", rejected:"red"};
  return (
    <div className="card">
      <div className="table-wrap"><table>
        <thead><tr><th>Student</th><th>From</th><th>To</th><th>Reason</th><th>Document</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>{rows.map(l=>{
          const s = db.students.find(x=>x.id===l.studentId);
          return (
            <tr key={l.id}>
              <td style={{fontWeight:600}}>{s.name}</td><td>{l.from}</td><td>{l.to}</td><td>{l.reason}</td><td>{l.doc||"—"}</td>
              <td><Badge tone={tone[l.status]}>{l.status}</Badge></td>
              <td>{l.status==="pending" ? (
                <div style={{display:"flex", gap:6}}>
                  <button className="btn btn-sm btn-primary" onClick={()=>act(l.id,"approved")}><Ic name="check" size={12}/> Approve</button>
                  <button className="btn btn-sm btn-danger" onClick={()=>act(l.id,"rejected")}><Ic name="x" size={12}/> Reject</button>
                </div>
              ) : <span style={{fontSize:11.5, color:"var(--text-faint)"}}>—</span>}</td>
            </tr>
          );
        })}</tbody>
      </table></div>
    </div>
  );
}

function AtRiskStudents(){
  const {db, update, toast} = useStore();
  const [level, setLevel] = useState("all");
  const rows = db.students.map(s=>({s, risk:studentRisk(db,s.id)})).filter(r=>level==="all"||r.risk.level===level).sort((a,b)=>b.risk.score-a.risk.score);
  const remind = (sid) => { update(d=>{ d.notifications.unshift({id:uid("nt"), audience:sid, type:"progress", title:"Academic progress alert", message:"Your recent attendance and activity scores need attention. Please reach out to your mentor.", read:false, date:todayISO()}); }); toast("Alert sent", "success"); };
  return (
    <div>
      <div className="section-head">
        <div style={{display:"flex", gap:8}}>
          {["all","high","medium","low"].map(l=>(
            <button key={l} className={`btn btn-sm ${level===l?"btn-primary":"btn-outline"}`} style={{textTransform:"capitalize"}} onClick={()=>setLevel(l)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-2">
        {rows.map(({s,risk})=>(
          <div className="card card-pad" key={s.id}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
              <div style={{display:"flex", gap:10}}>
                <div className="avatar" style={{background:s.color}}>{initials(s.name)}</div>
                <div><div style={{fontWeight:700}}>{s.name}</div><div style={{fontSize:11.5, color:"var(--text-faint)"}}>{s.roll} · {s.cls}</div></div>
              </div>
              <RiskPill level={risk.level}/>
            </div>
            <div className="grid grid-stats" style={{gridTemplateColumns:"repeat(4,1fr)", gap:8, marginTop:14}}>
              {[["Attendance",risk.att],["Activities",risk.act],["Assignments",risk.asn],["Quiz avg",risk.quiz]].map(([l,v])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontFamily:"var(--font-display)", fontWeight:700, fontSize:16}}>{v}%</div>
                  <div style={{fontSize:10, color:"var(--text-faint)"}}>{l}</div>
                </div>
              ))}
            </div>
            {risk.reasons.length>0 && (
              <ul style={{marginTop:12, paddingLeft:18, fontSize:12, color:"var(--text-muted)"}}>{risk.reasons.map((r,i)=><li key={i}>{r}</li>)}</ul>
            )}
            <button className="btn btn-outline btn-sm" style={{marginTop:10}} onClick={()=>remind(s.id)}><Ic name="send" size={13}/> Send notification</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   REPORTS (shared teacher/admin)
============================================================================ */
function toCSV(rows, headers){
  const esc = (v) => `"${String(v).replace(/"/g,'""')}"`;
  return [headers.join(","), ...rows.map(r=>headers.map(h=>esc(r[h])).join(","))].join("\n");
}
function downloadCSV(filename, rows, headers){
  const csv = toCSV(rows, headers);
  const blob = new Blob([csv], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

function ReportsPage({role}){
  const {db, toast} = useStore();
  const [type, setType] = useState("Attendance Report");
  const [dept, setDept] = useState("all");
  const [cls, setCls] = useState("all");
  const [generated, setGenerated] = useState(null);
  const types = ["Attendance Report","Student Progress Report","Activity Report","Assignment Report","At-Risk Student Report"];

  const filteredStudents = db.students.filter(s => (dept==="all"||s.dept===dept) && (cls==="all"||s.cls===cls));

  const buildRows = () => {
    if(type==="Attendance Report") return filteredStudents.map(s=>({Student:s.name, Roll:s.roll, Class:s.cls, Attendance:`${studentOverallAttendance(db,s.id)}%`}));
    if(type==="Student Progress Report") return filteredStudents.map(s=>({Student:s.name, Attendance:studentOverallAttendance(db,s.id), Activities:studentActivityCompletion(db,s.id), Assignments:studentAssignmentCompletion(db,s.id), Progress:studentProgressScore(db,s.id)}));
    if(type==="Activity Report") return db.activities.map(a=>{ const rows=db.completions.filter(c=>c.activityId===a.id); return {Activity:a.title, Subject:a.subject, Type:a.type, Completion:`${pct(rows.filter(r=>r.status==="completed").length, rows.length)}%`}; });
    if(type==="Assignment Report") return db.assignments.map(a=>{ const rows=db.submissions.filter(s=>s.assignmentId===a.id); return {Assignment:a.title, Subject:a.subject, Submitted:`${pct(rows.filter(r=>r.status==="submitted").length, rows.length)}%`}; });
    if(type==="At-Risk Student Report") return filteredStudents.map(s=>{ const r=studentRisk(db,s.id); return {Student:s.name, RiskLevel:r.level, RiskScore:r.score, Reasons:r.reasons.join("; ")||"None"}; });
    return [];
  };

  const generate = () => { const rows = buildRows(); setGenerated({type, rows, headers: rows.length? Object.keys(rows[0]) : []}); toast("Report generated", "success"); };
  const download = () => { if(!generated) return; downloadCSV(`${generated.type.replace(/\s+/g,"_")}.csv`, generated.rows, generated.headers); };
  const printReport = () => window.print();

  return (
    <div>
      <div className="card card-pad" style={{marginBottom:18}}>
        <div className="section-title" style={{marginBottom:14}}>Generate report</div>
        <div className="field-row">
          <Field label="Report type"><select className="input" value={type} onChange={e=>setType(e.target.value)}>{types.map(t=><option key={t}>{t}</option>)}</select></Field>
          <Field label="Department"><select className="input" value={dept} onChange={e=>setDept(e.target.value)}><option value="all">All departments</option>{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select></Field>
        </div>
        <div className="field-row">
          <Field label="Class"><select className="input" value={cls} onChange={e=>setCls(e.target.value)}><option value="all">All classes</option>{CLASSES.map(c=><option key={c}>{c}</option>)}</select></Field>
          <div style={{display:"flex", alignItems:"flex-end"}}><button className="btn btn-primary btn-block" onClick={generate}><Ic name="file" size={15}/> Generate report</button></div>
        </div>
      </div>

      {generated && (
        <div className="card card-pad">
          <div className="section-head">
            <div className="section-title">{generated.type}</div>
            <div style={{display:"flex", gap:8}}>
              <button className="btn btn-outline btn-sm" onClick={download}><Ic name="download" size={13}/> Download CSV</button>
              <button className="btn btn-outline btn-sm" onClick={printReport}><Ic name="file" size={13}/> Download PDF (print)</button>
            </div>
          </div>
          {generated.rows.length===0 ? <EmptyState icon="file" title="No data for this filter"/> : (
            <div className="table-wrap"><table>
              <thead><tr>{generated.headers.map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>{generated.rows.map((r,i)=><tr key={i}>{generated.headers.map(h=><td key={h}>{String(r[h])}</td>)}</tr>)}</tbody>
            </table></div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   ADMIN PAGES
============================================================================ */
function AdminDashboard({go}){
  const {db} = useStore();
  const avgAttendance = Math.round(db.students.reduce((s,st)=>s+studentOverallAttendance(db,st.id),0)/db.students.length);
  const atRisk = db.students.filter(s=>studentRisk(db,s.id).level==="high").length;
  const insights = smartInsights(db);
  const deptAtt = DEPARTMENTS.map(d=>{
    const ss = db.students.filter(s=>s.dept===d);
    const v = ss.length ? Math.round(ss.reduce((sum,s)=>sum+studentOverallAttendance(db,s.id),0)/ss.length) : 0;
    return {label:d.split(" ")[0], value:v};
  });
  const trend = [{label:"Apr",value:78},{label:"May",value:80},{label:"Jun",value:76},{label:"Jul",value:81},{label:"Aug",value:avgAttendance}];
  return (
    <div>
      <div className="grid grid-stats" style={{marginBottom:18}}>
        <StatCard label="Total students" value={db.students.length} icon="users" tint="ink"/>
        <StatCard label="Total teachers" value={db.teachers.length} icon="user" tint="violet"/>
        <StatCard label="Departments" value={DEPARTMENTS.length} icon="building" tint="gold"/>
        <StatCard label="Average attendance" value={`${avgAttendance}%`} icon="qr" tint="teal"/>
        <StatCard label="Total activities" value={db.activities.length} icon="activity" tint="violet"/>
        <StatCard label="At-risk students" value={atRisk} icon="shield" tint="coral"/>
      </div>
      <div className="grid grid-2" style={{marginBottom:18}}>
        <div className="card card-pad"><div className="section-title" style={{marginBottom:6}}>Department-wise attendance</div><MiniBarChart data={deptAtt} tint="gold"/></div>
        <div className="card card-pad"><div className="section-title" style={{marginBottom:6}}>Daily attendance trend</div><MiniLineChart data={trend} tint="violet"/></div>
      </div>
      <div className="grid grid-2">
        <SmartInsightBox insights={insights}/>
        <div className="card card-pad">
          <div className="section-title" style={{marginBottom:12}}>Manage</div>
          <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
            {[["Students","admin/students","users"],["Teachers","admin/teachers","user"],["Departments","admin/departments","building"],["Classes","admin/classes","layers"]].map(([l,r,ic])=>(
              <button key={r} className="btn btn-outline btn-sm" onClick={()=>go(r)}><Ic name={ic} size={13}/> {l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminStudents({search}){
  const {db, update, toast} = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({name:"", email:"", dept:DEPARTMENTS[0], cls:CLASSES[0], roll:""});
  const rows = db.students.filter(s=>!search || s.name.toLowerCase().includes(search.toLowerCase()));
  const add = () => {
    if(!form.name || !form.email){ toast("Name and email are required.", "error"); return; }
    update(d=>{
      const id = uid("s");
      d.students.push({id, ...form, password:"student123", color:["#6C63FF","#1F9C86","#E8A33D","#E15B5B","#3C8CE0"][d.students.length%5]});
      d.studentAttendance[id] = {}; d.subjects.forEach(su=>{ d.studentAttendance[id][su] = {attended:20, total:26}; });
      d.activities.forEach(a=>{ d.completions.push({id:uid("comp"), activityId:a.id, studentId:id, status:"pending", submittedAt:null, points:0}); });
      d.assignments.forEach(a=>{ d.submissions.push({id:uid("sub"), assignmentId:a.id, studentId:id, status:"pending", submittedAt:null, marks:null}); });
    });
    toast("Student added", "success"); setOpen(false); setForm({name:"", email:"", dept:DEPARTMENTS[0], cls:CLASSES[0], roll:""});
  };
  const remove = (id) => { update(d=>{ d.students = d.students.filter(s=>s.id!==id); }); toast("Student removed", "info"); };
  return (
    <div>
      <div className="section-head"><div/><button className="btn btn-primary" onClick={()=>setOpen(true)}><Ic name="plus" size={15}/> Add student</button></div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>Student</th><th>Roll</th><th>Department</th><th>Class</th><th>Attendance</th><th></th></tr></thead>
        <tbody>{rows.map(s=>(
          <tr key={s.id}>
            <td style={{display:"flex", alignItems:"center", gap:9}}><div className="avatar" style={{width:26,height:26,fontSize:10,background:s.color}}>{initials(s.name)}</div>{s.name}</td>
            <td className="mono">{s.roll}</td><td>{s.dept}</td><td>{s.cls}</td>
            <td><Badge tone={studentOverallAttendance(db,s.id)>=75?"green":"red"}>{studentOverallAttendance(db,s.id)}%</Badge></td>
            <td><button className="icon-btn" style={{width:32,height:32}} onClick={()=>remove(s.id)}><Ic name="trash" size={13}/></button></td>
          </tr>
        ))}</tbody>
      </table></div></div>
      {open && (
        <Modal title="Add student" onClose={()=>setOpen(false)} footer={<><button className="btn btn-ghost" onClick={()=>setOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={add}>Add student</button></>}>
          <Field label="Full name"><input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></Field>
          <Field label="Email"><input className="input" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/></Field>
          <div className="field-row">
            <Field label="Department"><select className="input" value={form.dept} onChange={e=>setForm({...form, dept:e.target.value})}>{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select></Field>
            <Field label="Class"><select className="input" value={form.cls} onChange={e=>setForm({...form, cls:e.target.value})}>{CLASSES.map(c=><option key={c}>{c}</option>)}</select></Field>
          </div>
          <Field label="Roll number"><input className="input" value={form.roll} onChange={e=>setForm({...form, roll:e.target.value})}/></Field>
        </Modal>
      )}
    </div>
  );
}

function AdminTeachers({search}){
  const {db, update, toast} = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({name:"", email:"", subjects:[]});
  const rows = db.teachers.filter(t=>!search || t.name.toLowerCase().includes(search.toLowerCase()));
  const add = () => {
    if(!form.name || !form.email){ toast("Name and email are required.", "error"); return; }
    update(d=>{ d.teachers.push({id:uid("t"), ...form, password:"teacher123"}); });
    toast("Teacher added", "success"); setOpen(false); setForm({name:"", email:"", subjects:[]});
  };
  const remove = (id) => { update(d=>{ d.teachers = d.teachers.filter(t=>t.id!==id); }); toast("Teacher removed", "info"); };
  const toggleSubj = (subj) => setForm(f=> ({...f, subjects: f.subjects.includes(subj) ? f.subjects.filter(s=>s!==subj) : [...f.subjects, subj]}));
  return (
    <div>
      <div className="section-head"><div/><button className="btn btn-primary" onClick={()=>setOpen(true)}><Ic name="plus" size={15}/> Add teacher</button></div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>Teacher</th><th>Email</th><th>Subjects</th><th></th></tr></thead>
        <tbody>{rows.map(t=>(
          <tr key={t.id}><td style={{fontWeight:600}}>{t.name}</td><td className="mono" style={{fontSize:12}}>{t.email}</td>
          <td>{t.subjects.map(s=><Badge tone="violet" key={s}>{s}</Badge>)}</td>
          <td><button className="icon-btn" style={{width:32,height:32}} onClick={()=>remove(t.id)}><Ic name="trash" size={13}/></button></td></tr>
        ))}</tbody>
      </table></div></div>
      {open && (
        <Modal title="Add teacher" onClose={()=>setOpen(false)} footer={<><button className="btn btn-ghost" onClick={()=>setOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={add}>Add teacher</button></>}>
          <Field label="Full name"><input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></Field>
          <Field label="Email"><input className="input" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/></Field>
          <Field label="Subjects">
            <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
              {SUBJECTS.map(s=>(
                <span key={s} onClick={()=>toggleSubj(s)} className={`badge ${form.subjects.includes(s)?"badge-violet":"badge-gray"}`} style={{cursor:"pointer"}}>{s}</span>
              ))}
            </div>
          </Field>
        </Modal>
      )}
    </div>
  );
}

function AdminSimpleList({field, title, icon}){
  const {db, update, toast} = useStore();
  const [val, setVal] = useState("");
  const add = () => { if(!val.trim()) return; update(d=>{ d[field] = [...d[field], val.trim()]; }); setVal(""); toast(`${title.slice(0,-1)} added`, "success"); };
  const remove = (item) => { update(d=>{ d[field] = d[field].filter(x=>x!==item); }); };
  return (
    <div className="card card-pad" style={{maxWidth:520}}>
      <div className="section-title" style={{marginBottom:14}}>{title}</div>
      <div style={{display:"flex", gap:8, marginBottom:16}}>
        <input className="input" placeholder={`Add new ${title.toLowerCase().slice(0,-1)}`} value={val} onChange={e=>setVal(e.target.value)}/>
        <button className="btn btn-primary" onClick={add}><Ic name="plus" size={14}/></button>
      </div>
      {db[field].map(item=>(
        <div className="list-row" key={item}>
          <div style={{display:"flex", alignItems:"center", gap:9}}><Ic name={icon} size={15}/> {item}</div>
          <button className="icon-btn" style={{width:30,height:30}} onClick={()=>remove(item)}><Ic name="trash" size={13}/></button>
        </div>
      ))}
    </div>
  );
}

function dailyAttendanceTrend(db){
  const dates=["06 Aug","07 Aug","08 Aug","09 Aug","10 Aug"];
  const fallback=[79,84,81,88,86];
  return dates.map((label,i)=>({label,value:fallback[i]}));
}

function AdminAnalytics(){
  const {db} = useStore();
  const deptAtt = DEPARTMENTS.map(d=>{
    const ss = db.students.filter(s=>s.dept===d);
    const v = ss.length ? Math.round(ss.reduce((sum,s)=>sum+studentOverallAttendance(db,s.id),0)/ss.length) : 0;
    return {label:d.split(" ")[0], value:v};
  });
  const classAtt = CLASSES.map(c=>{
    const ss = db.students.filter(s=>s.cls===c);
    const v = ss.length ? Math.round(ss.reduce((sum,s)=>sum+studentOverallAttendance(db,s.id),0)/ss.length) : 0;
    return {label:c, value:v};
  });
  const actCompletion = pct(db.completions.filter(c=>c.status==="completed").length, db.completions.length);
  const asnCompletion = pct(db.submissions.filter(s=>s.status==="submitted").length, db.submissions.length);
  const avgProgress = Math.round(db.students.reduce((s,st)=>s+studentProgressScore(db,st.id),0)/db.students.length);
  const trend = dailyAttendanceTrend(db);
  return (
    <div>
      <div className="grid grid-stats" style={{marginBottom:18}}>
        <StatCard label="Activity completion" value={`${actCompletion}%`} icon="activity" tint="violet"/>
        <StatCard label="Assignment completion" value={`${asnCompletion}%`} icon="clipboard" tint="gold"/>
        <StatCard label="Avg. student progress" value={`${avgProgress}%`} icon="chart" tint="teal"/>
      </div>
      <div className="grid grid-2" style={{marginBottom:18}}>
        <div className="card card-pad"><div className="section-title" style={{marginBottom:6}}>Department-wise attendance</div><MiniBarChart data={deptAtt} tint="gold"/></div>
        <div className="card card-pad"><div className="section-title" style={{marginBottom:6}}>Class-wise attendance</div><MiniBarChart data={classAtt} tint="teal"/></div>
      </div>
      <div className="card card-pad">
        <div className="section-title" style={{marginBottom:6}}>Daily attendance trend</div>
        <MiniLineChart data={trend} tint="violet"/>
      </div>
    </div>
  );
}

function AdminSettings(){
  const {db, update, toast, resetDemo} = useStore();
  const [threshold, setThreshold] = useState(db.settings.attendanceThreshold);
  const [confirmReset, setConfirmReset] = useState(false);
  const save = () => { update(d=>{ d.settings.attendanceThreshold = Number(threshold); }); toast("Settings saved", "success"); };
  return (
    <div className="grid grid-2">
      <div className="card card-pad">
        <div className="section-title" style={{marginBottom:14}}>Attendance policy</div>
        <Field label="Required attendance threshold (%)"><input className="input" type="number" value={threshold} onChange={e=>setThreshold(e.target.value)}/></Field>
        <button className="btn btn-primary" onClick={save}>Save settings</button>
      </div>
      <div className="card card-pad">
        <div className="section-title" style={{marginBottom:14}}>Points configuration</div>
        {Object.entries(db.settings.pointsMap).map(([k,v])=>(
          <div className="list-row" key={k}><span style={{fontSize:13}}>{k}</span><span className="mono" style={{fontWeight:700, color:"var(--gold-ink)"}}>{v} pts</span></div>
        ))}
      </div>
      <div className="card card-pad">
        <div className="section-title" style={{marginBottom:14}}>Demo data</div>
        <p style={{fontSize:12.5, color:"var(--text-muted)", marginBottom:12}}>Reset all attendance, activities, assignments and notifications back to the original hackathon demo dataset.</p>
        <button className="btn btn-danger" onClick={()=>setConfirmReset(true)}>Reset demo data</button>
      </div>
      {confirmReset && <ConfirmDialog title="Reset demo data?" message="This clears all changes made during this demo session and restores the original seed data. This cannot be undone." danger
        onConfirm={()=>{ resetDemo(); toast("Demo data reset", "info"); }} onClose={()=>setConfirmReset(false)}/>}
    </div>
  );
}

/* ============================================================================
   ROOT
============================================================================ */
function AppInner(){
  const {session} = useAuth();
  return (
    <>
      <ToastStack/>
      {session ? <Shell/> : <LoginPage/>}
    </>
  );
}

function App(){
  return (
    <StoreProvider>
      <AuthProvider>
        <AppInner/>
      </AuthProvider>
    </StoreProvider>
  );
}

export default App;
