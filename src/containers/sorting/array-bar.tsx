import { motion } from 'framer-motion'

const ArrayBar = ({ element, springAnim, hasChanged }) => (
  <motion.div
    layout
    transition={springAnim}
    className={`text-white text-center ${hasChanged ? 'bg-red-500' : 'bg-blue-500'}`}
    style={{ height: element.value * 3, width: '40px' }}
  >
    {element.value}
  </motion.div>
)

export default ArrayBar
