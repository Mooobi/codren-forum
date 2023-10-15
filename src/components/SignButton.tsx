import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import Button from './Button';

export default function SignButton({ session }: { session: Session | null }) {
  return (
    <Button
      background='#618856'
      color='white'
      onClick={() => {
        session ? signOut() : signIn();
      }}
    >
      {session ? 'SignOut' : 'SignIn'}
    </Button>
  );
}
