import { notFound } from 'next/navigation';

/** Any unknown path inside a language shows that language's 404. */
export default function CatchAll() {
  notFound();
}
