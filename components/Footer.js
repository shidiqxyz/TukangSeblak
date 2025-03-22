export default function Footer() {
    const currentYear = new Date().getFullYear(); // Mendapatkan tahun saat ini
  
    return (
      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="container mx-auto text-center">
          {/* Copyright */}
          <p className="mb-4">&copy; {currentYear} TukangSeblak ❤️</p> 
          {/* Social Icons */}
          <div className="flex justify-center space-x-6">
            {/* Website */}
            <a
              href="https://shidiq.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
            >
              <i className="fa-solid fa-globe"></i>
            </a>
  
            {/* Twitter */}
            <a
              href="https://x.com/shidiqxyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-sky-500 transition-colors duration-300"
            >
              <i className="fa-brands fa-twitter"></i>
            </a>
          </div>
        </div>
      </footer>
    );
  }