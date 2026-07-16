import bcrypt from 'bcryptjs';
import { sequelize, CareerCluster, User, Qualification, Institute, CareerTest, CareerTestQuestion } from '../models/index.js';

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

async function main() {
  await sequelize.authenticate();

  // ── Career Clusters ──
  let clusters = await CareerCluster.findAll();
  if (clusters.length === 0) {
    clusters = await CareerCluster.bulkCreate([
      { name: 'Information Technology', emoji: '💻', color: '#0A2E1C', description: 'Software, networks, and data careers' },
      { name: 'Health Science', emoji: '🩺', color: '#2563EB', description: 'Medicine, nursing, and allied health careers' },
      { name: 'Business Management & Administration', emoji: '📊', color: '#E8A200', description: 'Business, management, and administration careers' },
      { name: 'Education & Training', emoji: '📚', color: '#059669', description: 'Teaching and training careers' },
      { name: 'Arts, Audio/Video & Communications', emoji: '🎨', color: '#DB2777', description: 'Creative, media, and design careers' },
    ]);
    console.log('✅ Seeded career clusters.');
  }
  const clusterByName = Object.fromEntries(clusters.map((c) => [c.name, c]));

  // ── Qualifications ──
  const qualCount = await Qualification.count();
  let qualifications = [];
  if (qualCount === 0) {
    qualifications = await Qualification.bulkCreate([
      { name: 'BSc in Computer Science', level: 'DEGREE', field: 'IT', description: 'Undergraduate degree in computer science', clusterId: clusterByName['Information Technology'].id },
      { name: 'HND in Information Technology', level: 'HND', field: 'IT', description: 'Higher National Diploma in IT', clusterId: clusterByName['Information Technology'].id },
      { name: 'MBBS', level: 'DEGREE', field: 'Health', description: 'Bachelor of Medicine, Bachelor of Surgery', clusterId: clusterByName['Health Science'].id },
      { name: 'Diploma in Nursing', level: 'DIPLOMA', field: 'Health', description: 'Registered Nursing Diploma', clusterId: clusterByName['Health Science'].id },
      { name: 'HND in Business Management', level: 'HND', field: 'Business', description: 'Higher National Diploma', clusterId: clusterByName['Business Management & Administration'].id },
      { name: 'CA Sri Lanka Professional Qualification', level: 'PROFESSIONAL', field: 'Finance', description: 'Chartered Accountancy', clusterId: clusterByName['Business Management & Administration'].id },
      { name: 'Bachelor of Education', level: 'DEGREE', field: 'Education', description: 'Undergraduate teaching degree', clusterId: clusterByName['Education & Training'].id },
      { name: 'Diploma in Graphic Design', level: 'DIPLOMA', field: 'Arts', description: 'Visual design and multimedia diploma', clusterId: clusterByName['Arts, Audio/Video & Communications'].id },
    ]);
    console.log('✅ Seeded qualifications (each under its career cluster).');
  } else {
    qualifications = await Qualification.findAll();
  }
  const qualByName = Object.fromEntries(qualifications.map((q) => [q.name, q]));

  // ── Institutes ──
  const instituteCount = await Institute.count();
  if (instituteCount === 0) {
    const uom = await Institute.create({ name: 'University of Moratuwa', type: 'UNIVERSITY', location: 'Moratuwa', website: 'https://uom.lk', description: 'Leading engineering and IT university' });
    await uom.setQualificationsOffered([qualByName['BSc in Computer Science'].id]);

    const nibm = await Institute.create({ name: 'NIBM', type: 'PRIVATE', location: 'Colombo', website: 'https://nibm.lk', description: 'National Institute of Business Management' });
    await nibm.setQualificationsOffered([qualByName['HND in Information Technology'].id, qualByName['HND in Business Management'].id]);

    const uoc = await Institute.create({ name: 'University of Colombo', type: 'UNIVERSITY', location: 'Colombo', website: 'https://cmb.ac.lk', description: "Sri Lanka's oldest university" });
    await uoc.setQualificationsOffered([qualByName['MBBS'].id, qualByName['Bachelor of Education'].id]);

    const casl = await Institute.create({ name: 'CA Sri Lanka', type: 'PROFESSIONAL', location: 'Colombo', website: 'https://casrilanka.com', description: 'Institute of Chartered Accountants of Sri Lanka' });
    await casl.setQualificationsOffered([qualByName['CA Sri Lanka Professional Qualification'].id]);

    console.log('✅ Seeded institutes/universities, each mapped to the qualifications they offer.');
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
  // Create the test if it doesn't exist; if it does, check if it has 50 questions; if not, replace them.
  const testTitle = 'Career Key';
  const [test, created] = await CareerTest.findOrCreate({
    where: { title: testTitle },
    defaults: {
      purpose: 'This short interest inventory helps you understand what kind of work genuinely interests you, before you commit to an A/L stream, degree, or job path. It is based on Holland\'s RIASEC theory, used worldwide in career guidance.',
      whatItIdentifies: 'It identifies your top 2-3 interest areas out of six (Realistic, Investigative, Artistic, Social, Enterprising, Conventional), and matches them to career clusters and specific jobs in this system that fit those interests.',
      estimatedMinutes: '10-15 minutes',
      isActive: true,
    },
  });

  if (!created) {
    // Test already exists – check how many questions it has
    const existingQuestions = await CareerTestQuestion.findAll({ where: { testId: test.id } });
    if (existingQuestions.length !== RIASEC_QUESTIONS.length) {
      console.log(`🔄 Replacing ${existingQuestions.length} existing questions with the new 50-question bank.`);
      // Delete old questions and insert new ones
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
      console.log('✅ Seeded the Career Key test with 50 RIASEC questions.');
    } else {
      console.log('✅ Career Key test already has 50 questions – no changes made.');
    }
  } else {
    // New test – create all questions
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

  console.log('🎉 Seed complete.');
  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});