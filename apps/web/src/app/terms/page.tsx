export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-700">
      <h1 className="text-4xl font-black text-slate-900">Terms of Service</h1>
      <p className="mt-3 text-sm text-slate-500">Effective 4 July 2026</p>
      <div className="mt-10 space-y-6 leading-7">
        <p>By using IAs Academy, you agree to provide accurate account information, keep your account secure, and use course materials only for personal learning.</p>
        <p>You may not share access credentials, redistribute course content, interfere with the service, abuse enrollment codes, or use the platform unlawfully.</p>
        <p>Course availability and features may change as the service improves. Purchases and refunds are also subject to the terms and billing rules of the applicable app store or payment provider.</p>
        <p>The service supports learning and preparation but does not guarantee examination results, employment, placement, certification recognition, or any particular outcome.</p>
        <p>For questions about these terms, contact <a className="text-indigo-600 underline" href="mailto:support@ias-academy.in">support@ias-academy.in</a>.</p>
      </div>
    </main>
  );
}
