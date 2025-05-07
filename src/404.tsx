import './index.css'
import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div>
      <h1 className="text-center font-bold text-6xl">Page Not Founded</h1>
      <p className="text-center">
        The page that you're trying to acess had changed or dont exist anymore.
      </p>

      <div className="mt-6">
        <Link to="/#/">
          <button className="p-4 hover:bg-sprimary text-black hover:text:white cursor-pointer">
            Go to Home page
          </button>
        </Link>
      </div>
    </div>
  )
}
