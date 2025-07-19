export default function ForgotPassword() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Forgot Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-2 border mb-4 rounded"
      />
      <button className="w-full bg-blue-600 text-white p-2 rounded">
        Send Reset Link
      </button>
      <p className="text-sm mt-2 text-gray-500">
        (Placeholder — no backend connected)
      </p>
    </div>
  );
}
