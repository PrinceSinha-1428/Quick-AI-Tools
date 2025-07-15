import { assets } from '../assets/assets'

const Footer = () => {
  return (
   <footer className="w-full  text-gray-800">
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
        <div className="flex items-center space-x-3 mb-6">
            <img alt="" className="h-11"
                src={assets.logo} />
        </div>
        <p className="text-center max-w-xl text-sm font-normal leading-relaxed">
            Experience the power of AI with Quick Ai <br /> Transform your content creation with our suite of premium AI tools. Write articles, generate images, and enhance your workflow.
        </p>
    </div>
    <div className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm font-normal">
            Prince Kumar Sinha © {new Date().getFullYear()}. All rights reserved.
        </div>
    </div>
</footer>
  )
}

export default Footer
