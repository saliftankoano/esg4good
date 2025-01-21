export default function Problem() {
  return (
    <section id='problem' className='bg-neutral-50 py-24 text-black'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <h2 className='mb-6 text-4xl font-bold'>
            The Challenge in ESG Reporting
          </h2>
          <p className='text-lg text-neutral-600'>
            Companies struggle with complex reporting requirements, data
            collection, and measuring real impact.
          </p>
        </div>
        <div className='grid grid-cols-3 gap-8'>
          <div className='rounded-xl bg-white p-8 shadow-sm'>
            <i className='fa-solid fa-clipboard-list mb-4 text-3xl'></i>
            <h3 className='mb-3 text-xl font-semibold'>Complex Compliance</h3>
            <p className='text-neutral-600'>
              Navigate through numerous regulations and frameworks.
            </p>
          </div>
          <div className='rounded-xl bg-white p-8 shadow-sm'>
            <i className='fa-solid fa-database mb-4 text-3xl'></i>
            <h3 className='mb-3 text-xl font-semibold'>Data Management</h3>
            <p className='text-neutral-600'>
              Scattered data sources and inconsistent metrics.
            </p>
          </div>
          <div className='rounded-xl bg-white p-8 shadow-sm'>
            <i className='fa-solid fa-chart-column mb-4 text-3xl'></i>
            <h3 className='mb-3 text-xl font-semibold'>Impact Tracking</h3>
            <p className='text-neutral-600'>
              Difficulty in measuring and proving sustainability impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
