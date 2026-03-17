import useTranslation from '../hooks/useTranslation'

const About = () => {
  const t = useTranslation()

  return (
    <div className="space-y-8">
      
      <section className="rounded-3xl border-2 border-brand-orange bg-gradient-to-br from-orange-50 to-white p-8 shadow-lg md:p-12">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-orange bg-brand-orange/5 px-3 py-1">

          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
            {t('about.heading')}
          </p>
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold text-black md:text-4xl">
          DarshanSetu
        </h1>
        <p className="mt-3 text-lg text-gray-700">
          {t('about.subtitle')}
        </p>
        <div className="mt-6 h-1 w-24 rounded-full bg-brand-orange" />
      </section>

      
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border-2 border-blue-200 bg-white p-8 shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-2xl font-bold text-black">{t('about.missionTitle')}</h2>
          </div>
          <p className="leading-relaxed text-gray-700">
            {t('about.missionCopy')}
          </p>
        </section>

        <section className="rounded-3xl border-2 border-green-200 bg-white p-8 shadow-lg">
          <div className="mb-4 flex items-center gap-3">

            <h2 className="text-2xl font-bold text-black">{t('about.valuesTitle')}</h2>
          </div>
          <p className="leading-relaxed text-gray-700">
            {t('about.valuesCopy')}
          </p>
        </section>
      </div>

      
      <section className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center font-display text-3xl font-bold text-black">
          {t('about.servicesTitle')}
        </h2>
        <p className="mb-8 text-center text-gray-600">
          {t('about.servicesSubtitle')}
        </p>

        <div className="space-y-6">
          <article className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
            <div className="flex items-start gap-4">

              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-900">
                  {t('about.service2.title')}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-blue-800">
                  {t('about.service2.desc')}
                </p>
                <div className="mt-3 space-y-1 text-sm text-blue-700">
                  <p>{t('about.service2.point1')}</p>
                  <p>{t('about.service2.point2')}</p>
                  <p>{t('about.service2.point3')}</p>
                </div>
              </div>
            </div>
          </article>

          
          <article className="rounded-2xl border-2 border-green-200 bg-green-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900">
                  {t('about.service3.title')}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-green-800">
                  {t('about.service3.desc')}
                </p>
                <div className="mt-3 space-y-1 text-sm text-green-700">
                  <p>{t('about.service3.point1')}</p>
                  <p>{t('about.service3.point2')}</p>
                  <p>{t('about.service3.point3')}</p>
                </div>
              </div>
            </div>
          </article>

          
          <article className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-purple-900">
                  {t('about.service4.title')}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-purple-800">
                  {t('about.service4.desc')}
                </p>
                <div className="mt-3 space-y-1 text-sm text-purple-700">
                  <p>{t('about.service4.point1')}</p>
                  <p>{t('about.service4.point2')}</p>
                  <p>{t('about.service4.point3')}</p>
                </div>
              </div>
            </div>
          </article>

          
          <article className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-indigo-900">
                  {t('about.service5.title')}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-indigo-800">
                  {t('about.service5.desc')}
                </p>
                <div className="mt-3 space-y-1 text-sm text-indigo-700">
                  <p>{t('about.service5.point1')}</p>
                  <p>{t('about.service5.point2')}</p>
                  <p>{t('about.service5.point3')}</p>
                </div>
              </div>
            </div>
          </article>

          
          <article className="rounded-2xl border-2 border-pink-200 bg-pink-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-pink-900">
                  {t('about.service6.title')}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-pink-800">
                  {t('about.service6.desc')}
                </p>
                <div className="mt-3 space-y-1 text-sm text-pink-700">
                  <p>{t('about.service6.point1')}</p>
                  <p>{t('about.service6.point2')}</p>
                  <p>{t('about.service6.point3')}</p>
                </div>
              </div>
            </div>
          </article>

          
          <article className="rounded-2xl border-2 border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-900">
                  {t('about.service7.title')}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-red-800">
                  {t('about.service7.desc')}
                </p>
                <div className="mt-3 space-y-1 text-sm text-red-700">
                  <p>{t('about.service7.point1')}</p>
                  <p>{t('about.service7.point2')}</p>
                  <p>{t('about.service7.point3')}</p>
                </div>
              </div>
            </div>
          </article>

          
          <article className="rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-yellow-900">
                  {t('about.service8.title')}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-yellow-800">
                  {t('about.service8.desc')}
                </p>
                <div className="mt-3 space-y-1 text-sm text-yellow-700">
                  <p>{t('about.service8.point1')}</p>
                  <p>{t('about.service8.point2')}</p>
                  <p>{t('about.service8.point3')}</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      
      <section className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center font-display text-3xl font-bold text-black">
          {t('about.impactTitle')}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <span className="text-4xl">⏱</span>
            </div>
            <h3 className="text-2xl font-bold text-green-600">{t('about.impact1.stat')}</h3>
            <p className="mt-2 text-sm text-gray-700">{t('about.impact1.desc')}</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <span className="text-4xl">😊</span>
            </div>
            <h3 className="text-2xl font-bold text-blue-600">{t('about.impact2.stat')}</h3>
            <p className="mt-2 text-sm text-gray-700">{t('about.impact2.desc')}</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
              <span className="text-4xl">🌱</span>
            </div>
            <h3 className="text-2xl font-bold text-orange-600">{t('about.impact3.stat')}</h3>
            <p className="mt-2 text-sm text-gray-700">{t('about.impact3.desc')}</p>
          </div>
        </div>
      </section>

      
      <section className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center font-display text-3xl font-bold text-black">
          {t('about.techTitle')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
            <span className="text-3xl">🤖</span>
            <p className="mt-2 font-semibold text-gray-800">{t('about.tech1')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
            <span className="text-3xl">📡</span>
            <p className="mt-2 font-semibold text-gray-800">{t('about.tech2')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
            <span className="text-3xl">📱</span>
            <p className="mt-2 font-semibold text-gray-800">{t('about.tech3')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
            <span className="text-3xl">☁</span>
            <p className="mt-2 font-semibold text-gray-800">{t('about.tech4')}</p>
          </div>
        </div>
      </section>

      
      <section className="rounded-3xl border-2 border-brand-orange bg-white p-8 text-center shadow-lg">
        <h2 className="mb-4 font-display text-2xl font-bold text-black">
          {t('about.teamTitle')}
        </h2>
        <p className="mx-auto max-w-2xl text-gray-700">
          {t('about.teamDesc')}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="tel:1800-108-1212"
            className="rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-orange-dark"
          >
            📞 {t('about.contactUs')}
          </a>
          <a
            href="mailto:support@darshan-setu.in"
            className="rounded-full border-2 border-brand-orange px-6 py-3 text-sm font-semibold text-brand-orange transition hover:bg-brand-orange hover:text-white"
          >
            ✉ {t('about.emailUs')}
          </a>
        </div>
      </section>
    </div>
  )
}

export default About