export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-700">
      <h1 className="text-4xl font-black text-slate-900">Privacy Policy</h1>
      <p className="mt-3 text-sm text-slate-500">Effective 4 July 2026</p>
      <div className="mt-10 space-y-6 leading-7">
        <p>IAs Academy processes account details, enrollments, course progress, and support messages to provide and secure the learning service.</p>
        <p>Authentication providers, hosting and database providers, crash reporting, app stores, purchase processing, and advertising services may process limited data when those features are enabled. Their own policies also apply.</p>
        <p>We retain information only while it is needed to operate the service, meet legal obligations, resolve disputes, and prevent abuse. You may request access, correction, or deletion of your account through the support link below.</p>
        <p>We use reasonable technical safeguards, but no internet service can guarantee absolute security. We do not knowingly offer the service to children below the minimum digital-consent age applicable in their country.</p>
        <p>For privacy requests, contact <a className="text-indigo-600 underline" href="mailto:support@ias-academy.in">support@ias-academy.in</a>.</p>
      </div>
    </main>
  );
}
