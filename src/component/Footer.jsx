import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#141414] text-gray-400 py-12 px-4 md:px-24 mt-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Social Media Icons */}

        <div className="flex space-x-6 mb-10">
          <a href="#" className="hover:text-white"><Facebook size={24} /></a>
          <a href="#" className="hover:text-white"><Instagram size={24} /></a>
          <a href="#" className="hover:text-white"><Twitter size={24} /></a>
          <a href="#" className="hover:text-white"><Youtube size={24} /></a>
        </div>


        {/* Footer Links */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-sm">
          <div className="flex flex-col space-y-3">
            <a href="#" className="hover:underline">FAQ</a>
            <a href="#" className="hover:underline">Investor Relations</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Speed Test</a>
          </div>
          <div className="flex flex-col space-y-3">
            <a href="#" className="hover:underline">Help Center</a>
            <a href="#" className="hover:underline">Jobs</a>
            <a href="#" className="hover:underline">Cookie Preferences</a>
            <a href="#" className="hover:underline">Legal Notices</a>
          </div>
          <div className="flex flex-col space-y-3">
            <a href="#" className="hover:underline">Account</a>
            <a href="#" className="hover:underline">Ways to Watch</a>
            <a href="#" className="hover:underline">Corporate Information</a>
            <a href="#" className="hover:underline">Only on Netflix</a>
          </div>
          <div className="flex flex-col space-y-3">
            <a href="#" className="hover:underline">Media Center</a>
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Contact Us</a>
          </div>
        </div>

        {/* Language & Copyright */}
        <div className="border-t border-gray-700 my-6"></div>

        <div className="text-sm space-y-4">
          <button className="border border-gray-500 px-3 py-1 rounded hover:border-white">
            English
          </button>
          <p className="mt-4">© 2025 Netflix Clone by Mayur</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
