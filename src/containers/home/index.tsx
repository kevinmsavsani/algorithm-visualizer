import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { Link } from 'react-router-dom'

const NetworkBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="network"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="50" cy="50" r="1" fill="#4ade80" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#network)" />
    </svg>
  </div>
)

const AlgorithmIcon = ({
  type,
}: {
  type: 'sorting' | 'pathfinding' | 'convexhull'
}) => {
  switch (type) {
    case 'sorting':
      return (
        <svg
          className="w-64 h-64 text-green-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <rect x="3" y="14" width="4" height="10" />
          <rect x="9" y="9" width="4" height="15" />
          <rect x="15" y="4" width="4" height="20" />
          <rect x="21" y="0" width="4" height="24" />
        </svg>
      )
    case 'pathfinding':
      return (
        <svg
          className="w-64 h-64 text-green-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="4" cy="4" r="3" />
          <circle cx="12" cy="12" r="3" />
          <circle cx="20" cy="4" r="3" />
          <circle cx="20" cy="20" r="3" />
          <path d="M4 7v10M12 15v5M20 7v10M7 4h10M15 12h5M7 20h10" />
        </svg>
      )
    case 'convexhull':
      return (
        <svg
          className="w-64 h-64 text-green-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        </svg>
      )
  }
}

export default function Home() {
  return (
    <div
      className={`relative min-h-screen dark:bg-gray-900 dakr:text-white flex flex-col items-center justify-center overflow-hidden`}
    >
      <NetworkBackground />
      <main className="z-10 text-center">
        <div className="mb-8">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-green-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
          </svg>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            ALGORITHM <span className="text-green-400">VISUALIZER</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
            Algorithm Visualizer is an interactive online platform that
            visualizes algorithms from code. Currently these include Sorting,
            Pathfind and ConvexHull Algorithms. More Algorithms will be coming
            soon!!
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {['sorting', 'pathfinding', 'convexhull'].map((type) => (
            <Link to={`/${type}`} key={type}>
              <CardContainer className="inter-var">
                <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border flex flex-col items-center justify-center ">
                  <CardItem
                    translateZ="100"
                    rotateX={20}
                    rotateZ={-10}
                    className="mt-4"
                  >
                    <AlgorithmIcon
                      type={type as 'sorting' | 'pathfinding' | 'convexhull'}
                    />
                  </CardItem>

                  <CardItem className="mt-2 text-xl font-semibold capitalize">
                    {type}
                  </CardItem>
                </CardBody>
              </CardContainer>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
