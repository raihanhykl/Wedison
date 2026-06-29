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
  {
    id: "sales-manager-bandung-shop",
    jobTitle: "Sales Manager Bandung Shop",
    department: "Sales",
    jobOverview: (
      <div>
        <p className="mb-4">
          We are looking for an experienced Sales Manager to lead our Bandung
          shop operations and drive sales performance.
        </p>
        <p>
          This role is responsible for managing the sales team, achieving sales
          targets, and ensuring excellent customer experience at our Bandung
          location.
        </p>
      </div>
    ),
    keyResponsibilities: (
      <ul className="list-disc list-inside space-y-2">
        <li>Lead and manage the sales team at Bandung shop</li>
        <li>Develop and implement sales strategies to achieve targets</li>
        <li>Monitor and analyze sales performance metrics</li>
        <li>Train and mentor sales team members</li>
        <li>Build and maintain strong customer relationships</li>
        <li>Coordinate with marketing team for promotional activities</li>
        <li>Prepare sales reports and forecasts</li>
        <li>Ensure shop operations run smoothly and efficiently</li>
      </ul>
    ),
    qualificationsRequirement: (
      <ul className="list-disc list-inside space-y-2">
        <li>Minimum education S1 in any field</li>
        <li>Minimum 3 years experience in sales management</li>
        <li>Experience in automotive or EV industry is preferred</li>
        <li>Strong leadership and team management skills</li>
        <li>Excellent communication and negotiation skills</li>
        <li>Target-oriented with proven track record</li>
        <li>Based in or willing to relocate to Bandung</li>
      </ul>
    ),
    jobPortals: [],
  },
  {
    id: "sales-operations-supervisor",
    jobTitle: "Sales Operations Supervisor",
    department: "Sales",
    jobOverview: (
      <div>
        <p className="mb-4">
          We are seeking a Sales Operations Supervisor to optimize our sales
          processes and support the sales team in achieving their goals.
        </p>
        <p>
          This position will oversee sales operations, manage sales data, and
          ensure efficient workflows across the sales department.
        </p>
      </div>
    ),
    keyResponsibilities: (
      <ul className="list-disc list-inside space-y-2">
        <li>Supervise daily sales operations and administrative tasks</li>
        <li>Develop and implement sales processes and procedures</li>
        <li>Manage sales data, CRM systems, and reporting tools</li>
        <li>Analyze sales performance and generate insights</li>
        <li>Coordinate between sales team and other departments</li>
        <li>Ensure accurate and timely sales documentation</li>
        <li>Support sales team with tools and resources</li>
        <li>Identify and implement process improvements</li>
      </ul>
    ),
    qualificationsRequirement: (
      <ul className="list-disc list-inside space-y-2">
        <li>Minimum education S1 in Business Administration or related field</li>
        <li>Minimum 2 years experience in sales operations</li>
        <li>Proficient in CRM systems and Microsoft Office</li>
        <li>Strong analytical and problem-solving skills</li>
        <li>Excellent organizational and multitasking abilities</li>
        <li>Detail-oriented with strong data management skills</li>
        <li>Good communication and interpersonal skills</li>
      </ul>
    ),
    jobPortals: [],
  },
  {
    id: "sales-jakarta-bandung",
    jobTitle: "Sales (Jakarta dan Bandung)",
    department: "Sales",
    jobOverview: (
      <div>
        <p className="mb-4">
          We are hiring Sales representatives for our Jakarta and Bandung
          locations to promote and sell our electric vehicle products.
        </p>
        <p>
          This role involves direct customer engagement, product demonstrations,
          and achieving individual sales targets.
        </p>
      </div>
    ),
    keyResponsibilities: (
      <ul className="list-disc list-inside space-y-2">
        <li>Engage with potential customers and understand their needs</li>
        <li>Present and demonstrate EV products to customers</li>
        <li>Achieve individual and team sales targets</li>
        <li>Build and maintain customer relationships</li>
        <li>Follow up on leads and inquiries</li>
        <li>Process sales transactions accurately</li>
        <li>Stay updated on product knowledge and industry trends</li>
        <li>Provide excellent customer service experience</li>
      </ul>
    ),
    qualificationsRequirement: (
      <ul className="list-disc list-inside space-y-2">
        <li>Minimum education SMA/SMK or equivalent</li>
        <li>Experience in sales is preferred but fresh graduates are welcome</li>
        <li>Excellent communication and interpersonal skills</li>
        <li>Customer-oriented mindset</li>
        <li>Enthusiastic and self-motivated</li>
        <li>Able to work in a target-driven environment</li>
        <li>Based in Jakarta or Bandung</li>
      </ul>
    ),
    jobPortals: [],
  },
  {
    id: "admin-sales",
    jobTitle: "Admin Sales",
    department: "Sales",
    jobOverview: (
      <div>
        <p className="mb-4">
          We are looking for an Admin Sales to provide administrative support to
          the sales team and ensure smooth sales operations.
        </p>
        <p>
          This role involves handling sales documentation, data entry, and
          coordination with various stakeholders.
        </p>
      </div>
    ),
    keyResponsibilities: (
      <ul className="list-disc list-inside space-y-2">
        <li>Process and manage sales orders and documentation</li>
        <li>Maintain accurate sales records and databases</li>
        <li>Prepare sales reports and presentations</li>
        <li>Coordinate with logistics for order fulfillment</li>
        <li>Handle customer inquiries and correspondence</li>
        <li>Support sales team with administrative tasks</li>
        <li>Manage inventory tracking and updates</li>
        <li>Ensure timely and accurate data entry</li>
      </ul>
    ),
    qualificationsRequirement: (
      <ul className="list-disc list-inside space-y-2">
        <li>Minimum education D3/S1 in any field</li>
        <li>Minimum 1 year experience in administrative role</li>
        <li>Proficient in Microsoft Office (Excel, Word)</li>
        <li>Strong attention to detail and accuracy</li>
        <li>Good organizational and time management skills</li>
        <li>Excellent written and verbal communication</li>
        <li>Able to work independently and in a team</li>
      </ul>
    ),
    jobPortals: [],
  },
  {
    id: "social-media-specialist",
    jobTitle: "Social Media Specialist",
    department: "Marketing",
    jobOverview: (
      <div>
        <p className="mb-4">
          We are seeking a creative Social Media Specialist to manage our social
          media presence and grow our online community.
        </p>
        <p>
          This role involves developing social media strategies, creating
          engaging content, and analyzing performance metrics.
        </p>
      </div>
    ),
    keyResponsibilities: (
      <ul className="list-disc list-inside space-y-2">
        <li>Develop and execute social media strategies</li>
        <li>Create and curate engaging content for various platforms</li>
        <li>Manage daily posting and community engagement</li>
        <li>Monitor social media trends and competitor activities</li>
        <li>Analyze and report on social media performance</li>
        <li>Collaborate with content creators and marketing team</li>
        <li>Respond to comments and messages professionally</li>
        <li>Plan and execute social media campaigns</li>
      </ul>
    ),
    qualificationsRequirement: (
      <ul className="list-disc list-inside space-y-2">
        <li>Minimum education S1 in Marketing, Communications, or related field</li>
        <li>Minimum 2 years experience in social media management</li>
        <li>Proficient in social media platforms and tools</li>
        <li>Strong copywriting and content creation skills</li>
        <li>Understanding of social media analytics</li>
        <li>Creative thinking and trend awareness</li>
        <li>Excellent communication skills in Indonesian and English</li>
      </ul>
    ),
    jobPortals: [],
  },
  {
    id: "content-creator",
    jobTitle: "Content Creator",
    department: "Marketing",
    jobOverview: (
      <div>
        <p className="mb-4">
          We are looking for a talented Content Creator to produce engaging
          visual and written content for our marketing channels.
        </p>
        <p>
          This role involves creating videos, photos, and graphics that showcase
          our EV products and brand story.
        </p>
      </div>
    ),
    keyResponsibilities: (
      <ul className="list-disc list-inside space-y-2">
        <li>Create engaging video content for social media and marketing</li>
        <li>Produce high-quality photos and graphics</li>
        <li>Develop creative concepts and storylines</li>
        <li>Edit and post-produce video and photo content</li>
        <li>Collaborate with marketing team on campaigns</li>
        <li>Stay updated on content trends and best practices</li>
        <li>Manage content calendar and deadlines</li>
        <li>Maintain brand consistency across all content</li>
      </ul>
    ),
    qualificationsRequirement: (
      <ul className="list-disc list-inside space-y-2">
        <li>Minimum education S1 in any field</li>
        <li>Minimum 1 year experience in content creation</li>
        <li>Proficient in video editing software (Premiere, Final Cut, etc.)</li>
        <li>Experience with photography and photo editing</li>
        <li>Strong creative and storytelling skills</li>
        <li>Portfolio showcasing previous work</li>
        <li>Ability to work under tight deadlines</li>
        <li>Interest in EV and automotive industry is a plus</li>
      </ul>
    ),
    jobPortals: [],
  },
  {
    id: "customer-support",
    jobTitle: "Customer Support",
    department: "Operations",
    jobOverview: (
      <div>
        <p className="mb-4">
          We are hiring Customer Support representatives to provide excellent
          service and support to our customers.
        </p>
        <p>
          This role involves handling customer inquiries, resolving issues, and
          ensuring customer satisfaction.
        </p>
      </div>
    ),
    keyResponsibilities: (
      <ul className="list-disc list-inside space-y-2">
        <li>Handle customer inquiries via phone, email, and chat</li>
        <li>Resolve customer complaints and issues promptly</li>
        <li>Provide product information and guidance to customers</li>
        <li>Process service requests and follow up on cases</li>
        <li>Maintain accurate records of customer interactions</li>
        <li>Escalate complex issues to appropriate teams</li>
        <li>Gather customer feedback for improvement</li>
        <li>Ensure high customer satisfaction scores</li>
      </ul>
    ),
    qualificationsRequirement: (
      <ul className="list-disc list-inside space-y-2">
        <li>Minimum education SMA/SMK or equivalent</li>
        <li>Experience in customer service is preferred</li>
        <li>Excellent communication and listening skills</li>
        <li>Patient and empathetic demeanor</li>
        <li>Problem-solving abilities</li>
        <li>Proficient in basic computer applications</li>
        <li>Able to work in shifts if required</li>
        <li>Fluent in Indonesian, English is a plus</li>
      </ul>
    ),
    jobPortals: [],
  },
  {
    id: "admin",
    jobTitle: "Admin",
    department: "Operations",
    jobOverview: (
      <div>
        <p className="mb-4">
          We are looking for an Admin to support daily office operations and
          administrative tasks.
        </p>
        <p>
          This role involves general administrative duties, document management,
          and coordination across departments.
        </p>
      </div>
    ),
    keyResponsibilities: (
      <ul className="list-disc list-inside space-y-2">
        <li>Handle general administrative tasks and correspondence</li>
        <li>Manage documents, filing, and record keeping</li>
        <li>Coordinate meetings and schedules</li>
        <li>Process invoices and expense reports</li>
        <li>Maintain office supplies and inventory</li>
        <li>Support various departments with administrative needs</li>
        <li>Handle incoming calls and visitors</li>
        <li>Assist with data entry and reporting</li>
      </ul>
    ),
    qualificationsRequirement: (
      <ul className="list-disc list-inside space-y-2">
        <li>Minimum education D3/S1 in any field</li>
        <li>Minimum 1 year experience in administrative role</li>
        <li>Proficient in Microsoft Office</li>
        <li>Strong organizational skills</li>
        <li>Attention to detail and accuracy</li>
        <li>Good communication skills</li>
        <li>Able to multitask and prioritize work</li>
        <li>Professional and reliable</li>
      </ul>
    ),
    jobPortals: [],
  },
  {
    id: "ev-technician-service-center",
    jobTitle: "EV Technician for Service Center",
    department: "Service",
    jobOverview: (
      <div>
        <p className="mb-4">
          We are seeking skilled EV Technicians to join our service center team
          and maintain our electric vehicles.
        </p>
        <p>
          This role involves diagnosing, repairing, and servicing electric
          vehicles to ensure optimal performance and customer satisfaction.
        </p>
      </div>
    ),
    keyResponsibilities: (
      <ul className="list-disc list-inside space-y-2">
        <li>Diagnose and troubleshoot EV electrical and mechanical issues</li>
        <li>Perform routine maintenance and repairs on electric vehicles</li>
        <li>Handle battery systems, motors, and charging components</li>
        <li>Use diagnostic tools and equipment effectively</li>
        <li>Document service work and maintain records</li>
        <li>Follow safety protocols for high-voltage systems</li>
        <li>Provide technical guidance to customers when needed</li>
        <li>Stay updated on EV technology and service procedures</li>
      </ul>
    ),
    qualificationsRequirement: (
      <ul className="list-disc list-inside space-y-2">
        <li>Minimum education SMK in Automotive or Electrical Engineering</li>
        <li>Experience in vehicle maintenance, EV experience is a plus</li>
        <li>Knowledge of electrical systems and components</li>
        <li>Familiar with diagnostic tools and equipment</li>
        <li>Understanding of safety procedures for high-voltage systems</li>
        <li>Good problem-solving and analytical skills</li>
        <li>Willing to learn and adapt to new technologies</li>
        <li>Valid driving license is preferred</li>
      </ul>
    ),
    jobPortals: [],
  },
];
