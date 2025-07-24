import Sidebar from '../components/Sidebar';
import InitialForm from '../components/InitialForm';

export default function Home() {
  return (
    <div className="flex h-screen mx-auto bg-white max-h-screen">
      <Sidebar />
      <InitialForm />
    </div>
  );
}