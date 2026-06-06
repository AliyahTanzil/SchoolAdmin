import React from 'react'
import RoleDashboardLayout from './RoleDashboardLayout'

export default function FinanceDashboard({ navigation }) {
  return (
    <RoleDashboardLayout
      navigation={navigation}
      accent="#2f235f"
      hero={{
        kicker: 'Finance Office',
        title: 'Fees, payroll, and school money movement',
        description: 'Track collections, balances, payroll readiness, expenses, and finance exceptions from one focused view.',
        cardLabel: 'Collection Priority',
        cardTitle: '126 student balances need follow-up',
        cardText: 'Focus first on accounts with overdue balances and active payment-plan commitments.'
      }}
      stats={[
        { label: 'Fees Collected', value: '$184k', hint: '82% of term target', color: '#2563eb' },
        { label: 'Outstanding Balance', value: '$39k', hint: '126 student accounts', color: '#d97706' },
        { label: 'Payroll Ready', value: '96%', hint: '4 approvals pending', color: '#059669' },
        { label: 'Expenses This Month', value: '$18.7k', hint: 'Within operating plan', color: '#7c3aed' }
      ]}
      actions={[
        { screen: 'StudentList', title: 'Student Accounts', description: 'Review balances, sponsorships, and payment status.' },
        { screen: 'TeacherList', title: 'Payroll Records', description: 'Check staff payroll readiness and teacher records.' },
        { screen: 'AdminDashboard', title: 'Admin Review', description: 'Escalate exceptions to the administrator dashboard.' },
        { screen: 'Attendance', title: 'Attendance Audit', description: 'Use attendance context before fee follow-up.' }
      ]}
      alerts={[
        { title: 'Payment Plans Due', detail: '18 accounts need payment-plan confirmation.' },
        { title: 'Payroll Exceptions', detail: '4 teacher records require finance approval.' },
        { title: 'Transport Fees', detail: 'Route B collections are 12% behind plan.' }
      ]}
      meters={[
        { label: 'Tuition', value: '84%' },
        { label: 'Transport', value: '71%' },
        { label: 'Boarding', value: '89%' }
      ]}
      notes={[
        'Projected month-end collection: $212k',
        'Highest outstanding class group: Grade 11',
        'Next payroll run: June 28, 2026'
      ]}
    />
  )
}
