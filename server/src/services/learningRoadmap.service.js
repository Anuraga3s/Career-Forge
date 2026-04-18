const streamRoadmaps = {
  CSE: {
    languages: {
      topics: ["Variables & Data Types", "Control Flow", "Functions", "OOP", "File I/O"],
      duration: "2 weeks"
    },
    dataStructures: {
      topics: ["Arrays & Lists", "Stacks & Queues", "Linked Lists", "Trees", "Graphs", "Hash Maps"],
      duration: "4 weeks"
    },
    algorithms: {
      topics: ["Sorting", "Searching", "Recursion", "Dynamic Programming", "Greedy", "Graph Algorithms"],
      duration: "4 weeks"
    },
    databases: {
      topics: ["SQL Basics", "Indexing", "Joins", "Aggregation", "Transactions", "Query Optimization"],
      duration: "3 weeks"
    },
    frontend: {
      topics: ["HTML/CSS Fundamentals", "JavaScript ES6+", "DOM Manipulation", "React Basics", "State Management", "Routing"],
      duration: "4 weeks"
    },
    backend: {
      topics: ["REST APIs", "Middleware", "Authentication", "Database Integration", "Error Handling", "Deployment"],
      duration: "3 weeks"
    },
    devops: {
      topics: ["Docker Basics", "Container Deployment", "CI/CD Pipeline", "Cloud Platforms", "Monitoring"],
      duration: "2 weeks"
    }
  },
  Civil: {
    fundamentals: {
      topics: ["Structural Analysis", "RCC Design", "Steel Design", "Soil Mechanics", "Foundation Design"],
      duration: "4 weeks"
    },
    software: {
      topics: ["AutoCAD 2D/3D", "STAAD Pro Basics", "Analysis & Reporting", "Drawing Standards", "BIM Concepts"],
      duration: "3 weeks"
    },
    designPractice: {
      topics: ["Beam Design", "Column Design", "Slab Design", "Retaining Walls", "Bridge Design"],
      duration: "4 weeks"
    },
    sustainability: {
      topics: ["Green Building", "Energy Efficiency", "Material Selection", "Cost Optimization", "Quality Control"],
      duration: "2 weeks"
    },
    projects: {
      topics: ["Residential Projects", "Commercial Projects", "Infra Projects", "Documentation", "Supervision"],
      duration: "3 weeks"
    }
  },
  Mechanical: {
    coreThermodynamics: {
      topics: ["Laws of Thermodynamics", "Heat Transfer", "Combustion", "Power Cycles", "Refrigeration"],
      duration: "3 weeks"
    },
    mechanicsOfMaterials: {
      topics: ["Stress & Strain", "Properties of Materials", "Failure Theories", "Deflection", "Fatigue"],
      duration: "3 weeks"
    },
    machineDesign: {
      topics: ["Shaft Design", "Bearing Selection", "Gear Design", "Welding Joints", "Power Transmission"],
      duration: "4 weeks"
    },
    cad: {
      topics: ["SolidWorks Sketches", "Part Modeling", "Assembly Design", "Drawings", "Simulation Basics"],
      duration: "3 weeks"
    },
    manufacturing: {
      topics: ["Machining Processes", "CNC Programming", "Quality Control", "Process Planning", "Cost Analysis"],
      duration: "3 weeks"
    },
    projects: {
      topics: ["Design Project", "Simulation Analysis", "Manufacturing Plans", "Documentation", "Presentation"],
      duration: "2 weeks"
    }
  },
  MDS: {
    dataAnalytics: {
      topics: ["Excel Advanced", "SQL Fundamentals", "Data Visualization", "Statistical Analysis", "BI Tools"],
      duration: "3 weeks"
    },
    businessAnalysis: {
      topics: ["Requirements Gathering", "Process Optimization", "Market Analysis", "Business Cases", "Metrics"],
      duration: "2 weeks"
    },
    operationsManagement: {
      topics: ["Supply Chain Basics", "Inventory Management", "Demand Planning", "Logistics", "Procurement"],
      duration: "3 weeks"
    },
    financialAnalysis: {
      topics: ["Financial Statements", "Budgeting", "Cost Analysis", "ROI Calculation", "Forecasting"],
      duration: "2 weeks"
    },
    tools: {
      topics: ["SAP/Oracle Basics", "Salesforce Fundamentals", "ERP Implementation", "Cloud Tools", "Automation"],
      duration: "2 weeks"
    },
    projectManagement: {
      topics: ["Agile & Scrum", "Project Planning", "Risk Management", "Stakeholder Communication", "Leadership"],
      duration: "2 weeks"
    }
  }
};

const generateRoadmap = (missingSkills, stream = "CSE") => {
  const streamRoadmap = streamRoadmaps[stream] || streamRoadmaps.CSE;
  const lowerMissing = missingSkills.map(s => s.toLowerCase());
  
  const roadmap = {};
  let priorityOrder = 1;

  // Map missing skills to roadmap sections and prioritize
  for (const [section, content] of Object.entries(streamRoadmap)) {
    let relevanceScore = 0;
    
    // Check if any missing skill relates to this section
    for (const topic of content.topics) {
      const lowerTopic = topic.toLowerCase();
      for (const missing of lowerMissing) {
        if (lowerTopic.includes(missing) || missing.includes(lowerTopic.split(" ")[0])) {
          relevanceScore++;
        }
      }
    }

    // Include sections with missing skills or all sections if no match
    if (relevanceScore > 0 || missingSkills.length === 0) {
      roadmap[section] = {
        priority: relevanceScore > 0 ? priorityOrder++ : priorityOrder + 10,
        progress: 0,
        status: "not-started",
        duration: content.duration,
        topics: content.topics.map(topic => ({
          name: topic,
          status: "pending",
          resources: []
        }))
      };
    }
  }

  // If no relevant sections found, return full roadmap
  if (Object.keys(roadmap).length === 0) {
    for (const [section, content] of Object.entries(streamRoadmap)) {
      roadmap[section] = {
        priority: priorityOrder++,
        progress: 0,
        status: "not-started",
        duration: content.duration,
        topics: content.topics.map(topic => ({
          name: topic,
          status: "pending",
          resources: []
        }))
      };
    }
  }

  return roadmap;
};

module.exports = generateRoadmap;