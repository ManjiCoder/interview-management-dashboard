// app/candidates/[id]/page.tsx
import CandidateDetail from '@/components/CandidateDetail';
import { getPostsByUser, getTodosByUser, getUsers } from '@/services/api';

export default async function CandidateDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = parseInt(params.id);

  const { users } = await getUsers(); // Or fetch single user via `/users/${id}`
  const user = users.find((u) => u.id === userId);
  if (!user) return <div>User not found</div>;

  const todosData = await getTodosByUser(userId);
  const postsData = await getPostsByUser(userId);

  return (
    <CandidateDetail
      user={user}
      todos={todosData.todos}
      feedback={postsData.posts}
    />
  );
}
