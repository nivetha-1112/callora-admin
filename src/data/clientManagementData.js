// Rich mock data for Telecaller Client Management Module

export const clientLocations = ['Noida', 'Gurgaon', 'Delhi', 'Chennai', 'Mumbai', 'Bangalore', 'Kolkata', 'Hyderabad'];
export const clientSources = ['Expo-based', 'Website Landing Page', 'Direct Referral', 'Social Media Campaign', 'Google Ads', 'Inbound Call'];
export const clientStatuses = ['New Lead', 'Contacted', 'Interested', 'Follow-up Scheduled', 'Not Interested', 'Converted'];

export const mockClients = [
  // TC001 Priya Sharma
  {
    id: 'CLI101',
    telecallerId: 'TC001',
    clientName: 'Suresh Gupta',
    mobileNumber: '+91 88776 55401',
    email: 'suresh.gupta@gmail.com',
    location: 'Noida',
    assignedDate: '2026-06-24',
    currentStatus: 'Interested',
    lastFollowUpDate: '2026-06-27'
  },
  {
    id: 'CLI102',
    telecallerId: 'TC001',
    clientName: 'Meena Devi',
    mobileNumber: '+91 88776 55402',
    email: 'meena.devi@yahoo.com',
    location: 'Gurgaon',
    source: 'Website Landing Page',
    assignedDate: '2026-06-24',
    currentStatus: 'Not Interested',
    lastFollowUpDate: '2026-06-26'
  },
  {
    id: 'CLI103',
    telecallerId: 'TC001',
    clientName: 'Ramesh Iyer',
    mobileNumber: '+91 88776 55403',
    email: 'ramesh.iyer@outlook.com',
    location: 'Delhi',
    source: 'Direct Referral',
    assignedDate: '2026-06-24',
    currentStatus: 'Converted',
    lastFollowUpDate: '2026-06-27'
  },
  {
    id: 'CLI104',
    telecallerId: 'TC001',
    clientName: 'Kavita Singh',
    mobileNumber: '+91 88776 55404',
    email: 'kavita.singh@gmail.com',
    location: 'Noida',
    source: 'Google Ads',
    assignedDate: '2026-06-25',
    currentStatus: '',
    lastFollowUpDate: '2026-06-27'
  },
  {
    id: 'CLI105',
    telecallerId: 'TC001',
    clientName: 'Arjun Nair',
    mobileNumber: '+91 88776 55405',
    email: 'arjun.nair@hotmail.com',
    location: 'Gurgaon',
    source: 'Social Media Campaign',
    assignedDate: '2026-06-25',
    currentStatus: 'Follow-up Scheduled',
    lastFollowUpDate: '2026-06-28'
  },

  // TC002 Amit Kumar
  {
    id: 'CLI106',
    telecallerId: 'TC002',
    clientName: 'Raj Kumar',
    mobileNumber: '+91 88776 55406',
    email: 'raj.kumar@gmail.com',
    location: 'Noida',
    assignedDate: '2026-06-24',
    currentStatus: 'Interested',
    lastFollowUpDate: '2026-06-27'
  },
  {
    id: 'CLI107',
    telecallerId: 'TC002',
    clientName: 'Deepak Singh',
    mobileNumber: '+91 88776 55407',
    email: 'deepak.singh@outlook.com',
    location: 'Gurgaon',
    source: 'Google Ads',
    assignedDate: '2026-06-24',
    currentStatus: 'Follow-up Scheduled',
    lastFollowUpDate: '2026-06-27'
  },
  {
    id: 'CLI108',
    telecallerId: 'TC002',
    clientName: 'Kavya Sharma',
    mobileNumber: '+91 88776 55408',
    email: 'kavya.sharma@yahoo.com',
    location: 'Noida',
    source: 'Website Landing Page',
    assignedDate: '2026-06-25',
    currentStatus: 'Interested',
    lastFollowUpDate: '2026-06-27'
  },

  // TC003 Sneha Reddy
  {
    id: 'CLI109',
    telecallerId: 'TC003',
    clientName: 'Amit Verma',
    mobileNumber: '+91 88776 55409',
    email: 'amit.verma@gmail.com',
    location: 'Delhi',
    source: 'Social Media Campaign',
    assignedDate: '2026-06-22',
    currentStatus: 'Converted',
    lastFollowUpDate: '2026-06-26'
  },
  {
    id: 'CLI110',
    telecallerId: 'TC003',
    clientName: 'Neha Gupta',
    mobileNumber: '+91 88776 55410',
    email: 'neha.gupta@yahoo.com',
    location: 'Mumbai',
    source: 'Inbound Call',
    assignedDate: '2026-06-23',
    currentStatus: 'Follow-up Scheduled',
    lastFollowUpDate: '2026-06-28'
  },

  // Add default mock clients for other telecallers dynamically if requested, or statically
  // Statically define a few more to make sure list pages are never empty
  {
    id: 'CLI111',
    telecallerId: 'TC004',
    clientName: 'Vijay Kumar',
    mobileNumber: '+91 88776 55411',
    email: 'vijay.k@gmail.com',
    location: 'Chennai',
    assignedDate: '2026-06-20',
    currentStatus: 'Interested',
    lastFollowUpDate: '2026-06-25'
  },
  {
    id: 'CLI112',
    telecallerId: 'TC005',
    clientName: 'Sanjay Joshi',
    mobileNumber: '+91 88776 55412',
    email: 'sanjay.j@gmail.com',
    location: 'Bangalore',
    source: 'Website Landing Page',
    assignedDate: '2026-06-21',
    currentStatus: 'New Lead',
    lastFollowUpDate: '2026-06-22'
  },
  {
    id: 'CLI113',
    telecallerId: 'TC006',
    clientName: 'Kirti Sen',
    mobileNumber: '+91 88776 55413',
    email: 'kirti.sen@yahoo.com',
    location: 'Kolkata',
    source: 'Direct Referral',
    assignedDate: '2026-06-18',
    currentStatus: 'Not Interested',
    lastFollowUpDate: '2026-06-20'
  },
  {
    id: 'CLI114',
    telecallerId: 'TC007',
    clientName: 'Preeti Deshmukh',
    mobileNumber: '+91 88776 55414',
    email: 'preeti.d@gmail.com',
    location: 'Mumbai',
    source: 'Google Ads',
    assignedDate: '2026-06-19',
    currentStatus: 'Converted',
    lastFollowUpDate: '2026-06-24'
  },
  {
    id: 'CLI115',
    telecallerId: 'TC006',
    clientName: 'Sunita Rao',
    mobileNumber: '+91 88776 55406',
    email: 'sunita.rao@gmail.com',
    location: 'Delhi',
    source: 'Inbound Call',
    assignedDate: '2026-06-25',
    currentStatus: 'Interested',
    lastFollowUpDate: '2026-06-25'
  }
];

// Map of client ID to status timeline logs
export const mockTimelines = {
  'CLI101': [
    { status: 'New Lead', updatedBy: 'System Bulk Upload', date: '24-Jun-2026', time: '09:15 AM', remarks: 'Imported via CSV file' },
    { status: 'Contacted', updatedBy: 'Priya Sharma', date: '25-Jun-2026', time: '10:30 AM', remarks: 'First introductory call. Client was busy, requested callback.' },
    { status: 'Interested', updatedBy: 'Priya Sharma', date: '27-Jun-2026', time: '04:12 PM', remarks: 'Detailed discussion. Interested in Premium Admin Package.' }
  ],
  'CLI102': [
    { status: 'New Lead', updatedBy: 'System Bulk Upload', date: '24-Jun-2026', time: '09:15 AM', remarks: 'Imported via CSV file' },
    { status: 'Contacted', updatedBy: 'Priya Sharma', date: '26-Jun-2026', time: '02:15 PM', remarks: 'Client rejected proposal. Prefers self-hosted solution.' },
    { status: 'Not Interested', updatedBy: 'Priya Sharma', date: '26-Jun-2026', time: '02:17 PM', remarks: 'Marked as Not Interested.' }
  ],
  'CLI103': [
    { status: 'New Lead', updatedBy: 'System Bulk Upload', date: '24-Jun-2026', time: '09:15 AM', remarks: 'Imported via CSV file' },
    { status: 'Contacted', updatedBy: 'Priya Sharma', date: '25-Jun-2026', time: '11:00 AM', remarks: 'Shared product proposal.' },
    { status: 'Interested', updatedBy: 'Priya Sharma', date: '26-Jun-2026', time: '03:30 PM', remarks: 'Client requested invoice for yearly subscription.' },
    { status: 'Converted', updatedBy: 'Priya Sharma', date: '27-Jun-2026', time: '10:00 AM', remarks: 'Payment received. Account activated.' }
  ],
  'CLI104': [
    { status: 'New Lead', updatedBy: 'System Bulk Upload', date: '25-Jun-2026', time: '11:45 AM', remarks: 'Imported via Google Lead Form' }
  ],
  'CLI105': [
    { status: 'New Lead', updatedBy: 'System Bulk Upload', date: '25-Jun-2026', time: '11:45 AM', remarks: 'Imported via Facebook Ads' },
    { status: 'Contacted', updatedBy: 'Priya Sharma', date: '26-Jun-2026', time: '03:20 PM', remarks: 'Spoke briefly. Requested proposal on WhatsApp.' },
    { status: 'Follow-up Scheduled', updatedBy: 'Priya Sharma', date: '28-Jun-2026', time: '11:00 AM', remarks: 'Follow-up scheduled to review details.' }
  ],
  'CLI106': [
    { status: 'Lead Received', updatedBy: 'System Bulk Upload', date: '24-Jun-2026', time: '09:20 AM', remarks: 'Imported via CSV file' },
    { status: 'Contacted', updatedBy: 'Amit Kumar', date: '25-Jun-2026', time: '12:10 PM', remarks: 'Brief discussion about requirements.' },
    { status: 'Interested', updatedBy: 'Amit Kumar', date: '27-Jun-2026', time: '03:15 PM', remarks: 'Wants a customized quotation.' },
    { status: 'Follow Up', updatedBy: 'Amit Kumar', date: '28-Jun-2026', time: '10:30 AM', remarks: 'Followed up to check if they reviewed the details.' },
    { status: 'Callback Requested', updatedBy: 'Amit Kumar', date: '29-Jun-2026', time: '11:45 AM', remarks: 'Client requested a callback after meeting with the VP.' },
    { status: 'Contacted', updatedBy: 'Amit Kumar', date: '30-Jun-2026', time: '02:00 PM', remarks: 'Discussed pricing customizations.' },
    { status: 'Converted', updatedBy: 'Amit Kumar', date: '01-Jul-2026', time: '04:30 PM', remarks: 'Payment confirmed. Subscriptions activated.' }
  ]
};

// Map of client ID to call history logs
export const mockCallHistory = {
  'CLI101': [
    { date: '25-Jun-2026', time: '10:30 AM', duration: '01:15', telecallerName: 'Priya Sharma', outcome: 'Contacted', notes: 'Client was traveling. Requested callback on Saturday.' },
    { date: '27-Jun-2026', time: '04:12 PM', duration: '05:12', telecallerName: 'Priya Sharma', outcome: 'Interested', notes: 'Explained package features. Client requested pricing details via email.' }
  ],
  'CLI102': [
    { date: '26-Jun-2026', time: '02:15 PM', duration: '02:15', telecallerName: 'Priya Sharma', outcome: 'Not Interested', notes: 'Not interested in cloud plans. Prefers a local offline setup.' }
  ],
  'CLI103': [
    { date: '25-Jun-2026', time: '11:00 AM', duration: '04:15', telecallerName: 'Priya Sharma', outcome: 'Contacted', notes: 'Spoke with IT manager. They are interested in a demo.' },
    { date: '26-Jun-2026', time: '03:30 PM', duration: '06:48', telecallerName: 'Priya Sharma', outcome: 'Interested', notes: 'Client confirmed subscription details. Sent payment invoice link.' },
    { date: '27-Jun-2026', time: '10:00 AM', duration: '01:30', telecallerName: 'Priya Sharma', outcome: 'Converted', notes: 'Followed up on payment. Payment verified successfully.' }
  ],
  'CLI105': [
    { date: '26-Jun-2026', time: '03:20 PM', duration: '03:20', telecallerName: 'Priya Sharma', outcome: 'Follow-up Required', notes: 'Shared link of catalog on WhatsApp. Need to follow up.' }
  ],
  'CLI106': [
    { date: '25-Jun-2026', time: '12:10 PM', duration: '02:40', telecallerName: 'Amit Kumar', outcome: 'Contacted', notes: 'Initial screening. Client matches target criteria.' },
    { date: '27-Jun-2026', time: '03:15 PM', duration: '05:30', telecallerName: 'Amit Kumar', outcome: 'Interested', notes: 'Detailed discussion. Client asked for customization options. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
    { date: '28-Jun-2026', time: '10:30 AM', duration: '01:45', telecallerName: 'Amit Kumar', outcome: 'Follow Up', notes: 'Shared pricing quote. Client said they will review and respond tomorrow.' },
    { date: '29-Jun-2026', time: '11:45 AM', duration: '03:10', telecallerName: 'Amit Kumar', outcome: 'Callback Requested', notes: 'Client asked to reschedule the call to discuss discount options.' },
    { date: '01-Jul-2026', time: '04:30 PM', duration: '04:15', telecallerName: 'Amit Kumar', outcome: 'Converted', notes: 'Finalized deal terms. Discount approved. Client processed payment.' }
  ]
};

// Map of client ID to call recordings
export const mockRecordings = {
  'CLI101': [
    { name: 'Recording_CLI101_25062026.mp3', date: '25-Jun-2026', duration: '01:15' },
    { name: 'Recording_CLI101_27062026.mp3', date: '27-Jun-2026', duration: '05:12' }
  ],
  'CLI102': [
    { name: 'Recording_CLI102_26062026.mp3', date: '26-Jun-2026', duration: '02:15' }
  ],
  'CLI103': [
    { name: 'Recording_CLI103_25062026.mp3', date: '25-Jun-2026', duration: '04:15' },
    { name: 'Recording_CLI103_26062026.mp3', date: '26-Jun-2026', duration: '06:48' }
  ],
  'CLI105': [
    { name: 'Recording_CLI105_26062026.mp3', date: '26-Jun-2026', duration: '03:20' }
  ],
  'CLI106': [
    { name: 'Recording_CLI106_25062026.mp3', date: '25-Jun-2026', duration: '02:40' },
    { name: 'Recording_CLI106_27062026.mp3', date: '27-Jun-2026', duration: '05:30' },
    { name: 'Recording_CLI106_28062026.mp3', date: '28-Jun-2026', duration: '01:45' },
    { name: 'Recording_CLI106_29062026.mp3', date: '29-Jun-2026', duration: '03:10' },
    { name: 'Recording_CLI106_01072026.mp3', date: '01-Jul-2026', duration: '04:15' }
  ]
};
