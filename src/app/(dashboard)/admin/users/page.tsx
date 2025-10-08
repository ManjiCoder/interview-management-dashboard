import { getUsers, User } from '@/services/api';
import UserRoleManagement from '../components/UserRoleManagement';

export default async function CandidateManagementPage() {
  const data = await getUsers();
  const candidates = data.users.map((u: User) => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    company: u.company,
    role: ['ta_member', 'panelist'][u.id % 2],
    interviewStatus: ['Scheduled', 'Completed', 'No-show'][u.id % 3],
  }));

  return <UserRoleManagement users={candidates} />;
}
