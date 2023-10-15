import Form from './Form';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function SignUp() {
  const session = await getServerSession();

  if (session) {
    redirect('/list');
  }

  return <Form />;
}
