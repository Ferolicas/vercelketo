export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-600 via-green-500 to-emerald-600">
      <div className="text-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4">Sin Conexión</h1>
        <p className="text-xl mb-6">Parece que no hay conexión a internet</p>
        <p className="text-lg opacity-90">
          Por favor, verifica tu conexión y vuelve a intentar
        </p>
      </div>
    </div>
  )
}