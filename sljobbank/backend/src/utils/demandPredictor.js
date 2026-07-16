const highDemandKeywords = [
  'ai', 'machine learning', 'data scientist', 'software engineer',
  'full stack', 'backend', 'frontend', 'devops', 'cloud',
  'cybersecurity', 'data analyst', 'business intelligence',
  'product manager', 'project manager', 'ux/ui', 'designer'
];

const highDemandSectors = [
  'Technology', 'Healthcare', 'Finance', 'Education',
  'Information Technology'
];

export function predictDemand(jobData) {
  let score = 50;

  const {
    title,
    salaryMin,
    salaryMax,
    sector,
    remoteAvailable,
    internshipAvailable,
    careerPathway
  } = jobData;

  if (title) {
    const lowerTitle = title.toLowerCase();
    const keywordMatch = highDemandKeywords.some(kw => lowerTitle.includes(kw));
    if (keywordMatch) score += 20;
  }

  const avgSalary = (salaryMin + salaryMax) / 2 || 0;
  if (avgSalary >= 150000) score += 30;
  else if (avgSalary >= 100000) score += 15;
  else if (avgSalary < 50000) score -= 20;

  if (sector && highDemandSectors.includes(sector)) {
    score += 15;
  }

  if (remoteAvailable) score += 10;
  if (internshipAvailable) score -= 5;

  if (careerPathway && /growth|advancement|promotion|leadership/i.test(careerPathway)) {
    score += 5;
  }

  score = Math.min(100, Math.max(0, score));

  let label;
  if (score >= 70) label = 'HIGH';
  else if (score >= 40) label = 'MEDIUM';
  else label = 'LOW';

  return { score, label };
}
