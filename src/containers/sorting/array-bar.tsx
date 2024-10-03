import { motion } from 'framer-motion'

const ArrayBar = ({ steps, currentStep, arr, springAnim }) => (
  <div className="flex justify-center items-end mt-8 space-x-1">
    {(steps[currentStep] || arr).map((element, index) => {
      const previousArray = steps[currentStep - 1] || arr
      const hasChanged = previousArray[index]?.value !== element.value
      return (
        <motion.div
          layout
          transition={springAnim}
          className={`text-white text-center ${hasChanged ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ height: element.value * 3, width: '40px' }}
        >
          {element.value}
        </motion.div>
      )
    })}
  </div>
)

export default ArrayBar
