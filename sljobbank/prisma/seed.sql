-- ─────────────────────────────────────────────────────────────
--  SL Job Bank — MySQL Seed Data
--  Run after: CREATE DATABASE sl_job_bank;
-- ─────────────────────────────────────────────────────────────

USE sl_job_bank;

-- ── System Settings ───────────────────────────────────────────
INSERT INTO system_settings (id, paid_mode_enabled, monthly_price, yearly_price,
  bank_name, account_number, account_holder, updated_at)
VALUES ('settings-001', false, 990.00, 8900.00,
  'Bank of Ceylon', '7890-1234-5678', 'SL Job Bank (Pvt) Ltd', NOW());

-- ── Demo Users (passwords = bcrypt of "demo123") ──────────────
INSERT INTO users (id, full_name, email, password, role, subscription_type, is_active, created_at, updated_at)
VALUES
  ('u-student-01',  'Kavya Perera',          'student@demo.com',    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBApHGBVOeZLWm', 'STUDENT',     'FREE', true, NOW(), NOW()),
  ('u-student-02',  'Nimal Wickramasinghe',  'nimal@demo.com',      '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBApHGBVOeZLWm', 'STUDENT',     'PAID', true, NOW(), NOW()),
  ('u-student-03',  'Dilani Fernando',       'dilani@demo.com',     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBApHGBVOeZLWm', 'STUDENT',     'FREE', true, NOW(), NOW()),
  ('u-student-04',  'Sithara Mendis',        'sithara@demo.com',    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBApHGBVOeZLWm', 'STUDENT',     'FREE', true, NOW(), NOW()),
  ('u-counselor-01','Dr. Amara Silva',       'counselor@demo.com',  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBApHGBVOeZLWm', 'COUNSELOR',   'FREE', true, NOW(), NOW()),
  ('u-admin-01',    'Admin User',            'admin@demo.com',      '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBApHGBVOeZLWm', 'SUPER_ADMIN', 'FREE', true, NOW(), NOW());

-- ── 16 Career Clusters ────────────────────────────────────────
INSERT INTO career_clusters (id, name, description, emoji, color, sort_order, is_active, created_at, updated_at) VALUES
  ('cl-01', 'Agriculture, Food & Natural Resources',      'Farming, agribusiness, food science, environmental conservation and natural resource management', '🌾', '#2D6A4F', 1,  true, NOW(), NOW()),
  ('cl-02', 'Architecture & Construction',               'Design and build homes, offices, roads and all infrastructure that Sri Lanka depends on',          '🏗️', '#B5451B', 2,  true, NOW(), NOW()),
  ('cl-03', 'Arts, Audio/Video & Communications',        'Creative arts, broadcast media, journalism, graphic design and digital content production',        '🎨', '#6B21A8', 3,  true, NOW(), NOW()),
  ('cl-04', 'Business Management & Administration',      'Leadership, operations management, human resources and strategic business administration',          '💼', '#1E3A8A', 4,  true, NOW(), NOW()),
  ('cl-05', 'Education & Training',                      'Teaching, curriculum design, educational leadership and training and development',                  '📚', '#0369A1', 5,  true, NOW(), NOW()),
  ('cl-06', 'Finance',                                   'Banking, accounting, investment analysis, insurance and financial planning services',               '💰', '#065F46', 6,  true, NOW(), NOW()),
  ('cl-07', 'Government & Public Administration',        'Civil service, public policy, governance, national defence and public sector administration',       '🏛️', '#374151', 7,  true, NOW(), NOW()),
  ('cl-08', 'Health Science',                            'Medicine, nursing, pharmacy, dentistry and allied health and wellness services',                    '🏥', '#991B1B', 8,  true, NOW(), NOW()),
  ('cl-09', 'Hospitality & Tourism',                     'Hotels, travel management, food and beverage, event management and tourism services',               '✈️', '#C2410C', 9,  true, NOW(), NOW()),
  ('cl-10', 'Human Services',                            'Social work, counseling, community development and social welfare services',                        '🤝', '#7C3AED', 10, true, NOW(), NOW()),
  ('cl-11', 'Information Technology',                    'Software engineering, networking, artificial intelligence, cybersecurity and data science',         '💻', '#0E7490', 11, true, NOW(), NOW()),
  ('cl-12', 'Law, Public Safety & Security',             'Legal services, law enforcement, national security and emergency response',                         '⚖️', '#1D4ED8', 12, true, NOW(), NOW()),
  ('cl-13', 'Manufacturing',                             'Industrial production, quality control, process engineering and supply chain operations',           '🏭', '#78350F', 13, true, NOW(), NOW()),
  ('cl-14', 'Marketing',                                 'Advertising, digital marketing, brand management, market research and sales strategy',              '📢', '#9D174D', 14, true, NOW(), NOW()),
  ('cl-15', 'Science, Technology, Engineering & Mathematics', 'Research, engineering design, applied mathematics and laboratory sciences',                   '🔬', '#312E81', 15, true, NOW(), NOW()),
  ('cl-16', 'Transportation, Distribution & Logistics',  'Supply chain, shipping, aviation, port operations and transportation management',                   '🚢', '#134E4A', 16, true, NOW(), NOW());

-- ── Institutes ────────────────────────────────────────────────
INSERT INTO institutes (id, name, location, contact, website, accreditation, type, is_active, created_at, updated_at) VALUES
  ('inst-01', 'University of Moratuwa',                     'Moratuwa, Western Province',     '+94 11 265 0301', 'https://uom.lk',         'UGC Recognised',    'GOVERNMENT',    true, NOW(), NOW()),
  ('inst-02', 'University of Colombo',                      'Colombo 03, Western Province',   '+94 11 258 9034', 'https://cmb.ac.lk',      'UGC Recognised',    'GOVERNMENT',    true, NOW(), NOW()),
  ('inst-03', 'University of Kelaniya',                     'Kelaniya, Western Province',     '+94 11 291 4479', 'https://kln.ac.lk',      'UGC Recognised',    'GOVERNMENT',    true, NOW(), NOW()),
  ('inst-04', 'University of Peradeniya',                   'Peradeniya, Central Province',   '+94 81 238 8001', 'https://pdn.ac.lk',      'UGC Recognised',    'GOVERNMENT',    true, NOW(), NOW()),
  ('inst-05', 'University of Sri Jayawardenepura',          'Nugegoda, Western Province',     '+94 11 275 8000', 'https://sjp.ac.lk',      'UGC Recognised',    'GOVERNMENT',    true, NOW(), NOW()),
  ('inst-06', 'SLIIT',                                      'Malabe, Western Province',       '+94 11 754 4801', 'https://sliit.lk',       'UGC Recognised',    'PRIVATE',       true, NOW(), NOW()),
  ('inst-07', 'IIT (Informatics Institute of Technology)',  'Colombo 03, Western Province',   '+94 11 269 8011', 'https://iit.ac.lk',      'Affiliated to UK',  'PRIVATE',       true, NOW(), NOW()),
  ('inst-08', 'NIBM',                                       'Colombo 07, Western Province',   '+94 11 269 7001', 'https://nibm.lk',        'NIBM Act',          'GOVERNMENT',    true, NOW(), NOW()),
  ('inst-09', 'CA Sri Lanka (ICASL)',                       'Colombo 03, Western Province',   '+94 11 235 2000', 'https://casrilanka.com', 'ICASL Act',         'PROFESSIONAL',  true, NOW(), NOW()),
  ('inst-10', 'CIMA Sri Lanka',                             'Colombo 03, Western Province',   '+94 11 232 3909', 'https://cimaglobal.com', 'Royal Charter',     'PROFESSIONAL',  true, NOW(), NOW()),
  ('inst-11', 'CIPM Sri Lanka',                             'Colombo 05, Western Province',   '+94 11 257 8100', 'https://cipm.lk',        'CIPM Act',          'PROFESSIONAL',  true, NOW(), NOW()),
  ('inst-12', 'AOD (Academy of Design)',                    'Colombo 03, Western Province',   '+94 11 267 2512', 'https://aod.lk',         'UGC Recognised',    'PRIVATE',       true, NOW(), NOW()),
  ('inst-13', 'Faculty of Medicine, Univ. of Colombo',     'Colombo 08, Western Province',   '+94 11 269 5300', 'https://med.cmb.ac.lk',  'SLMC Recognised',   'GOVERNMENT',    true, NOW(), NOW()),
  ('inst-14', 'Colombo School of Hotel Management',         'Colombo 03, Western Province',   '+94 11 257 3555', 'https://cshm.lk',        'SLTHB Recognised',  'PRIVATE',       true, NOW(), NOW()),
  ('inst-15', 'Sri Lanka Institute of Tourism',             'Colombo 03, Western Province',   '+94 11 243 7059', 'https://slit.lk',        'Ministry Approved', 'GOVERNMENT',    true, NOW(), NOW()),
  ('inst-16', 'AAT Sri Lanka',                              'Colombo 07, Western Province',   '+94 11 256 5900', 'https://aatsl.lk',       'AAT Act',           'PROFESSIONAL',  true, NOW(), NOW());

-- ── Jobs ─────────────────────────────────────────────────────
INSERT INTO jobs (id, title, description, responsibilities, qualifications, skills, al_stream, al_subjects,
  salary_min, salary_max, industry_demand, career_pathway, employment_growth, sector,
  remote_available, internship_available, government_available, private_available,
  cluster_id, is_active, created_at, updated_at) VALUES

-- IT Cluster
('job-01', 'Software Engineer',
  'Design, develop, test and maintain software applications serving Sri Lankan businesses and international tech companies.',
  'Develop and maintain web/mobile applications|Write clean, scalable code|Participate in code reviews|Collaborate with cross-functional teams|Troubleshoot production issues',
  'BSc in Computer Science or Software Engineering (minimum 2nd class degree). UGC recognised university.',
  'Java|Python|React.js|Node.js|SQL|Git|REST APIs|Docker',
  'Physical Science', 'Combined Mathematics|Physics|ICT',
  120000, 450000, 'Very High', 'Junior Developer → Senior Developer → Tech Lead → Engineering Manager → CTO',
  '+22% by 2027', 'Private / Government', true, true, true, true, 'cl-11', true, NOW(), NOW()),

('job-02', 'Data Scientist',
  'Analyse complex datasets using ML and AI to discover actionable business insights and build predictive models.',
  'Build and deploy ML models|Perform statistical analysis|Develop data pipelines|Present insights to stakeholders|Research new methodologies',
  'BSc in Statistics, Computer Science or Data Science. MSc preferred for senior roles.',
  'Python|R|TensorFlow|PyTorch|SQL|Tableau|Apache Spark|Scikit-learn',
  'Physical Science', 'Combined Mathematics|Physics|ICT',
  150000, 500000, 'Very High', 'Data Analyst → Data Scientist → Senior Scientist → Lead Data Scientist → CDO',
  '+35% by 2027', 'Private', true, true, false, true, 'cl-11', true, NOW(), NOW()),

('job-03', 'Cybersecurity Analyst',
  'Protect organisational systems and data from cyber threats through monitoring, analysis and incident response.',
  'Monitor security systems|Conduct vulnerability assessments|Respond to security incidents|Develop security policies|Train staff on security',
  'BSc in IT, Cybersecurity or Computer Science. CISSP or CEH certification preferred.',
  'Network security|SIEM tools|Penetration testing|Ethical hacking|Python|Incident response',
  'Physical Science', 'Combined Mathematics|Physics|ICT',
  100000, 400000, 'Very High', 'Security Analyst → Senior Analyst → Security Manager → CISO',
  '+31% by 2027', 'Private / Government', false, true, true, true, 'cl-11', true, NOW(), NOW()),

-- Health Science
('job-04', 'Medical Doctor (MBBS)',
  'Diagnose and treat illnesses, conduct medical examinations and promote public health across Sri Lanka.',
  'Examine and diagnose patients|Prescribe medications and treatment|Conduct medical procedures|Maintain patient records|Engage in continuing education',
  'MBBS from a UGC-recognised medical faculty. Registration with Sri Lanka Medical Council (SLMC) mandatory.',
  'Clinical diagnosis|Patient care|Surgical procedures|Medical documentation|Research methodology',
  'Biological Science', 'Biology|Chemistry|Physics',
  200000, 800000, 'High', 'Intern → Medical Officer → Registrar → Senior Registrar → Consultant',
  '+15% by 2027', 'Government / Private', false, true, true, true, 'cl-08', true, NOW(), NOW()),

('job-05', 'Pharmacist',
  'Dispense medications, counsel patients on safe drug use and ensure correct medication management in hospitals and community pharmacies.',
  'Dispense and verify prescriptions|Counsel patients on medication use|Monitor for drug interactions|Manage pharmaceutical inventory|Provide clinical pharmacy services',
  'BPharm from a recognised university. Registration with Sri Lanka Pharmacy Council mandatory.',
  'Pharmacology|Drug interaction management|Patient counselling|Clinical pharmacy|Inventory management',
  'Biological Science', 'Biology|Chemistry|Physics',
  80000, 250000, 'High', 'Intern Pharmacist → Pharmacist → Senior Pharmacist → Chief Pharmacist → Director',
  '+11% by 2027', 'Government / Private', false, true, true, true, 'cl-08', true, NOW(), NOW()),

-- Finance
('job-06', 'Chartered Accountant',
  'Manage financial records, prepare audit reports and advise businesses on financial strategy, tax and compliance.',
  'Prepare and audit financial statements|Tax planning and compliance|Financial advisory services|Internal controls review|Regulatory reporting',
  'CA Sri Lanka (ICASL) certification. CIMA or ACCA qualifications also recognised by Sri Lankan employers.',
  'Financial reporting|Auditing|Tax law|ERP systems (SAP/Oracle)|MS Excel|IFRS standards',
  'Commerce', 'Accounting|Economics|Business Studies',
  90000, 350000, 'High', 'Accountant → Senior Accountant → Financial Controller → Finance Director → CFO',
  '+12% by 2027', 'Private / Government', true, true, true, true, 'cl-06', true, NOW(), NOW()),

-- Business
('job-07', 'Human Resources Manager',
  'Lead talent acquisition, employee relations, performance management and organisational development initiatives.',
  'Oversee end-to-end recruitment|Design and implement HR policies|Manage employee relations|Drive performance management|Lead training and development programs',
  'BSc Human Resource Management or Business Administration. CIPM qualification preferred by Sri Lankan employers.',
  'Recruitment|Labour law (Shop & Office Act)|HRIS|Training & development|Payroll management|Conflict resolution',
  'Commerce / Arts', 'Business Studies|Economics|Accounting',
  80000, 280000, 'Medium', 'HR Officer → HR Executive → HR Manager → Head of HR → CHRO',
  '+8% by 2027', 'Private / Government', false, true, true, true, 'cl-04', true, NOW(), NOW()),

-- Civil Engineering
('job-08', 'Civil Engineer',
  'Design, plan and supervise construction of infrastructure including roads, bridges, buildings and water systems across Sri Lanka.',
  'Structural design and analysis|Project planning and cost estimation|Site supervision and quality control|Safety and environmental compliance|Coordinate with government authorities',
  'BSc Civil Engineering from a UGC-recognised university. IESL membership required for independent practice.',
  'AutoCAD|STAAD Pro|Project management|Surveying|MS Project|Sri Lanka Building Code',
  'Physical Science', 'Combined Mathematics|Physics|Chemistry',
  100000, 380000, 'High', 'Graduate Engineer → Project Engineer → Senior Engineer → Principal Engineer → Director',
  '+14% by 2027', 'Government / Private', false, true, true, true, 'cl-15', true, NOW(), NOW()),

-- Marketing
('job-09', 'Digital Marketing Manager',
  'Develop and execute comprehensive digital marketing strategies across SEO, social media, PPC, content marketing and email marketing.',
  'Develop digital marketing strategy|Manage social media channels|Run SEO and PPC campaigns|Analyse campaign performance|Lead and mentor marketing team',
  'Degree in Marketing, Business or Communications. Google Ads, HubSpot and Meta Blueprint certifications highly valued.',
  'SEO / SEM|Social media marketing|Google Analytics 4|Content marketing|Email automation|Conversion Rate Optimisation',
  'Commerce / Arts', 'Business Studies|Economics|ICT',
  70000, 300000, 'High', 'Marketing Executive → Digital Specialist → Marketing Manager → Head of Marketing → CMO',
  '+24% by 2027', 'Private', true, true, false, true, 'cl-14', true, NOW(), NOW()),

-- Hospitality
('job-10', 'Hotel Manager',
  'Oversee all hotel operations to deliver exceptional guest experiences and achieve sustainable profitability.',
  'Manage all hotel departments|Handle guest relations and complaints|Budget and P&L management|Staff recruitment, training and performance|Ensure brand standards compliance',
  'Degree in Hotel Management or Hospitality Management. Front office and F&B experience required.',
  'Hotel operations management|Revenue management|Guest relations|F&B management|Property Management Systems (PMS)|Leadership',
  'Commerce / Arts', 'Business Studies|Economics|English',
  100000, 400000, 'High', 'Front Office Executive → Duty Manager → Department Manager → GM → Regional Director',
  '+16% by 2027', 'Private', false, true, false, true, 'cl-09', true, NOW(), NOW()),

-- Arts
('job-11', 'Graphic Designer',
  'Create compelling visual content for digital and print media including brand identities, UI/UX design and marketing materials.',
  'Design logos and brand identities|Create digital marketing assets|UI/UX wireframing and prototyping|Collaborate with marketing teams|Manage design projects end-to-end',
  'Diploma or Degree in Graphic Design or Visual Communication. Strong portfolio mandatory.',
  'Adobe Photoshop|Illustrator|InDesign|Figma|Typography|Colour theory|Brand identity',
  'Arts / Technology', 'Art|ICT|English',
  60000, 250000, 'Medium', 'Junior Designer → Designer → Senior Designer → Art Director → Creative Director',
  '+18% by 2027', 'Private', true, true, false, true, 'cl-03', true, NOW(), NOW()),

-- Education
('job-12', 'Secondary School Teacher',
  'Educate and inspire secondary school students in Sri Lanka, delivering engaging lessons aligned with the national curriculum.',
  'Plan and deliver lessons aligned to curriculum|Assess student progress|Provide pastoral care|Collaborate with parents and colleagues|Engage in professional development',
  'Bachelor of Education (BEd) or degree with PGDE. National Colleges of Education (NCOE) graduates also eligible.',
  'Lesson planning|Classroom management|Assessment and evaluation|Communication|Subject expertise|ICT integration',
  'Arts / Commerce / Science', 'Varies by subject',
  45000, 120000, 'Medium', 'Probationary Teacher → Class Teacher → Senior Teacher → Principal → Zonal Director',
  '+5% by 2027', 'Government / Private', false, true, true, true, 'cl-05', true, NOW(), NOW());

-- ── Courses ───────────────────────────────────────────────────
INSERT INTO courses (id, name, duration, fee, qualification, intake_dates, delivery_mode,
  institute_id, job_id, is_active, fee_updated_at, created_at, updated_at) VALUES

-- Software Engineer courses
('crs-01', 'BSc Software Engineering',   '4 years', 0,      'BSc (Hons)',     'March, September', 'FULL_TIME', 'inst-01', 'job-01', true, NOW(), NOW(), NOW()),
('crs-02', 'BSc Information Technology', '4 years', 320000, 'BSc (Hons)',     'January, June',    'FULL_TIME', 'inst-06', 'job-01', true, NOW(), NOW(), NOW()),
('crs-03', 'BSc Computer Science',       '3 years', 480000, 'BSc (Hons)',     'October',          'FULL_TIME', 'inst-07', 'job-01', true, NOW(), NOW(), NOW()),
('crs-04', 'HND Software Engineering',   '2 years', 95000,  'HND',           'January, July',    'FULL_TIME', 'inst-08', 'job-01', true, NOW(), NOW(), NOW()),

-- Data Scientist courses
('crs-05', 'BSc Statistics',             '3 years', 0,      'BSc (Hons)',     'March',            'FULL_TIME', 'inst-02', 'job-02', true, NOW(), NOW(), NOW()),
('crs-06', 'BSc Data Science',           '4 years', 340000, 'BSc (Hons)',     'January',          'FULL_TIME', 'inst-06', 'job-02', true, NOW(), NOW(), NOW()),

-- Cybersecurity courses
('crs-07', 'BSc Cybersecurity',          '4 years', 360000, 'BSc (Hons)',     'January',          'FULL_TIME', 'inst-06', 'job-03', true, NOW(), NOW(), NOW()),
('crs-08', 'BSc Computer Science',       '3 years', 480000, 'BSc (Hons)',     'October',          'FULL_TIME', 'inst-07', 'job-03', true, NOW(), NOW(), NOW()),

-- Medical Doctor courses
('crs-09', 'MBBS',                       '5 years', 0,      'MBBS',          'September',        'FULL_TIME', 'inst-13', 'job-04', true, NOW(), NOW(), NOW()),

-- Pharmacist courses
('crs-10', 'BPharm',                     '4 years', 0,      'BPharm',        'September',        'FULL_TIME', 'inst-02', 'job-05', true, NOW(), NOW(), NOW()),

-- Chartered Accountant courses
('crs-11', 'CA Professional Programme',  '3-4 years', 85000,'CA Qualification','January, June',   'PART_TIME', 'inst-09', 'job-06', true, NOW(), NOW(), NOW()),
('crs-12', 'CIMA Professional',          '3 years', 180000, 'CIMA (CGMA)',   'January, April, July, October', 'BLENDED', 'inst-10', 'job-06', true, NOW(), NOW(), NOW()),
('crs-13', 'BSc Accounting',             '3 years', 0,      'BSc (Hons)',    'March',            'FULL_TIME', 'inst-05', 'job-06', true, NOW(), NOW(), NOW()),

-- HR Manager courses
('crs-14', 'Professional HR Qualification', '2 years', 75000, 'CIPM Qualification', 'January, July', 'PART_TIME', 'inst-11', 'job-07', true, NOW(), NOW(), NOW()),
('crs-15', 'BSc HRM',                    '3 years', 0,      'BSc (Hons)',    'March',            'FULL_TIME', 'inst-03', 'job-07', true, NOW(), NOW(), NOW()),

-- Civil Engineer courses
('crs-16', 'BSc Civil Engineering',      '4 years', 0,      'BSc (Hons)',    'March, September', 'FULL_TIME', 'inst-01', 'job-08', true, NOW(), NOW(), NOW()),
('crs-17', 'BSc Civil Engineering',      '4 years', 0,      'BSc (Hons)',    'March',            'FULL_TIME', 'inst-04', 'job-08', true, NOW(), NOW(), NOW()),

-- Digital Marketing courses
('crs-18', 'BSc Marketing Management',   '3 years', 0,      'BSc (Hons)',    'March',            'FULL_TIME', 'inst-02', 'job-09', true, NOW(), NOW(), NOW()),
('crs-19', 'Diploma in Digital Marketing','1 year', 65000,  'Diploma',      'January, June',    'PART_TIME', 'inst-16', 'job-09', true, NOW(), NOW(), NOW()),

-- Hotel Manager courses
('crs-20', 'BSc Hotel Management',       '3 years', 180000, 'BSc (Hons)',    'September',        'FULL_TIME', 'inst-14', 'job-10', true, NOW(), NOW(), NOW()),
('crs-21', 'HND Hospitality Studies',    '2 years', 85000,  'HND',          'January, July',    'FULL_TIME', 'inst-15', 'job-10', true, NOW(), NOW(), NOW()),

-- Graphic Designer courses
('crs-22', 'BA Graphic Design',          '3 years', 550000, 'BA (Hons)',     'January, August',  'FULL_TIME', 'inst-12', 'job-11', true, NOW(), NOW(), NOW()),

-- Teacher courses
('crs-23', 'Bachelor of Education (BEd)','4 years', 0,      'BEd',          'March',            'FULL_TIME', 'inst-02', 'job-12', true, NOW(), NOW(), NOW());

-- ── Favourites (demo data) ─────────────────────────────────────
INSERT INTO favorites (id, user_id, job_id, saved_at) VALUES
  ('fav-01', 'u-student-01', 'job-01', NOW()),
  ('fav-02', 'u-student-01', 'job-04', NOW()),
  ('fav-03', 'u-student-02', 'job-01', NOW()),
  ('fav-04', 'u-student-02', 'job-02', NOW()),
  ('fav-05', 'u-student-02', 'job-06', NOW());

-- ── Payments (demo data) ──────────────────────────────────────
INSERT INTO payments (id, amount, status, method, reference, plan, user_id, payment_date) VALUES
  ('pay-01', 990.00,  'COMPLETED', 'PAYHERE',       'PH-20241001-001', 'monthly', 'u-student-02', NOW()),
  ('pay-02', 8900.00, 'COMPLETED', 'BANK_TRANSFER',  'BT-20240801-001', 'yearly',  'u-student-03', NOW()),
  ('pay-03', 990.00,  'PENDING',   'PAYHERE',        'PH-20241015-003', 'monthly', 'u-student-01', NOW());

-- ── Notifications (demo) ─────────────────────────────────────
INSERT INTO notifications (id, title, message, type, is_read, user_id, created_at) VALUES
  ('notif-01', 'Welcome to SL Job Bank!', 'Start exploring 600+ career paths mapped to Sri Lanka''s A/L system.', 'info',    false, 'u-student-01', NOW()),
  ('notif-02', 'New job added: Data Scientist', 'A new Data Scientist role has been added to the IT cluster.', 'success', false, 'u-student-01', NOW()),
  ('notif-03', 'Subscription activated', 'Your monthly subscription is now active. Enjoy full access!', 'success', true, 'u-student-02', NOW());
