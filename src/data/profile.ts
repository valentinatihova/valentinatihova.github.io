export const profile = {
  name: "Valentina Tihova",
  title: "Senior Data & MarTech Engineer",
  about: "Senior Data & MarTech Engineer, 8+ years. I've shipped and run data pipelines, real-time decisioning, reporting, and customer lifecycle work in fintech, retail, and telecom. Day to day: turn requirements into something deployable, then keep it testable and observable. Recent work includes 15+ analytics builds for a large bank and migrating five marketing flows off a legacy CRM to a new stack.",
  email: "valentina.tikhova1@gmail.com",
  location: "Valencia, Spain",
  hiringContext: "Remote in Europe",
  workAuthorization: "EU work authorized",
  telegram: {
    handle: "@Tihova_Valentina",
    url: "https://t.me/Tihova_Valentina"
  },
  socials: {
    linkedin: "https://www.linkedin.com/in/valentina-tihova/",
    github: "https://github.com/valentinatihova"
  },
  experience: [
    {
      company: "T1A",
      role: "Senior CLM Solutions Consultant",
      period: "Jan 2025 – Present",
      description: "Customer lifecycle, decisioning, and reporting for telecom and banking clients—integrations, live campaign logic, and cloud reporting.",
      achievements: [
        "Designed integrations between decisioning, reporting, and customer data layers to support more scalable personalization and operational visibility.",
        "Configured real-time campaign logic and validation flows in SAS RTDM for production decisioning and activation.",
        "Cloud reporting on Azure, Databricks, and Power BI for monitoring and standard stakeholder packs.",
        "Rolled out Salesforce Data Cloud and SFMC for a bank: unified profiles and lifecycle use cases across channels."
      ],
      tools: ["SAS RTDM", "Azure Databricks", "Power BI", "Salesforce Data Cloud", "SFMC", "SQL"]
    },
    {
      company: "GlowByte Consulting",
      role: "Lead Data Analyst",
      period: "Dec 2022 – Dec 2024",
      description: "Led migration from SAS RTDM to CM Ocean and owned QA, monitoring, and delivery across fintech and martech projects.",
      achievements: [
        "Migrated marketing campaigns, customer segments, and underlying data (Oracle to Postgres and Tarantool) to CM Ocean over 6 months — 5 complex flows fully re-implemented on the new stack.",
        "Built Kafka topic monitoring for campaign triggers: tracked input parameter consumption, detected failures, and automated campaign restarts via a custom API module.",
        "Automated functional and load testing, replacing manual execution with structured frameworks.",
        "Built team onboarding infrastructure — internal Wiki and Telegram knowledge hub."
      ],
      tools: ["Apache Airflow", "Python", "Docker", "Kubernetes", "Kafka", "ETL", "Pandas", "Scikit-learn", "SQL", "A/B Testing"]
    },
    {
      company: "GlowByte Consulting",
      role: "Data Analyst",
      period: "Oct 2020 – Dec 2022",
      description: "Delivered marketing decisioning cases in SAS RTDM and SAS MA for one of Russia's largest banks, and built the testing infrastructure around them.",
      achievements: [
        "Implemented 15+ marketing cases — offer recalculation, card issuance, installment products, and transactional triggers — from campaign brief to production.",
        "Replaced manual log-based testing with SoapUI and Postman automation, running multiple scenarios in parallel with structured output.",
        "Extended test coverage to load simulation, verifying system stability under campaign traffic."
      ],
      tools: ["Python", "Pandas", "Scikit-learn", "SQL", "Apache Airflow", "A/B Testing"]
    },
    {
      company: "KORUS Consulting",
      role: "Data Analyst",
      period: "Jun 2018 – Oct 2020",
      description: "Implemented retail planning systems for food and fashion clients across Russia and Europe — automating workflows that previously ran in Excel.",
      achievements: [
        "Implemented Oracle Hyperion for a major food retailer, replacing manual Excel consolidation and adding new planning dimensions for their first online sales channel.",
        "Led TXT Retail implementation for a large fashion retailer from scratch — automated seasonal merchandise planning, markdown calculations, and assortment metrics.",
        "Delivered Armonica Retail for a European fashion e-tailer — seasonal financial planning from strategic targets to buyer plans with multi-level drill-down for merchandising teams.",
        "Built plan vs actual dashboards in Power BI and Tableau with Python, giving buyers and merchants a unified view across planning horizons.",
        "Prepared solution documentation and led UAT sessions with 25+ users."
      ],
      tools: ["Oracle Hyperion", "Power BI", "Tableau", "Python", "SQL"]
    },
    {
      company: "Sberbank",
      role: "Finance Analyst",
      period: "Dec 2015 – May 2018",
      description: "Automated 10+ reporting forms, reducing manual errors and significantly speeding up data collection processes.",
      achievements: [
        "Developed validation forms for the accounting system, ensuring IFRS compliance and data completeness."
      ],
      tools: ["VBA", "Excel", "SQL", "Financial Modeling"]
    }
  ],
  education: [
    {
      degree: "Bachelor of Engineering - BE, Computer Programming",
      school: "Peter the Great St. Petersburg Polytechnic University",
      period: "Sep 2019 – Mar 2021"
    },
    {
      degree: "Master of Economics",
      school: "Tula State University",
      period: "2011 – 2017"
    }
  ],
  certifications: [
    {
      name: "Data Visualisation and Introduction to BI-Tools",
      issuer: "Yandex Practicum",
      date: "Sep 2024",
      details: "Dashboard layout, common UX patterns, and custom charts in Tableau, DataLens, and Datawrapper.",
      previewUrl: "/certificates/cert-datavis-bi-2024.pdf"
    },
    {
      name: "Data Analyst",
      issuer: "Yandex Practicum",
      date: "Jan 2020",
      details: "Python, preprocessing, EDA, statistical analysis, data collection & storage, business analytics, data-driven decisions, data storytelling, automation, forecasting, and an independent graduation project. 240 hours total.",
      previewUrl: "/certificates/cert-da-2020.pdf"
    }
  ],
};
