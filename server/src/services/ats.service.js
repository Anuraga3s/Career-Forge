const streamSkills = {
  CSE: {
    core: ["data structures", "algorithms", "oops", "database", "sql", "nosql", "api", "rest"],
    languages: ["java", "python", "c++", "javascript", "c#", "go", "rust"],
    frontend: ["react", "angular", "vue", "html", "css", "javascript", "typescript"],
    backend: ["nodejs", "express", "django", "spring", "flask", "fastapi"],
    databases: ["mongodb", "postgresql", "mysql", "redis", "elasticsearch"],
    devops: ["docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "jenkins"],
    other: ["git", "linux", "unix", "networking", "security", "machine learning", "ai"],
  },
  Civil: {
    core: ["civil engineering", "structural analysis", "concrete design", "steel design", "geotechnical"],
    software: ["autocad", "staad", "ansys", "revit", "sap2000", "etabs", "plaxis"],
    design: ["beam design", "column design", "foundation design", "rcc", "highway design"],
    materials: ["concrete", "steel", "soil mechanics", "material properties"],
    other: ["surveying", "hydraulics", "environmental", "project management", "bim"],
  },
  Mechanical: {
    core: ["thermodynamics", "mechanics of materials", "kinematics", "dynamics", "fluid mechanics"],
    design: ["cad design", "machine design", "combustion", "heat transfer", "manufacturing"],
    software: ["solidworks", "catia", "autocad", "ansys", "matlab", "fusion 360", "inventor"],
    manufacturing: ["cnc", "machining", "casting", "welding", "assembly", "production"],
    other: ["turbomachinery", "automotive", "aerospace", "maintenance", "quality control"],
  },
  MDS: {
    core: ["management", "business analysis", "operations", "supply chain", "data analysis"],
    analytics: ["excel", "sql", "tableau", "power bi", "python", "r", "business intelligence"],
    tools: ["sap", "oracle", "salesforce", "analytics", "forecasting", "optimization"],
    finance: ["accounting", "financial analysis", "budgeting", "cost analysis"],
    other: ["project management", "scrum", "agile", "lean", "six sigma"],
  }
};

const calculateATS = (text, stream = "CSE") => {
  const lowerText = text.toLowerCase();
  const streamData = streamSkills[stream] || streamSkills.CSE;

  // Flatten all skills for this stream
  const allStreamSkills = Object.values(streamData).flat();
  const detectedSkills = allStreamSkills.filter(skill => lowerText.includes(skill));

  // Calculate score based on skill coverage
  let score = Math.min(detectedSkills.length * 5, 100);

  let strengths = [];
  let weaknesses = [];
  let suggestions = [];

  // Stream-specific analysis
  if (stream === "CSE") {
    if (detectedSkills.filter(s => streamData.languages.includes(s)).length >= 2) {
      strengths.push("Good programming language knowledge");
    } else {
      weaknesses.push("Limited programming language skills");
      suggestions.push("Learn at least 2-3 programming languages");
      score -= 10;
    }

    if (detectedSkills.filter(s => streamData.databases.includes(s)).length >= 1) {
      strengths.push("Database knowledge present");
    } else {
      weaknesses.push("No database experience");
      suggestions.push("Learn SQL and NoSQL databases");
      score -= 8;
    }
  } else if (stream === "Civil") {
    if (detectedSkills.filter(s => streamData.software.includes(s)).length >= 1) {
      strengths.push("Civil engineering software proficiency");
    } else {
      weaknesses.push("Missing civil design software skills");
      suggestions.push("Learn AutoCAD, STAAD, or ANSYS");
      score -= 15;
    }

    if (detectedSkills.filter(s => streamData.design.includes(s)).length >= 2) {
      strengths.push("Good design concepts understanding");
    } else {
      weaknesses.push("Limited design knowledge");
      suggestions.push("Strengthen structural design concepts");
    }
  } else if (stream === "Mechanical") {
    if (detectedSkills.filter(s => streamData.software.includes(s)).length >= 1) {
      strengths.push("CAD/Software proficiency");
    } else {
      weaknesses.push("No CAD experience");
      suggestions.push("Learn SolidWorks or CATIA");
      score -= 15;
    }

    if (detectedSkills.filter(s => streamData.core.includes(s)).length >= 2) {
      strengths.push("Good mechanical fundamentals");
    } else {
      weaknesses.push("Weak fundamentals");
      suggestions.push("Revise core mechanical concepts");
    }
  } else if (stream === "MDS") {
    if (detectedSkills.filter(s => streamData.analytics.includes(s)).length >= 1) {
      strengths.push("Analytics and data skills present");
    } else {
      weaknesses.push("Missing analytics tools knowledge");
      suggestions.push("Learn Excel, SQL, and Tableau");
      score -= 12;
    }

    if (detectedSkills.filter(s => streamData.tools.includes(s)).length >= 1) {
      strengths.push("Enterprise tool experience");
    } else {
      weaknesses.push("No ERP/enterprise tool experience");
      suggestions.push("Learn SAP, Oracle, or Salesforce");
    }
  }

  // Universal checks
  if (!lowerText.includes("project")) {
    weaknesses.push("Projects section missing");
    suggestions.push("Add strong real-world projects");
    score -= 10;
  } else {
    strengths.push("Project experience documented");
  }

  if (!lowerText.includes("experience") && !lowerText.includes("internship")) {
    suggestions.push("Add internship or work experience section");
    score -= 5;
  } else {
    strengths.push("Professional experience included");
  }

  return {
    atsScore: Math.max(Math.round(score), 0),
    detectedSkills: [...new Set(detectedSkills)],
    strengths,
    weaknesses,
    suggestions
  };
};

module.exports = calculateATS;