import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
         <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <span className="text-white font-black text-sm tracking-tight">PF</span>
         </div>
        <span className="text-white font-black text-xl tracking-tight">
            Project<span className="text-indigo-400">Flow</span>
        </span>
        </div>
            <p className="text-gray-400 text-sm">
              The modern project management tool for teams that ship fast.
            </p>
          </div>

          {/* Links */}
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] }
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 ProjectFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/register">
              <span className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                Get started free →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;