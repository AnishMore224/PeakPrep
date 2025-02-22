import { ProfileView } from '../components/ProfileView';
import { DocumentSection } from '../components/DocumentSection.tsx';
import { useUIContext } from "../contexts/ui.context.tsx";
import { useAuth } from '../contexts/auth.context.tsx';
import { useDocument } from '../contexts/document.context.tsx';

export function Profile() {
  const { isSidebarVisible } = useUIContext();
  const { user } = useAuth();
  const { documents } = useDocument();
  return (
    <div className={`flex-1 bg-gray-50 transition-all duration-300 ${
      isSidebarVisible ? "md:ml-64 ml-0" : "md:ml-20 ml-0"
    }`}>
      <main className="flex-1 sm:p-8 py-8 px-4">
        <h1 className="text-4xl font-bold mb-8">Profile</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProfileView user={user}/>
          {
            user?.role === 'student' ? (
          
          <div className="space-y-8">
            <DocumentSection 
              title="Documents" 
              documents={documents}
              showUpload
            />
          </div>)
          : user?.role === 'admin' ? (
            <div className="space-y-8">
              <DocumentSection 
                title="Documents" 
                documents={documents}
                showUpload
              />
            </div>)
          : user?.role === 'hr' ? (
            <div className="space-y-8">
              <DocumentSection 
                title="Documents" 
                documents={documents}
                showUpload
              />
            </div>)
          : null
          }
        </div>
      </main>
    </div>
  );
}