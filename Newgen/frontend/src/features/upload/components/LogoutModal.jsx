export default function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onCancel}
    >
      <div
        className="bg-[#161616] border border-[#2a2a2a] rounded-2xl p-6 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white font-medium text-base mb-1">LogOut?</h2>
        <p className="text-gray-500 text-xs leading-relaxed mb-6">
          You'll need to sign in again to access your workspace.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 text-xs text-gray-400 bg-[#1e1e1e] border border-[#333] rounded-lg hover:bg-[#252525] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 text-xs text-white bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors"
          >
            Yes, log out
          </button>
        </div>
      </div>
    </div>
  );
}
