import { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";

// ═══════════════════════════════════════════════════════════
//  SEED DATA
// ═══════════════════════════════════════════════════════════
const CLUSTERS = [
  { id:1,  name:"Agriculture, Food & Natural Resources", emoji:"🌾", color:"#2D6A4F", bg:"#D8F3DC", jobs:45, desc:"Farming, agribusiness, food science, environmental conservation" },
  { id:2,  name:"Architecture & Construction",          emoji:"🏗️", color:"#B5451B", bg:"#FDDCCC", jobs:38, desc:"Design and build the environments where Sri Lanka lives and works" },
  { id:3,  name:"Arts, Audio/Video & Communications",   emoji:"🎨", color:"#6B21A8", bg:"#EDE9FE", jobs:52, desc:"Creative arts, broadcast media, journalism and graphic design" },
  { id:4,  name:"Business Management & Administration", emoji:"💼", color:"#1E3A8A", bg:"#DBEAFE", jobs:67, desc:"Leadership, operations, human resources and strategic management" },
  { id:5,  name:"Education & Training",                 emoji:"📚", color:"#0369A1", bg:"#E0F2FE", jobs:41, desc:"Teaching, curriculum design and educational administration" },
  { id:6,  name:"Finance",                              emoji:"💰", color:"#065F46", bg:"#D1FAE5", jobs:55, desc:"Banking, accounting, investment analysis and financial planning" },
  { id:7,  name:"Government & Public Administration",   emoji:"🏛️", color:"#374151", bg:"#F3F4F6", jobs:33, desc:"Civil service, public policy, governance and administration" },
  { id:8,  name:"Health Science",                      emoji:"🏥", color:"#991B1B", bg:"#FEE2E2", jobs:78, desc:"Medicine, nursing, pharmacy and allied health services" },
  { id:9,  name:"Hospitality & Tourism",               emoji:"✈️", color:"#C2410C", bg:"#FED7AA", jobs:44, desc:"Hotels, travel management, food service and event planning" },
  { id:10, name:"Human Services",                      emoji:"🤝", color:"#7C3AED", bg:"#F3E8FF", jobs:29, desc:"Social work, counseling, community services and development" },
  { id:11, name:"Information Technology",              emoji:"💻", color:"#0E7490", bg:"#CFFAFE", jobs:89, desc:"Software engineering, networking, AI and cybersecurity" },
  { id:12, name:"Law, Public Safety & Security",       emoji:"⚖️", color:"#1D4ED8", bg:"#DBEAFE", jobs:36, desc:"Legal services, law enforcement and national security" },
  { id:13, name:"Manufacturing",                       emoji:"🏭", color:"#78350F", bg:"#FEF3C7", jobs:31, desc:"Industrial production, quality control and operations" },
  { id:14, name:"Marketing",                           emoji:"📢", color:"#9D174D", bg:"#FCE7F3", jobs:48, desc:"Advertising, digital marketing, branding and sales strategy" },
  { id:15, name:"Science, Technology, Engineering & Mathematics", emoji:"🔬", color:"#312E81", bg:"#E0E7FF", jobs:62, desc:"Research, engineering, mathematics and laboratory sciences" },
  { id:16, name:"Transportation, Distribution & Logistics", emoji:"🚢", color:"#134E4A", bg:"#CCFBF1", jobs:27, desc:"Supply chain, shipping, aviation and transportation logistics" },
];

let JOBS = [
  { id:1, clusterId:11, title:"Software Engineer",
    desc:"Design, develop, test and maintain software applications serving Sri Lankan businesses and global tech companies.",
    responsibilities:["Develop and maintain web applications","Write clean, maintainable code","Participate in code reviews","Collaborate with cross-functional teams","Troubleshoot and debug applications"],
    quals:"BSc Computer Science or Software Engineering (minimum 2nd class degree). Recognised by UGC.",
    skills:["Java","Python","React.js","Node.js","SQL","Git","REST APIs"],
    alStream:"Physical Science", alSubjects:["Combined Mathematics","Physics","ICT"],
    salMin:120000, salMax:450000, demand:"Very High", growth:"+22% by 2027",
    pathway:"Junior Developer → Senior Developer → Tech Lead → Engineering Manager → CTO",
    sector:"Private / Government", remote:true, intern:true,
    institutes:[
      { name:"University of Moratuwa",    course:"BSc Software Engineering",    fee:0,      dur:"4 years", type:"govt" },
      { name:"SLIIT",                     course:"BSc IT",                      fee:320000, dur:"4 years", type:"private" },
      { name:"IIT (affiliated with UK)",  course:"BSc Computer Science",        fee:480000, dur:"3 years", type:"private" },
      { name:"NIBM",                      course:"HND Software Engineering",    fee:95000,  dur:"2 years", type:"private" },
    ]},
  { id:2, clusterId:11, title:"Data Scientist",
    desc:"Analyse complex datasets using ML/AI to discover actionable insights that drive business decisions.",
    responsibilities:["Build ML models","Analyse and visualise data","Develop data pipelines","Present insights to stakeholders","Research new methodologies"],
    quals:"BSc Statistics, Computer Science or Data Science. MSc preferred.",
    skills:["Python","R","TensorFlow","PyTorch","SQL","Tableau","Spark"],
    alStream:"Physical Science", alSubjects:["Combined Mathematics","Physics","ICT"],
    salMin:150000, salMax:500000, demand:"Very High", growth:"+35% by 2027",
    pathway:"Data Analyst → Data Scientist → Senior Scientist → Lead Data Scientist → CDO",
    sector:"Private", remote:true, intern:true,
    institutes:[
      { name:"University of Colombo",    course:"BSc Statistics",    fee:0,      dur:"3 years", type:"govt" },
      { name:"SLIIT",                    course:"BSc Data Science",  fee:340000, dur:"4 years", type:"private" },
      { name:"University of Kelaniya",   course:"BSc Computing",     fee:0,      dur:"3 years", type:"govt" },
    ]},
  { id:3, clusterId:8, title:"Medical Doctor (MBBS)",
    desc:"Diagnose and treat illnesses, conduct medical examinations and promote public health across Sri Lanka.",
    responsibilities:["Examine and diagnose patients","Prescribe treatments","Conduct medical procedures","Maintain patient records","Engage in continuing education"],
    quals:"MBBS from a recognised faculty of medicine. Registration with Sri Lanka Medical Council (SLMC) mandatory.",
    skills:["Clinical diagnosis","Patient care","Surgical procedures","Medical documentation","Research"],
    alStream:"Biological Science", alSubjects:["Biology","Chemistry","Physics"],
    salMin:200000, salMax:800000, demand:"High", growth:"+15% by 2027",
    pathway:"Intern → Medical Officer → Registrar → Senior Registrar → Consultant",
    sector:"Government / Private", remote:false, intern:true,
    institutes:[
      { name:"Faculty of Medicine, University of Colombo",   course:"MBBS",  fee:0, dur:"5 years", type:"govt" },
      { name:"Faculty of Medicine, University of Kelaniya",  course:"MBBS",  fee:0, dur:"5 years", type:"govt" },
      { name:"Faculty of Medicine, University of Peradeniya",course:"MBBS",  fee:0, dur:"5 years", type:"govt" },
    ]},
  { id:4, clusterId:6, title:"Chartered Accountant",
    desc:"Manage financial records, prepare audit reports and advise businesses on financial strategy and compliance.",
    responsibilities:["Prepare financial statements","Conduct audits","Tax planning and compliance","Financial advisory","Internal controls"],
    quals:"CA Sri Lanka (ICASL) certification. CIMA or ACCA qualifications also recognised.",
    skills:["Financial reporting","Auditing","Tax law","ERP systems","MS Excel","IFRS"],
    alStream:"Commerce", alSubjects:["Accounting","Economics","Business Studies"],
    salMin:90000, salMax:350000, demand:"High", growth:"+12% by 2027",
    pathway:"Accountant → Senior Accountant → Financial Controller → Finance Director → CFO",
    sector:"Private / Government", remote:true, intern:true,
    institutes:[
      { name:"CA Sri Lanka (ICASL)",                    course:"CA Professional Programme",  fee:85000,  dur:"3-4 years", type:"professional" },
      { name:"University of Sri Jayawardenepura",       course:"BSc Accounting",             fee:0,      dur:"3 years",   type:"govt" },
      { name:"CIMA Sri Lanka",                          course:"CIMA Professional",          fee:180000, dur:"3 years",   type:"professional" },
    ]},
  { id:5, clusterId:4, title:"Human Resources Manager",
    desc:"Lead talent acquisition, employee relations, performance management and organisational development initiatives.",
    responsibilities:["Oversee recruitment","Design HR policies","Manage employee relations","Performance management","Training and development"],
    quals:"BSc Human Resource Management or Business Administration. CIPM qualification preferred.",
    skills:["Recruitment","Labour law","HRIS","Training & development","Payroll","Conflict resolution"],
    alStream:"Commerce / Arts", alSubjects:["Business Studies","Economics","Accounting"],
    salMin:80000, salMax:280000, demand:"Medium", growth:"+8% by 2027",
    pathway:"HR Officer → HR Executive → HR Manager → Head of HR → CHRO",
    sector:"Private / Government", remote:false, intern:true,
    institutes:[
      { name:"CIPM Sri Lanka",             course:"Professional HR Qualification",  fee:75000, dur:"2 years",  type:"professional" },
      { name:"University of Kelaniya",     course:"BSc HRM",                        fee:0,     dur:"3 years",  type:"govt" },
      { name:"University of Colombo",      course:"BSc Business Administration",    fee:0,     dur:"3 years",  type:"govt" },
    ]},
  { id:6, clusterId:3, title:"Graphic Designer",
    desc:"Create compelling visual content for digital and print media, including brand identities, UI/UX and marketing collateral.",
    responsibilities:["Design logos and brand identities","Create digital content","UI/UX wireframing","Collaborate with marketing teams","Manage design projects"],
    quals:"Diploma or Degree in Graphic Design / Visual Communication. Strong portfolio required.",
    skills:["Adobe Photoshop","Illustrator","InDesign","Figma","Typography","Colour theory"],
    alStream:"Arts / Technology", alSubjects:["Art","ICT","English"],
    salMin:60000, salMax:250000, demand:"Medium", growth:"+18% by 2027",
    pathway:"Junior Designer → Designer → Senior Designer → Art Director → Creative Director",
    sector:"Private", remote:true, intern:true,
    institutes:[
      { name:"AOD (Academy of Design)",  course:"BA Graphic Design",         fee:550000, dur:"3 years", type:"private" },
      { name:"ICBT Campus",              course:"Diploma in Graphic Design",  fee:120000, dur:"1 year",  type:"private" },
      { name:"Parsons School of Design", course:"Foundation Design",          fee:95000,  dur:"1 year",  type:"private" },
    ]},
  { id:7, clusterId:15, title:"Civil Engineer",
    desc:"Design, plan and supervise construction of infrastructure including roads, bridges, buildings and water systems.",
    responsibilities:["Structural design and analysis","Project planning and management","Site supervision","Cost estimation","Safety compliance"],
    quals:"BSc Civil Engineering. IESL membership required for independent practice.",
    skills:["AutoCAD","STAAD Pro","Project management","Surveying","MS Project","Building codes"],
    alStream:"Physical Science", alSubjects:["Combined Mathematics","Physics","Chemistry"],
    salMin:100000, salMax:380000, demand:"High", growth:"+14% by 2027",
    pathway:"Graduate Engineer → Project Engineer → Senior Engineer → Principal Engineer → Director",
    sector:"Government / Private", remote:false, intern:true,
    institutes:[
      { name:"University of Moratuwa",   course:"BSc Civil Engineering",  fee:0,      dur:"4 years", type:"govt" },
      { name:"University of Peradeniya", course:"BSc Civil Engineering",  fee:0,      dur:"4 years", type:"govt" },
      { name:"SLTC",                     course:"BSc Civil Engineering",  fee:280000, dur:"4 years", type:"private" },
    ]},
  { id:8, clusterId:14, title:"Digital Marketing Manager",
    desc:"Develop and execute comprehensive digital marketing strategies across SEO, social media, PPC and content marketing.",
    responsibilities:["Develop digital marketing strategy","Manage social media channels","SEO and PPC campaigns","Analytics and reporting","Team leadership"],
    quals:"Degree in Marketing, Business or Communications. Google Ads, HubSpot and Meta certifications highly valued.",
    skills:["SEO / SEM","Social media marketing","Google Analytics 4","Content marketing","Email automation","CRO"],
    alStream:"Commerce / Arts", alSubjects:["Business Studies","Economics","ICT"],
    salMin:70000, salMax:300000, demand:"High", growth:"+24% by 2027",
    pathway:"Marketing Executive → Digital Specialist → Marketing Manager → Head of Marketing → CMO",
    sector:"Private", remote:true, intern:true,
    institutes:[
      { name:"University of Colombo",  course:"BSc Marketing Management",  fee:0,     dur:"3 years", type:"govt" },
      { name:"AAT Sri Lanka",          course:"Diploma in Digital Marketing",fee:65000, dur:"1 year",  type:"professional" },
      { name:"SLIM",                   course:"Diploma in Marketing",       fee:70000, dur:"1 year",  type:"professional" },
    ]},
  { id:9, clusterId:8, title:"Pharmacist",
    desc:"Dispense medications, counsel patients and ensure safe medication use in hospitals and community pharmacies.",
    responsibilities:["Dispense and verify prescriptions","Counsel patients on medication use","Monitor drug interactions","Inventory management","Clinical pharmacy services"],
    quals:"BPharm from a recognised university. Registration with Sri Lanka Pharmacy Council mandatory.",
    skills:["Pharmacology","Drug interactions","Patient counselling","Clinical pharmacy","Inventory management"],
    alStream:"Biological Science", alSubjects:["Biology","Chemistry","Physics"],
    salMin:80000, salMax:250000, demand:"High", growth:"+11% by 2027",
    pathway:"Pharmacist Intern → Pharmacist → Senior Pharmacist → Chief Pharmacist → Director",
    sector:"Government / Private", remote:false, intern:true,
    institutes:[
      { name:"Faculty of Pharmacy, University of Colombo",   course:"BPharm",  fee:0, dur:"4 years", type:"govt" },
      { name:"Faculty of Pharmacy, University of Peradeniya",course:"BPharm",  fee:0, dur:"4 years", type:"govt" },
    ]},
  { id:10, clusterId:9, title:"Hotel Manager",
    desc:"Oversee all hotel operations to ensure exceptional guest experiences and sustainable profitability.",
    responsibilities:["Manage hotel departments","Guest relations and satisfaction","Budget and P&L management","Staff recruitment and training","Quality standards compliance"],
    quals:"Degree in Hotel Management or Hospitality. Experience in front office and F&B preferred.",
    skills:["Hotel operations","Revenue management","Customer service","F&B management","PMS systems","Leadership"],
    alStream:"Commerce / Arts", alSubjects:["Business Studies","Economics","English"],
    salMin:100000, salMax:400000, demand:"High", growth:"+16% by 2027",
    pathway:"Front Office Exec → Assistant Manager → Department Manager → GM → Regional Director",
    sector:"Private", remote:false, intern:true,
    institutes:[
      { name:"Colombo School of Hotel Management",  course:"BSc Hotel Management",     fee:180000, dur:"3 years", type:"private" },
      { name:"Sri Lanka Institute of Tourism",      course:"HND Hospitality Studies",  fee:85000,  dur:"2 years", type:"govt" },
      { name:"Ceylon Hotel School",                 course:"Certificate in Hotel Ops",  fee:45000,  dur:"1 year",  type:"govt" },
    ]},
];

let USERS = [
  { id:"u1", name:"Kavya Perera",         email:"student@demo.com",   password:"demo123", role:"STUDENT",     sub:"FREE", active:true, joined:"2024-09-15", views:24, favs:5 },
  { id:"u2", name:"Nimal Wickramasinghe", email:"nimal@demo.com",     password:"demo123", role:"STUDENT",     sub:"PAID", active:true, joined:"2024-08-20", views:31, favs:8 },
  { id:"u3", name:"Dr. Amara Silva",      email:"counselor@demo.com", password:"demo123", role:"COUNSELOR",   sub:"FREE", active:true, joined:"2024-01-10", views:0,  favs:0 },
  { id:"u4", name:"Admin User",           email:"admin@demo.com",     password:"demo123", role:"SUPER_ADMIN", sub:"FREE", active:true, joined:"2023-06-01", views:0,  favs:0 },
  { id:"u5", name:"Dilani Fernando",      email:"dilani@demo.com",    password:"demo123", role:"STUDENT",     sub:"FREE", active:true, joined:"2024-10-01", views:12, favs:2 },
  { id:"u6", name:"Ravindu Jayasinghe",   email:"ravindu@demo.com",   password:"demo123", role:"STUDENT",     sub:"PAID", active:false,joined:"2024-07-12", views:8,  favs:3 },
  { id:"u7", name:"Sithara Mendis",       email:"sithara@demo.com",   password:"demo123", role:"STUDENT",     sub:"FREE", active:true, joined:"2024-11-02", views:3,  favs:1 },
  { id:"u8", name:"Harsha Bandara",       email:"counselor2@demo.com",password:"demo123", role:"COUNSELOR",   sub:"FREE", active:true, joined:"2024-03-15", views:0,  favs:0 },
];

let SETTINGS = { paidMode:false, monthlyPrice:990, yearlyPrice:8900, bankName:"Bank of Ceylon", accountNo:"7890-1234-5678", accountHolder:"SL Job Bank (Pvt) Ltd", qrEnabled:true };
let FAVORITES = { u1:[1,3,7], u2:[1,2,4,8], u5:[2,6], u7:[3] };
let PAYMENTS = [
  { id:"p1", userId:"u2", amount:990, status:"COMPLETED", date:"2024-10-01", method:"PayHere" },
  { id:"p2", userId:"u6", amount:8900, status:"COMPLETED", date:"2024-08-01", method:"Bank Transfer" },
  { id:"p3", userId:"u1", amount:990, status:"PENDING",   date:"2024-10-15", method:"PayHere" },
];

const MONTHLY = [
  { m:"Jan", users:120, subs:42, rev:89100,  views:890  },
  { m:"Feb", users:145, subs:51, rev:104500, views:1120 },
  { m:"Mar", users:189, subs:67, rev:143200, views:1480 },
  { m:"Apr", users:210, subs:78, rev:178200, views:1650 },
  { m:"May", users:258, subs:95, rev:212000, views:2100 },
  { m:"Jun", users:312, subs:120,rev:278100, views:2480 },
];
const CLUSTER_POP = [
  { name:"IT",        val:89, fill:"#0E7490" },
  { name:"Health",    val:78, fill:"#991B1B" },
  { name:"Business",  val:67, fill:"#1E3A8A" },
  { name:"STEM",      val:62, fill:"#312E81" },
  { name:"Finance",   val:55, fill:"#065F46" },
  { name:"Arts",      val:52, fill:"#6B21A8" },
  { name:"Others",    val:98, fill:"#6B7280" },
];
const PIE_COLORS = ["#0E7490","#991B1B","#1E3A8A","#312E81","#065F46","#6B21A8","#6B7280"];

// ═══════════════════════════════════════════════════════════
//  DESIGN TOKENS
// ═══════════════════════════════════════════════════════════
const C = {
  primary:       "#0A2E1C",
  primaryMid:    "#1A5C3A",
  primaryLight:  "#2D6A4F",
  accent:        "#E8A200",
  accentLight:   "#FEF3C7",
  surface:       "#FFFFFF",
  bg:            "#F2F5F3",
  border:        "#E2E8E4",
  text:          "#111827",
  textMuted:     "#6B7280",
  textLight:     "#9CA3AF",
  success:       "#059669",
  danger:        "#DC2626",
  info:          "#2563EB",
  warning:       "#D97706",
};

// ═══════════════════════════════════════════════════════════
//  REUSABLE UI PRIMITIVES
// ═══════════════════════════════════════════════════════════
const css = {
  card:    { background:C.surface, borderRadius:14, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 4px rgba(0,0,0,.05)" },
  cardSm:  { background:C.surface, borderRadius:10, padding:14, border:`1px solid ${C.border}` },
  btnPrimary:{ background:C.primary, color:"#fff", border:"none", borderRadius:8, padding:"9px 18px", cursor:"pointer", fontSize:13, fontWeight:700, letterSpacing:"0.01em" },
  btnAccent: { background:C.accent,  color:C.primary, border:"none", borderRadius:8, padding:"9px 18px", cursor:"pointer", fontSize:13, fontWeight:700 },
  btnGhost:  { background:"transparent", color:C.text, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 16px", cursor:"pointer", fontSize:13, fontWeight:600 },
  btnDanger: { background:C.danger, color:"#fff", border:"none", borderRadius:7, padding:"6px 13px", cursor:"pointer", fontSize:12, fontWeight:600 },
  btnSuccess:{ background:C.success,color:"#fff", border:"none", borderRadius:7, padding:"6px 13px", cursor:"pointer", fontSize:12, fontWeight:600 },
  input:  { padding:"9px 13px", border:`1.5px solid ${C.border}`, borderRadius:8, fontSize:13, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" },
  label:  { fontSize:12, fontWeight:700, color:"#374151", display:"block", marginBottom:5, letterSpacing:"0.02em" },
};

function Badge({ type="gray", children, sm=false }) {
  const map = {
    success:["#065F46","#D1FAE5"], danger:["#991B1B","#FEE2E2"], warn:["#92400E","#FEF3C7"],
    info:["#1E40AF","#DBEAFE"], gray:["#374151","#F3F4F6"], purple:["#5B21B6","#EDE9FE"],
    teal:["#134E4A","#CCFBF1"], paid:["#065F46","#D1FAE5"], free:["#374151","#F3F4F6"],
  };
  const [c,bg] = map[type]||map.gray;
  return <span style={{ display:"inline-flex", alignItems:"center", padding: sm?"1px 7px":"2px 10px", borderRadius:20, fontSize:sm?10:11, fontWeight:700, color:c, background:bg, whiteSpace:"nowrap" }}>{children}</span>;
}

function Avatar({ name, size=34 }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:C.primary, color:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:size*0.38, flexShrink:0 }}>{name?.[0]?.toUpperCase()}</div>;
}

function StatCard({ label, value, icon, color, trend, onClick }) {
  return (
    <div style={{ ...css.card, borderLeft:`4px solid ${color}`, cursor:onClick?"pointer":"default" }} onClick={onClick}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:26, fontWeight:900, color, lineHeight:1.1 }}>{value}</div>
          <div style={{ fontSize:12, color:C.textMuted, marginTop:4, fontWeight:600 }}>{label}</div>
          {trend && <div style={{ fontSize:11, color:C.success, marginTop:5, fontWeight:700 }}>{trend}</div>}
        </div>
        <div style={{ fontSize:28, opacity:.8 }}>{icon}</div>
      </div>
    </div>
  );
}

function SectionTitle({ children, action }) {
  return <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
    <span style={{ fontSize:14, fontWeight:800, color:C.text, letterSpacing:"0.01em" }}>{children}</span>
    {action}
  </div>;
}

function Divider() { return <div style={{ height:1, background:C.border, margin:"14px 0" }} />; }

function Tag({ children }) {
  return <span style={{ fontSize:11, padding:"3px 9px", background:"#F3F4F6", color:"#374151", borderRadius:6, fontWeight:600 }}>{children}</span>;
}

function ProgressBar({ pct, color=C.primary }) {
  return <div style={{ background:"#E5E7EB", borderRadius:4, height:6, overflow:"hidden" }}>
    <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:4, transition:"width .3s" }} />
  </div>;
}

function Alert({ type="info", children }) {
  const map = { info:["#EFF6FF","#1E40AF","#BFDBFE"], warn:["#FFFBEB","#92400E","#FDE68A"], success:["#F0FDF4","#065F46","#A7F3D0"], danger:["#FEF2F2","#991B1B","#FECACA"] };
  const [bg,tc,border] = map[type];
  return <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:10, padding:"12px 16px", fontSize:13, color:tc, marginBottom:14 }}>{children}</div>;
}

function EmptyState({ icon, title, sub, action }) {
  return <div style={{ textAlign:"center", padding:"48px 24px" }}>
    <div style={{ fontSize:42, marginBottom:12 }}>{icon}</div>
    <div style={{ fontSize:15, fontWeight:700, color:"#374151", marginBottom:6 }}>{title}</div>
    <div style={{ fontSize:13, color:C.textMuted, marginBottom:16 }}>{sub}</div>
    {action}
  </div>;
}

function Modal({ title, children, onClose, width=560 }) {
  return <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{ background:"#fff", borderRadius:16, padding:28, width, maxWidth:"100%", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,.25)" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <h3 style={{ fontSize:17, fontWeight:800, color:C.text }}>{title}</h3>
        <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.textMuted, lineHeight:1 }}>×</button>
      </div>
      {children}
    </div>
  </div>;
}

function Topbar({ title, user, extra }) {
  return <div style={{ background:"#fff", padding:"0 26px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${C.border}`, flexShrink:0, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
    <div style={{ fontSize:17, fontWeight:800, color:C.text }}>{title}</div>
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      {extra}
      {SETTINGS.paidMode && <Badge type="warn">💳 Paid Mode ON</Badge>}
      <span style={{ fontSize:13, color:C.textMuted }}>Hi, {user?.name?.split(" ")[0]}</span>
      <Avatar name={user?.name} size={34} />
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════
//  SIDEBAR
// ═══════════════════════════════════════════════════════════
function Sidebar({ user, view, setView, onLogout }) {
  const isStudent   = user.role === "STUDENT";
  const isCounselor = user.role === "COUNSELOR";
  const isAdmin     = user.role === "SUPER_ADMIN";

  const NavItem = ({ v, icon, label }) => (
    <div onClick={() => setView(v)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 18px", cursor:"pointer", fontSize:13.5, fontWeight:600, color: view===v ? C.accent : "rgba(255,255,255,.72)", background: view===v ? "rgba(232,162,0,.12)" : "transparent", borderLeft: `3px solid ${view===v ? C.accent : "transparent"}`, transition:"all .13s", userSelect:"none" }}>
      <span style={{ fontSize:15 }}>{icon}</span><span>{label}</span>
    </div>
  );
  const NavSection = ({ label }) => <div style={{ fontSize:10, fontWeight:800, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".1em", padding:"14px 18px 4px" }}>{label}</div>;

  return (
    <div style={{ width:232, background:C.primary, color:"#fff", display:"flex", flexDirection:"column", flexShrink:0, minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ padding:"22px 18px 16px", borderBottom:"1px solid rgba(255,255,255,.1)" }}>
        <div style={{ fontSize:17, fontWeight:900, color:C.accent, letterSpacing:"-.3px" }}>🇱🇰 SL Job Bank</div>
        <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:".1em", marginTop:2 }}>Career Guidance System</div>
        <div style={{ display:"inline-flex", alignItems:"center", marginTop:10, fontSize:10, padding:"3px 9px", borderRadius:10, background:"rgba(232,162,0,.2)", color:C.accent, fontWeight:700 }}>{user.role.replace("_"," ")}</div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, paddingBottom:8 }}>
        {isStudent && <>
          <NavSection label="Main" />
          <NavItem v="s.dashboard"    icon="🏠" label="Dashboard" />
          <NavItem v="s.clusters"     icon="🗂️" label="Career Clusters" />
          <NavItem v="s.jobs"         icon="💼" label="Browse Jobs" />
          <NavItem v="s.favorites"    icon="❤️" label="Saved Jobs" />
          <NavSection label="Account" />
          <NavItem v="s.subscription" icon="💳" label="Subscription" />
          <NavItem v="s.profile"      icon="👤" label="My Profile" />
        </>}
        {isCounselor && <>
          <NavSection label="Management" />
          <NavItem v="c.dashboard"  icon="🏠" label="Dashboard" />
          <NavItem v="c.jobs"       icon="💼" label="Manage Jobs" />
          <NavItem v="c.institutes" icon="🏫" label="Institutes & Courses" />
          <NavSection label="Insights" />
          <NavItem v="c.analytics"  icon="📊" label="Analytics" />
          <NavItem v="c.reports"    icon="📋" label="Reports" />
        </>}
        {isAdmin && <>
          <NavSection label="Management" />
          <NavItem v="a.dashboard"     icon="🏠" label="Dashboard" />
          <NavItem v="a.users"         icon="👥" label="User Management" />
          <NavItem v="a.jobs"          icon="💼" label="Job Management" />
          <NavSection label="System" />
          <NavItem v="a.subscription"  icon="💳" label="Subscription Control" />
          <NavItem v="a.payments"      icon="💰" label="Payment History" />
          <NavItem v="a.settings"      icon="⚙️" label="System Settings" />
          <NavItem v="a.analytics"     icon="📊" label="Analytics" />
          <NavItem v="a.reports"       icon="📋" label="Reports" />
        </>}
      </nav>

      {/* Footer */}
      <div style={{ padding:"14px 18px", borderTop:"1px solid rgba(255,255,255,.1)" }}>
        <div style={{ fontWeight:700, color:"#fff", fontSize:13, marginBottom:2 }}>{user.name}</div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,.45)", marginBottom:10 }}>{user.email}</div>
        <button onClick={onLogout} style={{ background:"rgba(255,255,255,.08)", color:"rgba(255,255,255,.7)", border:"none", padding:"6px 14px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600, width:"100%" }}>↩ Sign Out</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  AUTH PAGE
// ═══════════════════════════════════════════════════════════
function AuthPage({ onLogin }) {
  const [tab, setTab]     = useState("login");
  const [email, setEmail] = useState("student@demo.com");
  const [pass, setPass]   = useState("demo123");
  const [name, setName]   = useState("");
  const [err, setErr]     = useState("");

  function doLogin(e) {
    e.preventDefault();
    const u = USERS.find(x => x.email === email && x.password === pass);
    if (!u) { setErr("Invalid credentials. Try the demo accounts below."); return; }
    onLogin(u);
  }

  function doRegister(e) {
    e.preventDefault();
    if (!name || !email || !pass) { setErr("All fields are required."); return; }
    if (USERS.find(x => x.email === email)) { setErr("Email already registered."); return; }
    const newU = { id:`u${Date.now()}`, name, email, password:pass, role:"STUDENT", sub:"FREE", active:true, joined:new Date().toISOString().slice(0,10), views:0, favs:0 };
    USERS.push(newU);
    onLogin(newU);
  }

  const demos = [
    { role:"👨‍🎓 Student",     email:"student@demo.com",   pass:"demo123" },
    { role:"👩‍💼 Counselor",   email:"counselor@demo.com", pass:"demo123" },
    { role:"⚙️ Super Admin",   email:"admin@demo.com",     pass:"demo123" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(145deg, ${C.primary} 0%, ${C.primaryMid} 60%, #1A4B2F 100%)`, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:420, maxWidth:"100%" }}>
        {/* Brand */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:36, marginBottom:6 }}>🇱🇰</div>
          <h1 style={{ fontSize:24, fontWeight:900, color:"#fff", letterSpacing:"-.5px", marginBottom:4 }}>SL Job Bank</h1>
          <p style={{ fontSize:13, color:"rgba(255,255,255,.6)" }}>Sri Lanka Career Guidance Platform</p>
        </div>

        {/* Card */}
        <div style={{ background:"#fff", borderRadius:18, padding:32, boxShadow:"0 24px 80px rgba(0,0,0,.3)" }}>
          {/* Tabs */}
          <div style={{ display:"flex", background:"#F3F4F6", borderRadius:9, padding:3, marginBottom:22 }}>
            {["login","register"].map(t => (
              <button key={t} onClick={() => { setTab(t); setErr(""); }} style={{ flex:1, padding:"8px 0", border:"none", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:700, background: tab===t?"#fff":"transparent", color: tab===t?C.primary:C.textMuted, boxShadow: tab===t?"0 1px 4px rgba(0,0,0,.1)":undefined, transition:"all .15s" }}>
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={tab==="login" ? doLogin : doRegister}>
            {tab === "register" && (
              <div style={{ marginBottom:14 }}>
                <label style={css.label}>Full Name</label>
                <input style={css.input} placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)} />
              </div>
            )}
            <div style={{ marginBottom:14 }}>
              <label style={css.label}>Email Address</label>
              <input style={css.input} type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div style={{ marginBottom:18 }}>
              <label style={css.label}>Password</label>
              <input style={css.input} type="password" placeholder={tab==="login"?"Enter password":"Create a password"} value={pass} onChange={e=>setPass(e.target.value)} />
            </div>
            {err && <div style={{ color:C.danger, fontSize:12, marginBottom:10, padding:"8px 12px", background:"#FEF2F2", borderRadius:7 }}>⚠️ {err}</div>}
            <button type="submit" style={{ ...css.btnPrimary, width:"100%", padding:"12px 0", fontSize:14 }}>
              {tab==="login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Demo Accounts */}
          <div style={{ marginTop:20, padding:14, background:"#F0FDF4", borderRadius:10, border:"1px solid #A7F3D0" }}>
            <div style={{ fontSize:12, fontWeight:800, color:"#065F46", marginBottom:8 }}>🔑 Demo Accounts (click to fill)</div>
            {demos.map(d => (
              <div key={d.email} onClick={() => { setEmail(d.email); setPass(d.pass); setTab("login"); setErr(""); }} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", cursor:"pointer", borderBottom:"1px solid #A7F3D0" }}>
                <span style={{ fontSize:12, fontWeight:600, color:"#065F46" }}>{d.role}</span>
                <span style={{ fontSize:11, color:"#6B7280", fontFamily:"monospace" }}>{d.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SUBSCRIPTION PAGE
// ═══════════════════════════════════════════════════════════
function SubscriptionPage({ user, onActivate, onSkip }) {
  const [plan, setPlan] = useState("monthly");
  const price = plan === "monthly" ? SETTINGS.monthlyPrice : SETTINGS.yearlyPrice;

  if (user.sub === "PAID") return (
    <div style={{ maxWidth:520, margin:"0 auto" }}>
      <Alert type="success">✅ You have an active subscription — full access is unlocked!</Alert>
      <div style={{ ...css.card, textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
        <h3 style={{ fontSize:20, fontWeight:800, marginBottom:8 }}>Subscription Active</h3>
        <p style={{ color:C.textMuted, fontSize:13 }}>Full access to 600+ careers, institutes and salary data.</p>
        <button style={{ ...css.btnPrimary, marginTop:16 }} onClick={onSkip}>Go to Dashboard →</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:520, margin:"0 auto" }}>
      {SETTINGS.paidMode && <Alert type="warn">⚠️ The platform is in Paid Mode. Subscribe to access all features.</Alert>}

      <div style={{ ...css.card, border:`2px solid ${C.accent}`, marginBottom:16 }}>
        <div style={{ textAlign:"center", marginBottom:22 }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🎯</div>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.primary }}>Career Guidance Access</h2>
          <p style={{ fontSize:13, color:C.textMuted, marginTop:4 }}>Unlock 600+ careers, salary data, institute details & AI recommendations</p>
        </div>

        {/* Plan toggle */}
        <div style={{ display:"flex", background:"#F3F4F6", borderRadius:9, padding:3, marginBottom:20 }}>
          {["monthly","yearly"].map(p => (
            <button key={p} onClick={() => setPlan(p)} style={{ flex:1, padding:"9px 0", border:"none", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:700, background:plan===p?"#fff":"transparent", color:plan===p?C.primary:C.textMuted }}>
              {p==="monthly" ? "Monthly" : "Yearly — Save 25%"}
            </button>
          ))}
        </div>

        <div style={{ textAlign:"center", marginBottom:20 }}>
          <span style={{ fontSize:14, color:C.textMuted }}>LKR </span>
          <span style={{ fontSize:42, fontWeight:900, color:C.primary }}>{price.toLocaleString()}</span>
          <span style={{ fontSize:13, color:C.textMuted }}>/{plan==="monthly"?"month":"year"}</span>
        </div>

        {/* Features */}
        {["Access 600+ career profiles","View all salary ranges & institutes","A/L subject requirements","Course fees & durations","Save & compare careers","Download PDF career guides"].map(f => (
          <div key={f} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, fontSize:13, color:"#374151" }}>
            <span style={{ color:C.success, fontWeight:700 }}>✓</span>{f}
          </div>
        ))}

        <div style={{ height:1, background:C.border, margin:"18px 0" }} />

        {/* Payment options */}
        <div style={{ background:"#F9FAFB", borderRadius:10, padding:14, marginBottom:16, fontSize:12 }}>
          <div style={{ fontWeight:800, marginBottom:8, color:C.text }}>🏦 Bank Transfer Details</div>
          {[["Bank", SETTINGS.bankName],["Account No.", SETTINGS.accountNo],["Account Name", SETTINGS.accountHolder]].map(([l,v]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ color:C.textMuted }}>{l}</span><span style={{ fontWeight:700 }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <button style={{ ...css.btnPrimary, padding:"12px 0", fontSize:13 }} onClick={onActivate}>💳 Pay via PayHere</button>
          <button style={{ ...css.btnAccent, padding:"12px 0", fontSize:13 }} onClick={onActivate}>📱 QR Code Payment</button>
        </div>
        <div style={{ textAlign:"center", fontSize:11, color:C.textMuted, marginTop:10 }}>
          Secured by PayHere · Stripe · WebXPay · Dialog Genie
        </div>
      </div>

      {!SETTINGS.paidMode && <div style={{ textAlign:"center" }}><button style={{ ...css.btnGhost, fontSize:13 }} onClick={onSkip}>← Back to Dashboard</button></div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  STUDENT — DASHBOARD
// ═══════════════════════════════════════════════════════════
function StudentDashboard({ user, setView, setActiveJob, setFilterCluster }) {
  const favIds = FAVORITES[user.id] || [];
  const topJobs = JOBS.slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.text }}>Welcome back, {user.name.split(" ")[0]}! 👋</h2>
        <p style={{ fontSize:13, color:C.textMuted, marginTop:2 }}>Your personalised career guidance hub</p>
      </div>

      {SETTINGS.paidMode && user.sub !== "PAID" && (
        <Alert type="warn">⚠️ Paid mode is active. <span style={{ fontWeight:700, cursor:"pointer", textDecoration:"underline" }} onClick={() => setView("s.subscription")}>Subscribe now</span> for full access.</Alert>
      )}

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        <StatCard label="Career Paths" value="600+" icon="🗂️" color={C.info} />
        <StatCard label="Clusters"     value="16"   icon="🌐" color={C.primaryLight} />
        <StatCard label="Saved Jobs"   value={favIds.length} icon="❤️" color={C.danger} onClick={() => setView("s.favorites")} />
        <StatCard label="Subscription" value={user.sub} icon={user.sub==="PAID"?"✅":"🆓"} color={user.sub==="PAID"?C.success:"#6B7280"} onClick={() => setView("s.subscription")} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:18, marginBottom:18 }}>
        {/* Trending Jobs */}
        <div style={css.card}>
          <SectionTitle>🔥 Trending Careers</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {topJobs.map(j => {
              const cl = CLUSTERS.find(c => c.id === j.clusterId);
              const isFav = favIds.includes(j.id);
              return (
                <div key={j.id} onClick={() => { setActiveJob(j.id); setView("s.job"); }} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", background:C.bg, borderRadius:10, cursor:"pointer", transition:"background .15s" }}
                  onMouseOver={e => e.currentTarget.style.background="#E8F0EB"}
                  onMouseOut={e => e.currentTarget.style.background=C.bg}>
                  <div style={{ width:40, height:40, borderRadius:10, background:cl?.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{cl?.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:C.text }}>{j.title}</div>
                    <div style={{ fontSize:11, color:C.textMuted }}>{cl?.name}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:C.primaryLight, marginTop:2 }}>LKR {(j.salMin/1000).toFixed(0)}k – {(j.salMax/1000).toFixed(0)}k/mo</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                    <Badge type={j.demand==="Very High"?"success":j.demand==="High"?"info":"gray"} sm>{j.demand}</Badge>
                    <span style={{ fontSize:16, cursor:"pointer" }}>{isFav?"❤️":"🤍"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clusters grid */}
        <div style={css.card}>
          <SectionTitle>🗂️ Explore Clusters</SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {CLUSTERS.slice(0,8).map(c => (
              <div key={c.id} onClick={() => { setFilterCluster(c.id); setView("s.jobs"); }} style={{ padding:"10px 12px", border:`1.5px solid ${C.border}`, borderRadius:10, cursor:"pointer", transition:"all .15s" }}
                onMouseOver={e => { e.currentTarget.style.borderColor=c.color; e.currentTarget.style.background=c.bg+"60"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background="transparent"; }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{c.emoji}</div>
                <div style={{ fontSize:11.5, fontWeight:700, color:C.text, lineHeight:1.3 }}>{c.name.split(",")[0].split("&")[0].trim()}</div>
                <div style={{ fontSize:10, color:c.color, fontWeight:700, marginTop:3 }}>{c.jobs} careers</div>
              </div>
            ))}
          </div>
          <button style={{ ...css.btnGhost, width:"100%", marginTop:12, fontSize:12 }} onClick={() => setView("s.clusters")}>View All 16 Clusters →</button>
        </div>
      </div>

      {/* Monthly chart */}
      <div style={css.card}>
        <SectionTitle>📈 Platform Activity</SectionTitle>
        <div style={{ height:180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY} margin={{ top:5, right:10, left:0, bottom:0 }}>
              <defs>
                <linearGradient id="cgr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.primaryLight} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.primaryLight} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="m" tick={{ fontSize:11 }} />
              <YAxis tick={{ fontSize:11 }} />
              <Tooltip contentStyle={{ fontSize:12, borderRadius:8 }} />
              <Area type="monotone" dataKey="users" stroke={C.primaryLight} fill="url(#cgr)" strokeWidth={2.5} name="Active Users" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  STUDENT — CLUSTERS
// ═══════════════════════════════════════════════════════════
function ClustersPage({ setView, setFilterCluster }) {
  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>Career Clusters</h2>
      <p style={{ fontSize:13, color:C.textMuted, marginBottom:22 }}>All 16 career clusters mapped to the Sri Lankan A/L education system</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:13 }}>
        {CLUSTERS.map(c => (
          <div key={c.id} onClick={() => { setFilterCluster(c.id); setView("s.jobs"); }} style={{ background:C.surface, border:`1px solid ${C.border}`, borderTop:`3px solid ${c.color}`, borderRadius:12, padding:16, cursor:"pointer", transition:"all .15s" }}
            onMouseOver={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,.1)"; }}
            onMouseOut={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
            <div style={{ fontSize:28, marginBottom:9 }}>{c.emoji}</div>
            <div style={{ fontSize:13, fontWeight:800, color:C.text, marginBottom:5, lineHeight:1.35 }}>{c.name}</div>
            <div style={{ fontSize:11, color:C.textMuted, lineHeight:1.4, marginBottom:8 }}>{c.desc}</div>
            <div style={{ fontSize:12, fontWeight:700, color:c.color }}>{c.jobs} careers →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  STUDENT — JOBS LIST
// ═══════════════════════════════════════════════════════════
function JobsPage({ user, filterCluster, setFilterCluster, setView, setActiveJob }) {
  const [q, setQ] = useState("");
  const [demandF, setDemandF] = useState("");

  const filtered = useMemo(() => JOBS.filter(j => {
    if (filterCluster && j.clusterId !== filterCluster) return false;
    if (demandF && j.demand !== demandF) return false;
    if (q && ![j.title, j.desc, j.skills.join(" "), j.alStream].join(" ").toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, filterCluster, demandF]);

  const cl = filterCluster ? CLUSTERS.find(c => c.id === filterCluster) : null;

  function toggleFav(e, jobId) {
    e.stopPropagation();
    const uid = user.id;
    if (!FAVORITES[uid]) FAVORITES[uid] = [];
    const idx = FAVORITES[uid].indexOf(jobId);
    if (idx === -1) FAVORITES[uid].push(jobId);
    else FAVORITES[uid].splice(idx, 1);
    // force re-render via state trick (parent controls state)
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:900 }}>
            {cl ? <><span style={{ fontSize:22 }}>{cl.emoji}</span> {cl.name}</> : "Browse All Jobs"}
          </h2>
          <p style={{ fontSize:13, color:C.textMuted, marginTop:2 }}>{filtered.length} careers found</p>
        </div>
        {filterCluster && <button style={css.btnGhost} onClick={() => setFilterCluster(null)}>← All Clusters</button>}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:10, marginBottom:18 }}>
        <input style={{ ...css.input, flex:1 }} placeholder="🔍 Search careers, skills, A/L streams..." value={q} onChange={e => setQ(e.target.value)} />
        <select style={{ ...css.input, width:190 }} value={filterCluster||""} onChange={e => setFilterCluster(e.target.value ? +e.target.value : null)}>
          <option value="">All Clusters</option>
          {CLUSTERS.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name.split(",")[0]}</option>)}
        </select>
        <select style={{ ...css.input, width:150 }} value={demandF} onChange={e => setDemandF(e.target.value)}>
          <option value="">All Demand</option>
          {["Very High","High","Medium","Low"].map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {filtered.length === 0 && <EmptyState icon="🔍" title="No careers found" sub="Try adjusting your search or filters" action={<button style={css.btnPrimary} onClick={() => { setQ(""); setFilterCluster(null); setDemandF(""); }}>Clear Filters</button>} />}

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(j => {
          const clust = CLUSTERS.find(c => c.id === j.clusterId);
          const isFav = (FAVORITES[user.id]||[]).includes(j.id);
          return (
            <div key={j.id} onClick={() => { setActiveJob(j.id); setView("s.job"); }} style={{ ...css.card, display:"flex", gap:16, alignItems:"flex-start", cursor:"pointer", padding:18, transition:"all .15s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor=C.primaryLight; e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.08)"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.05)"; }}>
              <div style={{ width:52, height:52, borderRadius:13, background:clust?.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{clust?.emoji}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                  <div>
                    <div style={{ fontSize:15.5, fontWeight:800, color:C.text }}>{j.title}</div>
                    <div style={{ fontSize:12, color:C.textMuted, marginTop:1 }}>{clust?.name}</div>
                  </div>
                  <button onClick={e => { toggleFav(e,j.id); }} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", flexShrink:0 }}>{isFav?"❤️":"🤍"}</button>
                </div>
                <p style={{ fontSize:12.5, color:"#374151", lineHeight:1.55, margin:"8px 0", maxWidth:640 }}>{j.desc.slice(0,140)}...</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
                  <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, background:"#D1FAE5", color:"#065F46", fontWeight:700 }}>📈 {j.demand}</span>
                  <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, background:"#DBEAFE", color:"#1E40AF", fontWeight:700 }}>📚 {j.alStream}</span>
                  <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, background:C.accentLight, color:"#92400E", fontWeight:700 }}>💰 LKR {(j.salMin/1000).toFixed(0)}k–{(j.salMax/1000).toFixed(0)}k</span>
                  {j.remote && <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, background:"#EDE9FE", color:"#5B21B6", fontWeight:700 }}>🏠 Remote OK</span>}
                  {j.intern && <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, background:"#F3F4F6", color:"#374151", fontWeight:700 }}>🎓 Internship</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  STUDENT — JOB DETAIL
// ═══════════════════════════════════════════════════════════
function JobDetailPage({ user, jobId, setView, notify }) {
  const j = JOBS.find(x => x.id === jobId);
  if (!j) return <EmptyState icon="💼" title="Job not found" sub="" action={<button style={css.btnPrimary} onClick={() => setView("s.jobs")}>Back to Jobs</button>} />;

  const cl = CLUSTERS.find(c => c.id === j.clusterId);
  const isFav = (FAVORITES[user.id]||[]).includes(j.id);

  function toggleFav() {
    if (!FAVORITES[user.id]) FAVORITES[user.id] = [];
    const idx = FAVORITES[user.id].indexOf(j.id);
    if (idx === -1) { FAVORITES[user.id].push(j.id); notify("Added to saved jobs ❤️"); }
    else { FAVORITES[user.id].splice(idx, 1); notify("Removed from saved jobs"); }
  }

  return (
    <div>
      <button style={{ ...css.btnGhost, marginBottom:18, fontSize:12 }} onClick={() => setView("s.jobs")}>← Back to Jobs</button>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:18, alignItems:"start" }}>
        {/* Main */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Header card */}
          <div style={css.card}>
            <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
              <div style={{ width:60, height:60, borderRadius:15, background:cl?.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, flexShrink:0 }}>{cl?.emoji}</div>
              <div style={{ flex:1 }}>
                <h2 style={{ fontSize:22, fontWeight:900, color:C.text, marginBottom:4 }}>{j.title}</h2>
                <div style={{ fontSize:13, color:C.textMuted, marginBottom:10 }}>{cl?.name}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  <Badge type={j.demand==="Very High"?"success":j.demand==="High"?"info":"gray"}>{j.demand} Demand</Badge>
                  {j.remote && <Badge type="purple">Remote OK</Badge>}
                  {j.intern && <Badge type="info">Internship Available</Badge>}
                  <Badge type="teal">{j.sector}</Badge>
                </div>
              </div>
              <button onClick={toggleFav} style={{ background:"none", border:"none", fontSize:26, cursor:"pointer" }}>{isFav?"❤️":"🤍"}</button>
            </div>
            <Divider />
            <p style={{ fontSize:13.5, color:"#374151", lineHeight:1.65 }}>{j.desc}</p>
          </div>

          {/* Key Details */}
          <div style={css.card}>
            <SectionTitle>📊 Key Details</SectionTitle>
            {[
              ["💰 Salary Range", `LKR ${j.salMin.toLocaleString()} – ${j.salMax.toLocaleString()} / month`],
              ["📚 A/L Stream",   j.alStream],
              ["📖 A/L Subjects", j.alSubjects.join(", ")],
              ["🎓 Qualifications",j.quals],
              ["🏢 Sector",       j.sector],
              ["📈 Employment Growth", j.growth],
            ].map(([l,v]) => (
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}`, gap:12 }}>
                <span style={{ fontSize:13, color:C.textMuted, fontWeight:600, flexShrink:0 }}>{l}</span>
                <span style={{ fontSize:13, fontWeight:700, color:C.text, textAlign:"right" }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Career Pathway */}
          <div style={css.card}>
            <SectionTitle>🛤️ Career Pathway</SectionTitle>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, alignItems:"center" }}>
              {j.pathway.split("→").map((step, i, arr) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ fontSize:12, fontWeight:700, padding:"5px 12px", background: i===0?C.primary:i===arr.length-1?C.accent:"#F3F4F6", color: i===0?"#fff":i===arr.length-1?C.primary:C.text, borderRadius:20 }}>{step.trim()}</span>
                  {i < arr.length-1 && <span style={{ color:C.textMuted }}>→</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div style={css.card}>
            <SectionTitle>📋 Responsibilities</SectionTitle>
            {j.responsibilities.map((r,i) => (
              <div key={i} style={{ display:"flex", gap:10, padding:"6px 0", borderBottom:i<j.responsibilities.length-1?`1px solid ${C.border}`:"none" }}>
                <span style={{ color:C.success, fontWeight:700, flexShrink:0 }}>✓</span>
                <span style={{ fontSize:13, color:"#374151" }}>{r}</span>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div style={css.card}>
            <SectionTitle>🛠️ Required Skills</SectionTitle>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {j.skills.map(s => <Tag key={s}>{s}</Tag>)}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Actions */}
          <div style={css.card}>
            <button style={{ ...css.btnPrimary, width:"100%", padding:"12px 0", fontSize:14, marginBottom:9 }} onClick={() => notify("Career report downloading... 📄")}>📄 Download PDF Guide</button>
            <button style={{ ...css.btnAccent, width:"100%", padding:"10px 0", fontSize:13 }} onClick={toggleFav}>{isFav?"💔 Remove from Saved":"❤️ Save this Career"}</button>
          </div>

          {/* Salary Visual */}
          <div style={css.card}>
            <SectionTitle>💰 Salary Range</SectionTitle>
            <div style={{ textAlign:"center", marginBottom:12 }}>
              <div style={{ fontSize:22, fontWeight:900, color:C.primaryLight }}>LKR {(j.salMin/1000).toFixed(0)}k – {(j.salMax/1000).toFixed(0)}k</div>
              <div style={{ fontSize:11, color:C.textMuted }}>per month (LKR)</div>
            </div>
            <div style={{ marginBottom:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.textMuted, marginBottom:4 }}>
                <span>Entry</span><span>Senior</span>
              </div>
              <div style={{ background:"#E5E7EB", borderRadius:6, height:10, overflow:"hidden", position:"relative" }}>
                <div style={{ position:"absolute", left:"10%", width:"80%", height:"100%", background:`linear-gradient(90deg,${C.primaryLight},${C.accent})`, borderRadius:6 }} />
              </div>
            </div>
          </div>

          {/* Institutes */}
          <div style={css.card}>
            <SectionTitle>🏫 Institutes & Courses</SectionTitle>
            {j.institutes.map((inst,i) => (
              <div key={i} style={{ marginBottom:12, paddingBottom:12, borderBottom: i<j.institutes.length-1?`1px solid ${C.border}`:"none" }}>
                <div style={{ fontSize:13, fontWeight:800, marginBottom:6, color:C.text }}>{inst.name}</div>
                <div style={{ background:C.bg, borderRadius:8, padding:"10px 12px" }}>
                  <div style={{ fontSize:12.5, fontWeight:700 }}>{inst.course}</div>
                  <div style={{ fontSize:11, color:C.textMuted, marginTop:3 }}>⏱ {inst.dur}</div>
                  <div style={{ fontSize:12.5, fontWeight:800, marginTop:4, color: inst.fee===0?C.success:C.primary }}>
                    {inst.fee === 0 ? "🆓 Government (Free)" : `LKR ${inst.fee.toLocaleString()}`}
                  </div>
                  <div style={{ marginTop:4 }}>
                    <Badge type={inst.type==="govt"?"success":inst.type==="professional"?"info":"gray"} sm>{inst.type}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  STUDENT — FAVORITES
// ═══════════════════════════════════════════════════════════
function FavoritesPage({ user, setView, setActiveJob }) {
  const favIds = FAVORITES[user.id] || [];
  const favJobs = JOBS.filter(j => favIds.includes(j.id));

  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>Saved Jobs</h2>
      <p style={{ fontSize:13, color:C.textMuted, marginBottom:22 }}>{favJobs.length} saved career{favJobs.length !== 1 ? "s" : ""}</p>

      {favJobs.length === 0 && <EmptyState icon="❤️" title="No saved careers yet" sub="Browse jobs and click the heart icon to save them here" action={<button style={css.btnPrimary} onClick={() => setView("s.jobs")}>Browse Jobs</button>} />}

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {favJobs.map(j => {
          const cl = CLUSTERS.find(c => c.id === j.clusterId);
          return (
            <div key={j.id} style={{ ...css.card, display:"flex", gap:14, alignItems:"center" }}>
              <div style={{ width:48, height:48, borderRadius:12, background:cl?.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0, cursor:"pointer" }} onClick={() => { setActiveJob(j.id); setView("s.job"); }}>{cl?.emoji}</div>
              <div style={{ flex:1, cursor:"pointer" }} onClick={() => { setActiveJob(j.id); setView("s.job"); }}>
                <div style={{ fontSize:15, fontWeight:800 }}>{j.title}</div>
                <div style={{ fontSize:12, color:C.textMuted }}>{cl?.name}</div>
                <div style={{ fontSize:12, fontWeight:700, color:C.primaryLight, marginTop:3 }}>LKR {(j.salMin/1000).toFixed(0)}k – {(j.salMax/1000).toFixed(0)}k/mo · {j.demand} Demand</div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button style={{ ...css.btnGhost, fontSize:12 }} onClick={() => { setActiveJob(j.id); setView("s.job"); }}>View Details</button>
                <button style={{ background:"none", border:"none", fontSize:20, cursor:"pointer" }} onClick={() => { const idx = FAVORITES[user.id].indexOf(j.id); if(idx!==-1)FAVORITES[user.id].splice(idx,1); setView("s.favorites"); }}>❤️</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  STUDENT — PROFILE
// ═══════════════════════════════════════════════════════════
function ProfilePage({ user, setView, notify }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  return (
    <div style={{ maxWidth:560 }}>
      <h2 style={{ fontSize:22, fontWeight:900, marginBottom:20 }}>My Profile</h2>
      <div style={{ ...css.card, marginBottom:16 }}>
        <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:22 }}>
          <Avatar name={user.name} size={64} />
          <div>
            <div style={{ fontSize:18, fontWeight:800 }}>{user.name}</div>
            <div style={{ fontSize:13, color:C.textMuted }}>{user.email}</div>
            <div style={{ marginTop:6, display:"flex", gap:6 }}>
              <Badge type={user.sub==="PAID"?"success":"gray"}>{user.sub} Plan</Badge>
              <Badge type="info">{user.role}</Badge>
            </div>
          </div>
        </div>
        <div style={{ marginBottom:14 }}><label style={css.label}>Full Name</label><input style={css.input} value={name} onChange={e => setName(e.target.value)} /></div>
        <div style={{ marginBottom:18 }}><label style={css.label}>Email</label><input style={css.input} value={email} onChange={e => setEmail(e.target.value)} /></div>
        <button style={css.btnPrimary} onClick={() => { user.name = name; user.email = email; notify("Profile updated! ✅"); }}>Save Changes</button>
      </div>
      <div style={css.card}>
        <SectionTitle>Subscription</SectionTitle>
        <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
          <span style={{ fontSize:13, color:C.textMuted }}>Current Plan</span>
          <Badge type={user.sub==="PAID"?"success":"gray"}>{user.sub}</Badge>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
          <span style={{ fontSize:13, color:C.textMuted }}>Member Since</span>
          <span style={{ fontSize:13, fontWeight:700 }}>{user.joined}</span>
        </div>
        {user.sub === "FREE" ? <button style={{ ...css.btnAccent, marginTop:14 }} onClick={() => setView("s.subscription")}>Upgrade to Paid →</button>
          : <div style={{ color:C.success, fontSize:13, fontWeight:700, marginTop:12 }}>✅ Full access active</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  COUNSELOR — DASHBOARD
// ═══════════════════════════════════════════════════════════
function CounselorDashboard({ setView }) {
  const students = USERS.filter(u => u.role === "STUDENT");
  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>Counselor Dashboard</h2>
      <p style={{ fontSize:13, color:C.textMuted, marginBottom:22 }}>Manage career content and monitor platform engagement</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        <StatCard label="Total Students"   value={students.length}  icon="👨‍🎓" color={C.info}        />
        <StatCard label="Paid Subscribers" value={students.filter(u=>u.sub==="PAID").length} icon="💳" color={C.success} />
        <StatCard label="Jobs Listed"      value={JOBS.length}      icon="💼"  color={C.primaryLight} />
        <StatCard label="Clusters"         value="16"               icon="🗂️"  color="#7C3AED"       />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:18, marginBottom:18 }}>
        <div style={css.card}>
          <SectionTitle>📈 Student Growth (6 months)</SectionTitle>
          <div style={{ height:210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY} margin={{ top:5, right:10, left:0, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="m" tick={{ fontSize:11 }} />
                <YAxis tick={{ fontSize:11 }} />
                <Tooltip contentStyle={{ fontSize:12, borderRadius:8 }} />
                <Bar dataKey="users" name="Users" fill={C.primary} radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={css.card}>
          <SectionTitle>🗂️ Cluster Popularity</SectionTitle>
          <div style={{ height:210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CLUSTER_POP} dataKey="val" nameKey="name" cx="50%" cy="50%" outerRadius={75} paddingAngle={2}>
                  {CLUSTER_POP.map((d,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize:12 }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize:11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
        <div style={css.card}>
          <SectionTitle>🔥 Most Viewed Jobs</SectionTitle>
          {JOBS.slice(0,5).map((j,i) => {
            const cl = CLUSTERS.find(c => c.id === j.clusterId);
            return <div key={j.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom: i<4?`1px solid ${C.border}`:"none" }}>
              <span style={{ fontSize:14, fontWeight:900, color:"#D1D5DB", width:18 }}>{i+1}</span>
              <div style={{ fontSize:18 }}>{cl?.emoji}</div>
              <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700 }}>{j.title}</div><div style={{ fontSize:11, color:C.textMuted }}>{cl?.name}</div></div>
              <div style={{ width:80 }}><ProgressBar pct={90-i*14} color={cl?.color} /></div>
            </div>;
          })}
        </div>
        <div style={css.card}>
          <SectionTitle>⚡ Quick Actions</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[["➕ Add New Job","c.jobs"],["📊 View Analytics","c.analytics"],["📋 Generate Report","c.reports"],["🏫 Manage Institutes","c.institutes"]].map(([l,v]) => (
              <button key={v} style={{ ...css.btnGhost, textAlign:"left", padding:"11px 16px" }} onClick={() => setView(v)}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  COUNSELOR — MANAGE JOBS
// ═══════════════════════════════════════════════════════════
function CounselorJobs({ notify }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:"", clusterId:11, desc:"", quals:"", skills:"", alStream:"", salMin:"", salMax:"", demand:"High" });
  const [q, setQ] = useState("");

  const filtered = JOBS.filter(j => !q || j.title.toLowerCase().includes(q.toLowerCase()));

  function save() {
    if (!form.title.trim()) { notify("Job title is required"); return; }
    const newJ = {
      id: JOBS.length + 1, title:form.title, clusterId:+form.clusterId,
      desc:form.desc||"Job description pending.", quals:form.quals||"Relevant qualification.",
      skills:(form.skills||"").split(",").map(s=>s.trim()).filter(Boolean),
      alStream:form.alStream||"N/A", alSubjects:[], responsibilities:["To be added"],
      salMin:+form.salMin||0, salMax:+form.salMax||0, demand:form.demand,
      growth:"+10% by 2027", pathway:"Entry → Senior → Lead",
      sector:"Private", remote:false, intern:true, institutes:[],
    };
    JOBS.push(newJ);
    setShowModal(false);
    setForm({ title:"", clusterId:11, desc:"", quals:"", skills:"", alStream:"", salMin:"", salMax:"", demand:"High" });
    notify("Job added successfully! ✅");
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div><h2 style={{ fontSize:22, fontWeight:900 }}>Manage Jobs</h2><p style={{ fontSize:13, color:C.textMuted }}>{JOBS.length} jobs listed</p></div>
        <button style={css.btnPrimary} onClick={() => setShowModal(true)}>➕ Add New Job</button>
      </div>

      <div style={{ marginBottom:14 }}><input style={css.input} placeholder="🔍 Search jobs..." value={q} onChange={e => setQ(e.target.value)} /></div>

      <div style={css.card}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr>{["Job Title","Cluster","A/L Stream","Salary Range","Demand","Institutes","Actions"].map(h => <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:800, color:C.textMuted, textTransform:"uppercase", borderBottom:`1px solid ${C.border}` }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(j => {
              const cl = CLUSTERS.find(c => c.id === j.clusterId);
              return <tr key={j.id}>
                <td style={{ padding:"13px 14px", borderBottom:`1px solid #F9FAFB` }}><div style={{ fontWeight:700 }}>{j.title}</div><div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{j.desc.slice(0,55)}...</div></td>
                <td style={{ padding:"13px 14px", borderBottom:`1px solid #F9FAFB` }}><span style={{ fontSize:13 }}>{cl?.emoji} {cl?.name?.split(",")[0].split("&")[0].trim()}</span></td>
                <td style={{ padding:"13px 14px", borderBottom:`1px solid #F9FAFB`, fontSize:12 }}>{j.alStream}</td>
                <td style={{ padding:"13px 14px", borderBottom:`1px solid #F9FAFB`, fontSize:12, fontWeight:700, color:C.primaryLight }}>LKR {(j.salMin/1000).toFixed(0)}k–{(j.salMax/1000).toFixed(0)}k</td>
                <td style={{ padding:"13px 14px", borderBottom:`1px solid #F9FAFB` }}><Badge type={j.demand==="Very High"?"success":j.demand==="High"?"info":"gray"}>{j.demand}</Badge></td>
                <td style={{ padding:"13px 14px", borderBottom:`1px solid #F9FAFB`, fontSize:12 }}>{j.institutes.length}</td>
                <td style={{ padding:"13px 14px", borderBottom:`1px solid #F9FAFB` }}>
                  <div style={{ display:"flex", gap:6 }}>
                    <button style={css.btnSuccess} onClick={() => notify("Edit functionality — connect to backend API")}>Edit</button>
                    <button style={css.btnDanger} onClick={() => { if(window.confirm("Delete this job?")){ const idx=JOBS.findIndex(x=>x.id===j.id); if(idx!==-1)JOBS.splice(idx,1); notify("Job deleted."); }  }}>Delete</button>
                  </div>
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="➕ Add New Job" onClose={() => setShowModal(false)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div style={{ gridColumn:"1/-1" }}><label style={css.label}>Job Title *</label><input style={css.input} placeholder="e.g. Network Engineer" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} /></div>
            <div><label style={css.label}>Career Cluster</label>
              <select style={css.input} value={form.clusterId} onChange={e => setForm(f=>({...f,clusterId:e.target.value}))}>
                {CLUSTERS.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name.split(",")[0]}</option>)}
              </select>
            </div>
            <div><label style={css.label}>Demand Level</label>
              <select style={css.input} value={form.demand} onChange={e => setForm(f=>({...f,demand:e.target.value}))}>
                {["Very High","High","Medium","Low"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:"1/-1" }}><label style={css.label}>Description</label><textarea style={{ ...css.input, minHeight:80, resize:"vertical" }} value={form.desc} onChange={e => setForm(f=>({...f,desc:e.target.value}))} /></div>
            <div><label style={css.label}>Min Salary (LKR)</label><input style={css.input} type="number" placeholder="60000" value={form.salMin} onChange={e => setForm(f=>({...f,salMin:e.target.value}))} /></div>
            <div><label style={css.label}>Max Salary (LKR)</label><input style={css.input} type="number" placeholder="300000" value={form.salMax} onChange={e => setForm(f=>({...f,salMax:e.target.value}))} /></div>
            <div><label style={css.label}>A/L Stream</label><input style={css.input} placeholder="Physical Science" value={form.alStream} onChange={e => setForm(f=>({...f,alStream:e.target.value}))} /></div>
            <div><label style={css.label}>Skills (comma-separated)</label><input style={css.input} placeholder="Java, SQL, React" value={form.skills} onChange={e => setForm(f=>({...f,skills:e.target.value}))} /></div>
            <div style={{ gridColumn:"1/-1" }}><label style={css.label}>Qualifications</label><input style={css.input} value={form.quals} onChange={e => setForm(f=>({...f,quals:e.target.value}))} /></div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:20 }}>
            <button style={{ ...css.btnPrimary, flex:1, padding:"12px 0" }} onClick={save}>Save Job</button>
            <button style={css.btnGhost} onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  COUNSELOR — ANALYTICS
// ═══════════════════════════════════════════════════════════
function CounselorAnalytics() {
  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>Analytics</h2>
      <p style={{ fontSize:13, color:C.textMuted, marginBottom:22 }}>Platform usage and student engagement data</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        <StatCard label="Total Users"      value="312"   icon="👥" color={C.info}        trend="↑ 21% this month" />
        <StatCard label="Job Views / Month"value="2,480" icon="👁️" color={C.primaryLight} trend="↑ 18%" />
        <StatCard label="Active Subs"      value="120"   icon="💳" color={C.success}      trend="↑ 26%" />
        <StatCard label="Avg Sessions"     value="4.2"   icon="📊" color="#7C3AED" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>
        <div style={css.card}>
          <SectionTitle>📈 User Growth</SectionTitle>
          <div style={{ height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY} margin={{ top:5, right:10, left:0, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="m" tick={{ fontSize:11 }} />
                <YAxis tick={{ fontSize:11 }} />
                <Tooltip contentStyle={{ fontSize:12, borderRadius:8 }} />
                <Line type="monotone" dataKey="users" stroke={C.primaryLight} strokeWidth={2.5} dot={{ r:3 }} name="Users" />
                <Line type="monotone" dataKey="subs" stroke={C.accent} strokeWidth={2} dot={{ r:3 }} name="Subscribers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={css.card}>
          <SectionTitle>🗂️ Cluster Popularity</SectionTitle>
          <div style={{ height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CLUSTER_POP} layout="vertical" margin={{ top:5, right:10, left:50, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis type="number" tick={{ fontSize:10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize:11 }} />
                <Tooltip contentStyle={{ fontSize:12 }} />
                <Bar dataKey="val" name="Views" radius={[0,5,5,0]}>
                  {CLUSTER_POP.map((d,i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={css.card}>
        <SectionTitle>📊 Monthly Summary</SectionTitle>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead><tr>{["Month","New Users","Subscribers","Job Views","Revenue (LKR)"].map(h => <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:800, color:C.textMuted, textTransform:"uppercase", borderBottom:`1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
          <tbody>{MONTHLY.map(r => <tr key={r.m}>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB`, fontWeight:700 }}>{r.m} 2024</td>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}>{r.users}</td>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}>{r.subs}</td>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}>{r.views.toLocaleString()}</td>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB`, fontWeight:700, color:C.success }}>LKR {r.rev.toLocaleString()}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  COUNSELOR — INSTITUTES
// ═══════════════════════════════════════════════════════════
function InstitutesPage({ notify }) {
  const allInsts = [...new Map(JOBS.flatMap(j => j.institutes.map(i => [i.name, i])).filter(([,i])=>i)).entries()].map(([k,v])=>v);
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div><h2 style={{ fontSize:22, fontWeight:900 }}>Institutes & Courses</h2><p style={{ fontSize:13, color:C.textMuted }}>{allInsts.length} institutes listed</p></div>
        <button style={css.btnPrimary} onClick={() => notify("Add institute — connect to Spring Boot API")}>➕ Add Institute</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {JOBS.map(j => j.institutes.length > 0 && (
          <div key={j.id} style={css.card}>
            <SectionTitle>{CLUSTERS.find(c=>c.id===j.clusterId)?.emoji} {j.title} — Institutes</SectionTitle>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              {j.institutes.map((inst,i) => (
                <div key={i} style={{ background:C.bg, borderRadius:10, padding:"12px 14px", border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:13, fontWeight:800, marginBottom:4 }}>{inst.name}</div>
                  <div style={{ fontSize:12, color:"#374151", marginBottom:4 }}>{inst.course}</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>⏱ {inst.dur}</div>
                  <div style={{ fontSize:12, fontWeight:800, marginTop:6, color: inst.fee===0?C.success:C.primary }}>{inst.fee===0?"🆓 Free":"LKR "+inst.fee.toLocaleString()}</div>
                  <button style={{ ...css.btnGhost, marginTop:8, fontSize:11, padding:"4px 10px" }} onClick={() => notify("Edit course fee — dynamic pricing update")}>Edit Fee</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  COUNSELOR — REPORTS
// ═══════════════════════════════════════════════════════════
function ReportsPage({ notify }) {
  const rpts = [
    { icon:"👥", title:"Monthly User Report",        desc:"Active users, new signups, session duration, retention rate" },
    { icon:"💼", title:"Job Analytics Report",        desc:"Most viewed jobs, cluster performance, search trends" },
    { icon:"💳", title:"Subscription Report",         desc:"Payment summary, revenue breakdown, churn analysis" },
    { icon:"📊", title:"Student Engagement Report",   desc:"Session data, favorites, search behaviour, cluster preferences" },
    { icon:"🏫", title:"Institute & Course Report",   desc:"Popular courses, fee updates, enrolment trends" },
    { icon:"📈", title:"Career Demand Trends Report", desc:"Industry demand shifts, salary range changes, growth sectors" },
  ];
  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>Reports</h2>
      <p style={{ fontSize:13, color:C.textMuted, marginBottom:22 }}>Generate and download platform analytics reports</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {rpts.map(r => (
          <div key={r.title} style={css.card}>
            <div style={{ fontSize:26, marginBottom:8 }}>{r.icon}</div>
            <div style={{ fontSize:14.5, fontWeight:800, marginBottom:4 }}>{r.title}</div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:16, lineHeight:1.5 }}>{r.desc}</div>
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ ...css.btnPrimary, fontSize:12, padding:"7px 14px" }} onClick={() => notify("Generating PDF... 📄")}>📄 PDF</button>
              <button style={{ ...css.btnGhost,   fontSize:12, padding:"7px 14px" }} onClick={() => notify("Generating Excel... 📊")}>📊 Excel</button>
              <button style={{ ...css.btnGhost,   fontSize:12, padding:"7px 14px" }} onClick={() => notify("Generating CSV... 📝")}>📝 CSV</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ADMIN — DASHBOARD
// ═══════════════════════════════════════════════════════════
function AdminDashboard({ setView, notify }) {
  const students = USERS.filter(u => u.role === "STUDENT");
  const paid = students.filter(u => u.sub === "PAID");
  const rev = MONTHLY[MONTHLY.length-1].rev;

  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>Super Admin Dashboard</h2>
      <p style={{ fontSize:13, color:C.textMuted, marginBottom:16 }}>Complete platform control and real-time monitoring</p>

      {/* Paid mode toggle alert */}
      <div style={{ padding:"14px 18px", background: SETTINGS.paidMode?"#FFFBEB":"#F0FDF4", border:`1px solid ${SETTINGS.paidMode?"#FDE68A":"#A7F3D0"}`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:13.5, fontWeight:800, color: SETTINGS.paidMode?"#92400E":"#065F46" }}>{SETTINGS.paidMode ? "💳 Paid Mode is ACTIVE" : "✅ Free Mode — Open Access"}</div>
          <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{SETTINGS.paidMode ? "Students must subscribe before accessing the platform" : "All students have free access to all features"}</div>
        </div>
        <button style={{ ...(SETTINGS.paidMode ? css.btnGhost : css.btnAccent), fontSize:13 }} onClick={() => { SETTINGS.paidMode=!SETTINGS.paidMode; notify(`Paid mode ${SETTINGS.paidMode?"enabled ✅":"disabled"}`); setView("a.dashboard"); }}>
          {SETTINGS.paidMode ? "Disable Paid Mode" : "Enable Paid Mode"}
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        <StatCard label="Total Users"       value={USERS.length}      icon="👥" color={C.info}        onClick={() => setView("a.users")} />
        <StatCard label="Paid Subscribers"  value={paid.length}        icon="💳" color={C.success}     onClick={() => setView("a.payments")} />
        <StatCard label="Monthly Revenue"   value={`LKR ${(rev/1000).toFixed(0)}k`} icon="💰" color={C.accent} />
        <StatCard label="Active Listings"   value={JOBS.length}        icon="💼" color={C.primaryLight} onClick={() => setView("a.jobs")} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:18, marginBottom:18 }}>
        <div style={css.card}>
          <SectionTitle>💰 Revenue Trend</SectionTitle>
          <div style={{ height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY} margin={{ top:5, right:10, left:0, bottom:0 }}>
                <defs>
                  <linearGradient id="revgr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="m" tick={{ fontSize:11 }} />
                <YAxis tick={{ fontSize:11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ fontSize:12, borderRadius:8 }} formatter={v=>`LKR ${v.toLocaleString()}`} />
                <Area type="monotone" dataKey="rev" stroke={C.accent} fill="url(#revgr)" strokeWidth={2.5} name="Revenue (LKR)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={css.card}>
          <SectionTitle>⚡ Quick Controls</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[["👥 User Management","a.users"],["💳 Subscription Settings","a.subscription"],["💼 Job Management","a.jobs"],["📊 Full Analytics","a.analytics"],["📋 Reports","a.reports"],["⚙️ System Settings","a.settings"]].map(([l,v]) => (
              <button key={v} style={{ ...css.btnGhost, textAlign:"left", padding:"10px 14px", fontSize:13 }} onClick={() => setView(v)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={css.card}>
        <SectionTitle>🕐 Recent Users</SectionTitle>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead><tr>{["Name","Role","Subscription","Joined","Status"].map(h => <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:800, color:C.textMuted, textTransform:"uppercase", borderBottom:`1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
          <tbody>{USERS.slice(0,5).map(u => <tr key={u.id}>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}><div style={{ display:"flex", alignItems:"center", gap:10 }}><Avatar name={u.name} size={30} /><div><div style={{ fontWeight:700, fontSize:13 }}>{u.name}</div><div style={{ fontSize:11, color:C.textMuted }}>{u.email}</div></div></div></td>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}><Badge type={u.role==="SUPER_ADMIN"?"danger":u.role==="COUNSELOR"?"purple":"info"}>{u.role.replace("_"," ")}</Badge></td>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}><Badge type={u.sub==="PAID"?"success":"gray"}>{u.sub}</Badge></td>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB`, fontSize:12 }}>{u.joined}</td>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}><Badge type={u.active?"success":"danger"}>{u.active?"Active":"Inactive"}</Badge></td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ADMIN — USER MANAGEMENT
// ═══════════════════════════════════════════════════════════
function AdminUsers({ notify }) {
  const [q, setQ] = useState("");
  const [roleF, setRoleF] = useState("");
  const [tick, setTick] = useState(0);

  const filtered = USERS.filter(u => {
    if (roleF && u.role !== roleF) return false;
    if (q && ![u.name,u.email].join(" ").toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div><h2 style={{ fontSize:22, fontWeight:900 }}>User Management</h2><p style={{ fontSize:13, color:C.textMuted }}>{USERS.length} registered users</p></div>
        <button style={css.btnPrimary} onClick={() => notify("Add User — connect to Spring Boot /api/users POST")}>➕ Add User</button>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        <input style={{ ...css.input, flex:1 }} placeholder="🔍 Search users by name or email..." value={q} onChange={e => setQ(e.target.value)} />
        <select style={{ ...css.input, width:180 }} value={roleF} onChange={e => setRoleF(e.target.value)}>
          <option value="">All Roles</option>
          <option value="STUDENT">Student</option>
          <option value="COUNSELOR">Counselor</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </div>

      <div style={css.card}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead><tr>{["User","Role","Subscription","Joined","Status","Actions"].map(h => <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:800, color:C.textMuted, textTransform:"uppercase", borderBottom:`1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(u => <tr key={u.id}>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <Avatar name={u.name} size={32} />
                <div><div style={{ fontWeight:700 }}>{u.name}</div><div style={{ fontSize:11, color:C.textMuted }}>{u.email}</div></div>
              </div>
            </td>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}><Badge type={u.role==="SUPER_ADMIN"?"danger":u.role==="COUNSELOR"?"purple":"info"}>{u.role.replace("_"," ")}</Badge></td>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}><Badge type={u.sub==="PAID"?"success":"gray"}>{u.sub}</Badge></td>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB`, fontSize:12 }}>{u.joined}</td>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}><Badge type={u.active?"success":"danger"}>{u.active?"Active":"Inactive"}</Badge></td>
            <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}>
              <div style={{ display:"flex", gap:6 }}>
                <button style={{ ...css.btnGhost, fontSize:11, padding:"5px 10px" }} onClick={() => { u.active=!u.active; notify(`${u.name} ${u.active?"activated":"deactivated"}`); setTick(t=>t+1); }}>{u.active?"Deactivate":"Activate"}</button>
                {u.role !== "SUPER_ADMIN" && <button style={{ ...css.btnDanger, fontSize:11 }} onClick={() => { if(window.confirm("Delete user?")){ const i=USERS.findIndex(x=>x.id===u.id); if(i!==-1)USERS.splice(i,1); notify("User deleted"); setTick(t=>t+1); } }}>Delete</button>}
              </div>
            </td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ADMIN — SUBSCRIPTION CONTROL
// ═══════════════════════════════════════════════════════════
function AdminSubscription({ notify, setView }) {
  const [monthly, setMonthly] = useState(SETTINGS.monthlyPrice);
  const [yearly, setYearly] = useState(SETTINGS.yearlyPrice);
  const [bank, setBank] = useState(SETTINGS.bankName);
  const [accNo, setAccNo] = useState(SETTINGS.accountNo);
  const [holder, setHolder] = useState(SETTINGS.accountHolder);

  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>Subscription Control</h2>
      <p style={{ fontSize:13, color:C.textMuted, marginBottom:22 }}>Manage platform access mode, pricing and payment details</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
        {/* Mode toggle */}
        <div style={css.card}>
          <SectionTitle>🔑 Access Mode</SectionTitle>
          <div style={{ padding:"18px", background: SETTINGS.paidMode?"#FFFBEB":"#F0FDF4", borderRadius:12, border:`1px solid ${SETTINGS.paidMode?"#FDE68A":"#A7F3D0"}`, display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:800, color: SETTINGS.paidMode?"#92400E":"#065F46" }}>{SETTINGS.paidMode?"💳 Paid Mode ON":"🆓 Free Mode ON"}</div>
              <div style={{ fontSize:12, color:C.textMuted, marginTop:3 }}>{SETTINGS.paidMode?"Students must subscribe":"All features freely available"}</div>
            </div>
            <label style={{ position:"relative", width:46, height:26, display:"inline-block", cursor:"pointer" }}>
              <input type="checkbox" checked={SETTINGS.paidMode} onChange={() => { SETTINGS.paidMode=!SETTINGS.paidMode; notify(`Paid mode ${SETTINGS.paidMode?"enabled":"disabled"}`); setView("a.subscription"); }} style={{ display:"none" }} />
              <span style={{ position:"absolute", inset:0, background: SETTINGS.paidMode?C.primary:"#D1D5DB", borderRadius:26, transition:".3s" }} />
              <span style={{ position:"absolute", top:3, left: SETTINGS.paidMode?23:3, width:20, height:20, background:"#fff", borderRadius:"50%", transition:".3s" }} />
            </label>
          </div>
          <div style={{ fontSize:12, color:C.textMuted, lineHeight:1.6 }}>
            When <b>Paid Mode</b> is enabled, students who are on the <b>FREE</b> plan will be redirected to the subscription/payment page immediately after login.
          </div>
        </div>

        {/* Stats */}
        <div style={css.card}>
          <SectionTitle>📊 Subscription Stats</SectionTitle>
          {[["Total Students",USERS.filter(u=>u.role==="STUDENT").length],["Paid Subscribers",USERS.filter(u=>u.sub==="PAID").length],["Free Users",USERS.filter(u=>u.role==="STUDENT"&&u.sub==="FREE").length],["This Month Revenue",`LKR ${MONTHLY[5].rev.toLocaleString()}`]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:13, color:C.textMuted }}>{l}</span>
              <span style={{ fontSize:13, fontWeight:800, color:C.primary }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div style={css.card}>
          <SectionTitle>💰 Pricing Configuration</SectionTitle>
          <div style={{ marginBottom:14 }}><label style={css.label}>Monthly Price (LKR)</label><input style={css.input} type="number" value={monthly} onChange={e=>setMonthly(+e.target.value)} /></div>
          <div style={{ marginBottom:18 }}><label style={css.label}>Yearly Price (LKR)</label><input style={css.input} type="number" value={yearly} onChange={e=>setYearly(+e.target.value)} /></div>
          <button style={css.btnPrimary} onClick={() => { SETTINGS.monthlyPrice=monthly; SETTINGS.yearlyPrice=yearly; notify("Pricing updated! ✅"); }}>Update Pricing</button>
        </div>

        {/* Bank Details */}
        <div style={css.card}>
          <SectionTitle>🏦 Bank Transfer Details</SectionTitle>
          <div style={{ marginBottom:12 }}><label style={css.label}>Bank Name</label><input style={css.input} value={bank} onChange={e=>setBank(e.target.value)} /></div>
          <div style={{ marginBottom:12 }}><label style={css.label}>Account Number</label><input style={css.input} value={accNo} onChange={e=>setAccNo(e.target.value)} /></div>
          <div style={{ marginBottom:18 }}><label style={css.label}>Account Holder Name</label><input style={css.input} value={holder} onChange={e=>setHolder(e.target.value)} /></div>
          <button style={css.btnPrimary} onClick={() => { SETTINGS.bankName=bank; SETTINGS.accountNo=accNo; SETTINGS.accountHolder=holder; notify("Bank details saved! ✅"); }}>Save Details</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ADMIN — PAYMENT HISTORY
// ═══════════════════════════════════════════════════════════
function AdminPayments() {
  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>Payment History</h2>
      <p style={{ fontSize:13, color:C.textMuted, marginBottom:22 }}>All subscription payments and transaction records</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:22 }}>
        <StatCard label="Total Revenue"      value={`LKR ${PAYMENTS.reduce((a,p)=>a+(p.status==="COMPLETED"?p.amount:0),0).toLocaleString()}`} icon="💰" color={C.success} />
        <StatCard label="Completed Payments" value={PAYMENTS.filter(p=>p.status==="COMPLETED").length} icon="✅" color={C.info} />
        <StatCard label="Pending Payments"   value={PAYMENTS.filter(p=>p.status==="PENDING").length}   icon="⏳" color={C.warning} />
      </div>

      <div style={css.card}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead><tr>{["Payment ID","Student","Amount","Method","Date","Status"].map(h => <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:800, color:C.textMuted, textTransform:"uppercase", borderBottom:`1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
          <tbody>{PAYMENTS.map(p => {
            const u = USERS.find(x => x.id === p.userId);
            return <tr key={p.id}>
              <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB`, fontFamily:"monospace", fontSize:12 }}>{p.id.toUpperCase()}</td>
              <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}><div style={{ fontWeight:700 }}>{u?.name}</div><div style={{ fontSize:11, color:C.textMuted }}>{u?.email}</div></td>
              <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB`, fontWeight:800, color:C.success }}>LKR {p.amount.toLocaleString()}</td>
              <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}><Badge type="info">{p.method}</Badge></td>
              <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB`, fontSize:12 }}>{p.date}</td>
              <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}><Badge type={p.status==="COMPLETED"?"success":"warn"}>{p.status}</Badge></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ADMIN — JOB MANAGEMENT
// ═══════════════════════════════════════════════════════════
function AdminJobs({ notify }) {
  const [q, setQ] = useState("");
  const filtered = JOBS.filter(j => !q || j.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div><h2 style={{ fontSize:22, fontWeight:900 }}>Job Management</h2><p style={{ fontSize:13, color:C.textMuted }}>{JOBS.length} active listings across 16 clusters</p></div>
        <button style={css.btnPrimary} onClick={() => notify("Add Job — POST /api/jobs")}>➕ Add Job</button>
      </div>
      <div style={{ marginBottom:14 }}><input style={css.input} placeholder="🔍 Search jobs..." value={q} onChange={e=>setQ(e.target.value)} /></div>
      <div style={css.card}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead><tr>{["Title","Cluster","Salary","Demand","Institutes","Remote","Actions"].map(h=><th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:800, color:C.textMuted, textTransform:"uppercase", borderBottom:`1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(j=>{
            const cl=CLUSTERS.find(c=>c.id===j.clusterId);
            return <tr key={j.id}>
              <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}><div style={{ fontWeight:700 }}>{j.title}</div></td>
              <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}>{cl?.emoji} {cl?.name?.split(",")[0].split("&")[0].trim()}</td>
              <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB`, fontWeight:700, color:C.primaryLight }}>LKR {(j.salMin/1000).toFixed(0)}k–{(j.salMax/1000).toFixed(0)}k</td>
              <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}><Badge type={j.demand==="Very High"?"success":j.demand==="High"?"info":"gray"}>{j.demand}</Badge></td>
              <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}>{j.institutes.length}</td>
              <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}>{j.remote?"✅":"❌"}</td>
              <td style={{ padding:"12px 14px", borderBottom:`1px solid #F9FAFB` }}>
                <div style={{ display:"flex", gap:6 }}>
                  <button style={{ ...css.btnSuccess, fontSize:11 }} onClick={()=>notify("Edit — PUT /api/jobs/:id")}>Edit</button>
                  <button style={{ ...css.btnDanger, fontSize:11 }} onClick={()=>{ if(window.confirm("Delete?")){ const i=JOBS.findIndex(x=>x.id===j.id); if(i!==-1)JOBS.splice(i,1); notify("Deleted"); } }}>Delete</button>
                </div>
              </td>
            </tr>;
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ADMIN — SYSTEM SETTINGS
// ═══════════════════════════════════════════════════════════
function AdminSettings({ notify }) {
  const health = [["API Server","Online",C.success],["MySQL Database","Online",C.success],["Cloudinary Storage","Online",C.success],["PayHere Gateway","Online",C.success],["Email Service","Online",C.success],["JWT Auth","Active",C.info]];
  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>System Settings</h2>
      <p style={{ fontSize:13, color:C.textMuted, marginBottom:22 }}>Platform configuration, integrations and health monitoring</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>
        {[["🔐 JWT & Security","Token expiry, bcrypt rounds, CORS, rate limiting"],["📧 Email Service","Brevo/SendGrid SMTP, notification templates"],["☁️ Cloudinary Storage","API keys, upload limits, image optimisation"],["💳 Payment Gateway","PayHere / Stripe API keys, webhook URLs"],["📊 Google Analytics","Tracking ID, event configuration, reports"],["🔔 Notifications","Email, SMS (Dialog/Mobitel), in-app settings"]].map(([t,d])=>(
          <div key={t} style={css.card}>
            <div style={{ fontSize:13, fontWeight:800, marginBottom:4 }}>{t}</div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:14, lineHeight:1.5 }}>{d}</div>
            <button style={{ ...css.btnGhost, fontSize:12, padding:"7px 14px" }} onClick={() => notify("Configure — connect to backend settings API")}>Configure</button>
          </div>
        ))}
      </div>

      <div style={css.card}>
        <SectionTitle>🟢 System Health Monitor</SectionTitle>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {health.map(([name,status,color]) => (
            <div key={name} style={{ padding:"16px", background:C.bg, borderRadius:10, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:color, flexShrink:0 }} />
              <div><div style={{ fontSize:13, fontWeight:700 }}>{name}</div><div style={{ fontSize:11, color, fontWeight:700 }}>{status}</div></div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:16, display:"flex", gap:10 }}>
          <button style={css.btnPrimary} onClick={() => notify("System backup initiated ✅")}>💾 Backup Now</button>
          <button style={css.btnGhost} onClick={() => notify("System logs downloaded 📄")}>📋 Download Logs</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ADMIN — ANALYTICS
// ═══════════════════════════════════════════════════════════
function AdminAnalytics() {
  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>Platform Analytics</h2>
      <p style={{ fontSize:13, color:C.textMuted, marginBottom:22 }}>Comprehensive platform performance and revenue analytics</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        <StatCard label="Total Users"    value="312"      icon="👥" color={C.info}     trend="↑ 21% MoM" />
        <StatCard label="Revenue / Month"value="LKR 278k" icon="💰" color={C.success}  trend="↑ 31% MoM" />
        <StatCard label="Page Views"     value="4,820"    icon="👁️" color={C.primaryLight} trend="Today" />
        <StatCard label="Avg Session"    value="6.3 min"  icon="⏱️" color="#7C3AED" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>
        <div style={css.card}>
          <SectionTitle>💰 Monthly Revenue</SectionTitle>
          <div style={{ height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY} margin={{ top:5, right:10, left:0, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="m" tick={{ fontSize:11 }} />
                <YAxis tick={{ fontSize:11 }} tickFormatter={v=>`${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ fontSize:12 }} formatter={v=>`LKR ${v.toLocaleString()}`} />
                <Bar dataKey="rev" name="Revenue" fill={C.success} radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={css.card}>
          <SectionTitle>👥 User & Subscription Growth</SectionTitle>
          <div style={{ height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY} margin={{ top:5, right:10, left:0, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="m" tick={{ fontSize:11 }} />
                <YAxis tick={{ fontSize:11 }} />
                <Tooltip contentStyle={{ fontSize:12 }} />
                <Line type="monotone" dataKey="users" stroke={C.info}     strokeWidth={2.5} dot={{ r:3 }} name="Users" />
                <Line type="monotone" dataKey="subs"  stroke={C.success}  strokeWidth={2}   dot={{ r:3 }} name="Subscribers" />
                <Legend iconSize={10} wrapperStyle={{ fontSize:11 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:18 }}>
        <div style={css.card}>
          <SectionTitle>📊 Cluster Popularity Distribution</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {CLUSTER_POP.map((c,i) => (
              <div key={c.name} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:c.fill, flexShrink:0 }} />
                <span style={{ fontSize:12, width:80, fontWeight:600 }}>{c.name}</span>
                <div style={{ flex:1 }}><ProgressBar pct={(c.val/120)*100} color={c.fill} /></div>
                <span style={{ fontSize:12, fontWeight:700, width:28, textAlign:"right" }}>{c.val}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={css.card}>
          <SectionTitle>🗂️ Cluster Chart</SectionTitle>
          <div style={{ height:230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CLUSTER_POP} dataKey="val" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={3}>
                  {CLUSTER_POP.map((d,i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize:12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ADMIN — REPORTS
// ═══════════════════════════════════════════════════════════
function AdminReports({ notify }) {
  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>Reports</h2>
      <p style={{ fontSize:13, color:C.textMuted, marginBottom:22 }}>Generate comprehensive platform reports for analysis and compliance</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {[["📊","Platform Overview Report","Complete platform statistics, user metrics and revenue summary"],
          ["💳","Revenue & Payments Report","Payment history, subscription breakdown and revenue forecasts"],
          ["👥","User Activity Report","Engagement metrics, session data and retention analysis"],
          ["💼","Job & Career Report","Most viewed jobs, cluster trends and demand analysis"],
          ["🏫","Institutes & Courses Report","Enrolment data, course fee updates and accreditation status"],
          ["🔐","Security Audit Report","Login attempts, role changes, suspicious activity logs"]].map(([icon,title,desc])=>(
          <div key={title} style={css.card}>
            <div style={{ fontSize:24, marginBottom:8 }}>{icon}</div>
            <div style={{ fontSize:14, fontWeight:800, marginBottom:4 }}>{title}</div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:16, lineHeight:1.5 }}>{desc}</div>
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ ...css.btnPrimary, fontSize:12, padding:"7px 14px" }} onClick={()=>notify("Generating PDF... 📄")}>📄 PDF</button>
              <button style={{ ...css.btnGhost,   fontSize:12, padding:"7px 14px" }} onClick={()=>notify("Generating Excel... 📊")}>📊 Excel</button>
              <button style={{ ...css.btnGhost,   fontSize:12, padding:"7px 14px" }} onClick={()=>notify("Generating CSV... 📝")}>📝 CSV</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  NOTIFICATION TOAST
// ═══════════════════════════════════════════════════════════
function Toast({ msg }) {
  if (!msg) return null;
  return <div style={{ position:"fixed", bottom:24, right:24, background:C.primary, color:"#fff", padding:"12px 20px", borderRadius:12, fontSize:13, fontWeight:700, zIndex:9999, boxShadow:"0 8px 30px rgba(0,0,0,.25)", maxWidth:320, lineHeight:1.4 }}>{msg}</div>;
}

// ═══════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser]           = useState(null);
  const [view, setView]           = useState("login");
  const [activeJob, setActiveJob] = useState(null);
  const [filterCluster, setFilterCluster] = useState(null);
  const [toast, setToast]         = useState("");
  const [, tick]                   = useState(0);   // force re-render

  const notify = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }, []);

  function handleLogin(u) {
    setUser(u);
    if (SETTINGS.paidMode && u.role === "STUDENT" && u.sub !== "PAID") {
      setView("s.subscription");
    } else {
      const defaultView = { STUDENT:"s.dashboard", COUNSELOR:"c.dashboard", SUPER_ADMIN:"a.dashboard" };
      setView(defaultView[u.role] || "s.dashboard");
    }
  }

  function handleLogout() {
    setUser(null);
    setView("login");
  }

  function handleActivateSub() {
    if (user) {
      user.sub = "PAID";
      const u = USERS.find(x => x.id === user.id);
      if (u) u.sub = "PAID";
      notify("Subscription activated! Welcome to full access 🎉");
      const dv = { STUDENT:"s.dashboard", COUNSELOR:"c.dashboard", SUPER_ADMIN:"a.dashboard" };
      setView(dv[user.role] || "s.dashboard");
    }
  }

  // Paid mode guard
  useEffect(() => {
    if (user && SETTINGS.paidMode && user.role === "STUDENT" && user.sub !== "PAID" && view !== "s.subscription") {
      setView("s.subscription");
    }
  }, [view, user]);

  // ─── Page titles ───
  const PAGE_TITLES = {
    "s.dashboard":"Student Dashboard","s.clusters":"Career Clusters","s.jobs":"Browse Jobs",
    "s.job":"Job Details","s.favorites":"Saved Jobs","s.subscription":"Subscription",
    "s.profile":"My Profile","c.dashboard":"Counselor Dashboard","c.jobs":"Manage Jobs",
    "c.institutes":"Institutes & Courses","c.analytics":"Analytics","c.reports":"Reports",
    "a.dashboard":"Admin Dashboard","a.users":"User Management","a.jobs":"Job Management",
    "a.subscription":"Subscription Control","a.payments":"Payment History",
    "a.settings":"System Settings","a.analytics":"Analytics","a.reports":"Reports",
  };

  if (!user) return <><AuthPage onLogin={handleLogin} /><Toast msg={toast} /></>;

  // Subscription page (full-screen after login when paid mode on and user is free)
  if (view === "s.subscription" && SETTINGS.paidMode && user.sub !== "PAID") {
    return (
      <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column" }}>
        <div style={{ background:C.primary, padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontSize:16, fontWeight:800, color:C.accent }}>🇱🇰 SL Job Bank</div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:13, color:"rgba(255,255,255,.6)" }}>{user.name}</span>
            <button onClick={handleLogout} style={{ ...css.btnGhost, fontSize:12, background:"transparent", color:"rgba(255,255,255,.7)", borderColor:"rgba(255,255,255,.3)" }}>Sign Out</button>
          </div>
        </div>
        <div style={{ flex:1, padding:28, overflowY:"auto" }}>
          <SubscriptionPage user={user} onActivate={handleActivateSub} onSkip={() => setView("s.dashboard")} />
        </div>
        <Toast msg={toast} />
      </div>
    );
  }

  function renderPage() {
    const sv = (v) => setView(v);
    switch(view) {
      case "s.dashboard":    return <StudentDashboard user={user} setView={sv} setActiveJob={setActiveJob} setFilterCluster={setFilterCluster} />;
      case "s.clusters":     return <ClustersPage setView={sv} setFilterCluster={setFilterCluster} />;
      case "s.jobs":         return <JobsPage user={user} filterCluster={filterCluster} setFilterCluster={setFilterCluster} setView={sv} setActiveJob={setActiveJob} />;
      case "s.job":          return <JobDetailPage user={user} jobId={activeJob} setView={sv} notify={notify} />;
      case "s.favorites":    return <FavoritesPage user={user} setView={sv} setActiveJob={setActiveJob} />;
      case "s.subscription": return <SubscriptionPage user={user} onActivate={handleActivateSub} onSkip={() => sv("s.dashboard")} />;
      case "s.profile":      return <ProfilePage user={user} setView={sv} notify={notify} />;
      case "c.dashboard":    return <CounselorDashboard setView={sv} />;
      case "c.jobs":         return <CounselorJobs notify={notify} />;
      case "c.institutes":   return <InstitutesPage notify={notify} />;
      case "c.analytics":    return <CounselorAnalytics />;
      case "c.reports":      return <ReportsPage notify={notify} />;
      case "a.dashboard":    return <AdminDashboard setView={sv} notify={notify} />;
      case "a.users":        return <AdminUsers notify={notify} />;
      case "a.jobs":         return <AdminJobs notify={notify} />;
      case "a.subscription": return <AdminSubscription notify={notify} setView={sv} />;
      case "a.payments":     return <AdminPayments />;
      case "a.settings":     return <AdminSettings notify={notify} />;
      case "a.analytics":    return <AdminAnalytics />;
      case "a.reports":      return <AdminReports notify={notify} />;
      default:               return <EmptyState icon="🚧" title="Coming Soon" sub="This section is under development" />;
    }
  }

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background:C.bg, color:C.text }}>
      <Sidebar user={user} view={view} setView={setView} onLogout={handleLogout} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
        <Topbar title={PAGE_TITLES[view] || "Page"} user={user} />
        <div style={{ flex:1, padding:26, overflowY:"auto" }}>
          {renderPage()}
        </div>
      </div>
      <Toast msg={toast} />
    </div>
  );
}
