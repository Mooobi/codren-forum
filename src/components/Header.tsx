import { getServerSession } from 'next-auth';
import InnerHeader from './InnerHeader';

export default async function Header() {
  const session = await getServerSession();
  console.log('session', session);

  return <InnerHeader session={session} />;
}
