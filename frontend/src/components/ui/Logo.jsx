import { Link } from 'react-router-dom';

const Logo = ({ size = 'md' }) => {
  const sizes = {
    sm: { circle: 'w-7 h-7', text: 'text-lg', inner: 'text-xs' },
    md: { circle: 'w-9 h-9', text: 'text-xl', inner: 'text-sm' },
    lg: { circle: 'w-11 h-11', text: 'text-2xl', inner: 'text-base' }
  };

  return (
    <Link to="/" className="flex items-center gap-2">
      <div className={`${sizes[size].circle} bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/25`}>
        <span className={`text-white font-black ${sizes[size].inner} tracking-tight`}>PF</span>
      </div>
      <span className={`text-white font-black ${sizes[size].text} tracking-tight`}>
        Project<span className="text-indigo-400">Flow</span>
      </span>
    </Link>
  );
};

export default Logo;