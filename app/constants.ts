import {Course, PaymentAccount} from "../schemas/validationSchemas";


export const UPLOAD_SIZE_LIMIT = 5 * 1024 * 1024;

export const sampleCourse: Course = {
    id: '1',
    title: 'Full Stack Web Development Bootcamp',
    description: 'Master modern web development with React, Node.js, and database technologies. This comprehensive course will take you from beginner to professional developer.',
    duration: '12 weeks',
    level: 'Beginner to Advanced',
    price: 1299,
    features: [
      'Live instructor-led sessions',
      'Hands-on projects',
      'Career support',
      'Certificate of completion',
      'Lifetime access to materials',
      '1-on-1 mentorship'
    ],
    curriculum: [
      'HTML, CSS, and JavaScript Fundamentals',
      'React.js and Modern Frontend Development',
      'Node.js and Express.js Backend',
      'Database Design with MongoDB/PostgreSQL',
      'API Development and Integration',
      'Authentication and Security',
      'Deployment and DevOps',
      'Final Capstone Project'
    ]
  };
  
  export const paymentAccounts: PaymentAccount[] = [
    {
      id: '1',
      name: 'Success Academy Bank Account',
      accountNumber: '1234567890',
      bankName: 'Commercial Bank of Ethiopia',
      type: 'bank'
    },
    {
      id: '2',
      name: 'Mobile Money - Telebirr',
      accountNumber: '+251912345678',
      bankName: 'Telebirr',
      type: 'mobile'
    },
    {
      id: '3',
      name: 'Mobile Money - M-Birr',
      accountNumber: '+251923456789',
      bankName: 'M-Birr',
      type: 'mobile'
    }
  ];
  