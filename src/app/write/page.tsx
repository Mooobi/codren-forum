import { getServerSession } from 'next-auth';
import Form from './Form';
import { redirect } from 'next/navigation';

export default function Write() {
  const session = getServerSession();

  if (!session) {
    redirect('/list');
  }

  return <Form />;
}
