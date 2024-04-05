import Link from 'next/link';
import { FaSearch, FaHeart, FaUser } from 'react-icons/fa';

const navIcons = [
  { icon: <FaSearch />, alt: 'search' },
  { icon: <FaHeart />, alt: 'heart' },
  { icon: <FaUser />, alt: 'user' },
];

const Navbar = () => {
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <p className="nav-logo text-green-700">
           Fair <span className='text-primary'>Price</span>
          </p>
        </Link>

        <div className="flex items-center gap-5">
          {navIcons.map((item) => (
            <div key={item.alt} className="relative">
              {item.icon}
              <span className="sr-only">{item.alt}</span> 
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
