export default function Header() {
  return (
    <header
      id='header'
      className='fixed z-50 w-full border-b border-neutral-200 bg-white'>
      <nav className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div className='group flex cursor-pointer items-center space-x-2 transition-transform duration-300 hover:scale-105'>
            <i className='fa-solid fa-leaf text-2xl text-neutral-700 transition-colors duration-300 group-hover:text-emerald-400'></i>
            <span className='text-xl font-semibold text-black transition-colors duration-300 group-hover:text-emerald-400'>
              ESG for Good
            </span>
          </div>
          <div className='flex items-center space-x-8'>
            <a
              href='#about'
              className='text-neutral-600 hover:text-neutral-900'>
              About
            </a>
            <a
              href='#solution'
              className='text-neutral-600 hover:text-neutral-900'>
              Solution
            </a>
            <a
              href='#impact'
              className='text-neutral-600 hover:text-neutral-900'>
              Impact
            </a>
            <button className='rounded-lg bg-neutral-900 px-6 py-2 text-white transition-colors hover:bg-emerald-600'>
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
