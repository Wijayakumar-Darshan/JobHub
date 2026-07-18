import bcrypt from 'bcryptjs';
import {
  sequelize,
  CareerCluster,
  User,
  Qualification,
  Institute,
  CareerTest,
  CareerTestQuestion,
  Job,                  // <-- added
} from '../models/index.js';

// ─── The full 50 RIASEC questions ─────────────────────
const RIASEC_QUESTIONS = [
  // ----- REALISTIC (10) -----
  ['I like fixing or building mechanical things', 'REALISTIC'],
  ['I would enjoy working outdoors rather than in an office', 'REALISTIC'],
  ['I prefer hands-on tasks over reading theory', 'REALISTIC'],
  ['I like operating tools, equipment, or machinery', 'REALISTIC'],
  ['I would rather build something than talk about building it', 'REALISTIC'],
  ['I enjoy physical activities like sports or construction', 'REALISTIC'],
  ['I am good at repairing things and troubleshooting', 'REALISTIC'],
  ['I like working with my hands to create tangible results', 'REALISTIC'],
  ['I prefer concrete problems over abstract theories', 'REALISTIC'],
  ['I enjoy tasks that require strength or coordination', 'REALISTIC'],

  // ----- INVESTIGATIVE (10) -----
  ['I enjoy solving complex problems or puzzles', 'INVESTIGATIVE'],
  ['I like doing research and finding out how things work', 'INVESTIGATIVE'],
  ['I am curious about science and how the natural world works', 'INVESTIGATIVE'],
  ['I enjoy analyzing data to find patterns', 'INVESTIGATIVE'],
  ['I like working independently on intellectual challenges', 'INVESTIGATIVE'],
  ['I enjoy reading scientific articles and technical publications', 'INVESTIGATIVE'],
  ['I like to understand the underlying principles of things', 'INVESTIGATIVE'],
  ['I enjoy laboratory work or experimentation', 'INVESTIGATIVE'],
  ['I prefer exploring ideas over managing people', 'INVESTIGATIVE'],
  ['I like to question assumptions and find better solutions', 'INVESTIGATIVE'],

  // ----- ARTISTIC (10) -----
  ['I enjoy creative writing, art, music, or design', 'ARTISTIC'],
  ['I like expressing myself in original, unconventional ways', 'ARTISTIC'],
  ['I prefer open-ended tasks over strict step-by-step instructions', 'ARTISTIC'],
  ['I enjoy performing, designing, or creating things for others to see', 'ARTISTIC'],
  ['I like imagining new ideas more than following existing rules', 'ARTISTIC'],
  ['I enjoy attending concerts, galleries, or theatre performances', 'ARTISTIC'],
  ['I like to create things that are aesthetically pleasing', 'ARTISTIC'],
  ['I prefer unstructured time to explore my creativity', 'ARTISTIC'],
  ['I enjoy experimenting with colours, shapes, and sounds', 'ARTISTIC'],
  ['I am drawn to artistic and creative communities', 'ARTISTIC'],

  // ----- SOCIAL (10) -----
  ['I enjoy helping people solve their personal problems', 'SOCIAL'],
  ['I like teaching or explaining things to others', 'SOCIAL'],
  ['I care deeply about making a difference in my community', 'SOCIAL'],
  ['I enjoy working in teams and building relationships', 'SOCIAL'],
  ['I would enjoy a career centered on caring for others', 'SOCIAL'],
  ['I like volunteering and helping those in need', 'SOCIAL'],
  ['I am a good listener and people often confide in me', 'SOCIAL'],
  ['I enjoy facilitating group discussions and workshops', 'SOCIAL'],
  ['I prefer collaborative work over solitary tasks', 'SOCIAL'],
  ['I am interested in psychology, counselling, or social work', 'SOCIAL'],

  // ----- ENTERPRISING (10) -----
  ['I enjoy leading a group or project', 'ENTERPRISING'],
  ['I like persuading others or selling an idea/product', 'ENTERPRISING'],
  ['I would enjoy starting or running my own business', 'ENTERPRISING'],
  ['I enjoy taking risks and pursuing ambitious goals', 'ENTERPRISING'],
  ['I like being in charge and making key decisions', 'ENTERPRISING'],
  ['I enjoy competitive activities and winning', 'ENTERPRISING'],
  ['I am good at negotiating and influencing others', 'ENTERPRISING'],
  ['I like to be the one who initiates new projects', 'ENTERPRISING'],
  ['I enjoy public speaking and presenting to large groups', 'ENTERPRISING'],
  ['I prefer leadership roles over supportive ones', 'ENTERPRISING'],

  // ----- CONVENTIONAL (10) -----
  ['I like organizing information, files, or schedules', 'CONVENTIONAL'],
  ['I prefer clear rules and structured procedures', 'CONVENTIONAL'],
  ['I enjoy detailed, accurate work like data entry or bookkeeping', 'CONVENTIONAL'],
  ['I like following a step-by-step plan rather than improvising', 'CONVENTIONAL'],
  ['I feel comfortable working with numbers and precise records', 'CONVENTIONAL'],
  ['I like to keep things tidy and well-organized', 'CONVENTIONAL'],
  ['I prefer working in a structured environment with clear expectations', 'CONVENTIONAL'],
  ['I am good at managing time and meeting deadlines', 'CONVENTIONAL'],
  ['I enjoy administrative and clerical tasks', 'CONVENTIONAL'],
  ['I like to follow established rules and procedures', 'CONVENTIONAL'],
];

// ─── Helper: Generate a random integer ──────────────────────
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Job generation: 50 jobs per cluster ─────────────────────
function generateJobsForCluster(clusterName) {
  const jobs = [];
  const cluster = clusterName;

  // Base titles per cluster (customise as needed)
  const titlePrefixes = {
    'Agriculture, Food & Natural Resources': ['Farm Manager', 'Agronomist', 'Food Scientist', 'Environmental Consultant', 'Forester', 'Veterinarian', 'Horticulturist', 'Soil Scientist', 'Fishery Officer', 'Wildlife Biologist'],
    'Architecture & Construction': ['Architect', 'Civil Engineer', 'Construction Manager', 'Quantity Surveyor', 'Urban Planner', 'Structural Engineer', 'Interior Designer', 'Building Inspector', 'Landscape Architect', 'Project Manager'],
    'Arts, Audio/Video Technology & Communications': ['Graphic Designer', 'Video Editor', 'Journalist', 'Public Relations Specialist', 'Animator', 'Web Designer', 'Photographer', 'Content Creator', 'Audio Engineer', 'Film Director'],
    'Business Management & Administration': ['Business Analyst', 'Operations Manager', 'Project Coordinator', 'Office Administrator', 'Management Consultant', 'HR Generalist', 'Entrepreneur', 'Business Development Manager', 'Operations Director', 'Administrative Assistant'],
    'Education & Training': ['Teacher', 'Lecturer', 'Educational Consultant', 'Curriculum Developer', 'School Principal', 'Special Education Teacher', 'Instructional Designer', 'Training Coordinator', 'Education Policy Analyst', 'Early Childhood Educator'],
    'Finance': ['Accountant', 'Financial Analyst', 'Investment Banker', 'Auditor', 'Tax Consultant', 'Risk Manager', 'Wealth Manager', 'Financial Controller', 'Actuary', 'Treasury Analyst'],
    'Government & Public Administration': ['Policy Analyst', 'Public Administrator', 'City Planner', 'Urban Development Officer', 'Government Liaison', 'Budget Analyst', 'Public Affairs Specialist', 'Court Administrator', 'Immigration Officer', 'Civil Service Manager'],
    'Health Science': ['Doctor', 'Nurse', 'Pharmacist', 'Medical Lab Technician', 'Physiotherapist', 'Radiographer', 'Occupational Therapist', 'Health Administrator', 'Clinical Researcher', 'Dentist'],
    'Hospitality & Tourism': ['Hotel Manager', 'Tour Guide', 'Restaurant Manager', 'Event Coordinator', 'Travel Consultant', 'Concierge', 'Executive Chef', 'Resort Manager', 'Tourism Officer', 'Guest Relations Manager'],
    'Human Services': ['Social Worker', 'Counselor', 'Community Outreach Coordinator', 'Mental Health Advocate', 'Rehabilitation Specialist', 'Youth Worker', 'Case Manager', 'Substance Abuse Counselor', 'Family Support Worker', 'Crisis Intervention Specialist'],
    'Information Technology': ['Software Developer', 'Network Engineer', 'Data Analyst', 'Systems Administrator', 'Cybersecurity Analyst', 'Cloud Architect', 'Database Administrator', 'Full Stack Developer', 'Machine Learning Engineer', 'IT Project Manager'],
    'Law, Public Safety, Corrections & Security': ['Police Officer', 'Lawyer', 'Correctional Officer', 'Forensic Analyst', 'Security Consultant', 'Criminal Investigator', 'Firefighter', 'Emergency Manager', 'Immigration Officer', 'Probation Officer'],
    'Manufacturing': ['Production Manager', 'Industrial Engineer', 'Quality Control Supervisor', 'Supply Chain Planner', 'Mechanical Engineer', 'Plant Operations Manager', 'Process Engineer', 'Maintenance Manager', 'Packaging Engineer', 'Manufacturing Technician'],
    'Marketing': ['Marketing Manager', 'Brand Strategist', 'Digital Marketing Specialist', 'Sales Director', 'Market Research Analyst', 'Advertising Executive', 'Content Marketing Manager', 'SEO Specialist', 'Social Media Manager', 'Product Marketing Manager'],
    'Science, Technology, Engineering & Mathematics': ['Research Scientist', 'Biologist', 'Chemist', 'Physicist', 'Data Scientist', 'Statistician', 'Environmental Scientist', 'Materials Engineer', 'Aerospace Engineer', 'Mathematician'],
    'Transportation, Distribution & Logistics': ['Logistics Manager', 'Supply Chain Analyst', 'Fleet Manager', 'Warehouse Supervisor', 'Transportation Planner', 'Freight Broker', 'Inventory Planner', 'Distribution Center Manager', 'Shipping Coordinator', 'Aviation Manager'],
  };

  const prefixes = titlePrefixes[clusterName] || ['Professional', 'Specialist', 'Manager', 'Analyst'];

  // Generate 50 jobs for this cluster
  for (let i = 0; i < 50; i++) {
    const title = `${prefixes[i % prefixes.length]} ${i + 1}`; // ensure variety
    const salaryMin = rand(30000, 80000);
    const salaryMax = rand(salaryMin + 10000, salaryMin + 70000);
    const demandLevels = ['HIGH', 'MEDIUM', 'LOW'];
    const industryDemand = demandLevels[rand(0, 2)];

    jobs.push({
      title,
      description: `This is a detailed job description for ${title} in the ${clusterName} sector. It involves working on various tasks and projects.`,
      responsibilities: `- Lead and coordinate projects\n- Manage team members\n- Ensure quality standards\n- Report to senior management`,
      qualifications: `Bachelor's degree in ${clusterName} or related field.\nMinimum 2-3 years of experience.`,
      skills: `Communication, problem-solving, teamwork, technical expertise, time management.`,
      alStream: ['Physical Science', 'Biological Science', 'Commerce', 'Arts', 'Technology'][rand(0, 4)],
      alSubjects: `Mathematics, English, and one subject related to ${clusterName}.`,
      salaryMin,
      salaryMax,
      industryDemand,
      careerPathway: `Entry level → Mid level → Senior level → Management → Executive`,
      employmentGrowth: `${rand(5, 25)}% projected growth over 5 years`,
      sector: `${clusterName} Sector`,
      remoteAvailable: rand(0, 1) === 1,
      internshipAvailable: rand(0, 1) === 1,
      governmentAvailable: rand(0, 1) === 1,
      privateAvailable: true,
      image: `https://via.placeholder.com/400x200?text=${encodeURIComponent(title)}`,
      videoUrl: null,
      externalResources: `https://example.com/resources/${encodeURIComponent(title)}`,
      isActive: true,
    });
  }
  return jobs;
}

// ─── Main seed function ──────────────────────────────────────
async function main() {
  await sequelize.authenticate();
  await sequelize.sync();

  // ── Career Clusters (16 standard CTE clusters) ──
  let clusters = await CareerCluster.findAll();
  if (clusters.length === 0) {
    clusters = await CareerCluster.bulkCreate([
      { name: 'Agriculture, Food & Natural Resources', emoji: '🌾', color: '#4CAF50', description: 'Farming, food production, and environmental management careers' },
      { name: 'Architecture & Construction', emoji: '🏗️', color: '#FF9800', description: 'Designing, building, and maintaining structures' },
      { name: 'Arts, Audio/Video Technology & Communications', emoji: '🎨', color: '#DB2777', description: 'Creative, media, design, and performing arts careers' },
      { name: 'Business Management & Administration', emoji: '📊', color: '#E8A200', description: 'Business operations, management, and administration' },
      { name: 'Education & Training', emoji: '📚', color: '#059669', description: 'Teaching, training, and educational services' },
      { name: 'Finance', emoji: '💰', color: '#3B82F6', description: 'Banking, accounting, investment, and financial services' },
      { name: 'Government & Public Administration', emoji: '🏛️', color: '#64748B', description: 'Public service, governance, and policy careers' },
      { name: 'Health Science', emoji: '🩺', color: '#2563EB', description: 'Medicine, nursing, and allied health careers' },
      { name: 'Hospitality & Tourism', emoji: '🏨', color: '#EC4899', description: 'Hotels, travel, restaurants, and tourism services' },
      { name: 'Human Services', emoji: '🤝', color: '#8B5CF6', description: 'Social work, counseling, and community services' },
      { name: 'Information Technology', emoji: '💻', color: '#0A2E1C', description: 'Software, networks, data, and digital technology' },
      { name: 'Law, Public Safety, Corrections & Security', emoji: '⚖️', color: '#EF4444', description: 'Legal, law enforcement, and security services' },
      { name: 'Manufacturing', emoji: '🏭', color: '#78716C', description: 'Production, assembly, and industrial processes' },
      { name: 'Marketing', emoji: '📣', color: '#F97316', description: 'Sales, advertising, market research, and branding' },
      { name: 'Science, Technology, Engineering & Mathematics', emoji: '🔬', color: '#06B6D4', description: 'STEM research, engineering, and technical innovation' },
      { name: 'Transportation, Distribution & Logistics', emoji: '🚚', color: '#14B8A6', description: 'Supply chain, logistics, and transportation services' },
    ]);
    console.log('✅ Seeded 16 career clusters.');
  }
  const clusterByName = Object.fromEntries(clusters.map((c) => [c.name, c]));

  // ── Qualifications (130+ across all clusters) ──
  const qualCount = await Qualification.count();
  let qualifications = [];
  if (qualCount === 0) {
    const qualData = [
      // Information Technology
      { name: 'BSc in Computer Science', level: 'DEGREE', field: 'IT', description: 'Undergraduate degree in computer science', cluster: 'Information Technology' },
      { name: 'HND in Information Technology', level: 'HND', field: 'IT', description: 'Higher National Diploma in IT', cluster: 'Information Technology' },
      { name: 'BSc in Software Engineering', level: 'DEGREE', field: 'IT', description: 'Software development and engineering', cluster: 'Information Technology' },
      { name: 'Diploma in Cybersecurity', level: 'DIPLOMA', field: 'IT', description: 'Network and data security', cluster: 'Information Technology' },
      { name: 'BSc in Data Science', level: 'DEGREE', field: 'IT', description: 'Data analytics and machine learning', cluster: 'Information Technology' },
      { name: 'MSc in Artificial Intelligence', level: 'MASTERS', field: 'IT', description: 'Advanced AI and ML studies', cluster: 'Information Technology' },
      { name: 'NVQ Level 6 in ICT', level: 'NVQ', field: 'IT', description: 'National Vocational Qualification in ICT', cluster: 'Information Technology' },
      { name: 'Diploma in Web Development', level: 'DIPLOMA', field: 'IT', description: 'Front-end and back-end web technologies', cluster: 'Information Technology' },
      { name: 'BSc in Information Systems', level: 'DEGREE', field: 'IT', description: 'Business information systems', cluster: 'Information Technology' },
      // Health Science
      { name: 'MBBS', level: 'DEGREE', field: 'Health', description: 'Bachelor of Medicine, Bachelor of Surgery', cluster: 'Health Science' },
      { name: 'Diploma in Nursing', level: 'DIPLOMA', field: 'Health', description: 'Registered Nursing Diploma', cluster: 'Health Science' },
      { name: 'BSc in Pharmacy', level: 'DEGREE', field: 'Health', description: 'Pharmaceutical sciences', cluster: 'Health Science' },
      { name: 'BSc in Medical Laboratory Technology', level: 'DEGREE', field: 'Health', description: 'Lab diagnostics', cluster: 'Health Science' },
      { name: 'Diploma in Physiotherapy', level: 'DIPLOMA', field: 'Health', description: 'Rehabilitation services', cluster: 'Health Science' },
      { name: 'BSc in Radiography', level: 'DEGREE', field: 'Health', description: 'Medical imaging', cluster: 'Health Science' },
      { name: 'Diploma in Dental Assisting', level: 'DIPLOMA', field: 'Health', description: 'Dental support services', cluster: 'Health Science' },
      { name: 'MSc in Public Health', level: 'MASTERS', field: 'Health', description: 'Community health and epidemiology', cluster: 'Health Science' },
      // Business Management & Administration
      { name: 'HND in Business Management', level: 'HND', field: 'Business', description: 'Higher National Diploma', cluster: 'Business Management & Administration' },
      { name: 'BBA in Management', level: 'DEGREE', field: 'Business', description: 'Bachelor of Business Administration', cluster: 'Business Management & Administration' },
      { name: 'MBA in General Management', level: 'MASTERS', field: 'Business', description: 'Master of Business Administration', cluster: 'Business Management & Administration' },
      { name: 'Diploma in Human Resource Management', level: 'DIPLOMA', field: 'Business', description: 'HR practices and administration', cluster: 'Business Management & Administration' },
      { name: 'NVQ Level 6 in Office Management', level: 'NVQ', field: 'Business', description: 'Office administration and supervision', cluster: 'Business Management & Administration' },
      // Finance
      { name: 'CA Sri Lanka Professional Qualification', level: 'PROFESSIONAL', field: 'Finance', description: 'Chartered Accountancy', cluster: 'Finance' },
      { name: 'ACCA Qualification', level: 'PROFESSIONAL', field: 'Finance', description: 'Association of Chartered Certified Accountants', cluster: 'Finance' },
      { name: 'BSc in Accounting', level: 'DEGREE', field: 'Finance', description: 'Financial accounting and reporting', cluster: 'Finance' },
      { name: 'Diploma in Banking', level: 'DIPLOMA', field: 'Finance', description: 'Banking operations and services', cluster: 'Finance' },
      { name: 'MBA in Finance', level: 'MASTERS', field: 'Finance', description: 'Advanced financial management', cluster: 'Finance' },
      { name: 'CIMA Professional Qualification', level: 'PROFESSIONAL', field: 'Finance', description: 'Chartered Institute of Management Accountants', cluster: 'Finance' },
      // Education & Training
      { name: 'Bachelor of Education', level: 'DEGREE', field: 'Education', description: 'Undergraduate teaching degree', cluster: 'Education & Training' },
      { name: 'Diploma in Early Childhood Education', level: 'DIPLOMA', field: 'Education', description: 'Teaching young learners', cluster: 'Education & Training' },
      { name: 'PGDE - Postgraduate Diploma in Education', level: 'DIPLOMA', field: 'Education', description: 'Teacher training qualification', cluster: 'Education & Training' },
      { name: 'MEd in Educational Leadership', level: 'MASTERS', field: 'Education', description: 'School administration and leadership', cluster: 'Education & Training' },
      { name: 'NVQ Level 5 in Training & Development', level: 'NVQ', field: 'Education', description: 'Workplace training facilitation', cluster: 'Education & Training' },
      // Arts, Audio/Video & Communications
      { name: 'Diploma in Graphic Design', level: 'DIPLOMA', field: 'Arts', description: 'Visual design and multimedia', cluster: 'Arts, Audio/Video Technology & Communications' },
      { name: 'BA in Performing Arts', level: 'DEGREE', field: 'Arts', description: 'Theatre, music, and dance', cluster: 'Arts, Audio/Video Technology & Communications' },
      { name: 'BSc in Mass Communication', level: 'DEGREE', field: 'Communications', description: 'Journalism and media', cluster: 'Arts, Audio/Video Technology & Communications' },
      { name: 'Diploma in Film Production', level: 'DIPLOMA', field: 'Arts', description: 'Cinematography and editing', cluster: 'Arts, Audio/Video Technology & Communications' },
      { name: 'NVQ Level 5 in Multimedia', level: 'NVQ', field: 'Arts', description: 'Interactive media production', cluster: 'Arts, Audio/Video Technology & Communications' },
      // Architecture & Construction
      { name: 'BSc in Civil Engineering', level: 'DEGREE', field: 'Engineering', description: 'Infrastructure and construction', cluster: 'Architecture & Construction' },
      { name: 'Diploma in Quantity Surveying', level: 'DIPLOMA', field: 'Construction', description: 'Cost management in building', cluster: 'Architecture & Construction' },
      { name: 'BSc in Architecture', level: 'DEGREE', field: 'Architecture', description: 'Architectural design and planning', cluster: 'Architecture & Construction' },
      { name: 'NVQ Level 6 in Building Technology', level: 'NVQ', field: 'Construction', description: 'Construction supervision', cluster: 'Architecture & Construction' },
      { name: 'Diploma in Interior Design', level: 'DIPLOMA', field: 'Design', description: 'Interior space planning', cluster: 'Architecture & Construction' },
      // Agriculture, Food & Natural Resources
      { name: 'BSc in Agriculture', level: 'DEGREE', field: 'Agriculture', description: 'Crop and livestock management', cluster: 'Agriculture, Food & Natural Resources' },
      { name: 'Diploma in Food Science', level: 'DIPLOMA', field: 'Food', description: 'Food processing and safety', cluster: 'Agriculture, Food & Natural Resources' },
      { name: 'BSc in Environmental Science', level: 'DEGREE', field: 'Environment', description: 'Ecosystem management', cluster: 'Agriculture, Food & Natural Resources' },
      { name: 'NVQ Level 5 in Forestry', level: 'NVQ', field: 'Forestry', description: 'Forest resource management', cluster: 'Agriculture, Food & Natural Resources' },
      // Manufacturing
      { name: 'BSc in Mechanical Engineering', level: 'DEGREE', field: 'Engineering', description: 'Machinery and manufacturing', cluster: 'Manufacturing' },
      { name: 'Diploma in Industrial Engineering', level: 'DIPLOMA', field: 'Engineering', description: 'Process optimization', cluster: 'Manufacturing' },
      { name: 'NVQ Level 6 in Production Management', level: 'NVQ', field: 'Manufacturing', description: 'Factory operations', cluster: 'Manufacturing' },
      { name: 'BSc in Materials Science', level: 'DEGREE', field: 'Materials', description: 'Material properties and applications', cluster: 'Manufacturing' },
      // Law, Public Safety, Corrections & Security
      { name: 'LLB - Bachelor of Laws', level: 'DEGREE', field: 'Law', description: 'Legal studies', cluster: 'Law, Public Safety, Corrections & Security' },
      { name: 'Diploma in Criminology', level: 'DIPLOMA', field: 'Criminology', description: 'Crime analysis and justice', cluster: 'Law, Public Safety, Corrections & Security' },
      { name: 'NVQ Level 5 in Security Management', level: 'NVQ', field: 'Security', description: 'Private security operations', cluster: 'Law, Public Safety, Corrections & Security' },
      // Marketing
      { name: 'BBA in Marketing', level: 'DEGREE', field: 'Marketing', description: 'Marketing strategy and branding', cluster: 'Marketing' },
      { name: 'Diploma in Digital Marketing', level: 'DIPLOMA', field: 'Marketing', description: 'Online marketing and SEO', cluster: 'Marketing' },
      { name: 'MSc in Marketing Analytics', level: 'MASTERS', field: 'Marketing', description: 'Data-driven marketing decisions', cluster: 'Marketing' },
      // Government & Public Administration
      { name: 'BPA - Bachelor of Public Administration', level: 'DEGREE', field: 'Public Admin', description: 'Public sector management', cluster: 'Government & Public Administration' },
      { name: 'Diploma in Local Governance', level: 'DIPLOMA', field: 'Governance', description: 'Municipal administration', cluster: 'Government & Public Administration' },
      { name: 'MPA - Master of Public Administration', level: 'MASTERS', field: 'Public Admin', description: 'Advanced public policy', cluster: 'Government & Public Administration' },
      // Hospitality & Tourism
      { name: 'BSc in Hospitality Management', level: 'DEGREE', field: 'Hospitality', description: 'Hotel and restaurant management', cluster: 'Hospitality & Tourism' },
      { name: 'Diploma in Tourism Studies', level: 'DIPLOMA', field: 'Tourism', description: 'Travel and tour operations', cluster: 'Hospitality & Tourism' },
      { name: 'NVQ Level 5 in Culinary Arts', level: 'NVQ', field: 'Culinary', description: 'Professional cooking and kitchen management', cluster: 'Hospitality & Tourism' },
      // Human Services
      { name: 'BSW - Bachelor of Social Work', level: 'DEGREE', field: 'Social Work', description: 'Community welfare and counseling', cluster: 'Human Services' },
      { name: 'Diploma in Counselling', level: 'DIPLOMA', field: 'Counselling', description: 'Mental health support', cluster: 'Human Services' },
      { name: 'MSc in Psychology', level: 'MASTERS', field: 'Psychology', description: 'Clinical and research psychology', cluster: 'Human Services' },
      // STEM (Science, Technology, Engineering & Mathematics)
      { name: 'BSc in Mathematics', level: 'DEGREE', field: 'Math', description: 'Pure and applied mathematics', cluster: 'Science, Technology, Engineering & Mathematics' },
      { name: 'BSc in Physics', level: 'DEGREE', field: 'Physics', description: 'Classical and modern physics', cluster: 'Science, Technology, Engineering & Mathematics' },
      { name: 'BSc in Chemistry', level: 'DEGREE', field: 'Chemistry', description: 'Organic and inorganic chemistry', cluster: 'Science, Technology, Engineering & Mathematics' },
      { name: 'BSc in Biology', level: 'DEGREE', field: 'Biology', description: 'Life sciences', cluster: 'Science, Technology, Engineering & Mathematics' },
      { name: 'Diploma in Biotechnology', level: 'DIPLOMA', field: 'Biotech', description: 'Applied biological sciences', cluster: 'Science, Technology, Engineering & Mathematics' },
      // Transportation, Distribution & Logistics
      { name: 'BSc in Logistics Management', level: 'DEGREE', field: 'Logistics', description: 'Supply chain and transport', cluster: 'Transportation, Distribution & Logistics' },
      { name: 'Diploma in Supply Chain Management', level: 'DIPLOMA', field: 'Supply Chain', description: 'Inventory and procurement', cluster: 'Transportation, Distribution & Logistics' },
      { name: 'NVQ Level 5 in Freight Forwarding', level: 'NVQ', field: 'Logistics', description: 'International shipping operations', cluster: 'Transportation, Distribution & Logistics' },
      // Additional to reach 130+
      { name: 'BSc in Electronics Engineering', level: 'DEGREE', field: 'Engineering', description: 'Electronic circuits and systems', cluster: 'Science, Technology, Engineering & Mathematics' },
      { name: 'Diploma in Network Administration', level: 'DIPLOMA', field: 'IT', description: 'Network setup and maintenance', cluster: 'Information Technology' },
      { name: 'BSc in Actuarial Science', level: 'DEGREE', field: 'Finance', description: 'Risk assessment and statistics', cluster: 'Finance' },
      { name: 'Diploma in Real Estate Management', level: 'DIPLOMA', field: 'Business', description: 'Property valuation and sales', cluster: 'Business Management & Administration' },
      { name: 'NVQ Level 6 in Electrical Installation', level: 'NVQ', field: 'Construction', description: 'Electrical wiring and safety', cluster: 'Architecture & Construction' },
      { name: 'BSc in Marine Biology', level: 'DEGREE', field: 'Environment', description: 'Ocean life and conservation', cluster: 'Agriculture, Food & Natural Resources' },
      { name: 'Diploma in Journalism', level: 'DIPLOMA', field: 'Communications', description: 'News writing and reporting', cluster: 'Arts, Audio/Video Technology & Communications' },
      { name: 'BSc in Aviation Management', level: 'DEGREE', field: 'Transport', description: 'Airline operations and safety', cluster: 'Transportation, Distribution & Logistics' },
      { name: 'Diploma in Early Years Education', level: 'DIPLOMA', field: 'Education', description: 'Child development and learning', cluster: 'Education & Training' },
      { name: 'NVQ Level 5 in Hospitality Operations', level: 'NVQ', field: 'Hospitality', description: 'Hotel front office and housekeeping', cluster: 'Hospitality & Tourism' },
      { name: 'BSc in Public Relations', level: 'DEGREE', field: 'Communications', description: 'Corporate communications', cluster: 'Arts, Audio/Video Technology & Communications' },
      { name: 'Diploma in Occupational Health & Safety', level: 'DIPLOMA', field: 'Health', description: 'Workplace safety regulations', cluster: 'Health Science' },
      { name: 'BSc in Textile Engineering', level: 'DEGREE', field: 'Engineering', description: 'Textile production and design', cluster: 'Manufacturing' },
      { name: 'Diploma in Forensic Science', level: 'DIPLOMA', field: 'Science', description: 'Crime scene investigation', cluster: 'Law, Public Safety, Corrections & Security' },
      { name: 'NVQ Level 6 in Automotive Engineering', level: 'NVQ', field: 'Engineering', description: 'Vehicle maintenance and repair', cluster: 'Transportation, Distribution & Logistics' },
      { name: 'BSc in Data Analytics', level: 'DEGREE', field: 'IT', description: 'Big data and business intelligence', cluster: 'Information Technology' },
      { name: 'Diploma in Export Management', level: 'DIPLOMA', field: 'Business', description: 'International trade procedures', cluster: 'Business Management & Administration' },
      { name: 'BSc in Food Technology', level: 'DEGREE', field: 'Food', description: 'Food processing and quality control', cluster: 'Agriculture, Food & Natural Resources' },
      { name: 'Diploma in Event Management', level: 'DIPLOMA', field: 'Hospitality', description: 'Conference and event planning', cluster: 'Hospitality & Tourism' },
      { name: 'NVQ Level 5 in Accounting', level: 'NVQ', field: 'Finance', description: 'Bookkeeping and financial records', cluster: 'Finance' },
      { name: 'BSc in Renewable Energy', level: 'DEGREE', field: 'Engineering', description: 'Solar, wind, and sustainable energy', cluster: 'Science, Technology, Engineering & Mathematics' },
      { name: 'Diploma in Social Media Marketing', level: 'DIPLOMA', field: 'Marketing', description: 'Social media strategy and content', cluster: 'Marketing' },
      { name: 'BSc in Urban Planning', level: 'DEGREE', field: 'Architecture', description: 'City development and zoning', cluster: 'Architecture & Construction' },
    ];

    const qualObjects = qualData.map((q) => ({
      name: q.name,
      level: q.level,
      field: q.field,
      description: q.description,
      clusterId: clusterByName[q.cluster]?.id,
    })).filter((q) => q.clusterId);

    qualifications = await Qualification.bulkCreate(qualObjects);
    console.log(`✅ Seeded ${qualifications.length} qualifications.`);
  } else {
    qualifications = await Qualification.findAll();
  }
  const qualByName = Object.fromEntries(qualifications.map((q) => [q.name, q]));

  // ── Institutes & Universities (300+) ──
  const instituteCount = await Institute.count();
  if (instituteCount === 0) {
    const baseInstitutes = [
      { name: 'University of Moratuwa', type: 'UNIVERSITY', location: 'Moratuwa', website: 'https://uom.lk', description: 'Leading engineering and IT university' },
      { name: 'University of Colombo', type: 'UNIVERSITY', location: 'Colombo', website: 'https://cmb.ac.lk', description: "Sri Lanka's oldest university" },
      { name: 'University of Peradeniya', type: 'UNIVERSITY', location: 'Peradeniya', website: 'https://pdn.ac.lk', description: 'Premier comprehensive university' },
      { name: 'University of Sri Jayewardenepura', type: 'UNIVERSITY', location: 'Nugegoda', website: 'https://sjp.ac.lk', description: 'Major university with strong management programs' },
      { name: 'University of Kelaniya', type: 'UNIVERSITY', location: 'Kelaniya', website: 'https://kln.ac.lk', description: 'Well-known for arts and sciences' },
      { name: 'University of Ruhuna', type: 'UNIVERSITY', location: 'Matara', website: 'https://ruh.ac.lk', description: 'Southern province university' },
      { name: 'Eastern University Sri Lanka', type: 'UNIVERSITY', location: 'Batticaloa', website: 'https://esn.ac.lk', description: 'University in the Eastern province' },
      { name: 'South Eastern University of Sri Lanka', type: 'UNIVERSITY', location: 'Oluvil', website: 'https://seu.ac.lk', description: 'University in Ampara district' },
      { name: 'Rajarata University of Sri Lanka', type: 'UNIVERSITY', location: 'Mihintale', website: 'https://rjt.ac.lk', description: 'University in the North Central province' },
      { name: 'Sabaragamuwa University of Sri Lanka', type: 'UNIVERSITY', location: 'Belihuloya', website: 'https://sab.ac.lk', description: 'University in the Sabaragamuwa province' },
      { name: 'Wayamba University of Sri Lanka', type: 'UNIVERSITY', location: 'Kuliyapitiya', website: 'https://wyb.ac.lk', description: 'University in the North Western province' },
      { name: 'Uva Wellassa University', type: 'UNIVERSITY', location: 'Badulla', website: 'https://uwu.ac.lk', description: 'University in Uva province' },
      { name: 'NSBM Green University', type: 'PRIVATE', location: 'Pitipana', website: 'https://nsbm.ac.lk', description: 'Private university in Homagama' },
      { name: 'CINEC Campus', type: 'PRIVATE', location: 'Malabe', website: 'https://cinec.edu', description: 'Private institute for maritime and engineering' },
      { name: 'Horizon Campus', type: 'PRIVATE', location: 'Malabe', website: 'https://horizoncampus.edu.lk', description: 'Private higher education institute' },
      { name: 'SLIIT - Sri Lanka Institute of Information Technology', type: 'PRIVATE', location: 'Malabe', website: 'https://sliit.lk', description: 'Leading private IT institute' },
      { name: 'NIBM - National Institute of Business Management', type: 'PRIVATE', location: 'Colombo', website: 'https://nibm.lk', description: 'Business and management education' },
      { name: 'CA Sri Lanka', type: 'PROFESSIONAL', location: 'Colombo', website: 'https://casrilanka.com', description: 'Institute of Chartered Accountants of Sri Lanka' },
      { name: 'ACCA Sri Lanka', type: 'PROFESSIONAL', location: 'Colombo', website: 'https://accaglobal.com/lk', description: 'Association of Chartered Certified Accountants' },
      { name: 'CIMA Sri Lanka', type: 'PROFESSIONAL', location: 'Colombo', website: 'https://cimaglobal.com', description: 'Chartered Institute of Management Accountants' },
      { name: 'SLIATE - Sri Lanka Institute of Advanced Technological Education', type: 'PUBLIC', location: 'Various', website: 'https://sliate.ac.lk', description: 'Advanced technology institutes across Sri Lanka' },
      { name: 'Open University of Sri Lanka', type: 'UNIVERSITY', location: 'Nawala', website: 'https://ou.ac.lk', description: 'Distance education university' },
    ];

    const cities = ['Colombo', 'Kandy', 'Galle', 'Matara', 'Jaffna', 'Trincomalee', 'Batticaloa', 'Kurunegala', 'Anuradhapura', 'Badulla', 'Ratnapura', 'Negombo', 'Kalutara', 'Gampaha', 'Mawanella', 'Kegalle', 'Nuwara Eliya', 'Hambantota', 'Ampara', 'Polonnaruwa'];
    const types = ['UNIVERSITY', 'PRIVATE', 'PUBLIC', 'PROFESSIONAL', 'COLLEGE', 'INSTITUTE'];
    const suffixes = ['Institute of Technology', 'Campus', 'College of Studies', 'Academy', 'School of Excellence', 'Centre for Higher Education', 'University College'];

    let allInstituteData = [...baseInstitutes];
    let counter = 1;
    while (allInstituteData.length < 300) {
      const city = cities[Math.floor(Math.random() * cities.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const name = `${suffix} - ${city} (${counter})`;
      if (!allInstituteData.some(i => i.name === name)) {
        allInstituteData.push({
          name,
          type,
          location: city,
          website: `https://example${counter}.edu`,
          description: `A ${type.toLowerCase()} institution in ${city} offering various programs.`
        });
      }
      counter++;
    }

    allInstituteData = allInstituteData.sort(() => Math.random() - 0.5);

    const createdInstitutes = [];
    for (const instData of allInstituteData) {
      const inst = await Institute.create(instData);
      createdInstitutes.push(inst);

      const numQuals = Math.floor(Math.random() * 10) + 5;
      const shuffledQuals = qualifications.sort(() => Math.random() - 0.5);
      const selectedQuals = shuffledQuals.slice(0, numQuals).map(q => q.id);
      if (selectedQuals.length) {
        await inst.setQualificationsOffered(selectedQuals);
      }
    }
    console.log(`✅ Seeded ${createdInstitutes.length} institutes/universities.`);
  }

  // ── Jobs: 50 per cluster ────────────────────────────────────
  const jobCount = await Job.count();
  if (jobCount === 0) {
    const allJobData = [];
    for (const cluster of clusters) {
      const jobs = generateJobsForCluster(cluster.name);
      // Assign clusterId to each job
      jobs.forEach(job => {
        job.clusterId = cluster.id;
      });
      allJobData.push(...jobs);
    }

    // Bulk insert all jobs
    const createdJobs = await Job.bulkCreate(allJobData);
    console.log(`✅ Seeded ${createdJobs.length} jobs (50 per cluster).`);
  } else {
    console.log(`✅ Jobs already exist (${jobCount} found). Skipping job seeding.`);
  }

  // ── Admin User ──
  const adminEmail = 'admin@sljobbank.lk';
  const existingAdmin = await User.findOne({ where: { role: 'SUPER_ADMIN' } });
  if (!existingAdmin) {
    await User.create({
      fullName: 'System Admin',
      email: adminEmail,
      password: await bcrypt.hash('ChangeMe123!', 10),
      role: 'SUPER_ADMIN',
      isActive: true,
    });
    console.log(`✅ Seeded a test admin: ${adminEmail} / ChangeMe123!`);
    console.log('⚠️  Change this password before deploying for real students (Admin > Profile, or via the DB).');
  }

  // ── Career Test ──────────────────────────────────────
  const testTitle = 'Career Key';
  const [test, created] = await CareerTest.findOrCreate({
    where: { title: testTitle },
    defaults: {
      purpose: 'This short interest inventory helps you understand what kind of work genuinely interests you...',
      whatItIdentifies: 'It identifies your top 2-3 interest areas out of six...',
      estimatedMinutes: '10-15 minutes',
      isActive: true,
    },
  });

  if (!created) {
    const existingQuestions = await CareerTestQuestion.findAll({ where: { testId: test.id } });
    if (existingQuestions.length !== RIASEC_QUESTIONS.length) {
      console.log(`🔄 Replacing ${existingQuestions.length} existing questions...`);
      await CareerTestQuestion.destroy({ where: { testId: test.id } });
      await CareerTestQuestion.bulkCreate(
        RIASEC_QUESTIONS.map(([text, category], i) => ({
          testId: test.id,
          text,
          category,
          sortOrder: i + 1,
          isActive: true,
        }))
      );
      console.log('✅ Updated Career Key test with 50 RIASEC questions.');
    } else {
      console.log('✅ Career Key test already has 50 questions.');
    }
  } else {
    await CareerTestQuestion.bulkCreate(
      RIASEC_QUESTIONS.map(([text, category], i) => ({
        testId: test.id,
        text,
        category,
        sortOrder: i + 1,
        isActive: true,
      }))
    );
    console.log('✅ Seeded the Career Key test with 50 RIASEC questions.');
  }

  console.log('🎉 Seed complete. All 16 clusters, 130+ qualifications, 300+ institutes, and 800 jobs (50 per cluster) have been seeded.');
  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});