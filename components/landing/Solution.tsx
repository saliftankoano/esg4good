export default function Solution() {
  return (
    <section id='solution' className='py-24'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-2 items-center gap-12'>
          <div className='flex h-[600px] items-center justify-center rounded-2xl bg-neutral-100'>
            <span className='text-neutral-500'>Platform Screenshot</span>
          </div>
          <div className='space-y-8'>
            <h2 className='text-4xl font-bold'>Our Solution</h2>
            <div className='space-y-6'>
              <div className='flex items-start space-x-4'>
                <i className='fa-solid fa-check-circle mt-1 text-2xl text-neutral-700'></i>
                <div>
                  <h3 className='mb-2 text-xl font-semibold'>
                    Automated Data Collection
                  </h3>
                  <p className='text-neutral-600'>
                    AI-powered systems gather and validate ESG data from
                    multiple sources.
                  </p>
                </div>
              </div>
              <div className='flex items-start space-x-4'>
                <i className='fa-solid fa-chart-line mt-1 text-2xl text-neutral-700'></i>
                <div>
                  <h3 className='mb-2 text-xl font-semibold'>
                    Real-time Analytics
                  </h3>
                  <p className='text-neutral-600'>
                    Track your sustainability metrics and progress in real-time.
                  </p>
                </div>
              </div>
              <div className='flex items-start space-x-4'>
                <i className='fa-solid fa-file-lines mt-1 text-2xl text-neutral-700'></i>
                <div>
                  <h3 className='mb-2 text-xl font-semibold'>
                    Compliance Ready Reports
                  </h3>
                  <p className='text-neutral-600'>
                    Generate framework-compliant reports with one click.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
