export default function Footer() {
  return (
    <footer id='footer' className='bg-neutral-900 py-16 text-white'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-4 gap-8'>
          <div>
            <div className='mb-6 flex items-center space-x-2'>
              <i className='fa-solid fa-leaf text-2xl'></i>
              <span className='text-xl font-semibold'>ESG for Good</span>
            </div>
            <p className='text-neutral-400'>
              Insights fast-tracking renewable energy.
            </p>
          </div>
          <div>
            <h4 className='mb-4 font-semibold'>Features</h4>
            <ul className='space-y-2 text-neutral-400'>
              <li>Interactive Map</li>
              <li>AI Agent</li>
              <li>Risk Analysis</li>
              <li>Community Impact</li>
            </ul>
          </div>
          <div>
            <h4 className='mb-4 font-semibold'>Company</h4>
            <ul className='space-y-2 text-neutral-400'>
              <li>About</li>
              <li>Careers</li>
              <li>Blog</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className='mb-4 font-semibold'>Connect</h4>
            <div className='flex space-x-4'>
              <i className='fa-brands fa-twitter text-xl'></i>
              <i className='fa-brands fa-linkedin text-xl'></i>
              <i className='fa-brands fa-instagram text-xl'></i>
            </div>
          </div>
        </div>
        <div className='mt-12 border-t border-neutral-800 pt-8 text-sm text-neutral-400'>
          <p>&copy; 2025 ESG for Good. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
