import CandidateManagementTable from '@/components/CandidateManagmentTable';
import { getUsers, User } from '@/services/api';

export default async function CandidateManagementPage() {
  const data = await getUsers();
  const candidates = data.users.map((u: User) => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    company: u.company,
    role: ['Frontend', 'Backend', 'Fullstack'][u.id % 3],
    interviewStatus: ['Scheduled', 'Completed', 'No-show'][u.id % 3],
  }));

  return <CandidateManagementTable users={candidates} />;
}
