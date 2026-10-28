import ShaderBackground from './ui/ShaderBackground'

export default function PageHeader({
  label,
  title,
  description,
  image,
  imageSmall
}) {
  return (
    <section className='section page-hero'>
      <div className='page-hero-bg'>
        {image && (
          <img
            src={image}
            sizes='100vw'
            srcSet={imageSmall ? `${imageSmall} 1600w, ${image} 3171w` : undefined}
            alt=''
            className='page-hero-image'
          />
        )}
        <div className='page-hero-overlay'></div>
        <ShaderBackground className='page-hero-shader-bg' />
      </div>
      <div className='w-layout-blockcontainer container w-container'>
        <div className='page-hero-content'>
          <div slide-bottom-all='' className='sub-tag-wrap page-hero-tag'>
            <div className='sub-tag-text-wrap'>
              <div className='body-text'>{label}</div>
            </div>
          </div>
          <h1 className='page-hero-title'>{title}</h1>
          <p className='page-hero-text'>{description}</p>
        </div>
      </div>
    </section>
  )
}
