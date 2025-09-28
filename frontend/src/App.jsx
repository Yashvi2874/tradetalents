import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-background text-text">
      <header className="bg-surface shadow-sm py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-primary">
            Tradetalents Platform
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Our Professional Platform</h2>
          <p className="text-text-secondary mb-6">
            This is a clean, professional starting point for your application.
          </p>
          <div className="bg-surface rounded-lg shadow-sm p-6 border border-border">
            <p className="mb-4">Your content will appear here.</p>
            <p>Start building your professional application with Tailwind CSS.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
