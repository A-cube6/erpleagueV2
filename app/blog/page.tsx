import type { Metadata } from 'next';
import { ArrowRight, BarChart3, BrainCircuit, Cloud, ExternalLink, Factory, Link2, LockKeyhole, RefreshCcw, ShieldCheck, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SAP & ERP Insights | ERPLeague Australia Blog',
  description: 'Practical SAP and ERP insights from ERPLeague: S/4HANA, GROW with SAP, clean core, integration, SAP BTP, AI and managed ERP support.'
};

const companyLinkedIn = 'https://in.linkedin.com/company/erp-league';

const categories = [
  'All Posts',
  'S/4HANA',
  'GROW with SAP',
  'SAP AI & Joule',
  'Clean Core',
  'Integration',
  'BTP & Fiori',
  'NetSuite'
];

const alsoArticles = [
  {
    tag: 'SAP AI & Joule',
    title: 'When ERP starts thinking: how SAP Joule is transforming enterprise intelligence',
    date: 'LinkedIn post',
    href: 'https://www.linkedin.com/posts/erp-league-australia_sap-activity-7449787545954975746-0Dty'
  },
  {
    tag: 'Clean Core',
    title: "SAP's clean core strategy for future-ready ERP",
    date: 'LinkedIn post',
    href: 'https://www.linkedin.com/posts/erp-league-australia_sap-saps4hana-cleancore-activity-7438175298233286656-zN0a'
  },
  {
    tag: 'Integration',
    title: 'SAP updates integration certification program for partners',
    date: 'LinkedIn post',
    href: 'https://www.linkedin.com/posts/erp-league-australia_sap-integrationcertification-sapbtp-activity-7430585192957956096-qsam'
  }
];

const latestArticles = [
  {
    tag: 'S/4HANA',
    title: 'The APAC cloud ERP moment is here — SAP ECC end of life will not wait',
    date: 'LinkedIn post',
    href: 'https://www.linkedin.com/posts/erp-league-australia_sap-saps4hana-clouderp-activity-7451246597176315904-A4zj',
    Icon: Cloud,
    tone: 'blue'
  },
  {
    tag: 'SAP AI & Joule',
    title: 'SAP as a business memory system: what your ERP already knows',
    date: 'LinkedIn post',
    href: 'https://www.linkedin.com/posts/erp-league-australia_sapinsights-businessmemory-sapjoule-activity-7443649520690917376-SiSK',
    Icon: BrainCircuit,
    tone: 'green'
  },
  {
    tag: 'Procurement',
    title: 'Next-gen SAP Ariba: foundation for intelligent procurement',
    date: 'LinkedIn post',
    href: 'https://www.linkedin.com/posts/erp-league-australia_sapariba-intelligentprocurement-erp-activity-7439677382967382016-MIM9',
    Icon: ShieldCheck,
    tone: 'green'
  },
  {
    tag: 'Clean Core',
    title: 'Clean core, BTP and S/4HANA: the practical extension conversation',
    date: 'LinkedIn post',
    href: 'https://www.linkedin.com/posts/erp-league-australia_sap-saps4hana-cleancore-activity-7438175298233286656-zN0a',
    Icon: Wrench,
    tone: 'purple'
  },
  {
    tag: 'Cloud ERP',
    title: 'SAP Cloud ERP private package: accelerating transformation',
    date: 'LinkedIn post',
    href: 'https://www.linkedin.com/posts/erp-league-australia_sap-erp-erpleague-activity-7321850759694745600-KpCJ',
    Icon: RefreshCcw,
    tone: 'amber'
  },
  {
    tag: 'NetSuite',
    title: 'Oracle NetSuite and BILL: what AI-driven AP automation means for ERP teams',
    date: 'LinkedIn post',
    href: 'https://www.linkedin.com/posts/michael-james-50306b3b_manufacturing-erp-operations-activity-7394746889222483968-OmiY',
    Icon: BarChart3,
    tone: 'amber'
  }
];

function toneClasses(tone: string) {
  const tones: Record<string, { top: string; badge: string; icon: string }> = {
    blue: {
      top: 'bg-blue-50',
      badge: 'bg-blue-100 text-blue-900',
      icon: 'text-blue-700'
    },
    green: {
      top: 'bg-emerald-50',
      badge: 'bg-emerald-100 text-emerald-950',
      icon: 'text-emerald-700'
    },
    purple: {
      top: 'bg-violet-50',
      badge: 'bg-violet-100 text-violet-950',
      icon: 'text-violet-700'
    },
    amber: {
      top: 'bg-amber-50',
      badge: 'bg-amber-100 text-amber-950',
      icon: 'text-amber-700'
    }
  };
  return tones[tone] ?? tones.blue;
}

export default function BlogPage() {
  return (
    <main className="bg-slate-50 text-slate-950">
      <section className="relative overflow-hidden bg-[#042C53] text-white">
        <div className="absolute right-[-8%] top-[-28%] h-[420px] w-[420px] rounded-full border-[48px] border-white/5" />
        <div className="absolute right-[10%] top-[36%] h-28 w-28 rounded-full bg-[#378ADD]/10" />
        <div className="container py-16 md:py-24">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#85B7EB]">SAP & ERP Insights · Australia</p>
          <div className="max-w-3xl">
            <h1 className="m-0 text-4xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-5xl">Practical SAP & ERP insights for Australian businesses</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">No vendor fluff. Real guidance on SAP support, S/4HANA, GROW with SAP, clean core, integration, AI and ERP transformation — written for leaders who need clarity.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="btn btn-primary" href={companyLinkedIn} target="_blank" rel="noreferrer">Follow ERP League on LinkedIn <ExternalLink size={15} /></a>
              <a className="btn btn-secondary" href="/#contact">Suggest a topic</a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="container flex gap-6 overflow-x-auto py-0">
          {categories.map((category, index) => (
            <a
              href={index === 0 ? '/blog' : `#${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className={`whitespace-nowrap border-b-2 px-4 py-5 text-sm transition-colors ${index === 0 ? 'border-[#185FA5] font-semibold text-[#185FA5]' : 'border-transparent text-slate-500 hover:text-[#185FA5]'}`}
              key={category}
            >
              {category}
            </a>
          ))}
        </div>
      </section>

      <section className="grid border-b border-slate-200 bg-white lg:grid-cols-2">
        <article className="relative min-h-[360px] overflow-hidden bg-[#042C53] p-8 text-white md:p-12 lg:p-16">
          <div className="absolute bottom-[-70px] right-[-20px] h-48 w-48 rounded-full bg-[#378ADD]/10" />
          <span className="inline-flex rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-950">S/4HANA</span>
          <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-white">The SAP ECC end-of-life deadline is real — what Australian businesses need to do now</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100">SAP mainstream maintenance for ECC is approaching a hard commercial decision point. Start with application inventory, custom code, interfaces, data quality and an honest migration roadmap before committing to a large program.</p>
          <div className="mt-7 flex items-center gap-4 text-sm text-blue-100">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#378ADD]/70 text-xs font-bold text-white">EL</span>
            <span><strong className="block text-white">ERPLeague Team</strong>LinkedIn insight · S/4HANA planning</span>
          </div>
          <a className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#378ADD] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#185FA5]" href="https://www.linkedin.com/posts/erp-league-australia_sap-saps4hana-clouderp-activity-7451246597176315904-A4zj" target="_blank" rel="noreferrer">Read on LinkedIn <ArrowRight size={15} /></a>
        </article>

        <aside className="bg-slate-50 p-8 md:p-12 lg:p-16">
          <h2 className="text-base font-bold text-[#042C53]">Also in this issue</h2>
          <div className="mt-5 space-y-4">
            {alsoArticles.map((article) => (
              <a href={article.href} target="_blank" rel="noreferrer" className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#185FA5]/40 hover:shadow-card" key={article.title}>
                <span className="inline-flex rounded-md bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900">{article.tag}</span>
                <h3 className="mt-3 text-base font-bold leading-6 text-[#042C53]">{article.title}</h3>
                <p className="mt-3 text-sm text-slate-500">{article.date}</p>
              </a>
            ))}
          </div>
        </aside>
      </section>

      <section className="container py-12 md:py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Latest Articles</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#042C53]">ERP thinking, without the consulting theatre</h2>
          </div>
          <a href={companyLinkedIn} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#185FA5]">View all on LinkedIn <ExternalLink size={15} /></a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latestArticles.map((article) => {
            const tone = toneClasses(article.tone);
            const Icon = article.Icon;
            return (
              <a href={article.href} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#185FA5]/40 hover:shadow-card" key={article.title}>
                <div className={`flex h-28 items-center justify-center ${tone.top}`}>
                  <span className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-white/70">
                    <Icon className={tone.icon} size={30} strokeWidth={1.9} />
                  </span>
                </div>
                <div className="p-6">
                  <span className={`inline-flex rounded-md px-3 py-1 text-xs font-bold ${tone.badge}`}>{article.tag}</span>
                  <h3 className="mt-4 min-h-[56px] text-lg font-bold leading-7 text-[#042C53] group-hover:text-[#185FA5]">{article.title}</h3>
                  <p className="mt-3 text-sm text-slate-500">{article.date}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#185FA5]">Read <ArrowRight size={15} /></span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <a href={companyLinkedIn} target="_blank" rel="noreferrer" className="btn btn-outline">Load More Articles on LinkedIn <ExternalLink size={15} /></a>
        </div>
      </section>
    </main>
  );
}
