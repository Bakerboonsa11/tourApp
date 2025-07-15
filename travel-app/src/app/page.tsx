import Image from "next/image";
import Navbar from "@/components/customComponent/navigation";
export default function Home() {
  return (
   <div>
    <Navbar/>
    <h1 className="text-6xl font-bold text-center mt-10 ">Where to?</h1>
    <p className="text-center text-lg  mt-4">Explore the beauty of Oromia</p>

    <div className="flex justify-center mt-20">
  <div className="flex w-full max-w-xl">
    <input
      type="text"
      placeholder="Search tours..."
      className="flex-grow rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
    />
    <button
      className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 transition-colors"
    >
      Search
    </button>
  </div>
</div>



   </div>
        
  )   
          
}
