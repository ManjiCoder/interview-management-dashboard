import CandidateDetail from '@/components/CandidateDetail';
import { getPostsByUser, getTodosByUser, getUserById } from '@/services/api';
import { notFound } from 'next/navigation';

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (isNaN(Number(id))) {
    return notFound();
  }

  const userId = parseInt(id, 10);

  const user = await getUserById(userId);
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
