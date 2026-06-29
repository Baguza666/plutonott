export default function ValidationNotice({ path, status }: { path: string; status: string }) {
  const isLegalPage = ['/mentions-legales/', '/cgu/', '/confidentialite/', '/remboursement/'].includes(path);

  if (isLegalPage && (status === 'review_required' || status === 'blocked')) {
    return (
      <div
        className="bg-amber-50 border-l-4 border-amber-400 px-4 py-3 max-w-4xl mx-auto my-6"
        role="alert"
      >
        <p className="text-amber-800 text-sm font-medium">
          Version en cours de validation juridique.
        </p>
      </div>
    );
  }
  return null;
}
