import 'prismjs';
import 'prismjs/components/prism-javascript'; // Include the language you need
import 'prismjs/themes/prism.css'; // Choose a theme
import "./AvatarFlip.css"; // Add CSS for animations here



function Home() {


  return (
    <main>

      <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-1 space-y-4">
              Left Content
            </div>
            <div className="lg:flex-1 hidden md:block">
              Right content
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <section className="py-16 bg-gradient-to-b from-white to-indigo-50/50">
        Section ...
      </section>
    </main>
  );
}

export default Home;