export interface JobPortal {
  name: string;
  url: string;
  logo?: string;
}

export interface JobData {
  id: string;
  jobTitle: string;
  department: string;
  jobOverview: React.ReactNode;
  keyResponsibilities: React.ReactNode;
  qualificationsRequirement: React.ReactNode;
  jobPortals: JobPortal[];
}

export const jobListings: JobData[] = [
  {
    id: "production-manager-assembly-line-ev",
    jobTitle: "Production Manager (Assembly Line EV)",
    department: "Production",
    jobOverview: (
      <div>
        <p className="mb-4">
          Experienced Production Manager to oversee the entire production
          process, ensuring operations are efficient, high quality, and on time.
        </p>
        <p>
          This position will be responsible for production planning, team
          supervision, and quality and cost control.
        </p>
      </div>
    ),
    keyResponsibilities: (
      <ul className="list-disc list-inside space-y-2">
        <li>Plan, coordinate, and supervise daily production activities</li>
        <li>
          Ensure production targets are achieved according to quality and time
          standards
        </li>
        <li>
          Manage production teams, including work schedules, training, and
          performance evaluations
        </li>
        <li>
          Ensure efficient use of resources (raw materials, machines, labor)
        </li>
        <li>
          Collaborate with Quality Control, Maintenance, and Supply Chain teams
        </li>
        <li>
          Identify and implement process improvements (continuous improvement)
        </li>
        <li>
          Ensure occupational safety and cleanliness standards in production
          areas are met
        </li>
        <li>Prepare production reports and operational performance analysis</li>
      </ul>
    ),
    qualificationsRequirement: (
      <ul className="list-disc list-inside space-y-2">
        <li>
          Minimum education S1 Industrial Engineering or Mechanical Engineering
        </li>
        <li>
          Minimum 5 years experience in the field of 2-wheeled vehicle
          manufacturing
        </li>
        <li>
          Understand production systems, quality control, and HR management
        </li>
        <li>
          Able to read and understand SOPs, flow charts, and production planning
        </li>
        <li>Strong communication, leadership, and problem-solving skills</li>
        <li>
          Familiar with using ERP software / production systems is an added
          value
        </li>
        <li>Able to use English or Mandarin</li>
        <li>Have ISO certificates ISO 9001:2015 and ISO 14001:2015</li>
      </ul>
    ),
    jobPortals: [
      {
        name: "JobStreet",
        url: "https://id.jobstreet.com/id/job/89566578?ref=hirer-jobs-list",
      },
    ],
  },
];
