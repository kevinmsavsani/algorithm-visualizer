import { motion } from 'framer-motion'

const ArrayBar = ({ element, springAnim }) => (
  <motion.div
    layout
    transition={springAnim}
    className="bg-blue-500 text-white text-center"
    style={{ height: element.value * 3, width: '40px' }}
  >
    {element.value}
  </motion.div>
)

export default ArrayBar